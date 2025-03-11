import asyncio
import logging
import sys
import time
import statistics
from dotenv import load_dotenv
from edamam_service import EdamamService
from fatsecret_service import FatSecretService
from openfoodfacts_service import OpenFoodFactsService
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

# Lista di prodotti italiani da testare
ITALIAN_PRODUCTS = [
    "pasta al pomodoro",
    "pizza margherita",
    "risotto ai funghi porcini",
    "lasagna alla bolognese",
    "tiramisu",
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala",
    "gnocchi al pesto",
    "cannoli siciliani",
    "ossobuco alla milanese",
    "panna cotta",
    "focaccia genovese",
    "bruschetta al pomodoro",
    "polenta e funghi"
]

class ServiceTester:
    def __init__(self, service_name, service):
        self.service_name = service_name
        self.service = service
        self.results = {
            "success_count": 0,
            "fail_count": 0,
            "not_found_count": 0,
            "response_times": [],
            "found_products": [],
            "failed_products": [],
            "not_found_products": []
        }
    
    async def test_product(self, product_name, timeout=10):
        """Testa un singolo prodotto con timeout"""
        logger.info(f"[{self.service_name}] Ricerca di: {product_name}")
        
        start_time = time.time()
        try:
            # Imposta un timeout per evitare che il test si blocchi
            results = await asyncio.wait_for(
                self.service.search_food(product_name, max_results=3),
                timeout=timeout
            )
            
            elapsed_time = time.time() - start_time
            self.results["response_times"].append(elapsed_time)
            
            if results and "results" in results and results["results"]:
                self.results["success_count"] += 1
                self.results["found_products"].append(product_name)
                logger.info(f"[{self.service_name}] Trovati {len(results['results'])} risultati in {elapsed_time:.2f} secondi")
                
                # Mostra il primo risultato
                first_result = results["results"][0]
                logger.info(f"[{self.service_name}] Primo risultato: {first_result.get('name', 'N/A')}")
                return True
            else:
                self.results["not_found_count"] += 1
                self.results["not_found_products"].append(product_name)
                logger.info(f"[{self.service_name}] Nessun risultato trovato in {elapsed_time:.2f} secondi")
                return False
                
        except asyncio.TimeoutError:
            elapsed_time = time.time() - start_time
            self.results["fail_count"] += 1
            self.results["failed_products"].append(f"{product_name} (timeout)")
            logger.error(f"[{self.service_name}] Timeout durante la ricerca di '{product_name}' dopo {elapsed_time:.2f} secondi")
            return False
        except Exception as e:
            elapsed_time = time.time() - start_time
            self.results["fail_count"] += 1
            self.results["failed_products"].append(f"{product_name} ({str(e)})")
            logger.error(f"[{self.service_name}] Errore durante la ricerca di '{product_name}': {str(e)} dopo {elapsed_time:.2f} secondi")
            return False
    
    def print_statistics(self):
        """Stampa le statistiche dei test"""
        total_tests = self.results["success_count"] + self.results["fail_count"] + self.results["not_found_count"]
        success_rate = (self.results["success_count"] / total_tests) * 100 if total_tests > 0 else 0
        
        logger.info(f"\n--- Statistiche per {self.service_name} ---")
        logger.info(f"Totale prodotti testati: {total_tests}")
        logger.info(f"Prodotti trovati: {self.results['success_count']} ({success_rate:.1f}%)")
        logger.info(f"Prodotti non trovati: {self.results['not_found_count']}")
        logger.info(f"Errori/timeout: {self.results['fail_count']}")
        
        if self.results["response_times"]:
            avg_time = statistics.mean(self.results["response_times"])
            min_time = min(self.results["response_times"])
            max_time = max(self.results["response_times"])
            logger.info(f"Tempo di risposta medio: {avg_time:.2f} secondi")
            logger.info(f"Tempo di risposta minimo: {min_time:.2f} secondi")
            logger.info(f"Tempo di risposta massimo: {max_time:.2f} secondi")
        
        if self.results["found_products"]:
            logger.info(f"Prodotti trovati: {', '.join(self.results['found_products'])}")
        
        if self.results["not_found_products"]:
            logger.info(f"Prodotti non trovati: {', '.join(self.results['not_found_products'])}")
        
        if self.results["failed_products"]:
            logger.info(f"Prodotti con errori: {', '.join(self.results['failed_products'])}")

async def main():
    """Funzione principale per eseguire i test"""
    logger.info("Inizializzazione dei servizi...")
    
    # Inizializza i servizi
    edamam_service = EdamamService()
    fatsecret_service = FatSecretService()
    openfoodfacts_service = OpenFoodFactsService()
    aggregated_service = AggregatedFoodService()
    
    # Crea i tester
    testers = [
        ServiceTester("Edamam", edamam_service),
        ServiceTester("FatSecret", fatsecret_service),
        ServiceTester("OpenFoodFacts", openfoodfacts_service),
        ServiceTester("Aggregated", aggregated_service)
    ]
    
    # Esegui i test per ogni servizio
    for tester in testers:
        logger.info(f"\n=== Test del servizio {tester.service_name} ===")
        for product in ITALIAN_PRODUCTS:
            await tester.test_product(product)
    
    # Stampa le statistiche
    logger.info("\n\n=== STATISTICHE FINALI ===")
    for tester in testers:
        tester.print_statistics()

if __name__ == "__main__":
    asyncio.run(main())
