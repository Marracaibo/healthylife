import asyncio
import logging
import sys
import os
from dotenv import load_dotenv
from edamam_service import EdamamService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

async def test_edamam():
    """Testa l'API Edamam"""
    query = "pasta barilla"
    max_results = 5
    
    # Verifica che le variabili d'ambiente siano caricate
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    logger.info(f"Credenziali Edamam: APP_ID={app_id}, APP_KEY={app_key[:5]}...")
    
    # Inizializza il servizio
    edamam = EdamamService()
    
    # Test di ricerca
    logger.info(f"Test Edamam per '{query}'")
    try:
        results = await edamam.search_food(query, max_results)
        if results and "results" in results and results["results"]:
            logger.info(f"Edamam ha trovato {len(results['results'])} risultati")
            for item in results["results"][:3]:  # Mostra solo i primi 3 risultati
                logger.info(f"- {item['name']} (ID: {item['id']})")
        else:
            logger.info("Edamam non ha trovato risultati")
    except Exception as e:
        logger.error(f"Errore con Edamam: {str(e)}")
    
    # Se abbiamo un ID, testiamo anche il recupero dei dettagli
    if results and "results" in results and results["results"]:
        food_id = results["results"][0]["id"]
        logger.info(f"\nTest recupero dettagli per ID: {food_id}")
        try:
            details = await edamam.get_food(food_id)
            if details:
                logger.info(f"Dettagli ricevuti: {details['name']}")
                logger.info(f"Calorie: {details.get('calories', 'N/A')}")
                logger.info(f"Proteine: {details.get('protein', 'N/A')}")
                logger.info(f"Carboidrati: {details.get('carbs', 'N/A')}")
                logger.info(f"Grassi: {details.get('fat', 'N/A')}")
            else:
                logger.info("Nessun dettaglio ricevuto")
        except Exception as e:
            logger.error(f"Errore nel recupero dei dettagli: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam())
