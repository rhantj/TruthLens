from flask import Blueprint, jsonify, session, abort
from datetime import datetime
# main_routes.py의 패키지 경로를 참고하여 User 모델을 임포트합니다.
from backend.models.mypage import User 

mypage_bp = Blueprint('mypage_api', __name__, url_prefix='/api/v1/mypage')

@mypage_bp.route('/profile', methods=['GET'])
def get_mypage_profile():
    """
    마이페이지 동적 데이터 API:
    세션에 저장된 user_id를 기반으로 MariaDB에서 실제 유저의 통계 정보를 가져옵니다.
    """
    # 임현수님이 로그인 성공 시 세션에 담아둔 유저 ID를 가져옵니다.
    # (개발 및 테스트 편의를 위해 로그인 세션이 없으면 기본값 1번 유저로 동작하도록 처리)
    user_id = session.get('user_id') or 1 
    
    # 데이터베이스에서 해당 유저 조회
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404
        
    # 진아님이 스케치하신 UI 화면 포맷 및 변수명에 100% 매칭하여 반환
    return jsonify({
        "name": user.name,                                            # 예: "Investigator Pro"
        "email": user.email,                                          # "investigator.pro@truthlens.ai"
        "role_badge": user.role.upper(),                              # 배지용 대문자 변환: "ENTERPRISE"
        "trust_score": int(user.trust_score) if user.trust_score else 0, # "99" (%)
        "scan_count": user.scan_count or 0,                           # "142" (scans)
        "accuracy": round(user.accuracy, 1) if user.accuracy else 0.0, # 소수점 한자리: "99.8" (%)
        "plan_name": "Pro Plan" if user.role.lower() == 'pro' else "Enterprise Plan", 
        "next_payment_date": user.next_payment_date.strftime('%y.%m.%d') if user.next_payment_date else "N/A" # "24.12.20"
    }), 200