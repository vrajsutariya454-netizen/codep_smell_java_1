from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from app.auth.jwt_handler import create_access_token
from app.auth.github_oauth import get_github_access_token, get_github_user
from app.database import get_db
from app.models import User
from app.config import settings
from urllib.parse import urlencode

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/github/login")
async def github_login():
    github_auth_url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={settings.github_client_id}&"
        f"redirect_uri={settings.github_redirect_uri}&"
        f"scope=user:email,repo"
    )
    return RedirectResponse(url=github_auth_url)


@router.get("/github/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    print(f"[DEBUG] Callback received with code: {code[:20]}...")
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No authorization code provided",
        )

    access_token = await get_github_access_token(code)
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to obtain access token from GitHub",
        )

    github_user = await get_github_user(access_token)
    if not github_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to fetch GitHub user",
        )

    github_id = github_user.get("id")
    username = github_user.get("login")
    email = github_user.get("email")

    user = db.query(User).filter(User.github_id == github_id).first()
    if not user:
        user = User(
            github_id=github_id,
            username=username,
            email=email,
            github_token=access_token,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.username = username
        user.email = email
        user.github_token = access_token
        db.commit()
        db.refresh(user)

    jwt_token = create_access_token({"github_id": github_id})
    # Redirect to frontend with token
    frontend_url = "http://localhost:5173/auth/callback"
    params = urlencode({"token": jwt_token})
    return RedirectResponse(url=f"{frontend_url}?{params}")
