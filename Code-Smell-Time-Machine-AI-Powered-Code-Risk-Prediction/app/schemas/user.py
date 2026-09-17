from pydantic import BaseModel
from datetime import datetime


class UserResponse(BaseModel):
    id: int
    github_id: int
    username: str
    email: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
