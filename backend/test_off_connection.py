import requests
import sys

def test_connection(url):
    """Testa la connessione a un URL utilizzando requests"""
    print(f"Tentativo di connessione a: {url}")
    try:
        # Aumentiamo il timeout a 30 secondi
        response = requests.get(url, timeout=30)
        print(f"Stato risposta: {response.status_code}")
        print(f"Contenuto (primi 200 caratteri): {response.text[:200]}")
        return True
    except Exception as e:
        print(f"Errore: {str(e)}")
        return False

if __name__ == "__main__":
    url = "https://it.openfoodfacts.org/"
    success = test_connection(url)
    print(f"Connessione a {url}: {'Successo' if success else 'Fallita'}")
