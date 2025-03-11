from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List, Optional
import json
import time

# Importa il servizio diretto FatSecret
from services.fatsecret_real_service import search_foods_api, get_food_details_api

router = APIRouter(prefix="/api/food-direct-test", tags=["food-test"])

@router.get("/search")
async def search_food_direct(
    query: str = Query(..., description="Query di ricerca"),
    max_results: int = Query(10, description="Numero massimo di risultati")
):
    """Cerca alimenti utilizzando l'API diretta di FatSecret."""
    
    start_time = time.time()
    
    try:
        # Ottieni risultati usando l'API diretta
        results = search_foods_api(query, max_results)
        elapsed = time.time() - start_time
        
        # Formatta i risultati per una migliore visualizzazione
        formatted_results = []
        for food in results:
            food_id = food.get("food_id", "")
            food_name = food.get("food_name", "")
            brand = food.get("brand_name", "Generic")
            nutrition = food.get("nutrition", {})
            
            formatted_results.append({
                "id": food_id,
                "name": food_name,
                "brand": brand if brand != "Generic" else None,
                "calories": nutrition.get("calories", "N/A"),
                "fat": nutrition.get("fat", "N/A"),
                "carbs": nutrition.get("carbs", "N/A"),
                "protein": nutrition.get("protein", "N/A")
            })
        
        return {
            "query": query,
            "results": formatted_results,
            "count": len(formatted_results),
            "elapsed_time": elapsed
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/food/{food_id}")
async def get_food_detail_direct(food_id: str):
    """Ottiene i dettagli di un alimento specifico utilizzando l'API diretta di FatSecret."""
    
    start_time = time.time()
    
    try:
        # Ottieni dettagli usando l'API diretta
        details = get_food_details_api(food_id)
        elapsed = time.time() - start_time
        
        if not details:
            raise HTTPException(status_code=404, detail=f"Alimento con ID {food_id} non trovato")
        
        # Aggiungi informazioni sul tempo di risposta
        details["_meta"] = {
            "elapsed_time": elapsed
        }
        
        return details
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante il recupero dei dettagli: {str(e)}")
