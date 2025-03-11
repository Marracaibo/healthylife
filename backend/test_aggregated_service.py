import asyncio
import logging
import sys
import os
import traceback
from dotenv import load_dotenv
from aggregated_food_service import AggregatedFoodService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def test_aggregated_service():
    """Testa il servizio aggregato con prodotti italiani"""
    
    logger.info("Inizializzazione del servizio aggregato...")
    aggregated_service = AggregatedFoodService()
    
    # Lista di prodotti italiani da testare (ridotta per semplicità)
    italian_foods = [
        "pasta carbonara",
        "pizza margherita"
    ]
    
    for food in italian_foods:
        logger.info(f"\n--- Ricerca di: {food} ---")
        
        try:
            # Esegui la ricerca
            results = await aggregated_service.search_food(food, max_results=3)
            
            # Stampa i risultati
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {len(results['results'])} risultati:")
                
                for i, result in enumerate(results["results"]):
                    logger.info(f"{i+1}. {result['name']} - {result.get('description', 'Nessuna descrizione')}")
                    logger.info(f"   ID: {result['id']}")
                    logger.info(f"   Fonte: {result.get('source', 'sconosciuta')}")
                    
                    # Testa anche il recupero dei dettagli per il primo risultato
                    if i == 0:
                        food_id = result["id"]
                        logger.info(f"\nRecupero dettagli per: {food_id}")
                        
                        try:
                            details = await aggregated_service.get_food(food_id)
                            if details:
                                logger.info(f"Dettagli ricevuti:")
                                for key, value in details.items():
                                    if isinstance(value, (str, int, float, bool)) or value is None:
                                        logger.info(f"   {key}: {value}")
                            else:
                                logger.error("Nessun dettaglio ricevuto")
                        except Exception as e:
                            logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
            else:
                logger.warning(f"Nessun risultato trovato per '{food}'")
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{food}': {str(e)}")
            logger.error(traceback.format_exc())
    
    logger.info("\nTest completato!")

if __name__ == "__main__":
    asyncio.run(test_aggregated_service())
