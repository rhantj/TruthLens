def test_detect_news_page(logged_in_client):
    """뉴스 판별 화면(/detect/news)이 정상적으로 렌더링되는지 확인한다 (FR-03)"""
    response = logged_in_client.get('/detect/news')
    assert response.status_code == 200


def test_detect_news_api_requires_url_or_text(logged_in_client):
    """url/text가 없으면 400을 반환해야 한다 (FR-03)"""
    response = logged_in_client.post('/api/v1/detect/news', data={})
    assert response.status_code == 400


def test_detect_news_api_rejects_too_long_text(logged_in_client):
    """텍스트가 10,000자를 초과하면 400을 반환해야 한다 (FR-03)"""
    response = logged_in_client.post('/api/v1/detect/news', data={"text": "a" * 10001})
    assert response.status_code == 400


def test_detect_news_api_accepts_text(logged_in_client):
    """정상 텍스트 입력 시 분석 요청이 생성되어야 한다 (FR-03)"""
    response = logged_in_client.post('/api/v1/detect/news', data={"text": "샘플 뉴스 본문"})
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"
