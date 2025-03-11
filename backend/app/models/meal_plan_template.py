from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class MealPlanTemplate(Base):
    __tablename__ = "meal_plan_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Changed from template_name to match schema
    description = Column(String, nullable=True)
    goal = Column(String)
    calories_target = Column(Integer)
    macros = Column(JSON)
    dietary_restrictions = Column(JSON)
    days = Column(JSON)  # Store the meal plan structure as JSON
    rotation_enabled = Column(Boolean, default=False)
    rotation_frequency = Column(Integer, default=7)  # Days between rotations
