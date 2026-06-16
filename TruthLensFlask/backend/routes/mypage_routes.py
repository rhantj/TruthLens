from flask import Blueprint, jsonify, session
from flask import Blueprint, render_template

from backend.models.mypage import User 

mypage_bp = Blueprint('mypage', __name__)

@mypage_bp.route('/profile', methods=['GET'])
def profile():
    """마이페이지 화면: 프로필 및 스캔 통계"""
    user_id = session.get('user_id') or 1 
    user = User.query.get(user_id)
    user_info =  {
        "name": user.name,                                            # 예: "Investigator Pro"
        "email": user.email,                                          # "investigator.pro@truthlens.ai"
        "role_badge": user.role.upper(),                              # 배지용 대문자 변환: "ENTERPRISE"
        "trust_score": int(user.trust_score) if user.trust_score else 0, # "99" (%)
        "scan_count": user.scan_count or 0,                           # "142" (scans)
        "accuracy": round(user.accuracy, 1) if user.accuracy else 0.0, # 소수점 한자리: "99.8" (%)
        "plan_name": "Pro Plan" if user.role.lower() == 'pro' else "Enterprise Plan", 
        "next_payment_date": user.next_payment_date.strftime('%y.%m.%d') if user.next_payment_date else "N/A" # "24.12.20"
        }
    return render_template('mypage.html', user=user_info)