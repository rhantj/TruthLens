from backend.models.database import db
from backend.models.mypage import User
# 만약 이력 데이터(history) 컬럼이 다른 모델에 있다면 함께 임포트해줍니다.
# from models.history import History 

class MypageService:
    def __init__(self, user_id):
        """
        마이페이지 서비스가 생성될 때 현재 로그인한 '본인'의 ID를 주입받아 
        인스턴스 변수에 안전하게 저장합니다.
        """
        self.user_id = user_id

    def getUser(self):
        """
        인스턴스에 저장된 self.user_id를 활용하여 
        데이터베이스에서 본인의 상세 회원 정보를 조회하여 반환합니다.
        """
        # 1. 본인의 고유 ID로 데이터베이스(User 테이블)를 조회합니다.
        # 데이터가 없으면 None을 반환하거나, 필요에 따라 예외 처리를 할 수 있습니다.
        current_user_data = User.query.get(self.user_id)
        
        # 2. 만약 본인의 회원 정보 외에 '판별 이력(detection_request)' 데이터까지 
        # 함께 묶어서 반환해야 한다면 아래와 같이 확장할 수 있습니다.
        # (User 모델에 무언가 이력 관계가 정의되어 있거나 따로 조회한다고 가정)
        
        return current_user_data