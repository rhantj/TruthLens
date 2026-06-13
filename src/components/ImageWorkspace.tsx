import React, { useState, useRef } from "react";

interface ImageWorkspaceProps {
  onAnalyze: (imageFiles: string[], customPrompt?: string) => void;
  isAnalyzing: boolean;
}

export default function ImageWorkspace({
  onAnalyze,
  isAnalyzing,
}: ImageWorkspaceProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert files to Base64 arrays
  const processFiles = (files: FileList) => {
    const validImageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    // Limit maximum files to 10
    const slotsAvailable = 10 - selectedImages.length;
    const filesToLoad = validImageFiles.slice(0, slotsAvailable);

    filesToLoad.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag and Drop helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartAnalysis = () => {
    if (selectedImages.length > 0) {
      onAnalyze(selectedImages, customPrompt);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 animate-fade-in">
      {/* Upload & Files Workspace */}
      <section className="lg:col-span-8 flex flex-col gap-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative overflow-hidden upload-dashed p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#ebeae4]/40 border border-[#d8d6cf] transition-all duration-300 group ${
            dragging ? "bg-[#e0ded7]" : ""
          }`}
        >
          <div className="mb-6 p-4 bg-white border border-deep-navy/10 rounded-full group-hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-4xl text-deep-navy">
              upload_file
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="font-display serif text-2xl font-normal text-deep-navy">
              포렌식 미디어 드래그 앤 드롭
            </h2>
            <p className="text-xs text-deep-navy/70 max-w-sm mx-auto font-light leading-relaxed">
              고해상도 JPG, PNG, WebP 분석 지원 • 최대 10장 순차 스캔 가능
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-deep-navy/50 bg-[#e0ded7] px-2.5 py-0.5 rounded-full inline-block mt-2">
              최대 10장까지 업로드 가능 • {selectedImages.length}/10
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="px-6 py-2.5 bg-deep-navy text-white text-xs font-mono uppercase tracking-wider hover:bg-[#5a5a40] transition-all active:scale-95 flex items-center justify-center gap-2 select-none">
              <span className="material-symbols-outlined text-sm">publish</span>
              로컬 이미지 파일 선택
            </div>
          </label>
        </div>

        {/* Gallery Preview Area */}
        {selectedImages.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] text-deep-navy/60 uppercase tracking-widest font-bold">
              대기 중인 포렌식 리소스 ({selectedImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-white border border-[#d8d6cf] rounded-none">
              {selectedImages.map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden border border-[#d8d6cf] bg-surface-container-high group"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={`Preview resource ${index + 1}`}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-900 text-white rounded-full p-1 opacity-90 transition-colors cursor-pointer w-5 h-5 flex items-center justify-center shadow-md"
                  >
                    <span className="material-symbols-outlined text-[10px] select-none">close</span>
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded leading-none">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Tuning Option */}
        <div className="bg-white border border-[#d8d6cf] p-5 space-y-2">
          <label className="block text-[10px] font-mono font-bold text-deep-navy/60 uppercase tracking-widest">
            분석 보정 매개 변수 지정 (선택 사양)
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="이 미디어에서 발견되는 조명 밀도와 인위적인 노이즈 경계를 중심적으로 탐색..."
            className="w-full bg-surface-container-lowest text-xs rounded-none border border-[#d8d6cf] px-4 py-3 outline-none focus:border-deep-navy transition-all"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleStartAnalysis}
            disabled={selectedImages.length === 0 || isAnalyzing}
            className={`w-full py-4 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 select-none cursor-pointer ${
              selectedImages.length > 0 && !isAnalyzing
                ? "bg-deep-navy text-white hover:bg-[#5a5a40]"
                : "bg-[#ebeae4] text-deep-navy/40 border border-[#d8d6cf] cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                <span>스캐닝 처리 분석 중 ...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">analytics</span>
                <span>정직성 탐지 프로세스 개시</span>
              </>
            )}
          </button>
          <p className="text-center font-mono text-[9px] text-deep-navy/50 mt-4 leading-none uppercase tracking-widest">
            TruthLens AI v4.5 • Core Forensic Analyzer Engine
          </p>
        </div>
      </section>

      {/* Sidebar / Guidelines Panel */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-[#d8d6cf] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-deep-navy/10 pb-3">
            <span className="material-symbols-outlined text-[#5a5a40]">
              verified_user
            </span>
            <h3 className="font-display serif text-xl font-normal text-deep-navy">
              분석 가이드라인
            </h3>
          </div>

          <ul className="space-y-5">
            <li className="flex gap-4">
              <span className="material-symbols-outlined text-deep-navy/40 shrink-0 mt-0.5 text-lg">
                high_quality
              </span>
              <div>
                <p className="font-display serif font-semibold text-sm text-deep-navy leading-none mb-1">고해상도 데이터</p>
                <p className="text-xs text-deep-navy/70 leading-relaxed font-light">
                  정밀도를 최대화하기 위해 압축되지 않은 카메라 원본 그대로의 소스 파일을 제공하세요.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="material-symbols-outlined text-deep-navy/40 shrink-0 mt-0.5 text-lg">
                filter_center_focus
              </span>
              <div>
                <p className="font-display serif font-semibold text-sm text-deep-navy leading-none mb-1">인물 반사 검토</p>
                <p className="text-xs text-deep-navy/70 leading-relaxed font-light">
                  소셜 미디어가 가공한 아티팩트를 역추적하려면 메타 픽셀 밀도 변이를 대조해야 합니다.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="material-symbols-outlined text-deep-navy/40 shrink-0 mt-0.5 text-lg">
                layers
              </span>
              <div>
                <p className="font-display serif font-semibold text-sm text-deep-navy leading-none mb-1">다중 샘플의 사용</p>
                <p className="text-xs text-deep-navy/70 leading-relaxed font-light">
                  의심 시퀀스에서 프레임별 변동률을 측정하여 픽셀의 깜빡임을 입증할 수 있습니다.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-8 p-4 bg-[#ebeae4] border-l-2 border-[#5a5a40]">
            <p className="text-xs italic text-deep-navy/80 leading-relaxed font-light">
              "모든 디지털 생성 아키텍처는 고유 주파수와 Exif 데이터의 비일관성을 남겨둡니다."
            </p>
          </div>
        </div>

        {/* Secondary Pro Info */}
        <div className="bg-[#5a5a40] text-white p-6 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 select-none">
            <span className="material-symbols-outlined text-7xl text-white">workspace_premium</span>
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/80 font-bold">
              PRO INVESTIGATOR
            </h4>
            <p className="font-display serif text-lg text-white leading-snug">
              딥 메타데이터 추출 기능을 연계하여 잠금해제 하십시오
            </p>
            <button className="text-xs font-mono uppercase tracking-widest text-[#e0ded7] hover:text-white flex items-center gap-1 group transition-all cursor-pointer">
              <span>Upgrade Now</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
