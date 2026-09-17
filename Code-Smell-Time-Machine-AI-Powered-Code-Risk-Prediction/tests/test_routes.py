import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_github_login_redirect(client: TestClient):
    response = client.get("/auth/github/login", allow_redirects=False)
    assert response.status_code == 307
    assert "github.com/login/oauth/authorize" in response.headers["location"]


def test_analyze_without_auth(client: TestClient):
    response = client.post(
        "/analyze",
        json={"repo_url": "https://github.com/user/repo", "max_commits": 10},
    )
    assert response.status_code == 403


def test_analyze_with_invalid_url(client: TestClient, db):
    from app.models import User
    from app.auth.jwt_handler import create_access_token

    user = User(github_id=123, username="testuser", email="test@example.com")
    db.add(user)
    db.commit()

    token = create_access_token({"github_id": 123})

    response = client.post(
        "/analyze",
        json={"repo_url": "https://invalid.com/user/repo", "max_commits": 10},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
