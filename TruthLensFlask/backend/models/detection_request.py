from datetime import datetime

from backend.models.database import db


class DetectionRequest(db.Model):
    """detection_requests 테이블: 판별 요청 이력 (5.3)"""
    __tablename__ = 'detection_requests'

    id = db.Column(db.Integer, primary_key=True)
    # 외래키로 유저 테이블과 연결 (users 테이블의 id를 참조한다고 가정)
    # 만약 유저 테이블 이름이 'user'라면 'user.id'로 변경해주세요.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    content_hash = db.Column(db.String(64), nullable=False, index=True)
    type = db.Column(db.String(20), nullable=False)  # video, image, news, paper
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, processing, done, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
