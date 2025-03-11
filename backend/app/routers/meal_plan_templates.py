from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.meal_plan_template import MealPlanTemplate
from app.schemas.meal_plan_template import MealPlanTemplateCreate, MealPlanTemplateResponse
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[MealPlanTemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    logger.info("Fetching templates from database")
    templates = db.query(MealPlanTemplate).all()
    logger.info(f"Found {len(templates)} templates")
    return templates

@router.post("/", response_model=MealPlanTemplateResponse)
def create_template(template: MealPlanTemplateCreate, db: Session = Depends(get_db)):
    db_template = MealPlanTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.put("/{template_id}", response_model=MealPlanTemplateResponse)
def update_template(template_id: int, template: MealPlanTemplateCreate, db: Session = Depends(get_db)):
    db_template = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not db_template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    for key, value in template.dict().items():
        setattr(db_template, key, value)
    
    db.commit()
    db.refresh(db_template)
    return db_template

@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    db_template = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not db_template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(db_template)
    db.commit()
    return {"message": "Template deleted successfully"}

@router.post("/{template_id}/copy")
def copy_template(template_id: int, db: Session = Depends(get_db)):
    original = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Template not found")
    
    new_template = MealPlanTemplate(
        template_name=f"{original.template_name} (Copy)",
        description=original.description,
        goal=original.goal,
        calories_target=original.calories_target,
        macros=original.macros,
        dietary_restrictions=original.dietary_restrictions,
        days=original.days,
        rotation_enabled=original.rotation_enabled,
        rotation_frequency=original.rotation_frequency
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template

@router.post("/{template_id}/rotate")
def rotate_meals(template_id: int, db: Session = Depends(get_db)):
    template = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not template or not template.rotation_enabled:
        raise HTTPException(status_code=404, detail="Template not found or rotation not enabled")
    
    # Implement meal rotation logic
    days = template.days
    if len(days) > 1:
        rotated_days = days[1:] + [days[0]]
        template.days = rotated_days
        db.commit()
        return {"message": "Meals rotated successfully"}
    return {"message": "Not enough days to rotate"}
