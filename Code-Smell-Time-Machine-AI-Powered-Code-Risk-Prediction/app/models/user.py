from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String, index=True, nullable=False)
    email = Column(String, nullable=True)
    github_token = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
