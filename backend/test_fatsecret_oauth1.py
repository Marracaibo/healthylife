import os
import sys
import json
import logging

# Configura logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Importa il servizio da testare
from services.fatsecret_oauth1_service import search_foods

def main():
    # Verifica chiavi API
    from dotenv import load_dotenv
    load_dotenv()
    
    consumer_key = os.environ.get("FATSECRET_CLIENT_ID")
    consumer_secret = os.environ.get("FATSECRET_CLIENT_SECRET")
    
    print(f"FATSECRET_CLIENT_ID: {'*' * (len(consumer_key) - 4) + consumer_key[-4:] if consumer_key else 'Non impostato'}")
    print(f"FATSECRET_CLIENT_SECRET: {'*' * (len(consumer_secret) - 4) + consumer_secret[-4:] if consumer_secret else 'Non impostato'}")
    
    if not consumer_key or not consumer_secret:
        print("ERROR: Chiavi API FatSecret non configurate. Verifica il file .env")
        sys.exit(1)
    
    # Esegui test di ricerca
    query = "yogurt"
    max_results = 5
    
    print(f"\nRicerca di '{query}' con max_results={max_results}...\n")
    
    try:
        results = search_foods(query, max_results)
        
        print(f"Trovati {len(results)} risultati.\n")
        
        # Mostra risultati
        for i, food in enumerate(results, 1):
            print(f"Risultato {i}:")
            print(f"  ID: {food.get('food_id')}")
            print(f"  Nome: {food.get('food_name')}")
            print(f"  Brand: {food.get('brand_name')}")
            print(f"  Descrizione: {food.get('food_description')}")
            print()
    
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
