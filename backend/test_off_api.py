import requests
import json

def test_api_search():
    """Testa l'API di ricerca di OpenFoodFacts tramite un endpoint diretto"""
    print("Test dell'API di ricerca di OpenFoodFacts")
    
    # URL di ricerca diretto
    url = "https://it.openfoodfacts.org/cgi/search.pl"
    
    # Parametri di ricerca
    params = {
        "search_terms": "pasta barilla",
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 5
    }
    
    try:
        # Richiesta con timeout esteso
        response = requests.get(url, params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Risposta ricevuta! Trovati {len(data.get('products', []))} prodotti")
            
            # Mostra i primi 2 risultati
            for i, product in enumerate(data.get("products", [])[:2]):
                print(f"\nProdotto {i+1}:")
                print(f"  Nome: {product.get('product_name', 'N/A')}")
                print(f"  Marca: {product.get('brands', 'N/A')}")
                print(f"  ID: {product.get('id', 'N/A')}")
                
            return True
        else:
            print(f"Errore: Status code {response.status_code}")
            print(f"Risposta: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"Errore durante la richiesta: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api_search()
    print(f"\nTest API: {'Successo' if success else 'Fallito'}")
