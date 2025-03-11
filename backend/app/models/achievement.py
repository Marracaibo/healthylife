from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    icon = Column(String)  # meal, exercise, water, streak, weight, nutrition
    progress = Column(Float, default=0)
    target = Column(Float)
    unit = Column(String)
    achieved = Column(Boolean, default=False)
    achieved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    rules = Column(JSON)  # JSON object containing rules for achievement progress
