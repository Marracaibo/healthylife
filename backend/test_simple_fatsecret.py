from services.fatsecret_service import search_foods, get_food_details, get_auth_token
import json

def main():
    print("Test API FatSecret")
    
    # Test autenticazione
    print("\nTest autenticazione:")
    token = get_auth_token()
    if token:
        print(f"Token ottenuto: {token[:10]}...")
    else:
        print("Errore nell'ottenere il token")
    
    # Test ricerca alimenti
    query = "pasta"
    print(f"\nTest ricerca alimenti: '{query}'")
    try:
        results = search_foods(query, max_results=2)
        print(f"Risultati trovati: {len(results)}")
        
        if results:
            print("\nPrimo risultato:")
            print(json.dumps(results[0], indent=2))
            
            # Test dettaglio alimento
            food_id = results[0].get("food_id")
            if food_id:
                print(f"\nTest dettaglio alimento ID={food_id}:")
                details = get_food_details(food_id)
                print(json.dumps(details, indent=2))
    except Exception as e:
        print(f"Errore: {e}")

if __name__ == "__main__":
    main()
