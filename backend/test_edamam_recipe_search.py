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

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def test_edamam_recipe_search():
    """Testa la ricerca di ricette con l'API Edamam Recipe Search"""
    
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    # Lista di piatti italiani da testare
    italian_dishes = [
        "pasta carbonara",
        "pizza margherita",
        "risotto ai funghi",
        "lasagna",
        "tiramisu"
    ]
    
    for dish in italian_dishes:
        logger.info(f"\n--- Ricerca di: {dish} ---")
        
        try:
            # Esegui la ricerca
            results = await edamam_service.search_food(dish, max_results=3)
            
            # Stampa i risultati
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {len(results['results'])} risultati:")
                
                for i, result in enumerate(results["results"]):
                    logger.info(f"{i+1}. {result['name']} - Calorie: {result.get('calories', 'N/A')}")
                    logger.info(f"   ID: {result['id']}")
                    
                    # Testa anche il recupero dei dettagli per il primo risultato
                    if i == 0:
                        food_id = result["id"]
                        logger.info(f"\nRecupero dettagli per: {food_id}")
                        
                        try:
                            details = await edamam_service.get_food(food_id)
                            if details:
                                logger.info("Dettagli ricevuti:")
                                logger.info(f"   Nome: {details.get('name', 'N/A')}")
                                logger.info(f"   Descrizione: {details.get('description', 'N/A')}")
                                logger.info(f"   Calorie: {details.get('calories', 'N/A')}")
                                logger.info(f"   Porzioni: {details.get('servings', 'N/A')}")
                                logger.info(f"   Descrizione porzione: {details.get('servingDescription', 'N/A')}")
                            else:
                                logger.error("Nessun dettaglio ricevuto")
                        except Exception as e:
                            logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
            else:
                logger.warning(f"Nessun risultato trovato per '{dish}'")
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{dish}': {str(e)}")
    
    logger.info("\nTest completato!")

if __name__ == "__main__":
    asyncio.run(test_edamam_recipe_search())
