from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    weight = Column(Float)
    body_fat = Column(Float, nullable=True)
    muscle_mass = Column(Float, nullable=True)
    chest = Column(Float, nullable=True)
    waist = Column(Float, nullable=True)
    hips = Column(Float, nullable=True)
    arm = Column(Float, nullable=True)
    thigh = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
