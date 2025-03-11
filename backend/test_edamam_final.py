import asyncio
import logging
import sys
import time
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

# Lista di prodotti italiani da testare
PRODUCTS = [
    "pasta carbonara",
    "pizza margherita",
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala"
]

async def test_single_product(edamam_service, product):
    """Testa un singolo prodotto"""
    logger.info(f"\n--- Ricerca di: {product} ---")
    
    start_time = time.time()
    try:
        results = await edamam_service.search_food(product, max_results=2)
        elapsed_time = time.time() - start_time
        
        if results and "results" in results and results["results"]:
            logger.info(f"Trovati {len(results['results'])} risultati in {elapsed_time:.2f} secondi")
            
            for i, result in enumerate(results["results"]):
                logger.info(f"{i+1}. {result['name']} - Calorie: {result.get('calories', 'N/A')}")
            
            return True
        else:
            logger.warning(f"Nessun risultato trovato in {elapsed_time:.2f} secondi")
            return False
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore durante la ricerca di '{product}': {str(e)} dopo {elapsed_time:.2f} secondi")
        return False

async def main():
    """Funzione principale"""
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    success_count = 0
    
    for product in PRODUCTS:
        if await test_single_product(edamam_service, product):
            success_count += 1
    
    # Statistiche finali
    logger.info("\n=== STATISTICHE FINALI ===")
    logger.info(f"Prodotti testati: {len(PRODUCTS)}")
    logger.info(f"Prodotti trovati: {success_count}")
    logger.info(f"Tasso di successo: {(success_count / len(PRODUCTS)) * 100:.1f}%")

if __name__ == "__main__":
    asyncio.run(main())
