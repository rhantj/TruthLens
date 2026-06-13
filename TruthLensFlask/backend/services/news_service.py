from ai_models.news_detector import NewsDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.content_hash_service import hash_text_or_url


class NewsService:
    """뉴스 AI 생성/가짜뉴스 판별 비즈니스 로직 (FR-03)"""

    def __init__(self):
        self.detector = NewsDetector()

    def analyze(self, url=None, text=None):
        """뉴스 URL 또는 텍스트(최대 10,000자)를 분석한다"""
        content = url or text
        content_hash = hash_text_or_url(content)

        detection_request = DetectionRequest(content_hash=content_hash, type='news', status='pending')
        db.session.add(detection_request)
        db.session.commit()

        result = self.detector.detect(content)

        db.session.add(DetectionResult(
            request_id=detection_request.id,
            score=result['score'],
            detail_json=result['details'],
        ))
        detection_request.status = 'done'
        db.session.commit()

        return detection_request
