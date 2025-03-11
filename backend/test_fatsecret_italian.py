import asyncio
import logging
import sys
import os
import traceback
from dotenv import load_dotenv
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

async def test_fatsecret():
    """Testa il servizio FatSecret con prodotti italiani"""
    
    logger.info("Inizializzazione del servizio FatSecret...")
    fatsecret_service = FatSecretService()
    
    # Lista di prodotti italiani da testare
    italian_foods = [
        "pasta",
        "pizza",
        "risotto",
        "parmigiano",
        "prosciutto"
    ]
    
    for food in italian_foods:
        logger.info(f"\n--- Ricerca di: {food} ---")
        
        try:
            # Esegui la ricerca
            results = await fatsecret_service.search_food(food, max_results=3)
            
            # Stampa i risultati
            if results and "foods" in results and results["foods"] and "food" in results["foods"]:
                food_items = results["foods"]["food"]
                logger.info(f"Trovati {len(food_items)} risultati:")
                
                for i, food_item in enumerate(food_items):
                    name = food_item.get("food_name", "")
                    description = food_item.get("food_description", "Nessuna descrizione")
                    food_id = food_item.get("food_id", "")
                    
                    logger.info(f"{i+1}. {name} - {description}")
                    logger.info(f"   ID: {food_id}")
                    
                    # Testa anche il recupero dei dettagli per il primo risultato
                    if i == 0:
                        logger.info(f"\nRecupero dettagli per: {food_id}")
                        
                        try:
                            details = await fatsecret_service.get_food(food_id)
                            if details and "food" in details:
                                food_details = details["food"]
                                logger.info(f"Dettagli ricevuti:")
                                logger.info(f"   Nome: {food_details.get('food_name', '')}")
                                logger.info(f"   Descrizione: {food_details.get('food_description', '')}")
                                logger.info(f"   Marca: {food_details.get('brand_name', 'N/A')}")
                                
                                # Mostra le informazioni nutrizionali se disponibili
                                if "servings" in food_details and "serving" in food_details["servings"]:
                                    serving = food_details["servings"]["serving"]
                                    if isinstance(serving, list):
                                        serving = serving[0]  # Prendi il primo serving se ce ne sono più di uno
                                    
                                    logger.info(f"   Porzione: {serving.get('serving_description', '')}")
                                    logger.info(f"   Calorie: {serving.get('calories', '')} kcal")
                                    logger.info(f"   Proteine: {serving.get('protein', '')} g")
                                    logger.info(f"   Carboidrati: {serving.get('carbohydrate', '')} g")
                                    logger.info(f"   Grassi: {serving.get('fat', '')} g")
                            else:
                                logger.error("Nessun dettaglio ricevuto")
                        except Exception as e:
                            logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
            else:
                logger.warning(f"Nessun risultato trovato per '{food}'")
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{food}': {str(e)}")
            logger.error(traceback.format_exc())
    
    logger.info("\nTest completato!")

if __name__ == "__main__":
    asyncio.run(test_fatsecret())
