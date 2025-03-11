import asyncio
import logging
import sys
from dotenv import load_dotenv
from edamam_aggregated_service import EdamamAggregatedService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

def print_food_result(result):
    """Stampa un risultato di ricerca in formato leggibile"""
    print(f"\n{result.get('name', 'N/A')}")
    print(f"Calorie: {result.get('calories', 0):.0f} kcal")
    print(f"Proteine: {result.get('protein', 0):.1f} g")
    print(f"Grassi: {result.get('fat', 0):.1f} g")
    print(f"Carboidrati: {result.get('carbs', 0):.1f} g")
    
    # Stampa le etichette dietetiche
    diet_labels = result.get('diet_labels', [])
    health_labels = result.get('health_labels', [])
    
    all_labels = []
    if diet_labels:
        all_labels.extend(diet_labels[:3])
    if health_labels:
        all_labels.extend(health_labels[:3])
    
    if all_labels:
        print(f"Etichette: {', '.join(all_labels)}")
    
    print("-" * 40)

async def test_edamam_aggregated():
    """Testa il servizio EdamamAggregatedService"""
    
    logger.info("Inizializzazione del servizio EdamamAggregatedService...")
    service = EdamamAggregatedService()
    
    # Test con diversi termini di ricerca
    search_terms = ["pollo", "pasta", "pizza", "risotto"]
    
    for term in search_terms:
        logger.info(f"\n--- Ricerca di '{term}' ---")
        
        try:
            results = await service.search_food(term, max_results=3)
            
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {len(results['results'])} risultati:")
                
                for result in results["results"]:
                    print_food_result(result)
                
                # Test del recupero dettagli solo per il primo risultato del primo termine
                if term == search_terms[0] and results["results"]:
                    first_result = results["results"][0]
                    food_id = first_result.get('id')
                    
                    if food_id:
                        logger.info(f"\nRecupero dettagli per: {first_result.get('name')}")
                        
                        details = await service.get_food(food_id)
                        
                        if details:
                            logger.info("Dettagli ricevuti:")
                            logger.info(f"Nome: {details.get('name')}")
                            logger.info(f"Calorie: {details.get('calories'):.0f} kcal")
                            
                            # Stampa gli ingredienti
                            ingredients = details.get('ingredients', [])
                            if ingredients:
                                logger.info("\nIngredienti:")
                                for i, ing in enumerate(ingredients[:5]):
                                    logger.info(f"{i+1}. {ing}")
                                
                                if len(ingredients) > 5:
                                    logger.info(f"... e altri {len(ingredients) - 5} ingredienti")
                        else:
                            logger.error("Nessun dettaglio ricevuto")
            else:
                logger.warning(f"Nessun risultato trovato per '{term}'")
        
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{term}': {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_aggregated())
