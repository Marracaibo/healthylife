import asyncio
import json
import sys
from services.hybrid_food_search import HybridFoodSearch

async def test_search(query: str):
    service = HybridFoodSearch()
    results = await service.search(query, max_results=5, detailed=True)
    
    print(f"\nRisultati per '{query}':\n")
    print(f"Trovati {len(results['results'])} risultati")
    
    # Verifica se i campi esistono prima di accedervi
    metadata = results.get('metadata', {})
    sources_used = metadata.get('sources_used', [])
    elapsed_time = metadata.get('elapsed_time', 0)
    
    print(f"Fonti utilizzate: {sources_used}")
    print(f"Tempo di risposta: {elapsed_time:.2f}s\n")
    
    for i, item in enumerate(results['results'], 1):
        print(f"{i}. {item['food_name']} ({item.get('source', 'sconosciuto')})")
        print(f"   ID: {item.get('food_id', 'N/A')}")
        print(f"   Marca: {item.get('brand', 'N/A')}")
        print(f"   Nutrienti: {json.dumps(item.get('nutrition', {}), indent=2)}")
        print()

async def test_italian_foods():
    foods = [
        "parmigiano reggiano",
        "mozzarella di bufala",
        "prosciutto crudo",
        "lasagne alla bolognese",
        "pizza margherita",
        "tiramisu"
    ]
    
    for food in foods:
        await test_search(food)
        print("=" * 50)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Se viene fornito un argomento, cerca quello
        query = sys.argv[1]
        asyncio.run(test_search(query))
    else:
        # Altrimenti esegui il test con alimenti italiani
        asyncio.run(test_italian_foods())
