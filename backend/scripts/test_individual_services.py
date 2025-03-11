import requests
import json
import sys
import time
import os
from tabulate import tabulate

# Aggiungi la directory principale al path per poter importare i moduli
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa i servizi dopo aver aggiunto il path
from services.fatsecret_service import search_foods as fatsecret_search

# Configurazione base
BASE_URL = "http://localhost:8000"
TIMEOUT = 10  # secondi

# Esempi di cibi da testare
TEST_FOODS = [
    "pizza",
    "pasta",
    "apple",
    "chicken",
    "salmon"
]

def test_edamam():
    """Testa il servizio Edamam direttamente"""
    print("\n===== TEST SERVIZIO EDAMAM =====\n")
    endpoint = f"{BASE_URL}/api/edamam/search"
    
    for food in TEST_FOODS:
        print(f"\nRicerca per: '{food}'")
        try:
            start_time = time.time()
            response = requests.get(f"{endpoint}?query={food}&max_results=3", timeout=TIMEOUT)
            elapsed = time.time() - start_time
            
            print(f"Tempo: {elapsed:.2f} secondi | Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and "foods" in data:
                    foods = data["foods"]
                    print(f"✅ Successo! Trovati {len(foods)} risultati")
                    
                    if foods:
                        # Mostra il primo risultato
                        food_item = foods[0]
                        print(f"Primo risultato: {food_item.get('food_name', 'N/A')}")
                        print(f"Calorie: {food_item.get('nutrients', {}).get('calories', 'N/A')}")
                else:
                    print("❌ Formato risposta inatteso")
            else:
                print(f"❌ Errore: {response.text[:100]}...")
        except Exception as e:
            print(f"❌ Eccezione: {str(e)}")

def test_usda():
    """Testa il servizio USDA direttamente"""
    print("\n===== TEST SERVIZIO USDA =====\n")
    endpoint = f"{BASE_URL}/api/usda/search"
    
    for food in TEST_FOODS:
        print(f"\nRicerca per: '{food}'")
        try:
            start_time = time.time()
            response = requests.get(f"{endpoint}?query={food}&max_results=3", timeout=TIMEOUT)
            elapsed = time.time() - start_time
            
            print(f"Tempo: {elapsed:.2f} secondi | Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and "foods" in data:
                    foods = data["foods"]
                    print(f"✅ Successo! Trovati {len(foods)} risultati")
                    
                    if foods:
                        # Mostra il primo risultato
                        food_item = foods[0]
                        print(f"Primo risultato: {food_item.get('food_name', 'N/A')}")
                        print(f"Calorie: {food_item.get('nutrients', {}).get('calories', 'N/A')}")
                else:
                    print("❌ Formato risposta inatteso")
            else:
                print(f"❌ Errore: {response.text[:100]}...")
        except Exception as e:
            print(f"❌ Eccezione: {str(e)}")

def test_fatsecret():
    """Testa il servizio FatSecret direttamente"""
    print("\n===== TEST SERVIZIO FATSECRET =====\n")
    
    # Test diretto usando lo script che sappiamo funzionare
    for food in TEST_FOODS:
        print(f"\nRicerca per: '{food}'")
        try:
            start_time = time.time()
            results = fatsecret_search(food, 3)
            elapsed = time.time() - start_time
            
            print(f"Tempo: {elapsed:.2f} secondi")
            
            if results and isinstance(results, list):
                print(f"✅ Successo! Trovati {len(results)} risultati")
                
                if results:
                    # Mostra il primo risultato
                    food_item = results[0]
                    print(f"Primo risultato: {food_item.get('food_name', 'N/A')}")
                    print(f"Descrizione: {food_item.get('food_description', 'N/A')[:100]}...")
            else:
                print("❌ Nessun risultato trovato o errore")
        except Exception as e:
            print(f"❌ Eccezione: {str(e)}")

def test_hybrid():
    """Testa il servizio ibrido ma con maggiori dettagli sull'errore"""
    print("\n===== TEST SERVIZIO IBRIDO =====\n")
    endpoint = f"{BASE_URL}/api/hybrid-food/search"
    
    for food in TEST_FOODS:
        print(f"\nRicerca per: '{food}'")
        try:
            start_time = time.time()
            response = requests.get(f"{endpoint}?query={food}&max_results=3", timeout=TIMEOUT)
            elapsed = time.time() - start_time
            
            print(f"Tempo: {elapsed:.2f} secondi | Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and "foods" in data:
                    foods = data["foods"]
                    print(f"✅ Successo! Trovati {len(foods)} risultati")
                    
                    # Analisi delle sorgenti
                    sources = {}
                    for f in foods:
                        source = f.get("source", "unknown")
                        sources[source] = sources.get(source, 0) + 1
                    
                    print("\nSorgenti dei risultati:")
                    for source, count in sources.items():
                        print(f"- {source}: {count} risultati")
                    
                    if foods:
                        # Mostra il primo risultato
                        food_item = foods[0]
                        print(f"\nPrimo risultato: {food_item.get('food_name', 'N/A')}")
                        print(f"Sorgente: {food_item.get('source', 'N/A')}")
                        print(f"Calorie: {food_item.get('nutrients', {}).get('calories', 'N/A')}")
                else:
                    print("❌ Formato risposta inatteso")
                    print(f"Contenuto: {data}")
            else:
                print(f"❌ Errore: {response.text[:200]}...")
        except Exception as e:
            print(f"❌ Eccezione: {str(e)}")

def main():
    """Funzione principale che esegue tutti i test o quelli specificati"""
    print("\n==================================================")
    print("   TEST DEI SINGOLI SERVIZI DI RICERCA CIBO")
    print("==================================================\n")
    
    if len(sys.argv) > 1:
        # Se specificato un servizio come argomento, testa solo quello
        service = sys.argv[1].lower()
        if service == "edamam":
            test_edamam()
        elif service == "usda":
            test_usda()
        elif service == "fatsecret":
            test_fatsecret()
        elif service == "hybrid":
            test_hybrid()
        else:
            print(f"Servizio '{service}' non riconosciuto. Opzioni: edamam, usda, fatsecret, hybrid")
    else:
        # Altrimenti testa tutti
        print("Esecuzione di tutti i test dei servizi...\n")
        
        # Inizia con il servizio FatSecret che sappiamo funzionare correttamente
        test_fatsecret()
        
        # Poi testa i servizi web
        test_usda()
        test_edamam()
        test_hybrid()
    
    print("\n==================================================\n")

if __name__ == "__main__":
    main()
