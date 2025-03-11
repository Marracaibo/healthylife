import os
import json
import logging
from typing import List, Dict, Any
from fatsecret import Fatsecret

logger = logging.getLogger(__name__)

# Configurazione API FatSecret
FATSECRET_CONSUMER_KEY = os.environ.get("FATSECRET_CLIENT_ID", "ec9eca046ec44dd281a8c3c409211f7d")
FATSECRET_CONSUMER_SECRET = os.environ.get("FATSECRET_CLIENT_SECRET", "4fa804f604ab42dc81c5996da43a4b7b")

# Stampa le chiavi per debugging (oscurate parzialmente)
logger.debug(f"FATSECRET_CONSUMER_KEY: {'*' * (len(FATSECRET_CONSUMER_KEY) - 4) + FATSECRET_CONSUMER_KEY[-4:] if FATSECRET_CONSUMER_KEY else 'Non impostato'}")
logger.debug(f"FATSECRET_CONSUMER_SECRET: {'*' * (len(FATSECRET_CONSUMER_SECRET) - 4) + FATSECRET_CONSUMER_SECRET[-4:] if FATSECRET_CONSUMER_SECRET else 'Non impostato'}")

# Inizializza il client FatSecret
fs = Fatsecret(FATSECRET_CONSUMER_KEY, FATSECRET_CONSUMER_SECRET)


def search_foods(query: str, max_results: int = 5) -> List[Dict]:
    """
    Cerca alimenti utilizzando l'API FatSecret con la libreria ufficiale.
    
    Args:
        query: Termine di ricerca
        max_results: Numero massimo di risultati da restituire
        
    Returns:
        Lista di alimenti trovati
    """
    logger.info(f"FatSecret OAuth1: Ricerca di '{query}' con max_results={max_results}")
    
    try:
        # Esegui ricerca tramite la libreria fatsecret
        food_search_results = fs.foods_search(query, max_results=max_results)
        
        # Converti in formato uniforme
        foods = []
        
        if 'foods' in food_search_results and 'food' in food_search_results['foods']:
            food_results = food_search_results['foods']['food']
            
            # Verifica se è un singolo elemento o una lista
            if not isinstance(food_results, list):
                food_results = [food_results]
            
            for food in food_results:
                food_id = food.get("food_id", "")
                food_name = food.get("food_name", "")
                
                # Determina il brand
                brand = food.get("brand_name", "Generic")
                if not brand or brand == "":
                    food_type = food.get("food_type", "")
                    brand = food_type if food_type and food_type != "Generic" else "Generic"
                
                # Estrai la descrizione
                description = food.get("food_description", "")
                
                foods.append({
                    "food_id": food_id,
                    "food_name": food_name,
                    "brand_name": brand,
                    "food_description": description,
                    "raw_data": food  # Includi i dati grezzi per analisi
                })
        
        return foods
        
    except Exception as e:
        logger.error(f"Errore durante la ricerca FatSecret: {e}")
        return []


def get_food_details(food_id: str) -> Dict[str, Any]:
    """
    Ottiene i dettagli di un alimento specifico tramite l'API FatSecret.
    
    Args:
        food_id: ID dell'alimento
        
    Returns:
        Dettagli dell'alimento
    """
    logger.info(f"FatSecret OAuth1: Ottengo dettagli per food_id={food_id}")
    
    try:
        # Ottieni dettagli tramite la libreria fatsecret
        food_details = fs.food_get(food_id)
        
        if "food" in food_details:
            food = food_details["food"]
            food_name = food.get("food_name", "")
            food_type = food.get("food_type", "")
            brand = food.get("brand_name", "Generic")
            
            # Informazioni nutrizionali dettagliate
            nutrition = {}
            if "servings" in food and "serving" in food["servings"]:
                servings = food["servings"]["serving"]
                if not isinstance(servings, list):
                    servings = [servings]
                
                # Usa la porzione per 100g se disponibile
                std_serving = None
                for s in servings:
                    if s.get("serving_description", "").lower() == "100g" or \
                       (s.get("metric_serving_amount", "") == "100" and s.get("metric_serving_unit", "") == "g"):
                        std_serving = s
                        break
                
                # Altrimenti usa la prima porzione
                if not std_serving and servings:
                    std_serving = servings[0]
                
                if std_serving:
                    nutrition = {
                        "calories": std_serving.get("calories", "0"),
                        "fat": std_serving.get("fat", "0"),
                        "saturated_fat": std_serving.get("saturated_fat", "0"),
                        "polyunsaturated_fat": std_serving.get("polyunsaturated_fat", "0"),
                        "monounsaturated_fat": std_serving.get("monounsaturated_fat", "0"),
                        "carbs": std_serving.get("carbohydrate", "0"),
                        "sugar": std_serving.get("sugar", "0"),
                        "fiber": std_serving.get("fiber", "0"),
                        "protein": std_serving.get("protein", "0"),
                        "sodium": std_serving.get("sodium", "0"),
                        "potassium": std_serving.get("potassium", "0"),
                        "cholesterol": std_serving.get("cholesterol", "0"),
                        "serving_size": std_serving.get("metric_serving_amount", "100"),
                        "serving_unit": std_serving.get("metric_serving_unit", "g"),
                        "serving_description": std_serving.get("serving_description", "100g")
                    }
            
            return {
                "food_id": food_id,
                "food_name": food_name,
                "food_type": food_type,
                "brand_name": brand,
                "servings": servings if "servings" in locals() else [],
                "nutrition": nutrition,
                "source": "fatsecret"
            }
        
        return {}
        
    except Exception as e:
        logger.error(f"Errore durante il recupero dettagli FatSecret: {e}")
        return {}
