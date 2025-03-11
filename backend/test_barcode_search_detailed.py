import aiohttp
import asyncio
import json
import time
import logging

# Configurazione del logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('barcode_test.log')
    ]
)
logger = logging.getLogger(__name__)

# Lista di codici a barre da testare
barcodes = [
    "8001505005707",  # Nocciolata Rigoni di Asiago
    "8076809513692",  # Barilla Sauce napolitaine
    "8000500310427",  # Nutella Biscuits
    "5449000000996",  # Coca Cola
    "8000500033784",  # Kinder Bueno
    "8001120000035",  # Acqua San Benedetto
    "1234567890123",  # Codice a barre di test
]

async def test_fatsecret_barcode(barcode):
    """Testa direttamente l'endpoint di FatSecret per il codice a barre"""
    from services.fatsecret_oauth2_service import find_id_for_barcode
    
    logger.info(f"\nTesting FatSecret barcode: {barcode}")
    start_time = time.time()
    try:
        food_id = find_id_for_barcode(barcode)
        elapsed = time.time() - start_time
        
        logger.info(f"Time: {elapsed:.2f} seconds")
        if food_id:
            logger.info(f"Found food_id: {food_id}")
            return food_id
        else:
            logger.info("No food_id found")
            return None
    except Exception as e:
        logger.error(f"Exception in FatSecret test: {e}")
        return None

async def test_openfoodfacts_barcode(barcode):
    """Testa direttamente l'endpoint di OpenFoodFacts per il codice a barre"""
    from openfoodfacts_service import OpenFoodFactsService
    
    logger.info(f"\nTesting OpenFoodFacts barcode: {barcode}")
    start_time = time.time()
    try:
        off_service = OpenFoodFactsService()
        result = await off_service.get_food_by_barcode(barcode)
        elapsed = time.time() - start_time
        
        logger.info(f"Time: {elapsed:.2f} seconds")
        if result and "food" in result:
            food = result["food"]
            logger.info(f"Found food: {food.get('food_name', 'N/A')}")
            return food
        else:
            logger.info("No food found")
            return None
    except Exception as e:
        logger.error(f"Exception in OpenFoodFacts test: {e}")
        return None

async def test_hybrid_barcode(barcode):
    """Testa l'endpoint ibrido per il codice a barre"""
    from services.hybrid_food_search import HybridFoodSearch
    
    logger.info(f"\nTesting Hybrid barcode: {barcode}")
    start_time = time.time()
    try:
        hybrid_service = HybridFoodSearch()
        result = await hybrid_service.get_food_by_barcode(barcode)
        elapsed = time.time() - start_time
        
        logger.info(f"Time: {elapsed:.2f} seconds")
        logger.info(f"Source: {result.get('source', 'unknown')}")
        logger.info(f"Success: {result.get('success', False)}")
        logger.info(f"Total results: {result.get('total_results', 0)}")
        
        if result.get('total_results', 0) > 0 and "foods" in result and len(result["foods"]) > 0:
            food = result["foods"][0]
            logger.info(f"Food name: {food.get('food_name', 'N/A')}")
            logger.info(f"Brand: {food.get('brand', 'N/A')}")
            return food
        else:
            logger.info("No food details found")
            return None
    except Exception as e:
        logger.error(f"Exception in Hybrid test: {e}")
        return None

async def test_api_endpoint(barcode):
    """Testa l'endpoint API REST per il codice a barre"""
    logger.info(f"\nTesting API endpoint for barcode: {barcode}")
    url = f"http://localhost:8000/api/hybrid-food/barcode/{barcode}"
    start_time = time.time()
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                elapsed = time.time() - start_time
                logger.info(f"Status: {response.status}")
                logger.info(f"Time: {elapsed:.2f} seconds")
                
                if response.status == 200:
                    data = await response.json()
                    source = data.get("source", "unknown")
                    success = data.get("success", False)
                    total_results = data.get("total_results", 0)
                    
                    logger.info(f"Source: {source}")
                    logger.info(f"Success: {success}")
                    logger.info(f"Total results: {total_results}")
                    
                    if total_results > 0 and "foods" in data and len(data["foods"]) > 0:
                        food = data["foods"][0]
                        logger.info(f"Food name: {food.get('food_name', 'N/A')}")
                        logger.info(f"Brand: {food.get('brand', 'N/A')}")
                        return food
                    else:
                        logger.info("No food details found")
                        return None
                else:
                    logger.error(f"Error: {response.status}")
                    logger.error(await response.text())
                    return None
    except Exception as e:
        logger.error(f"Exception in API test: {e}")
        return None

async def run_tests():
    logger.info("Starting detailed barcode search tests...\n")
    
    results = {}
    
    for barcode in barcodes:
        logger.info(f"\n===== Testing barcode: {barcode} =====")
        results[barcode] = {
            "fatsecret": await test_fatsecret_barcode(barcode),
            "openfoodfacts": await test_openfoodfacts_barcode(barcode),
            "hybrid": await test_hybrid_barcode(barcode),
            "api": await test_api_endpoint(barcode)
        }
        time.sleep(1)  # Pausa per evitare di sovraccaricare i servizi
    
    logger.info("\n===== Test Summary =====")
    for barcode, result in results.items():
        logger.info(f"\nBarcode: {barcode}")
        logger.info(f"FatSecret: {'Success' if result['fatsecret'] else 'Failed'}")
        logger.info(f"OpenFoodFacts: {'Success' if result['openfoodfacts'] else 'Failed'}")
        logger.info(f"Hybrid Service: {'Success' if result['hybrid'] else 'Failed'}")
        logger.info(f"API Endpoint: {'Success' if result['api'] else 'Failed'}")
    
    logger.info("\nTest completed!")

def main():
    asyncio.run(run_tests())

if __name__ == "__main__":
    main()
