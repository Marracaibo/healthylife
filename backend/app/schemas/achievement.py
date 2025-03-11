from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class AchievementBase(BaseModel):
    title: str
    description: str
    icon: str
    target: float
    unit: str
    rules: Dict[str, Any]

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int
    progress: float
    achieved: bool
    achieved_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AchievementProgress(BaseModel):
    achievement_id: int
    progress: float
