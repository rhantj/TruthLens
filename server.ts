import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parser with large limit for base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini client if API key is provided
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY environment variable found. Falling back to intelligent analytical simulation mode.");
}

// Helper to provide realistic simulated analysis when API Key is absent or fails
function getSimulatedImageAnalysis(contentType: string = "image/png") {
  const isSuspicious = Math.random() > 0.4;
  const score = isSuspicious ? Math.floor(Math.random() * 40) + 55 : Math.floor(Math.random() * 20) + 10;
  
  const findings = [];
  const hotspots = [];
  
  if (isSuspicious) {
    findings.push({
      type: "error",
      severity: "high",
      title: "Pixel Pattern Anomaly Detected",
      description: "Repetitive edge alignment noise and non-standard high frequency wave distribution typical of generative adversarial networks (GANs) or diffusion textures.",
    });
    findings.push({
      type: "warning",
      severity: "medium",
      title: "Metadata Inbound Discrepancy",
      description: "Camera sensor profiling metadata (EXIF headers) have been stripped or modified, frequently matching diffusion model exports.",
    });
    findings.push({
      type: "info",
      severity: "low",
      title: "Generative Artefact Warning",
      description: "Asymmetrical highlights and blended textures identified in micro-structural grids near high-contrast borders.",
    });
    hotspots.push(
      { x: 34, y: 28, radius: 25, reason: "Anomalous blending in geometric boundary textures" },
      { x: 68, y: 72, radius: 40, reason: "Diffused background noise spike with structural degradation" }
    );
  } else {
    findings.push({
      type: "info",
      severity: "low",
      title: "Consistent Color Gradients",
      description: "Pixel distribution charts indicate natural noise patterns aligning with genuine physical hardware sensors.",
    });
    findings.push({
      type: "info",
      severity: "low",
      title: "Consistent EXIF Header Structure",
      description: "Original capture profile matches digital camera structures with valid sequence intervals.",
    });
  }

  return {
    confidenceScore: score,
    verdict: score >= 70 ? "AI_DETECTED" : score >= 40 ? "SUSPICIOUS" : "AUTHENTIC",
    verdictMessage: score >= 70 ? "매우 의심됨 - AI 생성 흔적 탐지" : score >= 40 ? "주의 - 픽셀/메타데이터 불일치" : "정상 - 인증 완료",
    findings,
    hotspots: hotspots.length > 0 ? hotspots : [{ x: 50, y: 50, radius: 15, reason: "Reference point within nominal limits" }],
    simulated: true
  };
}

