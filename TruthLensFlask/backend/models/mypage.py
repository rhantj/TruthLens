from flask import Blueprint, jsonify, session
from datetime import datetime
from backend.models.database import db

mypage_bp = Blueprint('mypage', __name__)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=True)
    google_sub    = db.Column(db.String(100), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(30), nullable=False, default='free')          # 'pro', 'enterprise' 등
    trust_score = db.Column(db.Float, nullable=False, default=0)            # 신뢰 수준 데이터
    scan_count = db.Column(db.Integer, nullable=False, default=0)           # 분석 통계 scans 수
    accuracy = db.Column(db.Float, nullable=False, default=0)               # 탐지 정확도 %
    next_payment_date = db.Column(db.Date, nullable=True)                   # 결제 예정일
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, nullable=True)


@mypage_bp.route('/api/v1/mypage/profile', methods=['GET'])
def get_mypage_profile():
    # 임현수님이 세션에 저장할 로그인 유저 ID (테스트용 기본값 1)
    user_id = session.get('user_id') or 1 
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404
        
    # 화면 캡처본 레이블에 완벽하게 대응하도록 데이터 매핑
    return jsonify({
        "name": user.name,                                            # "Investigator Pro"
        "email": user.email,                                          # "investigator.pro@truthlens.ai"
        "role_badge": user.role.upper(),                              # 배지용 대문자 변환: "ENTERPRISE"
        "trust_score": int(user.trust_score),                         # "99" (%)
        "scan_count": user.scan_count,                                # "142" (scans)
        "accuracy": round(user.accuracy, 1),                          # 소수점 한자리: "99.8" (%)
        "plan_name": "Pro Plan" if user.role == 'pro' else "Enterprise Plan", 
        "next_payment_date": user.next_payment_date.strftime('%y.%m.%d') if user.next_payment_date else "N/A" # "24.12.20" 포맷
    }), 200