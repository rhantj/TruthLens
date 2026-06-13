from ai_models.base_detector import BaseDetector


class PaperDetector(BaseDetector):
    """논문 AI 생성 판별 및 자동 요약 모델 (FR-04)"""

    def detect(self, content):
        # TODO: 섹션별 AI 생성 비율 분석, 자동 요약, 핵심 주장 추출 모델 연동
        return {
            "score": 0.0,
            "details": {
                "section_scores": {},  # 서론/방법론/결론 등 섹션별 AI 생성 비율
                "suspicious_paragraphs": [],
                "summary": "",  # 500자 이내 자동 요약
                "key_claims": [],  # 핵심 주장 3~5개
            },
        }
