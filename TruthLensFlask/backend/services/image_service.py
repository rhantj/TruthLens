from ai_models.image_detector import ImageDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.content_hash_service import hash_file


class ImageService:
    """이미지 AI 생성 판별 비즈니스 로직 (FR-02)"""

    def __init__(self):
        self.detector = ImageDetector()

    def analyze(self, file_path):
        """단일 이미지를 분석하고 결과를 DB에 저장한다"""
        content_hash = hash_file(file_path)

        detection_request = DetectionRequest(content_hash=content_hash, type='image', status='pending')
        db.session.add(detection_request)
        db.session.commit()

        result = self.detector.detect(file_path)

        db.session.add(DetectionResult(
            request_id=detection_request.id,
            score=result['score'],
            detail_json=result['details'],
        ))
        detection_request.status = 'done'
        db.session.commit()

        return detection_request

    def analyze_multiple(self, file_paths):
        """다중 이미지(최대 10장)를 분석한다"""
        return [self.analyze(path) for path in file_paths]
