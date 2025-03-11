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

async def test_edamam_italian():
    """Testa l'API Edamam con prodotti italiani"""
    # Lista di prodotti italiani da testare
    italian_products = [
        "pasta barilla",
        "parmigiano reggiano",
        "prosciutto di parma",
        "mozzarella di bufala",
        "olio extravergine di oliva"
    ]
    
    # Ottieni le credenziali
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        logger.error("Credenziali Edamam mancanti")
        return
    
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key[:5]}...")
    
    # Costruisci l'URL base
    search_url = "https://api.edamam.com/api/food-database/v2/parser"
    
    # Testa ogni prodotto
    for product in italian_products:
        logger.info(f"\n--- Testando: {product} ---")
        
        # Parametri della richiesta con lingua italiana
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "ingr": product,
            "lang": "it"  # Specifica la lingua italiana
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                logger.info(f"Invio richiesta per '{product}'...")
                async with session.get(search_url, params=params, timeout=30) as response:
                    status = response.status
                    logger.info(f"Status code: {status}")
                    
                    if status == 200:
                        data = await response.json()
                        # Verifica se ci sono risultati
                        if "hints" in data and data["hints"]:
                            logger.info(f"Trovati {len(data['hints'])} risultati")
                            # Mostra i primi 3 risultati
                            for i, hint in enumerate(data["hints"][:3]):
                                food = hint.get("food", {})
                                logger.info(f"  {i+1}. {food.get('label', 'N/A')} - {food.get('category', 'N/A')}")
                        else:
                            logger.info("Nessun risultato trovato")
                    else:
                        text = await response.text()
                        logger.info(f"Risposta di errore: {text[:200]}...")  # Mostra solo i primi 200 caratteri
        
        except Exception as e:
            logger.error(f"Errore durante la richiesta per '{product}': {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_italian())
