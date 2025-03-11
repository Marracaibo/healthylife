import requests
import json
import time

# Lista di codici a barre da testare
barcodes = [
    "8001505005707",  # Nocciolata Rigoni di Asiago
    "8076809513692",  # Barilla Sauce napolitaine
    "8000500310427",  # Nutella Biscuits
    "1234567890123",  # Codice a barre di test
    "5449000000996",  # Coca Cola
    "8000500033784",  # Kinder Bueno
    "8001120000035",  # Acqua San Benedetto
    "8001120000042",  # Altro prodotto
    "8001505005714",  # Variante del primo codice
]

def test_barcode(barcode):
    url = f"http://localhost:8000/api/hybrid-food/barcode/{barcode}"
    print(f"\nTesting barcode: {barcode}")
    start_time = time.time()
    try:
        response = requests.get(url)
        elapsed = time.time() - start_time
        if response.status_code == 200:
            data = response.json()
            source = data.get("source", "unknown")
            success = data.get("success", False)
            total_results = data.get("total_results", 0)
            
            print(f"Status: {response.status_code}")
            print(f"Time: {elapsed:.2f} seconds")
            print(f"Source: {source}")
            print(f"Success: {success}")
            print(f"Total results: {total_results}")
            
            if total_results > 0 and "foods" in data and len(data["foods"]) > 0:
                food = data["foods"][0]
                print(f"Food name: {food.get('food_name', 'N/A')}")
                print(f"Brand: {food.get('brand', 'N/A')}")
                print(f"Calories: {food.get('nutrients', {}).get('calories', 'N/A')}")
            else:
                print("No food details found")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {e}")

def main():
    print("Starting barcode search test...\n")
    
    for barcode in barcodes:
        test_barcode(barcode)
        time.sleep(1)  # Pausa per evitare di sovraccaricare il server
    
    print("\nTest completed!")

if __name__ == "__main__":
    main()
