"""
Script di test per l'API di ricerca ricette Edamam
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

# URL dell'API Edamam per la ricerca ricette
url = "https://api.edamam.com/search"

# Parametri per la ricerca
params = {
    "app_id": app_id,
    "app_key": app_key,
    "q": "bread"
}

# Header con account utente
headers = {
    "Edamam-Account-User": "ikhihi"
}

print(f"\nRichiesta all'API Edamam Recipe Search per 'bread'...")
try:
    response = requests.get(url, params=params, headers=headers)
    print(f"Codice di stato: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        hits = data.get("hits", [])
        print(f"Numero di risultati: {len(hits)}")
        
        if hits:
            print("\nPrimi 3 risultati:")
            for i, hit in enumerate(hits[:3]):
                recipe = hit.get("recipe", {})
                print(f"{i+1}. {recipe.get('label', 'N/A')}")
        else:
            print("Nessun risultato trovato.")
    else:
        print(f"Errore: {response.text}")
except Exception as e:
    print(f"Errore durante la richiesta: {e}")
