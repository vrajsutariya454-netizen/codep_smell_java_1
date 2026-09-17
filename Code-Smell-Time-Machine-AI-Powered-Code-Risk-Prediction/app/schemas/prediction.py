from pydantic import BaseModel, HttpUrl
from datetime import datetime


class PredictionResponse(BaseModel):
    id: int
    commit_id: int
    risk_score: float
    label: str
    model_used: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyzeRequest(BaseModel):
    repo_url: HttpUrl
    max_commits: int = 100


class AnalyzeResponse(BaseModel):
    repository_id: int
    total_commits: int
    predictions: list[PredictionResponse]
