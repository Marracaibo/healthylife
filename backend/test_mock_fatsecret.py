import asyncio
import json
from mock_fatsecret_service import mock_fatsecret_service

async def test_search_food():
    print("Cercando 'pizza'...")
    result = await mock_fatsecret_service.search_food("pizza", 5)
    print(json.dumps(result, indent=2))
    
    if "foods" in result and "food" in result["foods"]:
        foods = result["foods"]["food"]
        if isinstance(foods, list) and len(foods) > 0:
            first_food = foods[0]
            food_id = first_food.get("food_id")
            print(f"\nOttenendo dettagli per l'alimento con ID {food_id}...")
            food_details = await mock_fatsecret_service.get_food(food_id)
            print(json.dumps(food_details, indent=2))
        else:
            print("Nessun alimento trovato.")
    else:
        print("Errore nella ricerca o nessun risultato trovato.")

if __name__ == "__main__":
    print("Test del servizio FatSecret simulato")
    print("-----------------------------------")
    
    asyncio.run(test_search_food())
