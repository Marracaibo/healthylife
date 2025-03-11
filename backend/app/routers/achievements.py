from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.achievement import Achievement
from app.schemas.achievement import AchievementCreate, AchievementResponse, AchievementProgress
from datetime import datetime

router = APIRouter()

def check_achievement_completion(achievement: Achievement) -> bool:
    """Check if an achievement has been completed based on its progress and target"""
    return achievement.progress >= achievement.target

def update_achievement_progress(
    db: Session,
    achievement: Achievement,
    new_progress: float
) -> None:
    """Update achievement progress and check for completion"""
    achievement.progress = new_progress
    if not achievement.achieved and check_achievement_completion(achievement):
        achievement.achieved = True
        achievement.achieved_at = datetime.now()
    db.commit()

@router.post("/", response_model=AchievementResponse)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    db_achievement = Achievement(**achievement.dict())
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.get("/", response_model=List[AchievementResponse])
def get_achievements(
    skip: int = 0,
    limit: int = 100,
    include_completed: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Achievement)
    if not include_completed:
        query = query.filter(Achievement.achieved == False)
    return query.offset(skip).limit(limit).all()

@router.get("/{achievement_id}", response_model=AchievementResponse)
def get_achievement(achievement_id: int, db: Session = Depends(get_db)):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.post("/{achievement_id}/progress")
def update_progress(
    achievement_id: int,
    progress_data: AchievementProgress,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Update progress in background to not block the response
    background_tasks.add_task(
        update_achievement_progress,
        db=db,
        achievement=achievement,
        new_progress=progress_data.progress
    )
    
    return {"message": "Progress update scheduled"}

@router.get("/stats/summary")
def get_achievements_summary(db: Session = Depends(get_db)):
    """Get a summary of achievement progress"""
    total = db.query(Achievement).count()
    completed = db.query(Achievement).filter(Achievement.achieved == True).count()
    
    # Get achievements completed in the last 7 days
    recent = db.query(Achievement)\
        .filter(
            Achievement.achieved == True,
            Achievement.achieved_at >= datetime.now() - timedelta(days=7)
        ).count()
    
    return {
        "total": total,
        "completed": completed,
        "completion_rate": round((completed / total * 100) if total > 0 else 0, 1),
        "recent_completions": recent
    }

# Achievement types and their default rules
DEFAULT_ACHIEVEMENTS = [
    {
        "title": "Maestro della Dieta",
        "description": "Segui il piano alimentare per 7 giorni consecutivi",
        "icon": "meal",
        "target": 7,
        "unit": "giorni",
        "rules": {
            "type": "streak",
            "requirement": "daily_meals_logged",
            "min_meals": 3
        }
    },
    {
        "title": "Idratazione Perfetta",
        "description": "Raggiungi l'obiettivo di acqua per 5 giorni",
        "icon": "water",
        "target": 5,
        "unit": "giorni",
        "rules": {
            "type": "count",
            "requirement": "water_goal_met",
            "min_water": 2000  # ml
        }
    },
    {
        "title": "Prima Vittoria",
        "description": "Perdi il primo chilogrammo",
        "icon": "weight",
        "target": 1,
        "unit": "kg",
        "rules": {
            "type": "milestone",
            "requirement": "weight_loss",
            "from_start": True
        }
    },
    {
        "title": "Re del Workout",
        "description": "Completa 10 allenamenti",
        "icon": "exercise",
        "target": 10,
        "unit": "allenamenti",
        "rules": {
            "type": "count",
            "requirement": "workouts_completed"
        }
    },
    {
        "title": "Equilibrio Perfetto",
        "description": "Mantieni i macronutrienti nel range target per 5 giorni",
        "icon": "nutrition",
        "target": 5,
        "unit": "giorni",
        "rules": {
            "type": "streak",
            "requirement": "macros_in_range",
            "tolerance": 5  # percentage
        }
    }
]

@router.post("/initialize")
def initialize_achievements(db: Session = Depends(get_db)):
    """Initialize the default set of achievements if they don't exist"""
    existing = db.query(Achievement).count()
    if existing > 0:
        return {"message": "Achievements already initialized"}
    
    for achievement_data in DEFAULT_ACHIEVEMENTS:
        db_achievement = Achievement(**achievement_data)
        db.add(db_achievement)
    
    db.commit()
    return {"message": "Default achievements initialized"}
