import asyncio
import logging
import sys
import time
from dotenv import load_dotenv
from edamam_service import EdamamService
from fatsecret_service import FatSecretService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# Lista di prodotti italiani da testare
PRODUCTS = [
    "pasta carbonara",
    "pizza margherita",
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala"
]

async def test_edamam(product):
    """Testa un prodotto con Edamam"""
    edamam_service = EdamamService()
    
    start_time = time.time()
    try:
        results = await edamam_service.search_food(product, max_results=1)
        elapsed_time = time.time() - start_time
        
        if results and "results" in results and results["results"]:
            result = results["results"][0]
            return {
                "service": "Edamam",
                "product": product,
                "found": True,
                "name": result.get("name", "N/A"),
                "calories": result.get("calories", "N/A"),
                "time": elapsed_time
            }
        else:
            return {
                "service": "Edamam",
                "product": product,
                "found": False,
                "time": elapsed_time
            }
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore Edamam per '{product}': {str(e)}")
        return {
            "service": "Edamam",
            "product": product,
            "found": False,
            "error": str(e),
            "time": elapsed_time
        }

async def test_fatsecret(product):
    """Testa un prodotto con FatSecret"""
    fatsecret_service = FatSecretService()
    
    start_time = time.time()
    try:
        results = await fatsecret_service.search_food(product, max_results=1)
        elapsed_time = time.time() - start_time
        
        if results and len(results) > 0:
            result = results[0]
            return {
                "service": "FatSecret",
                "product": product,
                "found": True,
                "name": result.get("name", "N/A"),
                "calories": result.get("calories", "N/A"),
                "time": elapsed_time
            }
        else:
            return {
                "service": "FatSecret",
                "product": product,
                "found": False,
                "time": elapsed_time
            }
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore FatSecret per '{product}': {str(e)}")
        return {
            "service": "FatSecret",
            "product": product,
            "found": False,
            "error": str(e),
            "time": elapsed_time
        }

async def main():
    """Funzione principale"""
    logger.info("Inizializzazione del test di confronto tra Edamam e FatSecret...")
    
    edamam_results = []
    fatsecret_results = []
    
    for product in PRODUCTS:
        logger.info(f"\n--- Testando: {product} ---")
        
        # Test Edamam
        edamam_result = await test_edamam(product)
        edamam_results.append(edamam_result)
        
        if edamam_result["found"]:
            logger.info(f"Edamam: Trovato '{edamam_result['name']}' in {edamam_result['time']:.2f} secondi")
            logger.info(f"  Calorie: {edamam_result['calories']}")
        else:
            logger.info(f"Edamam: Nessun risultato in {edamam_result['time']:.2f} secondi")
        
        # Test FatSecret
        fatsecret_result = await test_fatsecret(product)
        fatsecret_results.append(fatsecret_result)
        
        if fatsecret_result["found"]:
            logger.info(f"FatSecret: Trovato '{fatsecret_result['name']}' in {fatsecret_result['time']:.2f} secondi")
            logger.info(f"  Calorie: {fatsecret_result['calories']}")
        else:
            logger.info(f"FatSecret: Nessun risultato in {fatsecret_result['time']:.2f} secondi")
    
    # Statistiche finali
    edamam_found = sum(1 for r in edamam_results if r["found"])
    fatsecret_found = sum(1 for r in fatsecret_results if r["found"])
    
    edamam_times = [r["time"] for r in edamam_results]
    fatsecret_times = [r["time"] for r in fatsecret_results]
    
    logger.info("\n=== STATISTICHE FINALI ===")
    logger.info(f"Prodotti testati: {len(PRODUCTS)}")
    logger.info(f"Edamam - Prodotti trovati: {edamam_found}/{len(PRODUCTS)} ({edamam_found/len(PRODUCTS)*100:.1f}%)")
    logger.info(f"FatSecret - Prodotti trovati: {fatsecret_found}/{len(PRODUCTS)} ({fatsecret_found/len(PRODUCTS)*100:.1f}%)")
    
    if edamam_times:
        logger.info(f"Edamam - Tempo medio di risposta: {sum(edamam_times)/len(edamam_times):.2f} secondi")
    
    if fatsecret_times:
        logger.info(f"FatSecret - Tempo medio di risposta: {sum(fatsecret_times)/len(fatsecret_times):.2f} secondi")
    
    # Confronto diretto
    logger.info("\n=== CONFRONTO DIRETTO ===")
    for product in PRODUCTS:
        edamam_item = next((r for r in edamam_results if r["product"] == product), None)
        fatsecret_item = next((r for r in fatsecret_results if r["product"] == product), None)
        
        logger.info(f"\nProdotto: {product}")
        
        if edamam_item and edamam_item["found"]:
            logger.info(f"Edamam: {edamam_item['name']} - {edamam_item['calories']} calorie")
        else:
            logger.info("Edamam: Non trovato")
        
        if fatsecret_item and fatsecret_item["found"]:
            logger.info(f"FatSecret: {fatsecret_item['name']} - {fatsecret_item['calories']} calorie")
        else:
            logger.info("FatSecret: Non trovato")

if __name__ == "__main__":
    asyncio.run(main())
