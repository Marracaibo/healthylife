from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.measurement import Measurement
from app.schemas.measurement import MeasurementCreate, MeasurementResponse
from datetime import date, timedelta

router = APIRouter()

@router.post("/", response_model=MeasurementResponse)
def create_measurement(measurement: MeasurementCreate, db: Session = Depends(get_db)):
    db_measurement = Measurement(**measurement.dict())
    db.add(db_measurement)
    db.commit()
    db.refresh(db_measurement)
    return db_measurement

@router.get("/", response_model=List[MeasurementResponse])
def get_measurements(
    skip: int = 0, 
    limit: int = 100,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(get_db)
):
    query = db.query(Measurement)
    
    if start_date:
        query = query.filter(Measurement.date >= start_date)
    if end_date:
        query = query.filter(Measurement.date <= end_date)
    
    return query.order_by(Measurement.date.desc()).offset(skip).limit(limit).all()

@router.get("/latest", response_model=MeasurementResponse)
def get_latest_measurement(db: Session = Depends(get_db)):
    measurement = db.query(Measurement).order_by(Measurement.date.desc()).first()
    if not measurement:
        raise HTTPException(status_code=404, detail="No measurements found")
    return measurement

@router.get("/trends")
def get_measurement_trends(timeframe: str = "1m", db: Session = Depends(get_db)):
    """Get measurement trends over a specified timeframe"""
    today = date.today()
    
    if timeframe == "1w":
        start_date = today - timedelta(days=7)
    elif timeframe == "1m":
        start_date = today - timedelta(days=30)
    elif timeframe == "3m":
        start_date = today - timedelta(days=90)
    elif timeframe == "6m":
        start_date = today - timedelta(days=180)
    elif timeframe == "1y":
        start_date = today - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid timeframe")
    
    measurements = db.query(Measurement)\
        .filter(Measurement.date >= start_date)\
        .order_by(Measurement.date.asc())\
        .all()
    
    if not measurements:
        return {
            "weight_trend": 0,
            "body_fat_trend": 0,
            "measurements": []
        }
    
    # Calculate trends
    if len(measurements) >= 2:
        first, last = measurements[0], measurements[-1]
        days_diff = (last.date - first.date).days or 1
        
        weight_change = last.weight - first.weight
        weight_trend = weight_change / days_diff  # kg per day
        
        body_fat_trend = 0
        if first.body_fat is not None and last.body_fat is not None:
            body_fat_change = last.body_fat - first.body_fat
            body_fat_trend = body_fat_change / days_diff  # % per day
    else:
        weight_trend = 0
        body_fat_trend = 0
    
    return {
        "weight_trend": round(weight_trend * 7, 2),  # Convert to weekly change
        "body_fat_trend": round(body_fat_trend * 7, 2),  # Convert to weekly change
        "measurements": measurements
    }

@router.get("/stats")
def get_measurement_stats(db: Session = Depends(get_db)):
    """Get overall measurement statistics"""
    measurements = db.query(Measurement).order_by(Measurement.date.asc()).all()
    
    if not measurements:
        return {
            "total_measurements": 0,
            "weight_lost": 0,
            "body_fat_change": 0,
            "tracking_days": 0
        }
    
    first, last = measurements[0], measurements[-1]
    tracking_days = (last.date - first.date).days + 1
    
    stats = {
        "total_measurements": len(measurements),
        "weight_lost": round(first.weight - last.weight, 1),
        "tracking_days": tracking_days
    }
    
    if first.body_fat is not None and last.body_fat is not None:
        stats["body_fat_change"] = round(first.body_fat - last.body_fat, 1)
    
    return stats
