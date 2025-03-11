import asyncio
import logging
import sys
from dotenv import load_dotenv
from enhanced_edamam_service import EnhancedEdamamService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def test_enhanced_edamam_search():
    """Testa la ricerca con il servizio Edamam migliorato"""
    
    logger.info("Inizializzazione del servizio Edamam migliorato...")
    edamam_service = EnhancedEdamamService()
    
    # Definisci i termini di ricerca da testare
    search_terms = ["msemmen", "pollo", "pasta", "pizza"]
    
    for term in search_terms:
        logger.info(f"\n--- Ricerca di '{term}' ---")
        try:
            results = await edamam_service.search_food(term, max_results=2)
            
            if results and "results" in results and results["results"]:
                logger.info(f"Trovati {len(results['results'])} risultati:")
                
                for i, result in enumerate(results["results"]):
                    logger.info(f"\n{i+1}. {result.get('name', 'N/A')}")
                    logger.info(f"   Fonte: {result.get('description', 'N/A')}")
                    logger.info(f"   Calorie: {result.get('calories', 'N/A'):.0f} kcal")
                    logger.info(f"   Porzioni: {result.get('servings', 'N/A')}")
                    
                    # Mostra i macronutrienti
                    macros = result.get('macros', {})
                    logger.info(f"   Proteine: {macros.get('protein', 'N/A'):.1f} g")
                    logger.info(f"   Grassi: {macros.get('fat', 'N/A'):.1f} g")
                    logger.info(f"   Carboidrati: {macros.get('carbs', 'N/A'):.1f} g")
                    
                    # Mostra i nutrienti
                    nutrients = result.get('nutrients', {})
                    logger.info(f"   Colesterolo: {nutrients.get('cholesterol', 'N/A'):.1f} mg")
                    logger.info(f"   Sodio: {nutrients.get('sodium', 'N/A'):.1f} mg")
                    
                    # Mostra le etichette dietetiche
                    diet_labels = result.get('diet_labels', [])
                    if diet_labels:
                        logger.info(f"   Etichette dietetiche: {', '.join(diet_labels[:10])}")
                        if len(diet_labels) > 10:
                            logger.info(f"     ... e altre {len(diet_labels) - 10} etichette")
                
                # Testa il recupero dei dettagli solo per il primo risultato del primo termine
                if term == search_terms[0] and results["results"]:
                    result = results["results"][0]
                    if result.get('id'):
                        food_id = result['id']
                        logger.info(f"\nRecupero dettagli per: {result.get('name', 'N/A')} (ID: {food_id})")
                        
                        try:
                            details = await edamam_service.get_food(food_id)
                            
                            if details:
                                logger.info("Dettagli ricevuti:")
                                logger.info(f"   Nome: {details.get('name', 'N/A')}")
                                logger.info(f"   Calorie: {details.get('calories', 'N/A'):.0f} kcal")
                                logger.info(f"   Porzioni: {details.get('servings', 'N/A')}")
                                
                                # Mostra i macronutrienti
                                macros = details.get('macros', {})
                                logger.info(f"   Proteine: {macros.get('protein', 'N/A'):.1f} g")
                                logger.info(f"   Grassi: {macros.get('fat', 'N/A'):.1f} g")
                                logger.info(f"   Carboidrati: {macros.get('carbs', 'N/A'):.1f} g")
                                
                                # Mostra gli ingredienti
                                ingredients = details.get('ingredients', [])
                                if ingredients:
                                    logger.info("   Ingredienti:")
                                    for ing in ingredients[:5]:  # Mostra solo i primi 5 ingredienti
                                        logger.info(f"     - {ing}")
                                    if len(ingredients) > 5:
                                        logger.info(f"     - ... e altri {len(ingredients) - 5} ingredienti")
                            else:
                                logger.error("Nessun dettaglio ricevuto")
                        except Exception as e:
                            logger.error(f"Errore durante il recupero dei dettagli: {str(e)}")
            else:
                logger.warning(f"Nessun risultato trovato per '{term}'")
        
        except Exception as e:
            logger.error(f"Errore durante la ricerca di '{term}': {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_enhanced_edamam_search())
