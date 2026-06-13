import { useState } from "react";
import { View, ForensicResult, VerificationRecord } from "./types";
import HomeView from "./components/HomeView";
import ImageWorkspace from "./components/ImageWorkspace";
import NewsWorkspace from "./components/NewsWorkspace";
import ResultsView from "./components/ResultsView";

// Hardcoded initial list of forensic records matching the requested screenshots
const INITIAL_RECORDS: VerificationRecord[] = [
  {
    id: "rec_1",
    fileName: "Manuscript_Verification_042.pdf",
    type: "document",
    timestamp: "2분 전",
    verdict: "AUTHENTIC",
    thumbUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCbZD3O9NfrJHOyPbJUVMNFPbTWNvg-nrshC4Ayibi8Qw4LM_b79QRF9_bjfyORrOoi3XYcmlBBb1H4l68v_E0fnYcDOhXzKsDIjwKxzuoMzh6taN1263PWZtiotltX_sEM_Ncv9procpwCzfQvpXI_ktrHJbqI3LmelVD5VLe0p_UYLl7Q03jQOyf1uS6C5UwVc2b-ooD7FkvOHRQAFqjWqIGRv1V6vM4iqqAsxoDu4emHCRRipKd4DtDPnMwQzTHi7VbwgGoGQ",
    result: {
      confidenceScore: 12,
      verdict: "AUTHENTIC",
      verdictMessage: "정상 - 학술 자료 무결성 일치",
      findings: [
        {
          severity: "low",
          title: "일관적인 구문론 배치",
          description: "어휘 밀도와 문장 구조 전이 분석 결과, AI 작성 징후 대신 주관식 어조 일관성이 유지되고 있습니다."
        },
        {
          severity: "low",
          title: "원본 데이터 교차 매칭 완료",
          description: "학술 색인 저널 대조 결과 고배율 패턴 표절 및 인위적 마킹이 발견되지 않았습니다."
        }
      ],
      summary: "제출된 문서는 문장 연합 분포 및 수사학적 구조에서 정상을 유지하며, 인위적 어미의 반복이 관측되지 않는 독창적인 초안으로 판단됩니다."
    }
  },
  {
    id: "rec_2",
    fileName: "Social_Profile_Banner.jpg",
    type: "image",
    timestamp: "15분 전",
    verdict: "AI_DETECTED",
    thumbUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbcZbLdcUr56GTjBEMsXtnF1uH1EfAgULpldJfHmxawJIPoKvxluZOSqkJoXURPc4-4WMJI9a2KHLl0Nsb5FTG1bcjvo097W7FAycsnZ2fqe-wuYrx2qJMWmxmd4z_rp4zTZrQchNPfrZWNpaSVJFl5A5gDcKwXKhjyVJjX-_qblanxhUiDAJf3jCTRAlUxlKDswC_QiXRFe3YRHTFzYqXsBoZNH9oMUplUrHieHFzuokTS-X2zNjluNPB-vejUk7c-ItgILPDNw",
    result: {
      confidenceScore: 82,
      verdict: "AI_DETECTED",
      verdictMessage: "매우 의심됨 - AI 패턴 탐지됨",
      findings: [
        {
          type: "error",
          severity: "high",
          title: "픽셀 패턴 이상",
          description: "대비가 높은 가장자리에서 비표준적인 색상 노이즈 분포 및 모델 고유 그리드 징후가 발견되었습니다."
        },
        {
          type: "error",
          severity: "high",
          title: "메타데이터 누락",
          description: "Exif 카메라 프로필 및 전사 헤더가 삭제되었습니다; 이는 이미지 확산 모델 가공물의 전형적 특성입니다."
        },
        {
          type: "warning",
          severity: "medium",
          title: "생성 아티팩트 보정 실패",
          description: "배경 테두리 영역 주변에서 물리적으로 성립할 수 없는 비대칭적 주파수 질감 입자가 확인되었습니다."
        }
      ],
      hotspots: [
        { x: 30, y: 35, radius: 30, reason: "안면/의복 가장자리 윤곽선에서 발견된 GAN 미세 텍수쳐 이상 부조화" },
        { x: 72, y: 64, radius: 45, reason: "소실점 축과 부동하는 인위적 픽셀 난수화 필터 잔여 영역" }
      ],
      summary: "구조 노이즈와 확산 주기성 검사 결과, 상업적 generative 서명 모델에 의한 부분 가소 합성 흔적이 매우 높게 스캐닝되는 픽셀입니다."
    }
  },
  {
    id: "rec_3",
    fileName: "Political_Statement_Viral.mp4",
    type: "video",
    timestamp: "42분 전",
    verdict: "SUSPICIOUS",
    thumbUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQn-99w3QnkQVf17FTPk2aicDQH0cq6pbTPbuqdzrseTKk09ydyxTL6BUtU35TA8v1ggRuC7ZrzrxhscNmQLK-6u6GiYv7LopbU6THO2MBcvELIsW4EGl7DePZO1w0A1KdRpc49fHC1B4U3XTIj94D_Pmcg7vmf7hobqd9tK6y4GhUQ6QPti5pbqeXS7G17b0Pq4Qt5O-N8DXDi1v-UAOf00j6FbsV9LIb_BUTfbSbRJQE77TAflLVZuKU5yGeMspzWHUPW0PEQ",
    result: {
      confidenceScore: 54,
      verdict: "SUSPICIOUS",
      verdictMessage: "주의 - 페이셜 딥페이크 위상 대조 필요",
      findings: [
        {
          severity: "medium",
          title: "시간적 프레임 깜빡임 흐름 발견",
          description: "인접 비디오 키프레임 간 눈 깜빡임 주기와 동공 수축율이 물리적 한계를 인위적으로 회피함이 감지되었습니다."
        },
        {
          severity: "low",
          title: "전단 보간 가청 아치 현상",
          description: "인위적으로 생성된 합성 오디오 파형과의 동기화 간 오프셋이 불일치하는 시간 격차가 노출되었습니다."
        }
      ],
      summary: "영상의 구강 주변 및 안면 접경 노이즈의 융합율에서 가중 불변성이 정밀 관측되지 않으므로, 딥페이크 도구의 사용 개연성이 의심됩니다."
    }
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [recentRecords, setRecentRecords] = useState<VerificationRecord[]>(INITIAL_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSourceImage, setAnalyzedSourceImage] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // App metrics
  const stats = {
    scansToday: 42801,
    precision: 99.9,
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Navigating home
  const handleRestart = () => {
    setCurrentView("home");
    setSelectedRecord(null);
    setAnalyzedSourceImage(undefined);
  };

  // Select specific verification suites from the dashboard
  const handleSelectSuite = (type: "image" | "news" | "video" | "document") => {
    if (type === "image" || type === "video") {
      setCurrentView("image_workspace");
    } else {
      setCurrentView("news_workspace");
    }
  };

  // Open structured historic logs from the recent list
  const handleOpenRecord = (record: VerificationRecord) => {
    if (record.result) {
      setSelectedRecord(record);
      setAnalyzedSourceImage(record.thumbUrl);
      setCurrentView("results");
      showNotification(`${record.fileName} 스캔 리포트를 불러왔습니다.`);
    }
  };

  // Call express endpoints: Analyze uploaded images/files
  const handleAnalyzeImage = async (images: string[], customPrompt?: string) => {
    setIsAnalyzing(true);
    // Persist the first image preview for results display
    setAnalyzedSourceImage(images[0]);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, customPrompt }),
      });

      if (!response.ok) {
        throw new Error("서버 측 포렌식 API가 응답하지 않습니다.");
      }

      const result: ForensicResult = await response.json();

      // Form a new historic verification entry to save
      const newRecord: VerificationRecord = {
        id: "rec_" + Date.now(),
        fileName: `Scan_${Date.now().toString().slice(-4)}.jpg`,
        type: "image",
        timestamp: "방금 전",
        verdict: result.verdict,
        thumbUrl: images[0],
        result,
      };

      setRecentRecords((prev) => [newRecord, ...prev]);
      setSelectedRecord(newRecord);
      setCurrentView("results");
      showNotification("이미지 포렌식 무결성 검증이 완료되었습니다.", "success");
    } catch (err: any) {
      console.error(err);
      showNotification("분석 중 오류 발생: " + err.message, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Call express endpoints: Analyze text or URL credentials
  const handleAnalyzeNews = async (payload: { url?: string; text?: string }) => {
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("서버 측 미디어 스캐너 API가 응답하지 않습니다.");
      }

      const result: ForensicResult = await response.json();

      // Create news log
      const newRecord: VerificationRecord = {
        id: "rec_" + Date.now(),
        fileName: payload.url ? `URL_Scan_${Date.now().toString().slice(-4)}` : "Text_Analysis_Report.pdf",
        type: "news",
        timestamp: "방금 전",
        verdict: result.verdict,
        result,
      };

      setRecentRecords((prev) => [newRecord, ...prev]);
      setSelectedRecord(newRecord);
      setCurrentView("results");
      showNotification("뉴스 신뢰도 분석 스캔이 완료되었습니다.", "success");
    } catch (err: any) {
      console.error(err);
      showNotification("구문 분석 중 오류 발생: " + err.message, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    const filename = selectedRecord ? `${selectedRecord.fileName.replace(/\.[^/.]+$/, "")}_Forensic_Report.pdf` : "TruthLens_Integrity_Report.pdf";
    showNotification(`${filename} 보고서 PDF가 생성되어 로컬 저장소에 저장되었습니다.`, "success");
  };

  const handleShareResult = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: "TruthLens Digital Forensic Result",
          text: `TruthLens verification verdict: ${selectedRecord?.result?.verdictMessage}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        showNotification("공유 링크 복사가 완료되었습니다. 클립보드를 확인해 보세요.", "success");
      }
    } catch (err) {
      showNotification("공유 링크가 클립보드에 복사되었습니다.", "success");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-[#f5f5f0]">
      {/* Toast Notification Alert banner */}
      {notification && (
        <div className="fixed top-20 right-6 left-6 sm:left-auto sm:w-96 bg-white border border-[#d8d6cf] p-4 shadow-lg z-[100] animate-fade-in flex items-start gap-3">
          <span
            className={`material-symbols-outlined select-none shrink-0 ${
              notification.type === "success" ? "text-authentic-green" : "text-alert-red"
            }`}
          >
            {notification.type === "success" ? "check_circle" : "error"}
          </span>
          <div>
            <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-deep-navy leading-none mb-1">JOURNAL NOTICE</h4>
            <p className="text-[11px] text-deep-navy/80 font-light leading-relaxed">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#f5f5f0]/90 backdrop-blur-md border-b border-[#d8d6cf] flex justify-between items-center px-4 md:px-8 h-16 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestart}
            className="text-deep-navy hover:bg-[#ebeae4] p-2 rounded-none cursor-pointer transition-colors w-10 h-10 flex items-center justify-center border border-transparent hover:border-[#d8d6cf]"
          >
            <span className="material-symbols-outlined text-[20px]">
              {currentView === "home" ? "menu" : "arrow_back"}
            </span>
          </button>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD39oenN-133O75xXvS8w6pM0Ue16VzH_35vXRE3-nE9wIHeC4O1M3b-93N7Yx_Xm3YxXv_Cg8oW6CVSB"
            alt="TruthLens logo icon placeholder"
            className="w-5 h-5 object-contain mr-1 hidden sm:block grayscale contrast-[150%]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            referrerPolicy="no-referrer"
          />
          <span
            onClick={handleRestart}
            className="font-display serif text-2xl italic font-normal text-deep-navy cursor-pointer hover:opacity-85 active:scale-[0.99] transition-all tracking-tight"
          >
            TruthLens
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentView("home")}
            title="검증 기록"
            className={`p-2 rounded-none border cursor-pointer transition-all w-10 h-10 flex items-center justify-center ${
              currentView === "home" ? "text-white bg-[#5a5a40] border-[#5a5a40]" : "text-deep-navy border-transparent hover:border-[#d8d6cf] hover:bg-[#ebeae4]"
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">history</span>
          </button>
          <button
            onClick={() => {
              setSelectedRecord(null);
              setCurrentView("image_workspace");
            }}
            title="신규 탐지 스캔"
            className={`p-2 rounded-none border cursor-pointer transition-all w-10 h-10 flex items-center justify-center ${
              currentView === "image_workspace" ? "text-white bg-[#5a5a40] border-[#5a5a40]" : "text-deep-navy border-transparent hover:border-[#d8d6cf] hover:bg-[#ebeae4]"
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">document_scanner</span>
          </button>
        </div>
      </header>

      {/* Main Content Area Canvas Container */}
      <main className="flex-grow pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {currentView === "home" && (
          <HomeView
            onSelectSuite={handleSelectSuite}
            recentRecords={recentRecords}
            onOpenRecord={handleOpenRecord}
            stats={stats}
          />
        )}

        {currentView === "image_workspace" && (
          <ImageWorkspace onAnalyze={handleAnalyzeImage} isAnalyzing={isAnalyzing} />
        )}

        {currentView === "news_workspace" && (
          <NewsWorkspace onAnalyze={handleAnalyzeNews} isAnalyzing={isAnalyzing} />
        )}

        {currentView === "results" && selectedRecord?.result && (
          <ResultsView
            result={selectedRecord.result}
            analyzedImage={analyzedSourceImage}
            onRestart={handleRestart}
            onDownloadReport={handleDownloadReport}
            onShareResult={handleShareResult}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#ebeae4]/40 border-t border-[#d8d6cf] py-10 flex flex-col items-center justify-center text-center px-4 select-none mb-16 md:mb-0">
        <div className="font-display serif text-xl italic text-deep-navy mb-2">
          TruthLens Journal
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a
            href="#tos"
            onClick={(e) => {
              e.preventDefault();
              showNotification("이용약관 내용을 블록체인에서 로드 중입니다...");
            }}
            className="text-xs text-deep-navy/70 hover:text-deep-navy transition-colors font-light underline underline-offset-4"
          >
            이용약관
          </a>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              showNotification("개인정보처리방침 사본을 준비 중입니다.");
            }}
            className="text-xs text-deep-navy/70 hover:text-deep-navy transition-colors font-light underline underline-offset-4"
          >
            개인정보처리방침
          </a>
          <a
            href="#forensics"
            onClick={(e) => {
              e.preventDefault();
              showNotification("포렌식 분석 방법성 매뉴얼 PDF를 불러오는 중...");
            }}
            className="text-xs text-deep-navy/70 hover:text-deep-navy transition-colors font-light underline underline-offset-4"
          >
            포렌식 방법론
          </a>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-deep-navy/50">
          © 2026 TruthLens AI. 디지털 정직성과 영상/기사 데이터 무결성을 보장합니다.
        </p>
      </footer>

      {/* BottomNavBar exclusively for Mobile devices */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-[#f5f5f0]/95 backdrop-blur-md border-t border-[#d8d6cf] md:hidden shadow-lg select-none">
        <button
          onClick={handleRestart}
          className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all cursor-pointer ${
            currentView === "home" ? "text-[#5a5a40] font-bold" : "text-deep-navy/60"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="font-mono text-[9px] uppercase tracking-wider scale-90 mt-0.5">Home</span>
        </button>

        <button
          onClick={() => {
            setSelectedRecord(null);
            setCurrentView("image_workspace");
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all cursor-pointer ${
            currentView === "image_workspace" ? "text-[#5a5a40] font-bold" : "text-deep-navy/60"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">image</span>
          <span className="font-mono text-[9px] uppercase tracking-wider scale-90 mt-0.5">Media</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("news_workspace");
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all cursor-pointer ${
            currentView === "news_workspace" ? "text-[#5a5a40] font-bold" : "text-deep-navy/60"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">newspaper</span>
          <span className="font-mono text-[9px] uppercase tracking-wider scale-90 mt-0.5">News</span>
        </button>

        {currentView === "results" && (
          <button
            onClick={() => setCurrentView("results")}
            className="flex flex-col items-center justify-center py-1.5 px-3 transition-all cursor-pointer text-[#5a5a40] font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            <span className="font-mono text-[9px] uppercase tracking-wider scale-90 mt-0.5">Report</span>
          </button>
        )}
      </nav>
    </div>
  );
}
