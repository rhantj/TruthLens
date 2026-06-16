def test_detect_paper_page(logged_in_client):
    """논문 판별 화면(/detect/paper)이 정상적으로 렌더링되는지 확인한다 (FR-04)"""
    response = logged_in_client.get('/detect/paper')
    assert response.status_code == 200


def test_detect_paper_api_requires_file(logged_in_client):
    """file(PDF)이 없으면 400을 반환해야 한다 (FR-04)"""
    response = logged_in_client.post('/api/v1/detect/paper', data={})
    assert response.status_code == 400


def test_get_citations_for_unknown_request_returns_empty_list(logged_in_client):
    """존재하지 않는 request_id에 대해서도 빈 목록을 반환한다 (FR-04)"""
    response = logged_in_client.get('/api/v1/paper/999/citations')
    assert response.status_code == 200
    assert response.get_json()["data"]["citations"] == []
