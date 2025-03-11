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

async def test_edamam_recipe_api():
    """Testa la funzionalità della Recipe Search API di Edamam"""
    
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    # Lista di prodotti italiani da testare
    italian_foods = [
        "pasta carbonara",
        "lasagna",
        "pizza margherita",
        "risotto",
        "tiramisu"
    ]
    
    for food in italian_foods:
        logger.info(f"\n--- Ricerca di: {food} ---")
        
        # Esegui la ricerca
        results = await edamam_service.search_food(food, max_results=3)
        
        # Stampa i risultati
        if results and "results" in results and results["results"]:
            logger.info(f"Trovati {len(results['results'])} risultati:")
            
            for i, result in enumerate(results["results"]):
                logger.info(f"{i+1}. {result['name']} - {result['description']}")
                
                # Testa anche il recupero dei dettagli per il primo risultato
                if i == 0:
                    food_id = result["id"]
                    logger.info(f"\nRecupero dettagli per: {food_id}")
                    
                    details = await edamam_service.get_food(food_id)
                    if details:
                        logger.info(f"Dettagli ricevuti: {details['food_name']}")
                        logger.info(f"Calorie: {details['calories']}kcal")
                        logger.info(f"Proteine: {details['protein']}g")
                        logger.info(f"Carboidrati: {details['carbohydrate']}g")
                        logger.info(f"Grassi: {details['fat']}g")
                    else:
                        logger.error("Nessun dettaglio ricevuto")
        else:
            logger.warning(f"Nessun risultato trovato per '{food}'")
    
    logger.info("\nTest completato!")

if __name__ == "__main__":
    asyncio.run(test_edamam_recipe_api())
