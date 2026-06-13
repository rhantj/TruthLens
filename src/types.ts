export type View = "home" | "image_workspace" | "news_workspace" | "results" | "history_list" | "settings";

export interface ForensicResult {
  confidenceScore: number;
  verdict: "AI_DETECTED" | "SUSPICIOUS" | "AUTHENTIC";
  verdictMessage: string;
  findings: Array<{
    type?: "error" | "warning" | "info";
    severity: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
  hotspots?: Array<{
    x: number;
    y: number;
    radius: number;
    reason: string;
  }>;
  summary?: string;
  realApi?: boolean;
}

export interface VerificationRecord {
  id: string;
  fileName: string;
  type: "image" | "document" | "video" | "news";
  timestamp: string;
  verdict: "AI_DETECTED" | "SUSPICIOUS" | "AUTHENTIC";
  thumbUrl?: string;
  result?: ForensicResult;
}
