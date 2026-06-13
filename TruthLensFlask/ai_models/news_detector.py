from ai_models.base_detector import BaseDetector


class NewsDetector(BaseDetector):
    """뉴스 AI 생성 텍스트 및 가짜뉴스 판별 모델 (FR-03)"""

    def detect(self, content):
        # TODO: AI 생성 텍스트 판별 + 가짜뉴스 판별 + 출처/감성 분석 모델 연동
        return {
            "score": 0.0,
            "details": {
                "fake_news_score": 0.0,
                "source_trust": None,
                "sentiment_bias": "중립",
                "suspicious_sentences": [],
            },
        }
