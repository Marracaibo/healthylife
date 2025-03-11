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

async def test_food_search():
    """Testa la ricerca di alimenti semplici come banana, mela, ecc."""
    
    # Ottieni le credenziali
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        logger.error("Credenziali Edamam mancanti")
        return
    
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key}")
    
    # Alimenti semplici da testare
    test_foods = ["banana", "mela", "pane"]
    
    # Test con l'API Food Database (quella corretta per cercare alimenti singoli)
    url = "https://api.edamam.com/api/food-database/v2/parser"
    
    for food in test_foods:
        logger.info(f"\n\n=== TESTANDO ALIMENTO: {food.upper()} ===")
        
        # Parametri per la ricerca
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "ingr": food
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                logger.info(f"Invio richiesta a {url} per {food}...")
                
                # Aggiungi l'header Edamam-Account-User
                headers = {
                    "Edamam-Account-User": "ikhh"  # Usa lo stesso user_id definito in EnhancedEdamamService
                }
                
                async with session.get(url, params=params, headers=headers, timeout=30) as response:
                    status = response.status
                    logger.info(f"Status code: {status}")
                    
                    if status == 200:
                        data = await response.json()
                        
                        # Analizza i risultati
                        if "hints" in data and len(data["hints"]) > 0:
                            logger.info(f"Trovati {len(data['hints'])} risultati per {food}")
                            
                            # Mostra i primi 3 risultati
                            for i, hint in enumerate(data["hints"][:3]):
                                food_item = hint.get("food", {})
                                logger.info(f"  {i+1}. {food_item.get('label', 'N/A')} - {food_item.get('category', 'N/A')}")
                        else:
                            logger.info(f"Nessun risultato trovato per {food}")
                        
                        # Salva i risultati completi in un file JSON
                        result_dir = os.path.join(os.path.dirname(__file__), "test_results")
                        os.makedirs(result_dir, exist_ok=True)
                        
                        filename = os.path.join(result_dir, f"{food}_food_database.json")
                        
                        with open(filename, "w", encoding="utf-8") as f:
                            json.dump(data, f, indent=2, ensure_ascii=False)
                        
                        logger.info(f"Risultati salvati in {filename}")
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nella richiesta: {error_text}")
                        
        except Exception as e:
            logger.error(f"Errore durante la richiesta: {str(e)}")
            
    # Test con l'API Recipe Search (quella che stiamo usando attualmente)
    logger.info("\n\n=== TEST CON RECIPE SEARCH API (ATTUALMENTE USATA) ===")
    url = "https://api.edamam.com/api/recipes/v2"
    
    for food in test_foods:
        logger.info(f"\n--- Testando {food} con Recipe Search API ---")
        
        # Parametri per la ricerca
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "type": "public",
            "q": food
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                logger.info(f"Invio richiesta a {url} per {food}...")
                
                # Aggiungi l'header Edamam-Account-User
                headers = {
                    "Edamam-Account-User": "ikhh"  # Usa lo stesso user_id definito in EnhancedEdamamService
                }
                
                async with session.get(url, params=params, headers=headers, timeout=30) as response:
                    status = response.status
                    logger.info(f"Status code: {status}")
                    
                    if status == 200:
                        data = await response.json()
                        
                        # Analizza i risultati
                        if "hits" in data and len(data["hits"]) > 0:
                            logger.info(f"Trovate {len(data['hits'])} ricette per {food}")
                            
                            # Mostra le prime 3 ricette
                            for i, hit in enumerate(data["hits"][:3]):
                                recipe = hit.get("recipe", {})
                                logger.info(f"  {i+1}. {recipe.get('label', 'N/A')}")
                        else:
                            logger.info(f"Nessuna ricetta trovata per {food}")
                        
                        # Salva i risultati completi in un file JSON
                        result_dir = os.path.join(os.path.dirname(__file__), "test_results")
                        os.makedirs(result_dir, exist_ok=True)
                        
                        filename = os.path.join(result_dir, f"{food}_recipe_search.json")
                        
                        with open(filename, "w", encoding="utf-8") as f:
                            json.dump(data, f, indent=2, ensure_ascii=False)
                        
                        logger.info(f"Risultati salvati in {filename}")
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nella richiesta: {error_text}")
                        
        except Exception as e:
            logger.error(f"Errore durante la richiesta: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_food_search())
