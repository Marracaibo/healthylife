import asyncio
import json
import os
import sys
import logging
import time
from dotenv import load_dotenv

# Configura logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Carica variabili d'ambiente
load_dotenv()

# Imposta variabile d'ambiente per usare l'API reale
os.environ["USE_MOCK_FATSECRET"] = "false"

# Importa servizi dopo aver caricato le variabili d'ambiente
from services.fatsecret_service import search_foods, get_food_details, get_auth_token
from services.hybrid_food_search import HybridFoodSearch


async def test_hybrid_food_service():
    """Test per il servizio ibrido di ricerca alimenti con FatSecret reale."""
    print("\n===== TEST HYBRID FOOD SERVICE WITH REAL FATSECRET =====\n")
    
    # Crea un'istanza del servizio ibrido
    hybrid_service = HybridFoodSearch()
    
    # Lista di alimenti italiani da testare
    italian_foods = [
        "pasta",
        "pizza margherita",
        "parmigiano reggiano",
        "olio extravergine",
        "tiramisù"
    ]
    
    # Testa la ricerca per ogni alimento
    for food in italian_foods:
        print(f"\n----- Ricerca: '{food}' -----")
        try:
            results = await hybrid_service.search(food, max_results=3, detailed=True)
            print(f"Trovati {len(results['results'])} risultati")
            
            # Mostra i primi 3 risultati
            for i, item in enumerate(results['results'][:3]):
                print(f"\nRisultato {i+1}:")
                print(f"  Nome: {item['food_name']}")
                print(f"  Brand: {item.get('brand', 'N/A')}")
                print(f"  Nutritional info: {item.get('nutrition', {})}")
                print(f"  Fonte: {item.get('source', 'N/A')}")
            
            # Mostra metadati
            print("\nMetadati:")
            print(f"  Fonti utilizzate: {results['metadata']['sources_used']}")
            print(f"  Tempo di risposta: {results['metadata'].get('elapsed_time', 'N/A'):.2f} secondi")
        
        except Exception as e:
            print(f"Errore durante la ricerca di {food}: {e}")
            print(traceback.format_exc())


async def test_direct_fatsecret_api():
    """Test diretto dell'API FatSecret."""
    print("\n===== TEST DIRECT FATSECRET API =====\n")
    
    # Verifica il token di autenticazione
    print("Test autenticazione FatSecret...")
    token = get_auth_token()
    print(f"Token ottenuto: {token[:10]}..." if token else "Errore nell'ottenere il token")
    
    # Lista di alimenti da testare
    test_foods = ["pasta", "apple", "chicken", "pizza"]
    
    # Testa la ricerca per ogni alimento
    for food in test_foods:
        print(f"\n----- Ricerca diretta FatSecret: '{food}' -----")
        try:
            start_time = time.time()
            results = search_foods(food, max_results=3)
            elapsed = time.time() - start_time
            
            print(f"Trovati {len(results)} risultati in {elapsed:.2f} secondi")
            
            # Mostra i primi 3 risultati
            for i, item in enumerate(results[:3]):
                print(f"\nRisultato {i+1}:")
                print(f"  ID: {item.get('food_id', 'N/A')}")
                print(f"  Nome: {item.get('food_name', 'N/A')}")
                print(f"  Tipo/Brand: {item.get('food_type', 'N/A')}")
                print(f"  Descrizione: {item.get('food_description', 'N/A')[:100]}...")
                
                # Test dettaglio alimento
                if i == 0:
                    print(f"\n  ** Dettaglio alimento ID {item.get('food_id', 'N/A')} **")
                    food_id = item.get('food_id')
                    if food_id:
                        detail_start = time.time()
                        details = get_food_details(food_id)
                        detail_elapsed = time.time() - detail_start
                        
                        print(f"  Dettagli ottenuti in {detail_elapsed:.2f} secondi")
                        print(f"  Nome completo: {details.get('food_name', 'N/A')}")
                        print(f"  Tipo/Brand: {details.get('food_type', 'N/A')}")
                        print(f"  Nutrizione: {json.dumps(details.get('nutrition', {}), indent=2)}")
        
        except Exception as e:
            print(f"Errore durante la ricerca diretta di {food}: {e}")


async def main():
    """Funzione principale che esegue tutti i test."""
    print("Inizio test API FatSecret reali...\n")
    
    # Verifica variabili d'ambiente
    client_id = os.environ.get("FATSECRET_CLIENT_ID")
    client_secret = os.environ.get("FATSECRET_CLIENT_SECRET")
    use_mock = os.environ.get("USE_MOCK_FATSECRET")
    
    print(f"FATSECRET_CLIENT_ID: {'Configurato' if client_id else 'MANCANTE'}")
    print(f"FATSECRET_CLIENT_SECRET: {'Configurato' if client_secret else 'MANCANTE'}")
    print(f"USE_MOCK_FATSECRET: {use_mock}")
    
    if not client_id or not client_secret:
        print("ERRORE: Credenziali FatSecret mancanti. Controlla il file .env")
        return
    
    # Test diretto dell'API FatSecret
    await test_direct_fatsecret_api()
    
    # Test del servizio ibrido
    await test_hybrid_food_service()
    
    print("\nTest completati.")


if __name__ == "__main__":
    asyncio.run(main())
