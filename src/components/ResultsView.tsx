import { ForensicResult } from "../types";
import Gauge from "./Gauge";
import Heatmap from "./Heatmap";

interface ResultsViewProps {
  result: ForensicResult;
  analyzedImage?: string; // Optional image viewed or analyzed
  onRestart: () => void;
  onDownloadReport: () => void;
  onShareResult: () => void;
}

export default function ResultsView({
  result,
  analyzedImage,
  onRestart,
  onDownloadReport,
  onShareResult,
}: ResultsViewProps) {
  const { confidenceScore, verdict, verdictMessage, findings, hotspots, summary } = result;

  // Verdict style mapper
  let verdictColorClass = "text-authentic-green bg-[#405a45]/5 border-[#405a45]";
  let verdictIcon = "verified";

  if (verdict === "AI_DETECTED") {
    verdictColorClass = "text-[#8a3324] bg-[#8a3324]/5 border-[#8a3324]";
    verdictIcon = "error";
  } else if (verdict === "SUSPICIOUS") {
    verdictColorClass = "text-[#a88434] bg-[#a88434]/5 border-[#a88434]";
    verdictIcon = "warning";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-6 animate-fade-in pb-12">
      {/* Upper header */}
      <div className="flex flex-col items-center text-center border-b border-deep-navy/10 pb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ebeae4] border border-[#d8d6cf] mb-3 select-none">
          <span className="material-symbols-outlined text-[#5a5a40] text-sm leading-none">
            shield
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-deep-navy/70 font-bold">
            {result.realApi ? "REAL-TIME FORENSIC TRUTHLENS ENGINE" : "OFFLINE FORENSIC REPORT LOG"}
          </span>
        </div>
        <h2 className="font-display serif text-4xl font-normal text-deep-navy">포렌식 진단 분석지</h2>
        <p className="text-xs text-deep-navy/70 max-w-lg mt-2 font-light leading-relaxed">
          제출 자료의 메타데이터 불일치 계수 및 픽셀의 파편적 주파수 분석을 종결하였습니다. 식별된 상세 지수 및 히트맵 분포는 다음과 같습니다.
        </p>
      </div>

      {/* Main Verdict Block (Confidence Gauge & Verdict Chip) */}
      <div className="bg-white border border-[#d8d6cf] p-8 flex flex-col items-center max-w-xl mx-auto">
        {/* Dynamic score gauge */}
        <div className="mb-4">
          <Gauge score={confidenceScore} />
        </div>

        {/* Big Verdict chip banner */}
        <div
          className={`border px-6 py-3.5 flex items-center justify-center gap-2.5 text-center mt-3 select-none ${verdictColorClass}`}
        >
          <span className="material-symbols-outlined shrink-0 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            {verdictIcon}
          </span>
          <span className="font-semibold text-xs sm:text-sm font-mono uppercase tracking-wider">
            {verdictMessage || (verdict === "AI_DETECTED" ? "CRITICAL: AI GENERATIVE SIGNATURE DETECTED" : verdict === "SUSPICIOUS" ? "WARNING: POTENTIAL PIXEL MANIPULATION" : "CLEAR: METADATA INTEGRITY VERIFIED")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-deep-navy/50 mt-6 text-[10px] font-mono uppercase tracking-wider select-none">
          <span className="material-symbols-outlined text-xs">group</span>
          <span>주 도메인 대조군 142개 시퀀스 연산 일치함</span>
        </div>
      </div>

      {/* Structured Detailed Analysis Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Findings checklist */}
        <div className="bg-white border border-[#d8d6cf] p-6">
          <h3 className="font-display serif text-lg font-semibold text-deep-navy mb-4 border-b border-deep-navy/10 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5a5a40]">analytics</span>
            <span>종합 정량 지표 요지</span>
          </h3>

          {findings && findings.length > 0 ? (
            <ul className="space-y-4">
              {findings.map((item, index) => {
                const subType = item.type || (item.severity === "high" ? "error" : item.severity === "medium" ? "warning" : "info");
                const icon = subType === "error" ? "error" : subType === "warning" ? "warning" : "info";
                const color = subType === "error" ? "text-[#8a3324]" : subType === "warning" ? "text-[#a88434]" : "text-[#5a5a40]";

                return (
                  <li key={index} className="flex gap-3 hover:translate-x-0.5 transition-transform">
                    <span className={`material-symbols-outlined shrink-0 mt-0.5 text-lg ${color}`}>
                      {icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-display serif font-semibold text-sm text-deep-navy leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-deep-navy/70 font-light mt-1 leading-relaxed">
                        {item.description}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-deep-navy/40 text-center py-8 text-xs italic font-light">
              발견된 이상 마커 지수가 검출되지 않았습니다.
            </div>
          )}

          {summary && (
            <div className="mt-6 pt-5 border-t border-deep-navy/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#5a5a40] font-bold block mb-1">총평 및 보완 의견</span>
              <p className="text-xs text-deep-navy/80 font-light leading-relaxed">{summary}</p>
            </div>
          )}
        </div>

        {/* Heatmap Section */}
        {analyzedImage ? (
          <div className="bg-white border border-[#d8d6cf] p-6 flex flex-col">
            <h3 className="font-display serif text-lg font-semibold text-deep-navy mb-4 border-b border-deep-navy/10 pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5a5a40]">visibility</span>
              <span>변형 주파수 히트맵 스캔</span>
            </h3>
            <div className="flex-grow">
              <Heatmap imageUrl={analyzedImage} hotspots={hotspots} />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#d8d6cf] p-6 flex flex-col justify-center items-center h-full min-h-[280px]">
            <span className="material-symbols-outlined text-5xl text-deep-navy/20 mb-2">
              text_snippet
            </span>
            <p className="text-xs text-deep-navy/50 font-light select-none italic text-center">
              텍스트 검증 모드에서는 이미지 히트맵이 제공되지 않습니다.
            </p>
          </div>
        )}
      </div>

      {/* Large horizontal Actions panel */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 select-none">
        <button
          onClick={onDownloadReport}
          className="bg-deep-navy text-white text-xs font-mono uppercase tracking-widest px-8 py-3.5 hover:bg-[#5a5a40] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm inline-block mr-1.5 align-middle">download</span>
          <span>REPORT PDF DOWNLOAD</span>
        </button>

        <button
          onClick={onShareResult}
          className="border border-[#d8d6cf] bg-white text-deep-navy text-xs font-mono uppercase tracking-widest px-8 py-3.5 hover:bg-[#ebeae4]/40 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm inline-block mr-1.5 align-middle">share</span>
          <span>SHARE ARTIFACT</span>
        </button>

        <button
          onClick={onRestart}
          className="border border-[#d8d6cf] bg-[#ebeae4]/40 text-deep-navy text-xs font-mono uppercase tracking-widest px-8 py-3.5 hover:bg-white transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm inline-block mr-1.5 align-middle">refresh</span>
          <span>RE-ANALYZE RECORD</span>
        </button>
      </div>
    </div>
  );
}
