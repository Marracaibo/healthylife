import asyncio
import logging
import sys
import os
import json
import aiohttp
from dotenv import load_dotenv

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

async def test_edamam_apis():
    """Testa diverse API di Edamam per vedere quale funziona con le credenziali attuali"""
    
    # Ottieni le credenziali
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        logger.error("Credenziali Edamam mancanti")
        return
    
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key}")
    
    # Definisci gli endpoint da testare
    endpoints = [
        {
            "name": "Food Database API",
            "url": "https://api.edamam.com/api/food-database/v2/parser",
            "params": {"ingr": "pasta"}
        },
        {
            "name": "Nutrition Analysis API",
            "url": "https://api.edamam.com/api/nutrition-data",
            "params": {"ingr": "100g pasta"}
        },
        {
            "name": "Recipe Search API",
            "url": "https://api.edamam.com/api/recipes/v2",
            "params": {"type": "public", "q": "pasta"}
        },
        {
            "name": "Meal Planner API - Plans",
            "url": "https://api.edamam.com/api/meal-planner/v1/plans",
            "params": {}
        },
        {
            "name": "Meal Planner API - Meals",
            "url": "https://api.edamam.com/api/meal-planner/v1/meals",
            "params": {}
        },
        {
            "name": "Meal Planner API - Weeks",
            "url": "https://api.edamam.com/api/meal-planner/v1/weeks",
            "params": {}
        },
        {
            "name": "Meal Recommendations API",
            "url": "https://api.edamam.com/api/meal-recommendations/v1",
            "params": {"type": "day"}
        },
        {
            "name": "Food Database Legacy API",
            "url": "https://api.edamam.com/api/food-database/parser",
            "params": {"ingr": "pasta"}
        }
    ]
    
    # Testa ogni endpoint
    for endpoint in endpoints:
        logger.info(f"\n--- Testando: {endpoint['name']} ---")
        
        # Aggiungi le credenziali ai parametri
        params = endpoint["params"].copy()
        params["app_id"] = app_id
        params["app_key"] = app_key
        
        try:
            async with aiohttp.ClientSession() as session:
                logger.info(f"Invio richiesta a {endpoint['url']}...")
                async with session.get(endpoint['url'], params=params, timeout=30) as response:
                    status = response.status
                    logger.info(f"Status code: {status}")
                    
                    try:
                        text = await response.text()
                        logger.info(f"Risposta: {text[:200]}...")  # Mostra solo i primi 200 caratteri
                    except Exception as e:
                        logger.error(f"Errore nella lettura della risposta: {str(e)}")
        
        except Exception as e:
            logger.error(f"Errore durante la richiesta a {endpoint['name']}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_apis())
