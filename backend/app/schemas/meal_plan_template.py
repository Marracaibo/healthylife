from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime

class MealPlanTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    goal: str
    calories_target: int
    macros: Dict[str, float]
    dietary_restrictions: List[str]
    days: List[Dict]
    rotation_enabled: bool = False
    rotation_frequency: Optional[int] = None

class MealPlanTemplateCreate(MealPlanTemplateBase):
    pass

class MealPlanTemplateResponse(MealPlanTemplateBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
