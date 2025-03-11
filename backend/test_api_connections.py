import asyncio
import logging
import os
from dotenv import load_dotenv
from services.usda_food_service import USDAFoodService
from edamam_only_service import EdamamOnlyService

# Configura il logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_api_connections")

# Carica le variabili d'ambiente
load_dotenv()

async def test_apis():
    # Test USDA
    logger.info("\n\n--- TESTING USDA API ---")
    usda_api_key = os.getenv("USDA_API_KEY", "")
    logger.info(f"USDA API Key: {usda_api_key[:5]}...{usda_api_key[-5:]}")
    
    usda_service = USDAFoodService()
    logger.info("Searching for 'bread' using USDA API...")
    usda_results = await usda_service.search_food("bread")
    
    if "foods" in usda_results and usda_results["foods"]:
        logger.info(f"USDA Success! Found {len(usda_results['foods'])} results for 'bread'")
    else:
        if "error" in usda_results:
            logger.error(f"USDA Error: {usda_results['error']}")
        else:
            logger.error("USDA API returned no results (no error message)")
    
    # Test Edamam
    logger.info("\n\n--- TESTING EDAMAM API ---")
    edamam_app_id = os.getenv("EDAMAM_APP_ID", "")
    edamam_app_key = os.getenv("EDAMAM_APP_KEY", "")
    logger.info(f"Edamam App ID: {edamam_app_id}")
    logger.info(f"Edamam App Key: {edamam_app_key[:5]}...{edamam_app_key[-5:]}")
    
    edamam_service = EdamamOnlyService()
    logger.info("Searching for 'bread' using Edamam API...")
    edamam_results = await edamam_service.search_food("bread")
    
    if "results" in edamam_results and edamam_results["results"]:
        logger.info(f"Edamam Success! Found {len(edamam_results['results'])} results for 'bread'")
    else:
        logger.error("Edamam API returned no results")

if __name__ == "__main__":
    asyncio.run(test_apis())
