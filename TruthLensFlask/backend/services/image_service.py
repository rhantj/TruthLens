import json

from ai_models.image_detector import ImageDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.content_hash_service import hash_file
from cache.redis_client import get_cached_result, set_cached_result
from backend.services.cache_record_service import record_cache_hit, record_cache_miss, record_request


class ImageService:
    """이미지 AI 생성 판별 비즈니스 로직 (FR-02)"""

    def __init__(self):
        self.detector = ImageDetector()

    def analyze(self, file_path):
        """단일 이미지를 분석하고 결과를 DB에 저장한다 (FR-05: 결과 캐싱)"""
        content_hash = hash_file(file_path)

        detection_request = DetectionRequest(content_hash=content_hash, type='image', status='pending')
        db.session.add(detection_request)
        db.session.commit()

        record_request(content_hash)

        cached_json = get_cached_result(content_hash)
        if cached_json is not None:
            result = json.loads(cached_json)
            is_cached = True
            record_cache_hit(content_hash)
        else:
            result = self.detector.detect(file_path)
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

    def analyze_multiple(self, file_paths):
        """다중 이미지(최대 10장)를 분석한다"""
        return [self.analyze(path) for path in file_paths]
