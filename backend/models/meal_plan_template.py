from sqlalchemy import Column, Integer, String, JSON, Boolean
from database import Base

class MealPlanTemplate(Base):
    __tablename__ = "meal_plan_templates"

    id = Column(Integer, primary_key=True, index=True)
    template_name = Column(String, index=True)
    description = Column(String)
    goal = Column(String)
    calories_target = Column(Integer)
    macros = Column(JSON)
    dietary_restrictions = Column(JSON)
    days = Column(JSON)
    rotation_enabled = Column(Boolean, default=False)
    rotation_frequency = Column(Integer, nullable=True)
