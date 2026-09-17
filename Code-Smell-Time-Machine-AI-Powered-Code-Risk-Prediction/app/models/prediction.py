from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, func, CheckConstraint
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    commit_id = Column(Integer, ForeignKey("commits.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)
    label = Column(String, nullable=False)
    model_used = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (CheckConstraint("risk_score >= 0 AND risk_score <= 1", name="check_risk_score_range"),)
