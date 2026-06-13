import React, { useState } from "react";

interface NewsWorkspaceProps {
  onAnalyze: (payload: { url?: string; text?: string }) => void;
  isAnalyzing: boolean;
}

export default function NewsWorkspace({
  onAnalyze,
  isAnalyzing,
}: NewsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (activeTab === "url") {
        setUrlInput(text);
      } else {
        setTextInput((prev) => prev + text);
      }
    } catch (err) {
      console.warn("Unable to read from clipboard:", err);
    }
  };

  const startAnalysis = () => {
    if (activeTab === "url" && urlInput.trim()) {
      onAnalyze({ url: urlInput });
    } else if (activeTab === "text" && textInput.trim()) {
      onAnalyze({ text: textInput });
    }
  };

  const isButtonDisabled =
    (activeTab === "url" && !urlInput.trim()) ||
    (activeTab === "text" && !textInput.trim()) ||
    isAnalyzing;

  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-6 animate-fade-in pb-12">
      {/* Workspace Area Header */}
      <section className="border-b border-deep-navy/10 pb-4">
        <h2 className="font-display serif text-3xl font-normal text-deep-navy">
          뉴스 정직성 포렌식
        </h2>
        <p className="text-xs text-deep-navy/70 font-light mt-1.5 leading-relaxed">
          언어적 장치, 사실 일치 도메인의 신용도, 그리고 대형 언어 모델(LLM)이 생성 과정에서 유도하는 미세 서명 패턴을 교차 스캐닝합니다.
        </p>
      </section>

      {/* Input Workspace Bento card */}
      <div className="bg-[#ebeae4]/40 border border-[#d8d6cf] overflow-hidden rounded-none">
        {/* Custom Tab Navigation bar */}
        <div className="flex border-b border-[#d8d6cf] bg-[#ebeae4] select-none">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 py-4 font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "url"
                ? "border-deep-navy text-deep-navy font-bold bg-white"
                : "border-transparent text-deep-navy/60 hover:bg-white/40"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">link</span>
            <span>URL 정밀 진단</span>
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-4 font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "text"
                ? "border-deep-navy text-deep-navy font-bold bg-white"
                : "border-transparent text-deep-navy/60 hover:bg-white/40"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">article</span>
            <span>전사 텍스트 기입</span>
          </button>
        </div>

        <div className="p-6 bg-white">
          {/* URL Input Form */}
          {activeTab === "url" && (
            <div className="space-y-4 animate-fade-in">
              <label className="block font-mono text-[10px] text-deep-navy/50 uppercase tracking-widest font-bold">
                의심 기사 URL 주소
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-[#d8d6cf] rounded-none px-4 py-3.5 pr-24 outline-none focus:border-deep-navy transition-all font-sans text-xs"
                  placeholder="https://examplenews.com/suspicious-article-path"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 bg-[#ebeae4] border border-[#d8d6cf] text-deep-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  PASTE
                </button>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#ebeae4]/40 border border-[#d8d6cf]">
                <span className="material-symbols-outlined text-[#5a5a40] text-sm shrink-0">
                  radar
                </span>
                <p className="text-xs text-deep-navy/80 leading-relaxed font-light">
                  지정된 기사의 소스 주소와 연계 호스트, DNS 기록 신뢰성 및 알려진 왜곡 보도 허브의 유인 경로 수치를 계량 분석합니다.
                </p>
              </div>
            </div>
          )}

          {/* Transcript Plain Text Form */}
          {activeTab === "text" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-end">
                <label className="block font-mono text-[10px] text-deep-navy/50 uppercase tracking-widest font-bold">
                  CONTENT FOR ANALYSIS
                </label>
                <span
                  className={`font-mono text-[10px] ${
                    textInput.length > 9000 ? "text-alert-red font-bold animate-pulse" : "text-deep-navy/40"
                  }`}
                >
                  {textInput.length.toLocaleString()} / 10,000 CHARS
                </span>
              </div>

              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  maxLength={10000}
                  className="w-full h-80 bg-surface-container-lowest border border-[#d8d6cf] rounded-none p-4 outline-none focus:border-deep-navy transition-all font-sans text-xs resize-none leading-relaxed"
                  placeholder="분석하고 싶으신 소셜 미디어 게시글, 캡처된 전사본, 또는 보도 자료 전문을 기입하십시오 ..."
                />
                
                {isAnalyzing && (
                  <div className="absolute top-0 left-0 w-full scanning-anim pointer-events-none" />
                )}
              </div>
            </div>
          )}

          {/* Action trigger button */}
          <div className="mt-8">
            <button
              onClick={startAnalysis}
              disabled={isButtonDisabled}
              className={`w-full py-4 rounded-none font-mono text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 select-none cursor-pointer transition-all ${
                !isButtonDisabled
                  ? "bg-deep-navy text-white hover:bg-[#5a5a40]"
                  : "bg-[#ebeae4] text-deep-navy/40 border border-[#d8d6cf] cursor-not-allowed"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  <span>언어학적 의미 분석 및 팩트 체크 대조 중 ...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">document_scanner</span>
                  <span>구조 분석 시작하기</span>
                </>
              )}
            </button>
            <p className="text-center font-mono text-[9px] uppercase tracking-wider text-deep-navy/40 mt-4 leading-relaxed">
              * 본 시스템의 분석 자료는 참고용 포렌식 지수이며 법적 구속력을 대용하지 않습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Accents Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[#d8d6cf] bg-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-[#5a5a40] mb-3 text-xl">security</span>
            <h4 className="font-display serif text-base font-semibold text-deep-navy leading-none">포렌식 교차 교정</h4>
          </div>
          <p className="text-[11px] text-deep-navy/70 font-light mt-3 leading-relaxed">
            40여 개의 글로벌 전수 데이터베이스와 기사 내용의 연혁을 추적하여 생성 텍스트의 팩트체크 교량 상태를 매칭합니다.
          </p>
        </div>

        <div className="p-5 border border-[#d8d6cf] bg-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-[#5a5a40] mb-3 text-xl">language</span>
            <h4 className="font-display serif text-base font-semibold text-deep-navy leading-none">도메인 무결성 추적</h4>
          </div>
          <p className="text-[11px] text-deep-navy/70 font-light mt-3 leading-relaxed">
            전파 흐름의 출발점이 되는 소스 호스트의 인위적 도메인 세탁 유무, DNS 파티션 내 보증 관계를 정밀 연산 연계합니다.
          </p>
        </div>

        <div className="p-5 border border-[#d8d6cf] bg-white flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-[#5a5a40] mb-3 text-xl">radar</span>
            <h4 className="font-display serif text-base font-semibold text-deep-navy leading-none">언어 마커 신경 회로망</h4>
          </div>
          <p className="text-[11px] text-deep-navy/70 font-light mt-3 leading-relaxed">
            GPT 혹은 타 독자적 LLM 군에서 일관성 있게 검출되는 과잉 어휘 지표, 일관된 리듬 변이 주파수를 식별합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
