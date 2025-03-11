import asyncio
import logging
import sys
import os
import json
import aiohttp
import uuid
from dotenv import load_dotenv

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

async def test_edamam_meal_planner_api():
    """Testa la funzionalità della Meal Planner API di Edamam con le nuove credenziali"""
    
    # Ottieni le credenziali
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        logger.error("Credenziali Edamam mancanti")
        return
    
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key}")
    
    # Crea un ID utente per l'header Edamam-Account-User
    # Questo è richiesto dall'API Meal Planner
    user_id = "ikhh"  # Username visualizzato nell'interfaccia Edamam
    logger.info(f"Utilizzando Edamam-Account-User: {user_id}")
    
    # Definisci gli endpoint da testare per la Meal Planner API
    endpoints = [
        {
            "name": "Recipe Search API",
            "url": "https://api.edamam.com/api/recipes/v2",
            "params": {"type": "public", "q": "pasta", "app_id": app_id, "app_key": app_key},
            "headers": {"Edamam-Account-User": user_id}
        },
        {
            "name": "Meal Planner API - Plans",
            "url": "https://api.edamam.com/api/meal-planner/v1/plans",
            "params": {"app_id": app_id, "app_key": app_key},
            "headers": {"Edamam-Account-User": user_id}
        },
        {
            "name": "Food Database API",
            "url": "https://api.edamam.com/api/food-database/v2/parser",
            "params": {"ingr": "pasta", "app_id": app_id, "app_key": app_key},
            "headers": {"Edamam-Account-User": user_id}
        },
        {
            "name": "Nutrition Analysis API",
            "url": "https://api.edamam.com/api/nutrition-data",
            "params": {"ingr": "100g pasta", "app_id": app_id, "app_key": app_key},
            "headers": {"Edamam-Account-User": user_id}
        }
    ]
    
    # Testa ogni endpoint
    for endpoint in endpoints:
        logger.info(f"\n--- Testando: {endpoint['name']} ---")
        
        try:
            async with aiohttp.ClientSession() as session:
                logger.info(f"Invio richiesta a {endpoint['url']}...")
                async with session.get(
                    endpoint['url'], 
                    params=endpoint['params'], 
                    headers=endpoint['headers'],
                    timeout=30
                ) as response:
                    status = response.status
                    logger.info(f"Status code: {status}")
                    
                    try:
                        if status == 200:
                            data = await response.json()
                            logger.info(f"Risposta ricevuta con successo!")
                            
                            # Mostra un riassunto della risposta in base al tipo di endpoint
                            if endpoint["name"] == "Recipe Search API":
                                hits = data.get("hits", [])
                                logger.info(f"Trovate {len(hits)} ricette")
                                for i, hit in enumerate(hits[:3]):  # Mostra solo le prime 3 ricette
                                    recipe = hit.get("recipe", {})
                                    logger.info(f"  {i+1}. {recipe.get('label', 'Senza nome')}")
                            
                            elif endpoint["name"] == "Food Database API":
                                hints = data.get("hints", [])
                                logger.info(f"Trovati {len(hints)} alimenti")
                                for i, hint in enumerate(hints[:3]):  # Mostra solo i primi 3 alimenti
                                    food = hint.get("food", {})
                                    logger.info(f"  {i+1}. {food.get('label', 'Senza nome')}")
                            
                            elif endpoint["name"] == "Meal Planner API - Plans":
                                logger.info(f"Risposta: {json.dumps(data, indent=2)[:500]}...")  # Mostra solo i primi 500 caratteri
                            
                            else:
                                logger.info(f"Risposta: {json.dumps(data, indent=2)[:500]}...")  # Mostra solo i primi 500 caratteri
                        else:
                            text = await response.text()
                            logger.info(f"Risposta: {text[:500]}...")  # Mostra solo i primi 500 caratteri
                    except Exception as e:
                        logger.error(f"Errore nella lettura della risposta: {str(e)}")
        
        except Exception as e:
            logger.error(f"Errore durante la richiesta a {endpoint['name']}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_meal_planner_api())
