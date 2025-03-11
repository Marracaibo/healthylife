"""
Script di test per diversi endpoint API Edamam
"""
import os
import requests
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Prendi le credenziali API
app_id = os.getenv("EDAMAM_APP_ID")
app_key = os.getenv("EDAMAM_APP_KEY")

print(f"Credenziali API Edamam:")
print(f"APP ID: {app_id}")
print(f"APP KEY: {app_key}")

# Lista di possibili endpoint API Edamam
endpoints = [
    "https://api.edamam.com/api/food-database/v2/parser",  # Food Database API
    "https://api.edamam.com/search",                       # Recipe Search API
    "https://api.edamam.com/api/nutrition-data",           # Nutrition Analysis API
    "https://api.edamam.com/api/nutrition-details"         # Nutrition Analysis API (dettagliato)
]

# Header con account utente
headers = {
    "Edamam-Account-User": "ikhihi"
}

# Test di ogni endpoint
for endpoint in endpoints:
    print(f"\nTest endpoint: {endpoint}")
    
    # Aggiungi parametri appropriati per ogni tipo di API
    if "food-database" in endpoint:
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "ingr": "bread"
        }
    elif "search" in endpoint:
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "q": "bread"
        }
    elif "nutrition-data" in endpoint:
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "ingr": "100g bread"
        }
    else:
        params = {
            "app_id": app_id,
            "app_key": app_key
        }
    
    try:
        response = requests.get(endpoint, params=params, headers=headers)
        print(f"Codice di stato: {response.status_code}")
        
        # Stampa il testo dell'errore se la risposta non ha successo
        if response.status_code != 200:
            print(f"Errore: {response.text}")
        else:
            print("Richiesta riuscita!")
            print(f"Risposta: {response.text[:200]}...") # Stampa solo i primi 200 caratteri
    except Exception as e:
        print(f"Errore durante la richiesta: {e}")
