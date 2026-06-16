from datetime import datetime, timedelta

from ai_models.news_detector import NewsDetector
from backend.models.database import db
from backend.models.detection_request import DetectionRequest
from backend.models.detection_result import DetectionResult
from backend.services.content_hash_service import hash_text_or_url

CACHE_TTL = timedelta(days=7)


class NewsService:
    """뉴스 AI 생성/가짜뉴스 판별 비즈니스 로직 (FR-03)"""

    def __init__(self):
        self.detector = NewsDetector()

    def analyze(self, url=None, text=None):
        """
        뉴스 URL 또는 본문 분석

        동작 순서
        1. URL이면 기사 본문 추출
        2. 본문 Hash 생성
        3. 7일 이내 동일 기사 검색
        4. 있으면 기존 결과 재사용
        5. 없으면 Gemini 분석
        """

        # ---------------------------------
        # URL이면 기사 본문 추출
        # ---------------------------------

        if url:
            from backend.services.article_extractor import ArticleExtractor

            try:
                article_text = ArticleExtractor.extract(url)
            except Exception as e:
                raise ValueError(f"기사 추출 실패 : {e}")

        else:
            article_text = text

        # ---------------------------------
        # 본문 해시 생성
        # ---------------------------------

        content_hash = hash_text_or_url(article_text)

        # ---------------------------------
        # 동일 기사 캐시 조회
        # ---------------------------------

        cached_request = (
            DetectionRequest.query
            .filter(
                DetectionRequest.content_hash == content_hash,
                DetectionRequest.status == "done",
                DetectionRequest.created_at >= datetime.utcnow() - CACHE_TTL
            )
            .order_by(DetectionRequest.created_at.desc())
            .first()
        )

        # ---------------------------------
        # 캐시 존재
        # ---------------------------------

        if cached_request:

            cached_result = DetectionResult.query.filter_by(
                request_id=cached_request.id
            ).first()

            # 혹시 결과가 없으면 새 분석
            if cached_result:

                # 새로운 요청 생성
                new_request = DetectionRequest(
                    content_hash=content_hash,
                    type="news",
                    status="done"
                )

                db.session.add(new_request)
                db.session.commit()

                # 결과 복사
                copied_result = DetectionResult(
                    request_id=new_request.id,
                    score=cached_result.score,
                    detail_json=cached_result.detail_json,
                    cached=True
                )

                db.session.add(copied_result)
                db.session.commit()

                return new_request

        # ---------------------------------
        # 캐시 없음
        # ---------------------------------

        detection_request = DetectionRequest(
            content_hash=content_hash,
            type="news",
            status="pending"
        )

        db.session.add(detection_request)
        db.session.commit()

        # ---------------------------------
        # Gemini 분석
        # ---------------------------------

        result = self.detector.detect(article_text)

        detection_result = DetectionResult(
            request_id=detection_request.id,
            score=result["score"],
            detail_json=result["details"],
            cached=False
        )

        db.session.add(detection_result)

        detection_request.status = "done"

        db.session.commit()

        return detection_request