from pydantic import BaseModel
from datetime import datetime


class RepositoryResponse(BaseModel):
    id: int
    owner_id: int
    url: str
    owner: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
