from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from app.database import Base


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String, unique=True, nullable=False)
    owner = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
