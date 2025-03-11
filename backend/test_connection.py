import requests
import sys

def test_connection(url):
    """Testa la connessione a un URL utilizzando requests"""
    print(f"Tentativo di connessione a: {url}")
    try:
        response = requests.get(url, timeout=10)
        print(f"Stato risposta: {response.status_code}")
        print(f"Contenuto (primi 100 caratteri): {response.text[:100]}")
        return True
    except Exception as e:
        print(f"Errore: {str(e)}")
        return False

if __name__ == "__main__":
    urls = [
        "https://world.openfoodfacts.org/",
        "https://it.openfoodfacts.org/",
        "https://api.edamam.com/",
        "https://platform.fatsecret.com/",
        "https://www.google.com/"  # Test di controllo
    ]
    
    for url in urls:
        success = test_connection(url)
        print(f"Connessione a {url}: {'Successo' if success else 'Fallita'}")
        print("-" * 50)
