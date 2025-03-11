"""
Script semplice per testare l'API USDA
"""
import os
import requests
import json
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Prendi la chiave API
api_key = os.getenv("USDA_API_KEY")

print(f"Chiave API USDA: {api_key}")

# URL dell'API USDA
url = "https://api.nal.usda.gov/fdc/v1/foods/search"

# Parametri per la ricerca
params = {
    "api_key": api_key,
    "query": "bread",
    "pageSize": 10,
    "dataType": ["Survey (FNDDS)", "Foundation", "SR Legacy"]
}

print(f"\nRichiesta all'API USDA per 'bread'...")
try:
    response = requests.get(url, params=params)
    print(f"Codice di stato: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        foods = data.get("foods", [])
        print(f"Numero di risultati: {len(foods)}")
        
        if foods:
            print("\nPrimi 3 risultati:")
            for i, food in enumerate(foods[:3]):
                print(f"{i+1}. {food.get('description', 'N/A')}")
        else:
            print("Nessun risultato trovato.")
    else:
        print(f"Errore: {response.text}")
except Exception as e:
    print(f"Errore durante la richiesta: {e}")

# Test anche con una parola italiana
print(f"\nRichiesta all'API USDA per 'pane'...")
params["query"] = "pane"
try:
    response = requests.get(url, params=params)
    print(f"Codice di stato: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        foods = data.get("foods", [])
        print(f"Numero di risultati: {len(foods)}")
        
        if foods:
            print("\nPrimi 3 risultati:")
            for i, food in enumerate(foods[:3]):
                print(f"{i+1}. {food.get('description', 'N/A')}")
        else:
            print("Nessun risultato trovato.")
    else:
        print(f"Errore: {response.text}")
except Exception as e:
    print(f"Errore durante la richiesta: {e}")
