from ai_models.paper_detector import PaperDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.citation_service import CitationService
from backend.services.content_hash_service import hash_file


class PaperService:
    """논문 AI 생성 판별 및 분석 비즈니스 로직 (FR-04)"""

    def __init__(self):
        self.detector = PaperDetector()
        self.citation_service = CitationService()

    def analyze(self, file_path):
        """PDF 논문(최대 50MB, 200페이지)에 대해 AI 판별, 자동 요약, 인용 분석을 수행한다"""
        content_hash = hash_file(file_path)

        detection_request = DetectionRequest(content_hash=content_hash, type='paper', status='pending')
        db.session.add(detection_request)
        db.session.commit()

        result = self.detector.detect(file_path)

        db.session.add(DetectionResult(
            request_id=detection_request.id,
            score=result['score'],
            detail_json=result['details'],
        ))

        self.citation_service.analyze_citations(detection_request.id, file_path)

        detection_request.status = 'done'
        db.session.commit()

        return detection_request
