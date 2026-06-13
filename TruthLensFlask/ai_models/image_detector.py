from ai_models.base_detector import BaseDetector


class ImageDetector(BaseDetector):
    """이미지 AI 생성 판별 모델 (FR-02)"""

    def detect(self, content):
        # TODO: 픽셀 패턴 분석, 히트맵 생성, EXIF 메타데이터 분석 모델 연동
        return {
            "score": 0.0,
            "details": {
                "heatmap": None,
                "exif": {},
                "summary": "분석 모델이 아직 연동되지 않았습니다.",
            },
        }
