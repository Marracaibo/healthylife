from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

class MeasurementBase(BaseModel):
    date: date
    weight: float
    body_fat: Optional[float] = None
    muscle_mass: Optional[float] = None
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None
    arm: Optional[float] = None
    thigh: Optional[float] = None
    notes: Optional[str] = None

class MeasurementCreate(MeasurementBase):
    pass

class MeasurementResponse(MeasurementBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
