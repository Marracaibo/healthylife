import asyncio
import httpx
import json

async def test_fatsecret_api():
    base_url = "http://127.0.0.1:8000"
    
    async with httpx.AsyncClient() as client:
        # Test ricerca alimenti
        print("Test ricerca alimenti:")
        search_url = f"{base_url}/api/fatsecret/search?query=pizza&max_results=5"
        response = await client.get(search_url)
        
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(json.dumps(data, indent=2))
            
            # Se ci sono risultati, testa anche il dettaglio del primo alimento
            if data["results"] and len(data["results"]) > 0:
                food_id = data["results"][0]["id"]
                print(f"\nTest dettaglio alimento (ID: {food_id}):")
                detail_url = f"{base_url}/api/fatsecret/food/{food_id}"
                detail_response = await client.get(detail_url)
                
                print(f"Status code: {detail_response.status_code}")
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    print(json.dumps(detail_data, indent=2))
                else:
                    print(f"Errore: {detail_response.text}")
        else:
            print(f"Errore: {response.text}")

if __name__ == "__main__":
    asyncio.run(test_fatsecret_api())
