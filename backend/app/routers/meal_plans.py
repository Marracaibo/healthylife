"""
Router per i piani alimentari
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import logging

# Configurazione del logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Schema per il piano alimentare
class MealItem(BaseModel):
    id: str
    name: str
    portion: float
    unit: str
    calories: float
    protein: float
    carbs: float
    fat: float

class MealData(BaseModel):
    name: str
    items: List[MealItem]
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float

class MealPlan(BaseModel):
    id: str
    name: str
    date: datetime
    meals: Dict[str, MealData]
    daily_totals: Dict[str, float]

# Lista temporanea di piani in-memory per test
sample_plans = []

@router.get("/", response_model=List[MealPlan])
async def get_meal_plans():
    """
    Restituisce tutti i piani alimentari salvati
    """
    logger.info(f"Richiesta lista piani alimentari. Piani disponibili: {len(sample_plans)}")
    return sample_plans

@router.get("/{plan_id}", response_model=Optional[MealPlan])
async def get_meal_plan(plan_id: str):
    """
    Restituisce un piano alimentare specifico
    """
    logger.info(f"Richiesta piano alimentare con ID: {plan_id}")
    for plan in sample_plans:
        if plan.id == plan_id:
            return plan
    
    # Se arriviamo qui, il piano non è stato trovato
    logger.warning(f"Piano alimentare con ID {plan_id} non trovato")
    raise HTTPException(status_code=404, detail="Piano alimentare non trovato")

@router.post("/", response_model=MealPlan)
async def create_meal_plan(plan: MealPlan):
    """
    Crea un nuovo piano alimentare
    """
    logger.info(f"Creazione nuovo piano alimentare: {plan.name}")
    
    # Verifica se esiste già un piano con lo stesso ID
    for i, existing_plan in enumerate(sample_plans):
        if existing_plan.id == plan.id:
            # Sostituisci il piano esistente
            sample_plans[i] = plan
            logger.info(f"Piano alimentare aggiornato: {plan.id}")
            return plan
    
    # Se non esiste, aggiungi il nuovo piano
    sample_plans.append(plan)
    logger.info(f"Nuovo piano alimentare creato: {plan.id}")
    return plan

@router.delete("/{plan_id}")
async def delete_meal_plan(plan_id: str):
    """
    Elimina un piano alimentare
    """
    logger.info(f"Richiesta eliminazione piano alimentare: {plan_id}")
    
    for i, plan in enumerate(sample_plans):
        if plan.id == plan_id:
            del sample_plans[i]
            logger.info(f"Piano alimentare eliminato: {plan_id}")
            return {"message": "Piano alimentare eliminato con successo"}
    
    # Se arriviamo qui, il piano non è stato trovato
    logger.warning(f"Piano alimentare con ID {plan_id} non trovato per l'eliminazione")
    raise HTTPException(status_code=404, detail="Piano alimentare non trovato")