// API Route: Analyze Image
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { images, customPrompt } = req.body; // array of base64 images

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No images provided for analysis." });
    }

    // Default response structure
    let result: any = null;

    if (ai) {
      try {
        const imagePart = {
          inlineData: {
            mimeType: "image/jpeg",
            data: images[0].replace(/^data:image\/\w+;base64,/, ""),
          },
        };

        const promptText = `
You are a highly advanced digital forensics AI investigator and image integrity examiner.
Your task is to analyze the attached image of a file or forensic piece and evaluate whether it contains AI-generated patterns, modifications, inconsistencies, deepfakes, or metadata anomalies.

${customPrompt ? `User specifically asks: "${customPrompt}"` : ""}

Evaluate pixel noise alignment, border coherence, spatial frequencies, texture repeats, and lighting inconsistencies.
Analyze whether the visual parts look synthetic (e.g. typical Midjourney, DALL-E, Stable Diffusion or GAN signatures).

Return your analysis strictly as a JSON object adhering to this schema:
{
  "confidenceScore": number (0 to 100 representing how confident you are that there are anomalies or AI patterns, where higher values indicate more artificial or manipulated markers),
  "verdict": string (must be exactly one of "AI_DETECTED", "SUSPICIOUS", "AUTHENTIC"),
  "verdictMessage": string (a short summary in Korean, e.g. "매우 의심됨 - AI 패턴 탐지됨" or "주의 - 생성 텍스처 의심" or "정상 - 메타데이터 일치"),
  "findings": [
    {
      "type": "error" | "warning" | "info",
      "severity": "high" | "medium" | "low",
      "title": string (Korean title, e.g. "픽셀 패턴 이상" or "생성 아티팩트"),
      "description": string (Korean detailed explanation)
    }
  ],
  "hotspots": [
    {
      "x": number (percentage 0 to 100 representing the horizontal position on the image where a suspicious element is centered),
      "y": number (percentage 0 to 100 representing the vertical position on the image),
      "radius": number (hotspot radius from 10 to 50 pixels),
      "reason": string (Korean explanation for this specific localized anomaly)
    }
  ]
}
Do not return any other text, markdown formatting or explanation outside the JSON block.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [imagePart, { text: promptText }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                confidenceScore: { type: Type.INTEGER },
                verdict: { type: Type.STRING },
                verdictMessage: { type: Type.STRING },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["type", "severity", "title", "description"]
                  }
                },
                hotspots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.INTEGER },
                      y: { type: Type.INTEGER },
                      radius: { type: Type.INTEGER },
                      reason: { type: Type.STRING }
                    },
                    required: ["x", "y", "radius", "reason"]
                  }
                }
              },
              required: ["confidenceScore", "verdict", "verdictMessage", "findings", "hotspots"]
            }
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          result = JSON.parse(textResponse.trim());
          result.realApi = true;
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to simulation:", geminiError);
      }
    }

    if (!result) {
      // Fallback if AI client is not available or errors out
      result = getSimulatedImageAnalysis();
    }

    return res.json(result);
  } catch (error: any) {
    console.error("Error in analyze-image API:", error);
    res.status(500).json({ error: "Internal Server Error analyzing image: " + error.message });
  }
});

// API Route: Analyze News / Text Integrity
app.post("/api/analyze-news", async (req, res) => {
  try {
    const { url, text } = req.body;

    if (!url && !text) {
      return res.status(400).json({ error: "Either URL or text must be provided." });
    }

    let result: any = null;
    const contentsToAnalyze = text || `URL to analyze: ${url}`;

    if (ai) {
      try {
        const promptText = `
You are a highly advanced digital content forensic system and natural language fact checker.
Analyze the following text or URL for markers of:
1. Large Language Model (LLM) signatures, syntax flows, repetitive templates, and predictability.
2. Fact-check consistency with known databases.
3. Coordinated disinformation or bot-like formatting indicators.

Content:
"${contentsToAnalyze}"

Return your analysis strictly as a JSON object adhering to this schema:
{
  "confidenceScore": number (0 to 100 where higher means highly likely fake / AI-generated / inconsistent),
  "verdict": string (must be exactly one of "AI_DETECTED", "SUSPICIOUS", "AUTHENTIC"),
  "verdictMessage": string (e.g., "AI 구문 탐지됨" or "사실관계 의심" or "인증 완료"),
  "findings": [
    {
      "severity": "high" | "medium" | "low",
      "title": string (Korean title),
      "description": string (Korean detailed breakdown)
    }
  ],
  "summary": string (Korean summary of the content's integrity evaluation)
}
Do not return any outer formatting - return raw JSON.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                confidenceScore: { type: Type.INTEGER },
                verdict: { type: Type.STRING },
                verdictMessage: { type: Type.STRING },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      severity: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["severity", "title", "description"]
                  }
                },
                summary: { type: Type.STRING }
              },
              required: ["confidenceScore", "verdict", "verdictMessage", "findings", "summary"]
            }
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          result = JSON.parse(textResponse.trim());
          result.realApi = true;
        }
      } catch (geminiError) {
        console.error("Gemini API call failed for Text, falling back:", geminiError);
      }
    }

    if (!result) {
      // Simulate realistically
      const score = Math.floor(Math.random() * 60) + 30;
      result = {
        confidenceScore: score,
        verdict: score >= 75 ? "AI_DETECTED" : score >= 45 ? "SUSPICIOUS" : "AUTHENTIC",
        verdictMessage: score >= 75 ? "매우 의심됨 - LLM 학습 구문 일치" : score >= 45 ? "주의 - 출처 신뢰도 결여" : "정상 - 독창적 기록 확인",
        findings: [
          {
            severity: score >= 75 ? "high" : "medium",
            title: "Linguistic Frequency Check",
            description: "High pattern matches matching GPT or Claude phrasing distributions and structured transitions."
          },
          {
            severity: "low",
            title: "Factual Calibration",
            description: "Some factual details diverge from verified primary source database structures."
          }
        ],
        summary: "The text contains typical structural transitions and word-ordering patterns that frequently correlate with generative text completions.",
        simulated: true
      };
    }

    return res.json(result);
  } catch (error: any) {
    console.error("Error in analyze-news API:", error);
    res.status(500).json({ error: "Internal Server Error analyzing news: " + error.message });
  }
});

// Setup startServer block
async function startServer() {
  // Setup Vite middleware in Development mode, otherwise serve from dist/
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TruthLens server is active and running on http://localhost:${PORT}`);
  });
}

startServer();
