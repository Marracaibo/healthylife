import asyncio
import logging
import sys
import time
import statistics
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

# Lista di prodotti regionali italiani da testare
REGIONAL_PRODUCTS = [
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala",
    "pecorino romano",
    "gorgonzola",
    "aceto balsamico di modena",
    "olio extravergine toscano",
    "pesto alla genovese",
    "tartufo bianco d'alba",
    "limoncello"
]

async def test_edamam_regional_products():
    """Test dei prodotti regionali italiani con Edamam"""
    
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    # Statistiche
    success_count = 0
    fail_count = 0
    not_found_count = 0
    response_times = []
    found_products = []
    not_found_products = []
    failed_products = []
    
    # Test di ogni prodotto
    for product in REGIONAL_PRODUCTS:
        logger.info(f"\n--- Ricerca di: {product} ---")
        
        start_time = time.time()
        try:
            # Imposta un timeout di 10 secondi
            results = await asyncio.wait_for(
                edamam_service.search_food(product, max_results=3),
                timeout=10
            )
            
            elapsed_time = time.time() - start_time
            response_times.append(elapsed_time)
            
            if results and "results" in results and results["results"]:
                success_count += 1
                found_products.append(product)
                logger.info(f"Trovati {len(results['results'])} risultati in {elapsed_time:.2f} secondi")
                
                # Mostra i risultati
                for i, result in enumerate(results["results"]):
                    logger.info(f"{i+1}. {result['name']} - Calorie: {result.get('calories', 'N/A')}")
                    logger.info(f"   ID: {result['id']}")
            else:
                not_found_count += 1
                not_found_products.append(product)
                logger.warning(f"Nessun risultato trovato in {elapsed_time:.2f} secondi")
        
        except asyncio.TimeoutError:
            elapsed_time = time.time() - start_time
            fail_count += 1
            failed_products.append(f"{product} (timeout)")
            logger.error(f"Timeout durante la ricerca di '{product}' dopo {elapsed_time:.2f} secondi")
        
        except Exception as e:
            elapsed_time = time.time() - start_time
            fail_count += 1
            failed_products.append(f"{product} ({str(e)})")
            logger.error(f"Errore durante la ricerca di '{product}': {str(e)} dopo {elapsed_time:.2f} secondi")
    
    # Stampa le statistiche finali
    total_tests = success_count + fail_count + not_found_count
    success_rate = (success_count / total_tests) * 100 if total_tests > 0 else 0
    
    logger.info("\n\n=== STATISTICHE FINALI ===")
    logger.info(f"Totale prodotti testati: {total_tests}")
    logger.info(f"Prodotti trovati: {success_count} ({success_rate:.1f}%)")
    logger.info(f"Prodotti non trovati: {not_found_count}")
    logger.info(f"Errori/timeout: {fail_count}")
    
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        logger.info(f"Tempo di risposta medio: {avg_time:.2f} secondi")
        logger.info(f"Tempo di risposta minimo: {min_time:.2f} secondi")
        logger.info(f"Tempo di risposta massimo: {max_time:.2f} secondi")
    
    if found_products:
        logger.info(f"Prodotti trovati: {', '.join(found_products)}")
    
    if not_found_products:
        logger.info(f"Prodotti non trovati: {', '.join(not_found_products)}")
    
    if failed_products:
        logger.info(f"Prodotti con errori: {', '.join(failed_products)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_regional_products())
