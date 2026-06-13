def test_detect_image_page(client):
    """이미지 판별 화면(/detect/image)이 정상적으로 렌더링되는지 확인한다 (FR-02)"""
    response = client.get('/detect/image')
    assert response.status_code == 200


def test_detect_image_api_requires_file(client):
    """file이 없으면 400을 반환해야 한다 (FR-02)"""
    response = client.post('/api/v1/detect/image', data={})
    assert response.status_code == 400
