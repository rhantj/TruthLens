from unittest.mock import patch

from backend.models.database import db
from backend.models.mypage import User


def test_user_can_be_created_without_password(app):
    """Google OAuth 유저는 password_hash 없이 생성 가능해야 한다"""
    with app.app_context():
        user = User(email='google@example.com', name='Google User', google_sub='google_sub_123')
        db.session.add(user)
        db.session.commit()

        saved = User.query.filter_by(email='google@example.com').first()
        assert saved is not None
        assert saved.google_sub == 'google_sub_123'
        assert saved.password_hash is None


def test_unauthenticated_request_redirects_to_login(client):
    """미인증 상태로 / 접근 시 /login으로 리디렉션되어야 한다"""
    response = client.get('/')
    assert response.status_code == 302
    assert '/login' in response.headers['Location']


def test_login_page_accessible_without_auth(client):
    """/login은 인증 없이 접근 가능해야 한다"""
    response = client.get('/login')
    assert response.status_code == 200


def test_google_callback_creates_new_user(app, client):
    """Google 콜백 시 신규 유저가 DB에 저장되어야 한다"""
    fake_userinfo = {
        'sub': 'google_sub_new',
        'email': 'newuser@gmail.com',
        'name': 'New User',
    }
    with patch('backend.auth.routes.oauth.google.authorize_access_token',
               return_value={'userinfo': fake_userinfo}):
        client.get('/auth/google/callback')

    with app.app_context():
        user = User.query.filter_by(email='newuser@gmail.com').first()
        assert user is not None
        assert user.google_sub == 'google_sub_new'
        assert user.name == 'New User'


def test_google_callback_updates_last_login_for_existing_user(app, client):
    """이미 가입된 유저는 last_login_at이 갱신되어야 한다"""
    with app.app_context():
        user = User(email='existing@gmail.com', name='Existing', google_sub='sub_existing')
        db.session.add(user)
        db.session.commit()

    fake_userinfo = {'sub': 'sub_existing', 'email': 'existing@gmail.com', 'name': 'Existing'}
    with patch('backend.auth.routes.oauth.google.authorize_access_token',
               return_value={'userinfo': fake_userinfo}):
        client.get('/auth/google/callback')

    with app.app_context():
        user = User.query.filter_by(email='existing@gmail.com').first()
        assert user.last_login_at is not None


def test_logout_clears_session(client):
    """로그아웃 시 세션의 user_id가 삭제되어야 한다"""
    with client.session_transaction() as sess:
        sess['user_id'] = 1

    client.get('/auth/logout')

    with client.session_transaction() as sess:
        assert 'user_id' not in sess
