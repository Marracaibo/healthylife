import asyncio
import logging
import sys
from dotenv import load_dotenv
from aggregated_food_service import AggregatedFoodService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def test_pollo_search():
    """Testa la ricerca di 'pollo' con il servizio aggregato"""
    
    logger.info("Inizializzazione del servizio aggregato...")
    aggregated_service = AggregatedFoodService()
    
    logger.info("Ricerca di 'pollo'...")
    try:
        results = await aggregated_service.search_food("pollo", max_results=5)
        
        if results and "results" in results and results["results"]:
            logger.info(f"Trovati {len(results['results'])} risultati:")
            for i, result in enumerate(results["results"]):
                logger.info(f"{i+1}. {result.get('name', 'N/A')} - Calorie: {result.get('calories', 'N/A')}")
                logger.info(f"   Fonte: {result.get('source', 'N/A')}")
                
            # Testa il recupero dei dettagli per il primo risultato
            if results["results"][0].get('id'):
                food_id = results["results"][0]['id']
                logger.info(f"\nRecupero dettagli per: {food_id}")
                
                try:
                    details = await aggregated_service.get_food(food_id)
                    
                    if details:
                        logger.info("Dettagli ricevuti:")
                        logger.info(f"   Nome: {details.get('name', 'N/A')}")
                        logger.info(f"   Calorie: {details.get('calories', 'N/A')}")
                        logger.info(f"   Proteine: {details.get('protein', 'N/A')}")
                        logger.info(f"   Grassi: {details.get('fat', 'N/A')}")
                        logger.info(f"   Carboidrati: {details.get('carbs', 'N/A')}")
                        logger.info(f"   Fonte: {details.get('source', 'N/A')}")
                    else:
                        logger.error("Nessun dettaglio ricevuto")
                except Exception as e:
                    logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
        else:
            logger.warning("Nessun risultato trovato")
    
    except Exception as e:
        logger.error(f"Errore durante la ricerca: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_pollo_search())
