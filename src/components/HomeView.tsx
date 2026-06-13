import { VerificationRecord } from "../types";

interface HomeViewProps {
  onSelectSuite: (type: "image" | "news" | "video" | "document") => void;
  recentRecords: VerificationRecord[];
  onOpenRecord: (record: VerificationRecord) => void;
  stats: {
    scansToday: number;
    precision: number;
  };
}

export default function HomeView({
  onSelectSuite,
  recentRecords,
  onOpenRecord,
  stats,
}: HomeViewProps) {
  return (
    <div className="space-y-12 animate-fade-in pb-8">
      {/* Editorial Header Block */}
      <div className="border-b border-deep-navy/10 pb-6 mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-electric-blue uppercase font-bold">
          TRUTHLENS JOURNAL — VOL. 04
        </span>
        <h1 className="font-display serif text-4xl sm:text-5xl md:text-6xl font-light text-deep-navy leading-tight mt-2">
          The Search for <em className="italic">Truth</em> in a Synthetic World
        </h1>
        <p className="text-sm md:text-base text-deep-navy/80 mt-4 max-w-2xl leading-relaxed font-light">
          이미지, 영상, 텍스트, 문서에 포함된 인위적 균열과 AI 생성 서명을 스캐닝하는 하이엔드 인공지능 디지털 포렌식 아키텍처입니다.
        </p>
      </div>

      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-xl bg-deep-navy text-surface-container-lowest px-6 py-12 md:py-14 md:px-10">
        <div className="absolute inset-0 opacity-5 grid-bg pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 h-full">
          <div className="max-w-xl text-center md:text-left space-y-6">
            <span className="font-mono text-[10px] text-surface-container uppercase tracking-widest bg-white/10 px-3 py-1 rounded">
              ESTABLISHED IN METADATA SCANNING
            </span>
            <h2 className="font-display serif text-3xl md:text-4xl font-normal text-white">
              가공되지 않은 원초적 <em className="italic">진실</em>을 보호하세요
            </h2>
            <p className="text-xs md:text-sm text-surface-container-low font-light leading-relaxed max-w-lg">
              디지털 콘텐츠 전사본에 숨겨진 구조물 결함, 동공 반사 왜곡 상태, 가상의 프레이밍 흔적 및 시간 흐름상의 주파수 차이를 정량화하여 완벽한 검증 보고서를 제안합니다.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start items-center">
              <button
                onClick={() => onSelectSuite("image")}
                className="bg-surface-container-lowest text-deep-navy font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-surface-container-high transition-all cursor-pointer"
              >
                이미지 포렌식 시작
              </button>
              <span className="font-mono text-[11px] text-surface-container-high italic opacity-85">
                • 120만 건 이상의 콘텐츠 검증 완료
              </span>
            </div>
          </div>

          {/* Signature Arched Image placeholder */}
          <div className="w-full max-w-xs hidden md:block select-none shrink-0">
            <div className="relative aspect-[3/4] max-h-[300px] w-[220px] mx-auto bg-[#e0ded7] rounded-t-[140px] border border-white/10 overflow-hidden group">
              <div className="scanning-anim absolute left-0 w-full z-20 pointer-events-none" />
              <img
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                alt="A premium classic artistic layout representing high-fashion clean editorial design."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvq1UEyzpurLn_fim3S3hOWDFwhWqdZq84kluezEdMwzxptm2YC3eMkpk6qknCeVS9NO_WkcOwWAi8Yurcd7BYQuztapv_xd5r265waPQG86U4HiYZ-yxE3t9AiOFj85q0gwMQ9llyYoRgsl3Mksfmee6K0c9biY9NKjmQfWfA1bJhTRlnlpaUjWFZsei2CADD4GExDU6hkij8qM6LwSj3Ol8BHTH-c04JSInLKIxnypdeN1dTYXJUQ9H6D7CJhzhGhR7O_ltZfA"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className="material-symbols-outlined text-4xl text-white/50 animate-pulse">
                  radar
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Mode Selector */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-deep-navy/10 pb-3 gap-2">
          <div>
            <h3 className="font-display serif text-2xl font-normal text-deep-navy">
              탐지 스위트 <span className="text-xs font-mono font-normal uppercase tracking-widest text-[#5a5a40] block sm:inline ml-0 sm:ml-2">ANALYSIS SUITE</span>
            </h3>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#5a5a40]">
            세그먼트 정식 선택
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Video suite */}
          <button
            onClick={() => onSelectSuite("video")}
            className="group relative flex flex-col text-left bg-[#ebeae4] border border-[#d8d6cf] p-6 hover:border-deep-navy hover:bg-white transition-all duration-300 w-full outline-none"
          >
            <div className="w-10 h-10 border border-deep-navy/10 flex items-center justify-center mb-6 text-deep-navy group-hover:bg-deep-navy group-hover:text-white transition-colors bg-white">
              <span className="material-symbols-outlined text-lg">videocam</span>
            </div>
            <h4 className="font-display serif text-lg font-semibold text-deep-navy mb-1.5">영상 분석</h4>
            <p className="text-xs text-deep-navy/70 leading-relaxed mb-6 font-light">
              딥페이크 탐지, 시간적 결함 분석, 안면 일관성 검사.
            </p>
            <div className="mt-auto font-mono text-[11px] text-electric-blue flex items-center gap-1.5 group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
              <span>스캔 시작</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </button>

          {/* Image suite */}
          <button
            onClick={() => onSelectSuite("image")}
            className="group relative flex flex-col text-left bg-[#ebeae4] border border-[#d8d6cf] p-6 hover:border-deep-navy hover:bg-white transition-all duration-300 w-full outline-none"
          >
            <div className="w-10 h-10 border border-deep-navy/10 flex items-center justify-center mb-6 text-deep-navy group-hover:bg-deep-navy group-hover:text-white transition-colors bg-white">
              <span className="material-symbols-outlined text-lg">image</span>
            </div>
            <h4 className="font-display serif text-lg font-semibold text-deep-navy mb-1.5">이미지 분석</h4>
            <p className="text-xs text-deep-navy/70 leading-relaxed mb-6 font-light">
              AI 생성 이미지 탐지, 픽셀 패턴 분석, 메타데이터 정밀 조사.
            </p>
            <div className="mt-auto font-mono text-[11px] text-electric-blue flex items-center gap-1.5 group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
              <span>스캔 시작</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </button>

          {/* News suite */}
          <button
            onClick={() => onSelectSuite("news")}
            className="group relative flex flex-col text-left bg-[#ebeae4] border border-[#d8d6cf] p-6 hover:border-deep-navy hover:bg-white transition-all duration-300 w-full outline-none"
          >
            <div className="w-10 h-10 border border-deep-navy/10 flex items-center justify-center mb-6 text-deep-navy group-hover:bg-deep-navy group-hover:text-white transition-colors bg-white">
              <span className="material-symbols-outlined text-lg">newspaper</span>
            </div>
            <h4 className="font-display serif text-lg font-semibold text-deep-navy mb-1.5">뉴스 분석</h4>
            <p className="text-xs text-deep-navy/70 leading-relaxed mb-6 font-light">
              가짜 뉴스 검증, 출처 신뢰도 교차 참조, 언어 모델링 분석.
            </p>
            <div className="mt-auto font-mono text-[11px] text-electric-blue flex items-center gap-1.5 group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
              <span>스캔 시작</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </button>

          {/* Document suite */}
          <button
            onClick={() => onSelectSuite("document")}
            className="group relative flex flex-col text-left bg-[#ebeae4] border border-[#d8d6cf] p-6 hover:border-deep-navy hover:bg-white transition-all duration-300 w-full outline-none"
          >
            <div className="w-10 h-10 border border-deep-navy/10 flex items-center justify-center mb-6 text-deep-navy group-hover:bg-deep-navy group-hover:text-white transition-colors bg-white">
              <span className="material-symbols-outlined text-lg">description</span>
            </div>
            <h4 className="font-display serif text-lg font-semibold text-deep-navy mb-1.5">문서 분석</h4>
            <p className="text-xs text-deep-navy/70 leading-relaxed mb-6 font-light">
              학술적 정직성 스캐닝, PDF 출처 추적, LLM 생성 텍스트 탐지.
            </p>
            <div className="mt-auto font-mono text-[11px] text-electric-blue flex items-center gap-1.5 group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
              <span>스캔 시작</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </div>
          </button>
        </div>
      </section>

      {/* Archive Bento Section: Recent Records & Stats Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Verifications list (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#ebeae4] border border-[#d8d6cf] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-deep-navy/10 pb-4 mb-4">
              <h3 className="font-display serif text-xl font-normal text-deep-navy">
                최근 아카이브 검증 파일 <span className="font-mono text-[10px] text-deep-navy/50">ARCHIVES</span>
              </h3>
            </div>

            <div className="space-y-3">
              {recentRecords.slice(0, 3).map((record) => {
                // Determine chip design based on verdict
                let chipStyle = "border-authentic-green text-authentic-green";
                let labelText = "AUTHENTIC";
                if (record.verdict === "AI_DETECTED") {
                  chipStyle = "border-alert-red text-alert-red font-bold";
                  labelText = "AI DETECTED";
                } else if (record.verdict === "SUSPICIOUS") {
                  chipStyle = "border-suspicious-yellow text-suspicious-yellow";
                  labelText = "SUSPICIOUS";
                }

                return (
                  <div
                    key={record.id}
                    onClick={() => onOpenRecord(record)}
                    className="flex items-center justify-between p-3.5 bg-surface-container-lowest border border-transparent hover:border-deep-navy transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Arched small preview for aesthetics */}
                      <div className="w-10 h-12 bg-surface-container rounded-t-[15px] overflow-hidden flex items-center justify-center shrink-0 border border-deep-navy/5">
                        {record.thumbUrl ? (
                          <img
                            className="w-full h-full object-cover"
                            src={record.thumbUrl}
                            alt="Verify preview image"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-deep-navy/40 text-sm select-none">
                            {record.type === "image"
                              ? "image"
                              : record.type === "video"
                              ? "videocam"
                              : record.type === "news"
                              ? "newspaper"
                              : "description"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display serif text-sm font-semibold text-deep-navy truncate max-w-[160px] sm:max-w-xs">
                          {record.fileName}
                        </div>
                        <div className="font-mono text-[10px] text-deep-navy/50 mt-0.5 uppercase tracking-wider">
                          {record.type === "image"
                            ? "이미지 분석"
                            : record.type === "document"
                            ? "문서 분석"
                            : record.type === "video"
                            ? "영상 분석"
                            : "뉴스 분석"}{" "}
                          • {record.timestamp}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 border font-mono text-[10px] uppercase shrink-0 ${chipStyle}`}
                    >
                      {labelText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {recentRecords.length === 0 && (
            <div className="text-center py-10 text-deep-navy/50 text-xs italic font-light">
              아직 검증 기록이 없습니다. 새로운 스캐닝을 시작하세요.
            </div>
          )}
        </div>

        {/* Global stats editorial block */}
        <div className="bg-deep-navy text-surface-container-lowest p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[10rem] text-white">analytics</span>
          </div>
          
          <div className="relative z-10 border-b border-white/10 pb-4">
            <span className="font-mono text-[9px] uppercase opacity-50 tracking-[0.2em] leading-none block">
              정량 분석 요지
            </span>
            <h3 className="font-display serif text-xl font-normal mt-2">
              포렌식 계량 지표
            </h3>
          </div>

          <div className="space-y-6 mt-8 relative z-10">
            <div>
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider mb-2 text-surface-container-low">
                <span>프로세싱 정확도</span>
                <span className="text-surface-container-lowest font-bold">
                  {stats.precision}%
                </span>
              </div>
              <div className="w-full h-[1px] bg-white/20">
                <div
                  style={{ width: `${stats.precision}%` }}
                  className="h-full bg-surface-container-lowest transition-all duration-1000"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider mb-2 text-surface-container-low">
                <span>일일 정밀 검증량</span>
                <span className="text-surface-container-lowest font-bold">
                  {stats.scansToday.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-[1px] bg-white/20">
                <div
                  style={{ width: "85%" }}
                  className="h-full bg-surface-container-lowest"
                />
              </div>
            </div>
          </div>

          <button className="mt-8 border border-white/20 hover:bg-white hover:text-deep-navy transition-all w-full py-2.5 rounded font-mono text-[11px] uppercase tracking-widest text-white cursor-pointer relative z-10">
            Enterprise Upgrade
          </button>
        </div>
      </section>
    </div>
  );
}
