from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import json
from sqlalchemy.sql import func

from database import Base

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    goal = Column(String(255), nullable=False)
    calories_target = Column(Integer, nullable=False)
    macros = Column(Text, nullable=False)  # Stored as JSON string
    dietary_restrictions = Column(Text, nullable=True)  # Stored as JSON string
    created_at = Column(DateTime, server_default=func.now())
    start_date = Column(DateTime, nullable=True)
    days = Column(Text, nullable=False)  # Stored as JSON string
    template_name = Column(String(255), nullable=True)  # Per identificare i template

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "goal": self.goal,
            "calories_target": self.calories_target,
            "macros": json.loads(self.macros) if self.macros else {},
            "dietary_restrictions": json.loads(self.dietary_restrictions) if self.dietary_restrictions else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "days": json.loads(self.days) if self.days else [],
            "template_name": self.template_name
        }
