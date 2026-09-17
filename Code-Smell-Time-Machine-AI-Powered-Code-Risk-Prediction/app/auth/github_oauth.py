import httpx
from app.config import settings


async def get_github_access_token(code: str) -> str | None:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.github_client_id,
                "client_secret": settings.github_client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        print(f"[DEBUG] GitHub token response status: {response.status_code}")
        print(f"[DEBUG] GitHub token response: {response.json()}")
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"[DEBUG] Got access token: {token[:20] if token else None}...")
            return token
        else:
            print(f"[DEBUG] Failed to get token")
    return None


async def get_github_user(access_token: str) -> dict | None:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        if response.status_code == 200:
            return response.json()
    return None
