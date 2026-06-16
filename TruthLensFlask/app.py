import os
from flask import Flask
from config import Config
from backend.models.database import db


def create_app(config_overrides=None):
    """애플리케이션 팩토리 함수

    :param config_overrides: 테스트 등에서 설정값을 덮어쓸 때 사용 (예: SQLALCHEMY_DATABASE_URI)
    """
    app = Flask(__name__)

    # 설정 로드 (config.py 및 .env 활용)
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    # 업로드 폴더 보장
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # SQLAlchemy 초기화
    db.init_app(app)

    # Blueprint 등록
    register_blueprints(app)

    return app


def register_blueprints(app):
    """도메인별 Blueprint를 앱에 등록한다"""
    from backend.routes.main_routes import main_bp
    from backend.routes.video_routes import video_bp
    from backend.routes.image_routes import image_bp
    from backend.routes.news_routes import news_bp
    from backend.routes.paper_routes import paper_bp
    from backend.routes.result_routes import result_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(video_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(paper_bp)
    app.register_blueprint(result_bp)
    


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=app.config['DEBUG'])
