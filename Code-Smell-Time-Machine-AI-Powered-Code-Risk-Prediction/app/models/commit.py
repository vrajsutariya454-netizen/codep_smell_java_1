from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, func, UniqueConstraint
from app.database import Base


class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)
    sha = Column(String, nullable=False)
    message = Column(String, nullable=False)
    author = Column(String, nullable=False)
    additions = Column(Integer, default=0)
    deletions = Column(Integer, default=0)
    files_changed = Column(Integer, default=0)
    committed_at = Column(DateTime, nullable=False)
    features = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (UniqueConstraint("repository_id", "sha", name="unique_repo_sha"),)
