import asyncio
import logging
import os
from dotenv import load_dotenv
from services.hybrid_food_service import HybridFoodService

# Configura il logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_hybrid_service")

# Carica le variabili d'ambiente
load_dotenv()

async def test_hybrid_service():
    # Test del servizio ibrido
    logger.info("\n\n--- TESTING HYBRID FOOD SERVICE ---")
    
    hybrid_service = HybridFoodService()
    logger.info("Searching for 'bread' using HybridFoodService...")
    
    # Test senza cache
    results = await hybrid_service.search_food("bread", use_cache=False)
    
    logger.info(f"Source: {results.get('source', 'unknown')}")
    logger.info(f"Total results: {results.get('total_results', 0)}")
    
    if results.get('total_results', 0) > 0:
        logger.info(f"HYBRID SERVICE SUCCESS! Found {results.get('total_results', 0)} results for 'bread'")
        
        # Mostra i primi 3 risultati
        for i, food in enumerate(results.get('results', [])[:3]):
            logger.info(f"Result {i+1}: {food.get('name', 'Unknown')} - {food.get('source', 'unknown')}")
    else:
        if "error" in results:
            logger.error(f"HYBRID SERVICE ERROR: {results.get('error', 'unknown error')}")
        else:
            logger.error("HYBRID SERVICE RETURNED NO RESULTS (no error message)")

if __name__ == "__main__":
    asyncio.run(test_hybrid_service())
