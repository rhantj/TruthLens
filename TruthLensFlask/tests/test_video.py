def test_detect_video_page(logged_in_client):
    """영상 판별 화면(/detect/video)이 정상적으로 렌더링되는지 확인한다 (FR-01)"""
    response = logged_in_client.get('/detect/video')
    assert response.status_code == 200


def test_detect_video_api_requires_file_or_url(logged_in_client):
    """file/url이 없으면 400을 반환해야 한다 (FR-01)"""
    response = logged_in_client.post('/api/v1/detect/video', data={})
    assert response.status_code == 400
