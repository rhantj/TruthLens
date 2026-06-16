import json

from ai_models.news_detector import NewsDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.content_hash_service import hash_text_or_url
from cache.redis_client import get_cached_result, set_cached_result
from backend.services.cache_record_service import record_cache_hit, record_cache_miss, record_request


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

        record_request(content_hash)

        cached_json = get_cached_result(content_hash)
        if cached_json is not None:
            result = json.loads(cached_json)
            is_cached = True
            record_cache_hit(content_hash)
        else:
            result = self.detector.detect(content)
            set_cached_result(content_hash, json.dumps(result))
            is_cached = False
            record_cache_miss(content_hash)

        db.session.add(DetectionResult(
            request_id=detection_request.id,
            score=result['score'],
            detail_json=result['details'],
            cached=is_cached,
        ))
        detection_request.status = 'done'
        db.session.commit()

        return detection_request
