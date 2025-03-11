from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
import json
import time
from datetime import datetime

# Importa il servizio OAuth 2.0 FatSecret
from services.fatsecret_oauth2_service import search_foods, get_food_details

router = APIRouter(prefix="/api/food-search-v2", tags=["food-search-v2"])

@router.get("/search")
async def search_foods_endpoint(
    query: str = Query(..., description="Query di ricerca"),
    max_results: int = Query(10, description="Numero massimo di risultati")
):
    """Cerca alimenti utilizzando l'API FatSecret con OAuth 2.0 con un formato migliorato."""
    
    start_time = time.time()
    
    try:
        # Ottieni risultati usando il servizio OAuth 2.0
        results = search_foods(query, max_results)
        elapsed = time.time() - start_time
        
        return {
            "results": results,
            "metadata": {
                "query": query,
                "timestamp": datetime.now().isoformat(),
                "count": len(results),
                "elapsed_time": elapsed,
                "source": "fatsecret_oauth2"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/food/{food_id}")
async def get_food_detail(
    food_id: str
):
    """Ottiene i dettagli di un alimento specifico utilizzando l'API FatSecret con OAuth 2.0."""
    
    start_time = time.time()
    
    try:
        # Ottieni dettagli usando il servizio OAuth 2.0
        details = get_food_details(food_id)
        elapsed = time.time() - start_time
        
        if not details:
            raise HTTPException(status_code=404, detail=f"Alimento con ID {food_id} non trovato")
        
        # Aggiungi informazioni sul tempo di risposta
        return {
            "food": details,
            "metadata": {
                "food_id": food_id,
                "timestamp": datetime.now().isoformat(),
                "elapsed_time": elapsed,
                "source": "fatsecret_oauth2"
            }
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Errore durante il recupero dei dettagli: {str(e)}")
