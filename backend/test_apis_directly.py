import asyncio
import logging
import sys
from openfoodfacts_service import OpenFoodFactsService
from edamam_service import EdamamService
from fatsecret_service import FatSecretService

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

async def test_all_apis():
    """Testa tutte le API direttamente"""
    query = "pasta barilla"
    max_results = 5
    
    # Inizializza i servizi
    openfoodfacts = OpenFoodFactsService(country="it")
    edamam = EdamamService()
    fatsecret = FatSecretService()
    
    # Test OpenFoodFacts
    logger.info(f"Test OpenFoodFacts per '{query}'")
    try:
        off_results = await openfoodfacts.search_food(query, max_results)
        if off_results and "results" in off_results and off_results["results"]:
            logger.info(f"OpenFoodFacts ha trovato {len(off_results['results'])} risultati")
            for item in off_results["results"][:2]:  # Mostra solo i primi 2 risultati
                logger.info(f"- {item['name']} (ID: {item['id']})")
        else:
            logger.info("OpenFoodFacts non ha trovato risultati")
    except Exception as e:
        logger.error(f"Errore con OpenFoodFacts: {str(e)}")
    
    # Test Edamam
    logger.info(f"\nTest Edamam per '{query}'")
    try:
        edamam_results = await edamam.search_food(query, max_results)
        if edamam_results and "results" in edamam_results and edamam_results["results"]:
            logger.info(f"Edamam ha trovato {len(edamam_results['results'])} risultati")
            for item in edamam_results["results"][:2]:  # Mostra solo i primi 2 risultati
                logger.info(f"- {item['name']} (ID: {item['id']})")
        else:
            logger.info("Edamam non ha trovato risultati")
    except Exception as e:
        logger.error(f"Errore con Edamam: {str(e)}")
    
    # Test FatSecret
    logger.info(f"\nTest FatSecret per '{query}'")
    try:
        fatsecret_results = await fatsecret.search_food(query, max_results)
        if fatsecret_results and "foods" in fatsecret_results and fatsecret_results["foods"] and "food" in fatsecret_results["foods"]:
            foods = fatsecret_results["foods"]["food"]
            logger.info(f"FatSecret ha trovato {len(foods)} risultati")
            for item in foods[:2]:  # Mostra solo i primi 2 risultati
                logger.info(f"- {item['food_name']} (ID: {item['food_id']})")
        else:
            logger.info("FatSecret non ha trovato risultati")
    except Exception as e:
        logger.error(f"Errore con FatSecret: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_all_apis())
