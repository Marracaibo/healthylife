from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import json

from models.meal_plan import MealPlan

def create_meal_plan(db: Session, meal_plan_data: dict) -> MealPlan:
    """Crea un nuovo piano alimentare"""
    # Assicuriamoci che i campi JSON siano stringhe
    macros = meal_plan_data.get("macros", {})
    if isinstance(macros, dict):
        macros = json.dumps(macros)
    
    dietary_restrictions = meal_plan_data.get("dietary_restrictions", [])
    if isinstance(dietary_restrictions, list):
        dietary_restrictions = json.dumps(dietary_restrictions)
    
    days = meal_plan_data.get("days", [])
    if isinstance(days, list):
        days = json.dumps(days)

    # Creiamo il piano con i valori predefiniti per i campi opzionali
    db_meal_plan = MealPlan(
        name=meal_plan_data.get("name", "Piano Alimentare"),
        description=meal_plan_data.get("description"),
        goal=meal_plan_data.get("goal", "mantenimento"),
        calories_target=meal_plan_data.get("calories_target", 2000),
        macros=macros,
        dietary_restrictions=dietary_restrictions,
        start_date=datetime.fromisoformat(meal_plan_data["start_date"]) if "start_date" in meal_plan_data else None,
        days=days,
        template_name=meal_plan_data.get("template_name")
    )
    
    try:
        db.add(db_meal_plan)
        db.commit()
        db.refresh(db_meal_plan)
        return db_meal_plan
    except Exception as e:
        db.rollback()
        raise e

def get_meal_plan(db: Session, meal_plan_id: int) -> Optional[MealPlan]:
    """Recupera un piano alimentare specifico"""
    return db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()

def get_meal_plans(db: Session, skip: int = 0, limit: int = 100) -> List[MealPlan]:
    """Recupera tutti i piani alimentari"""
    return db.query(MealPlan).filter(MealPlan.template_name.is_(None)).offset(skip).limit(limit).all()

def get_latest_meal_plan(db: Session) -> Optional[MealPlan]:
    """Recupera il piano alimentare più recente"""
    return db.query(MealPlan).filter(MealPlan.template_name.is_(None)).order_by(MealPlan.created_at.desc()).first()

def update_meal_plan(db: Session, meal_plan_id: int, meal_plan_data: dict) -> Optional[MealPlan]:
    """Aggiorna un piano alimentare esistente"""
    db_meal_plan = get_meal_plan(db, meal_plan_id)
    if not db_meal_plan:
        return None
    
    # Aggiorna solo i campi presenti nei dati
    if "name" in meal_plan_data:
        db_meal_plan.name = meal_plan_data["name"]
    if "description" in meal_plan_data:
        db_meal_plan.description = meal_plan_data["description"]
    if "goal" in meal_plan_data:
        db_meal_plan.goal = meal_plan_data["goal"]
    if "calories_target" in meal_plan_data:
        db_meal_plan.calories_target = meal_plan_data["calories_target"]
    if "macros" in meal_plan_data:
        db_meal_plan.macros = json.dumps(meal_plan_data["macros"]) if isinstance(meal_plan_data["macros"], dict) else meal_plan_data["macros"]
    if "dietary_restrictions" in meal_plan_data:
        db_meal_plan.dietary_restrictions = json.dumps(meal_plan_data["dietary_restrictions"]) if isinstance(meal_plan_data["dietary_restrictions"], list) else meal_plan_data["dietary_restrictions"]
    if "start_date" in meal_plan_data:
        db_meal_plan.start_date = datetime.fromisoformat(meal_plan_data["start_date"]) if isinstance(meal_plan_data["start_date"], str) else meal_plan_data["start_date"]
    if "days" in meal_plan_data:
        db_meal_plan.days = json.dumps(meal_plan_data["days"]) if isinstance(meal_plan_data["days"], list) else meal_plan_data["days"]
    
    try:
        db.commit()
        db.refresh(db_meal_plan)
        return db_meal_plan
    except Exception as e:
        db.rollback()
        raise e

def delete_meal_plan(db: Session, meal_plan_id: int) -> bool:
    """Elimina un piano alimentare"""
    db_meal_plan = get_meal_plan(db, meal_plan_id)
    if not db_meal_plan:
        return False
    
    try:
        db.delete(db_meal_plan)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e
