from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.meal_plan_template import MealPlanTemplate
from pydantic import BaseModel
from datetime import datetime
import logging

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class MealPlanTemplateBase(BaseModel):
    template_name: str
    description: str
    goal: str
    calories_target: int
    macros: dict
    dietary_restrictions: list
    days: list
    rotation_enabled: bool = False
    rotation_frequency: int = None

class MealPlanTemplateCreate(MealPlanTemplateBase):
    pass

class MealPlanTemplateResponse(MealPlanTemplateBase):
    id: int

    class Config:
        orm_mode = True

@router.get("/meal-plan-templates", response_model=List[MealPlanTemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    logger.info("Ricevuta richiesta GET /meal-plan-templates")
    templates = db.query(MealPlanTemplate).all()
    logger.info(f"Trovati {len(templates)} templates")
    return templates

@router.post("/meal-plan-templates", response_model=MealPlanTemplateResponse)
def create_template(template: MealPlanTemplateCreate, db: Session = Depends(get_db)):
    logger.info(f"Ricevuta richiesta POST /meal-plan-templates con dati: {template.dict()}")
    try:
        db_template = MealPlanTemplate(**template.dict())
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
        logger.info(f"Template creato con successo con ID: {db_template.id}")
        return db_template
    except Exception as e:
        logger.error(f"Errore durante la creazione del template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/meal-plan-templates/{template_id}", response_model=MealPlanTemplateResponse)
def update_template(template_id: int, template: MealPlanTemplateCreate, db: Session = Depends(get_db)):
    logger.info(f"Ricevuta richiesta PUT /meal-plan-templates/{template_id}")
    db_template = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not db_template:
        logger.warning(f"Template {template_id} non trovato")
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
        for key, value in template.dict().items():
            setattr(db_template, key, value)
        
        db.commit()
        db.refresh(db_template)
        logger.info(f"Template {template_id} aggiornato con successo")
        return db_template
    except Exception as e:
        logger.error(f"Errore durante l'aggiornamento del template {template_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/meal-plan-templates/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    logger.info(f"Ricevuta richiesta DELETE /meal-plan-templates/{template_id}")
    db_template = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not db_template:
        logger.warning(f"Template {template_id} non trovato")
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
        db.delete(db_template)
        db.commit()
        logger.info(f"Template {template_id} eliminato con successo")
        return {"message": "Template deleted successfully"}
    except Exception as e:
        logger.error(f"Errore durante l'eliminazione del template {template_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/meal-plan-templates/{template_id}/copy", response_model=MealPlanTemplateResponse)
def copy_template(template_id: int, db: Session = Depends(get_db)):
    logger.info(f"Ricevuta richiesta POST /meal-plan-templates/{template_id}/copy")
    original = db.query(MealPlanTemplate).filter(MealPlanTemplate.id == template_id).first()
    if not original:
        logger.warning(f"Template {template_id} non trovato")
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
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
        logger.info(f"Template {template_id} copiato con successo. Nuovo ID: {new_template.id}")
        return new_template
    except Exception as e:
        logger.error(f"Errore durante la copia del template {template_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
