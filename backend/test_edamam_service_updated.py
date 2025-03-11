import asyncio
import logging
import sys
from edamam_service import EdamamService

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

async def test_edamam_service():
    """Testa il servizio Edamam aggiornato con le nuove credenziali"""
    
    logger.info("Inizializzazione del servizio Edamam...")
    edamam_service = EdamamService()
    
    # Lista di prodotti italiani da testare
    italian_foods = [
        "pasta carbonara",
        "pizza margherita",
        "risotto ai funghi",
        "lasagna",
        "tiramisu"
    ]
    
    for food in italian_foods:
        logger.info(f"\n--- Ricerca di: {food} ---")
        
        try:
            # Esegui la ricerca
            results = await edamam_service.search_food(food, max_results=3)
            
            # Stampa i risultati
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {len(results['results'])} risultati:")
                
                for i, result in enumerate(results["results"]):
                    logger.info(f"{i+1}. {result['name']} - {result.get('description', 'Nessuna descrizione')}")
                    logger.info(f"   ID: {result['id']}")
                    
                    # Testa anche il recupero dei dettagli per il primo risultato
                    if i == 0:
                        food_id = result["id"]
                        logger.info(f"\nRecupero dettagli per: {food_id}")
                        
                        try:
                            details = await edamam_service.get_food(food_id)
                            if details:
                                logger.info(f"Dettagli ricevuti:")
                                logger.info(f"   Nome: {details.get('name', '')}")
                                logger.info(f"   Descrizione: {details.get('description', '')}")
                                logger.info(f"   Calorie: {details.get('calories', 0):.0f}")
                                
                                # Mostra le informazioni nutrizionali se disponibili
                                if "servings" in details and details["servings"]:
                                    serving = details["servings"][0]
                                    logger.info(f"   Porzioni: {serving.get('amount', 0)}")
                                    logger.info(f"   Descrizione porzione: {serving.get('description', '')}")
                            else:
                                logger.error("Nessun dettaglio ricevuto")
                        except Exception as e:
                            logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
            else:
                logger.warning(f"Nessun risultato trovato per '{food}'")
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{food}': {str(e)}")
    
    logger.info("\nTest completato!")

if __name__ == "__main__":
    asyncio.run(test_edamam_service())
