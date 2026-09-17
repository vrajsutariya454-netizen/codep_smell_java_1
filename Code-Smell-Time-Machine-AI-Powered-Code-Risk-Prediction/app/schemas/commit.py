from pydantic import BaseModel
from datetime import datetime


class CommitResponse(BaseModel):
    id: int
    repository_id: int
    sha: str
    message: str
    author: str
    additions: int
    deletions: int
    files_changed: int
    committed_at: datetime
    features: dict | None = None
    created_at: datetime

    class Config:
        from_attributes = True
