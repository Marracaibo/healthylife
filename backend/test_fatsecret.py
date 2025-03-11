import asyncio
import json
from fatsecret_service import fatsecret_service

async def test_search_food():
    search_term = "apple"
    print(f"Cercando '{search_term}'...")
    result = await fatsecret_service.search_food(search_term, 5)
    print(json.dumps(result, indent=2))
    
    if "foods" in result:
        print("\nContenuto di 'foods':")
        foods_data = result["foods"]
        print(f"  Tipo: {type(foods_data)}")
        print(f"  Chiavi: {foods_data.keys() if isinstance(foods_data, dict) else 'N/A'}")
        
        if "food" in foods_data:
            foods = foods_data["food"]
            print("\nContenuto di 'food':")
            print(f"  Tipo: {type(foods)}")
            print(f"  Lunghezza: {len(foods) if isinstance(foods, list) else '1 (oggetto singolo)' if foods else '0 (vuoto)'}")
            
            if isinstance(foods, list) and len(foods) > 0:
                first_food = foods[0]
                food_id = first_food.get("food_id")
                print(f"\nPrimo alimento:")
                print(f"  ID: {food_id}")
                print(f"  Nome: {first_food.get('food_name')}")
                print(f"  Descrizione: {first_food.get('food_description')}")
                
                print(f"\nOttenendo dettagli per l'alimento con ID {food_id}...")
                food_details = await fatsecret_service.get_food(food_id)
                print(json.dumps(food_details, indent=2))
            else:
                print("Nessun alimento trovato.")
        else:
            print("Nessun campo 'food' nella risposta.")
    else:
        print("Nessun campo 'foods' nella risposta.")

if __name__ == "__main__":
    print("Test dell'API FatSecret")
    print("----------------------")
    print(f"Client ID: {fatsecret_service.client_id}")
    print(f"Client Secret: {'*' * len(fatsecret_service.client_secret) if fatsecret_service.client_secret else 'Non configurato'}")
    
    asyncio.run(test_search_food())
