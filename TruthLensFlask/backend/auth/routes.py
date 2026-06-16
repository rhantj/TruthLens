from datetime import datetime

from flask import Blueprint, redirect, session, url_for

from backend.auth import oauth
from backend.models.database import db
from backend.models.mypage import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/auth/google')
def google_login():
    redirect_uri = url_for('auth.google_callback', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@auth_bp.route('/auth/google/callback')
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        userinfo = token.get('userinfo')

        user = User.query.filter_by(email=userinfo['email']).first()
        if user is None:
            user = User(
                email=userinfo['email'],
                name=userinfo['name'],
                google_sub=userinfo['sub'],
            )
            db.session.add(user)

        user.last_login_at = datetime.utcnow()
        db.session.commit()

        session['user_id'] = user.id
        return redirect(url_for('main.index'))

    except Exception:
        return redirect(url_for('main.login'))


@auth_bp.route('/auth/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('main.login'))
