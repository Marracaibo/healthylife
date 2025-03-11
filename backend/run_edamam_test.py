"""
Script per testare rapidamente il servizio Edamam con una query da riga di comando.
Questo script utilizza il servizio EdamamOnlyService per cercare cibo.

Uso: python run_edamam_test.py "query" [max_results]
"""

import asyncio
import sys
import logging
from dotenv import load_dotenv
from edamam_only_service import EdamamOnlyService

# Configurazione logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Disattiva i log meno importanti di altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def run_test(query, max_results=5):
    """Esegue un test con il servizio Edamam"""
    try:
        # Carica le variabili d'ambiente
        load_dotenv()
        
        logger.info(f"Inizializzazione del servizio EdamamOnlyService...")
        service = EdamamOnlyService()
        
        logger.info(f"Ricerca di '{query}' (max risultati: {max_results})...")
        results = await service.search_food(query, max_results=max_results)
        
        if results and "results" in results and results["results"]:
            count = len(results["results"])
            logger.info(f"Trovati {count} risultati per '{query}'")
            
            for i, result in enumerate(results["results"]):
                print(f"\n[{i+1}/{count}] {result.get('name', 'Nome sconosciuto')}")
                print("-" * 60)
                
                # Mostra calorie e macronutrienti
                servings = result.get('servings', 1)
                calories = result.get('calories', 0)
                protein = result.get('protein', 0)
                fat = result.get('fat', 0)
                carbs = result.get('carbs', 0)
                
                print(f"Calorie: {calories/servings:.0f} kcal per porzione")
                print(f"Proteine: {protein/servings:.1f} g")
                print(f"Grassi: {fat/servings:.1f} g")
                print(f"Carboidrati: {carbs/servings:.1f} g")
                
                # Mostra etichette dietetiche
                diet_labels = result.get('diet_labels', [])
                health_labels = result.get('health_labels', [])
                if diet_labels or health_labels:
                    print("\nEtichette:")
                    all_labels = diet_labels + health_labels[:5]
                    print(" • ".join(all_labels[:8]))  # Limita a 8 etichette
                
                # Mostra l'ID per riferimento
                print(f"\nID: {result.get('id', 'N/A')}")
            
            # Domanda all'utente se vuole vedere i dettagli completi per un risultato
            logger.info("\nVuoi vedere i dettagli completi per uno dei risultati? [Inserisci il numero o 'n' per uscire]")
            choice = input("> ")
            
            if choice.lower() != 'n' and choice.isdigit():
                choice_idx = int(choice) - 1
                if 0 <= choice_idx < count:
                    result = results["results"][choice_idx]
                    food_id = result.get('id')
                    
                    if food_id:
                        logger.info(f"Recupero dettagli per: {result.get('name')}")
                        details = await service.get_food(food_id)
                        
                        if details:
                            print("\n" + "=" * 70)
                            print(f"DETTAGLI PER: {details.get('name', 'N/A')}")
                            print("=" * 70)
                            
                            # Mostra gli ingredienti
                            ingredients = details.get('ingredients', [])
                            if ingredients:
                                print("\nINGREDIENTI:")
                                for ing in ingredients:
                                    print(f"  • {ing}")
                            
                            # Mostra i nutrienti completi
                            nutrients = details.get('nutrients', {})
                            if nutrients:
                                print("\nNUTRIENTI COMPLETI (per porzione):")
                                for nutrient, value in nutrients.items():
                                    print(f"  • {nutrient}: {value}")
                        else:
                            logger.error("Impossibile recuperare i dettagli.")
                else:
                    logger.warning("Scelta non valida.")
        else:
            logger.warning(f"Nessun risultato trovato per '{query}'")
    
    except Exception as e:
        logger.error(f"Errore durante l'esecuzione del test: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())

def main():
    """Funzione principale"""
    # Verifica gli argomenti
    if len(sys.argv) < 2:
        print(f"Uso: python {sys.argv[0]} \"query\" [max_results]")
        return
    
    query = sys.argv[1]
    max_results = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    
    # Esegui il test
    asyncio.run(run_test(query, max_results))

if __name__ == "__main__":
    main()
