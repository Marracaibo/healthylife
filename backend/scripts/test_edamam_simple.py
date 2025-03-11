"""
Script semplice per testare l'API Edamam
"""
import os
import requests
import json
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Prendi le credenziali API
app_id = os.getenv("EDAMAM_APP_ID")
app_key = os.getenv("EDAMAM_APP_KEY")

print(f"Credenziali API Edamam:")
print(f"APP ID: {app_id}")
print(f"APP KEY: {app_key}")

# URL dell'API Edamam
url = "https://api.edamam.com/api/food-database/v2/parser"

# Parametri per la ricerca
params = {
    "app_id": app_id,
    "app_key": app_key,
    "ingr": "bread"
}

# Header con account utente corretto
headers = {
    "Edamam-Account-User": "ikhihi"  # Username dell'account Edamam
}

print(f"\nRichiesta all'API Edamam per 'bread'...")
try:
    response = requests.get(url, params=params, headers=headers)
    print(f"Codice di stato: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        hints = data.get("hints", [])
        print(f"Numero di risultati: {len(hints)}")
        
        if hints:
            print("\nPrimi 3 risultati:")
            for i, hint in enumerate(hints[:3]):
                food = hint.get("food", {})
                print(f"{i+1}. {food.get('label', 'N/A')}")
        else:
            print("Nessun risultato trovato.")
    else:
        print(f"Errore: {response.text}")
except Exception as e:
    print(f"Errore durante la richiesta: {e}")
