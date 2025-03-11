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

async def test_edamam_detailed():
    """Testa l'API Edamam con dettagli completi sulla richiesta e risposta"""
    query = "pasta barilla"
    
    # Ottieni le credenziali
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        logger.error("Credenziali Edamam mancanti")
        return
    
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key}")
    
    # Costruisci i parametri della richiesta
    search_url = "https://api.edamam.com/api/food-database/v2/parser"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "ingr": query,
        "category": "generic-foods",
        "categoryLabel": "food"
    }
    
    logger.info(f"URL: {search_url}")
    logger.info(f"Parametri: {json.dumps(params, indent=2)}")
    
    try:
        async with aiohttp.ClientSession() as session:
            logger.info("Invio richiesta...")
            async with session.get(search_url, params=params, timeout=30) as response:
                status = response.status
                logger.info(f"Status code: {status}")
                
                # Stampa gli header della risposta
                logger.info("Headers della risposta:")
                for header, value in response.headers.items():
                    logger.info(f"  {header}: {value}")
                
                # Prova a leggere il corpo della risposta
                try:
                    if status == 200:
                        data = await response.json()
                        logger.info(f"Risposta: {json.dumps(data, indent=2)[:500]}...")  # Mostra solo i primi 500 caratteri
                    else:
                        text = await response.text()
                        logger.info(f"Risposta di errore: {text}")
                except Exception as e:
                    logger.error(f"Errore nella lettura della risposta: {str(e)}")
    
    except Exception as e:
        logger.error(f"Errore durante la richiesta: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_detailed())
