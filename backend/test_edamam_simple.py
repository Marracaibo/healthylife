import asyncio
import logging
import sys
from dotenv import load_dotenv
from edamam_service import EdamamService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def test_edamam_simple():
    """Test semplice per verificare la funzionalità di base di Edamam"""
    
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    # Cerca un solo piatto
    dish = "pizza margherita"
    logger.info(f"Ricerca di: {dish}")
    
    try:
        # Esegui la ricerca
        results = await edamam_service.search_food(dish, max_results=1)
        
        # Stampa i risultati
        if results and "results" in results and results["results"]:
            result = results["results"][0]
            logger.info(f"Risultato trovato: {result['name']}")
            logger.info(f"ID: {result['id']}")
            logger.info(f"Calorie: {result.get('calories', 'N/A')}")
            
            # Recupera i dettagli
            food_id = result["id"]
            logger.info(f"Recupero dettagli per ID: {food_id}")
            
            details = await edamam_service.get_food(food_id)
            if details:
                logger.info("Dettagli ricevuti:")
                logger.info(f"Nome: {details.get('name', 'N/A')}")
                logger.info(f"Descrizione: {details.get('description', 'N/A')}")
                logger.info(f"Calorie: {details.get('calories', 'N/A')}")
                logger.info(f"Porzioni: {details.get('servings', 'N/A')}")
            else:
                logger.error("Nessun dettaglio ricevuto")
        else:
            logger.warning(f"Nessun risultato trovato per '{dish}'")
    except Exception as e:
        logger.error(f"Errore durante il test: {str(e)}")
    
    logger.info("Test completato!")

if __name__ == "__main__":
    asyncio.run(test_edamam_simple())
