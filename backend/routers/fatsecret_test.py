from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List, Optional
import json
import time
from tabulate import tabulate

# Importa i servizi
from services.hybrid_food_search import HybridFoodSearch
from services.fatsecret_service import search_foods as fatsecret_search

router = APIRouter(prefix="/api/food-test", tags=["food-test"])

@router.get("/compare")
async def compare_search_results(
    query: str = Query(..., description="Query di ricerca"),
    max_results: int = Query(10, description="Numero massimo di risultati")
):
    """Confronta i risultati di ricerca tra FatSecret e il servizio ibrido."""
    
    start_time = time.time()
    
    # Ottieni risultati da FatSecret
    try:
        fatsecret_results = fatsecret_search(query, max_results)
        if not isinstance(fatsecret_results, list):
            fatsecret_results = []
    except Exception as e:
        fatsecret_results = []
    
    # Ottieni risultati dal servizio ibrido
    try:
        hybrid_search = HybridFoodSearch()
        hybrid_response = await hybrid_search.search(query, max_results)
        hybrid_results = hybrid_response.get("results", [])
    except Exception as e:
        hybrid_results = []
    
    # Prepara la risposta
    fatsecret_count = len(fatsecret_results)
    hybrid_count = len(hybrid_results)
    
    elapsed = time.time() - start_time
    
    # Formatta i risultati di FatSecret per la visualizzazione
    formatted_fatsecret = []
    for food in fatsecret_results:
        food_name = food.get("food_name", "Nome sconosciuto")
        brand = food.get("brand_name", "")
        food_id = food.get("food_id", "")
        
        # Estrai informazioni nutrizionali dalla descrizione
        description = food.get("food_description", "")
        nutrients = {}
        
        try:
            if "cal:" in description:
                cal_part = description.split("cal:")[1].split("|")[0].strip()
                nutrients["calories"] = cal_part.replace("kcal", "").strip()
            
            if "fat:" in description:
                fat_part = description.split("fat:")[1].split("|")[0].strip()
                nutrients["fat"] = fat_part.replace("g", "").strip()
            
            if "carbs:" in description:
                carbs_part = description.split("carbs:")[1].split("|")[0].strip()
                nutrients["carbs"] = carbs_part.replace("g", "").strip()
            
            if "protein:" in description:
                protein_part = description.split("protein:")[1].split("|")[0].strip()
                nutrients["protein"] = protein_part.replace("g", "").strip()
        except Exception:
            pass
        
        formatted_fatsecret.append({
            "name": food_name,
            "brand": brand,
            "id": food_id,
            "nutrients": nutrients,
            "description": description[:100] + "..." if len(description) > 100 else description
        })
    
    # Formatta i risultati del servizio ibrido per la visualizzazione
    formatted_hybrid = []
    for food in hybrid_results:
        food_name = food.get("food_name", "Nome sconosciuto")
        brand = food.get("brand_name", "")
        food_id = food.get("food_id", "")
        source = food.get("source", "sconosciuta")
        
        nutrients = food.get("nutrients", {})
        formatted_nutrients = {}
        
        for key, value in nutrients.items():
            if value is not None:
                formatted_nutrients[key] = str(value)
        
        formatted_hybrid.append({
            "name": food_name,
            "brand": brand,
            "id": food_id,
            "source": source,
            "nutrients": formatted_nutrients
        })
    
    return {
        "query": query,
        "elapsed_time": elapsed,
        "fatsecret": {
            "count": fatsecret_count,
            "results": formatted_fatsecret
        },
        "hybrid": {
            "count": hybrid_count,
            "results": formatted_hybrid
        }
    }
