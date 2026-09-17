from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import User, Repository, Commit, Prediction
from app.schemas import AnalyzeRequest, AnalyzeResponse, PredictionResponse
from app.services.mining import mine_commits, parse_github_url
from app.services.features import extract_features
from app.services.ml import train_model, predict_risk

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repository(
    request: AnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    repo_url = str(request.repo_url)

    parsed = parse_github_url(repo_url)
    if not parsed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub URL format",
        )

    owner, name = parsed

    repository = db.query(Repository).filter(Repository.url == repo_url).first()
    if not repository:
        repository = Repository(
            owner_id=current_user.id,
            url=repo_url,
            owner=owner,
            name=name,
        )
        db.add(repository)
        db.commit()
        db.refresh(repository)

    try:
        commit_data = await mine_commits(repo_url, request.max_commits, current_user.github_token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    if not commit_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No commits found in repository",
        )

    feature_dicts = []
    commits_to_process = []

    for raw_commit in commit_data:
        existing_commit = db.query(Commit).filter(
            Commit.repository_id == repository.id,
            Commit.sha == raw_commit["sha"],
        ).first()

        if not existing_commit:
            features = extract_features(raw_commit)
            feature_dicts.append(features)
            commits_to_process.append((raw_commit, features))

    if not commits_to_process:
        existing_predictions = db.query(Prediction).join(Commit).filter(
            Commit.repository_id == repository.id
        ).all()
        return AnalyzeResponse(
            repository_id=repository.id,
            total_commits=len(existing_predictions),
            predictions=[PredictionResponse.from_orm(p) for p in existing_predictions],
        )

    try:
        model = train_model(feature_dicts)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    predictions = []
    for raw_commit, features in commits_to_process:
        risk_score, label = predict_risk(model, features)

        committed_at = raw_commit.get("committed_at", datetime.now(timezone.utc).isoformat())
        if isinstance(committed_at, str):
            committed_at = datetime.fromisoformat(committed_at.replace("Z", "+00:00"))

        commit = Commit(
            repository_id=repository.id,
            sha=raw_commit["sha"],
            message=raw_commit.get("message", ""),
            author=raw_commit.get("author", ""),
            additions=raw_commit.get("additions", 0),
            deletions=raw_commit.get("deletions", 0),
            files_changed=raw_commit.get("files_changed", 0),
            committed_at=committed_at,
            features=features,
        )
        db.add(commit)
        db.flush()

        prediction = Prediction(
            commit_id=commit.id,
            risk_score=risk_score,
            label=label,
            model_used="LogisticRegression",
        )
        db.add(prediction)
        predictions.append(prediction)

    db.commit()

    return AnalyzeResponse(
        repository_id=repository.id,
        total_commits=len(commits_to_process),
        predictions=[PredictionResponse.from_orm(p) for p in predictions],
    )
