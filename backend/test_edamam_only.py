import asyncio
import logging
import sys
import json
from dotenv import load_dotenv
from edamam_only_service import EdamamOnlyService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

def print_recipe_card(recipe):
    """Formatta e stampa una scheda ricetta in stile simile all'immagine di esempio"""
    print("\n" + "=" * 60)
    print(f"{recipe.get('name', 'N/A')}")
    print("-" * 60)
    
    # Stampa le etichette dietetiche
    diet_labels = recipe.get('diet_labels', [])
    health_labels = recipe.get('health_labels', [])
    
    # Prendi solo le prime 10 etichette in totale
    all_labels = []
    if diet_labels:
        all_labels.extend(diet_labels)
    if health_labels:
        all_labels.extend(health_labels)
    
    all_labels = all_labels[:10]  # Limita a 10 etichette
    
    if all_labels:
        print(" • ".join(all_labels))
    
    # Stampa i macronutrienti e le calorie
    servings = recipe.get('servings', 1)
    calories = recipe.get('calories', 0)
    
    print(f"\n{servings} servings" + " " * 20 + f"{int(calories/servings)} kcal")
    
    # Stampa i macronutrienti in una tabella
    print("\nPROTEIN" + " " * 10 + f"{recipe.get('protein', 0)/servings:.1f} g")
    print("FAT" + " " * 13 + f"{recipe.get('fat', 0)/servings:.1f} g")
    print("CARB" + " " * 12 + f"{recipe.get('carbs', 0)/servings:.1f} g")
    
    # Stampa i nutrienti aggiuntivi
    if recipe.get('cholesterol') is not None:
        print("\nCholesterol" + " " * 5 + f"{recipe.get('cholesterol', 0)/servings:.1f} mg")
        print("Sodium" + " " * 9 + f"{recipe.get('sodium', 0)/servings:.1f} mg")
        print("Calcium" + " " * 8 + f"{recipe.get('calcium', 0)/servings:.1f} mg")
        print("Magnesium" + " " * 6 + f"{recipe.get('magnesium', 0)/servings:.1f} mg")
        print("Potassium" + " " * 6 + f"{recipe.get('potassium', 0)/servings:.1f} mg")
        print("Iron" + " " * 11 + f"{recipe.get('iron', 0)/servings:.1f} mg")
    
    print("=" * 60)

async def test_edamam_only():
    """Testa il servizio EdamamOnly"""
    
    logger.info("Inizializzazione del servizio EdamamOnly...")
    edamam_service = EdamamOnlyService()
    
    # Definisci i termini di ricerca da testare
    search_terms = ["msemmen", "pollo", "pasta"]
    
    for term in search_terms:
        logger.info(f"\n--- Ricerca di '{term}' ---")
        try:
            results = await edamam_service.search_food(term, max_results=2)
            
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {results.get('count', 0)} risultati:")
                
                for result in results["results"]:
                    # Stampa la scheda ricetta formattata
                    print_recipe_card(result)
                    
                # Recupera i dettagli solo per il primo risultato del primo termine
                if term == search_terms[0] and results["results"]:
                    first_result = results["results"][0]
                    food_id = first_result.get('id')
                    
                    if food_id:
                        logger.info(f"\nRecupero dettagli completi per: {first_result.get('name')}")
                        details = await edamam_service.get_food(food_id)
                        
                        if details:
                            logger.info("Dettagli ricevuti:")
                            
                            # Stampa gli ingredienti
                            ingredients = details.get('ingredients', [])
                            if ingredients:
                                logger.info("\nIngredienti:")
                                for ing in ingredients:
                                    logger.info(f"  • {ing}")
                        else:
                            logger.error("Nessun dettaglio ricevuto")
            else:
                logger.warning(f"Nessun risultato trovato per '{term}'")
        
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{term}': {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_edamam_only())
