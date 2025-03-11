"""
Script per testare direttamente la connessione alle API.
"""

import os
import sys
import asyncio
import httpx
import json
from pathlib import Path

# Aggiungi la directory principale al percorso di sistema
parent_dir = Path(__file__).parent.parent
if str(parent_dir) not in sys.path:
    sys.path.append(str(parent_dir))

# Carica le variabili d'ambiente dal file .env
from dotenv import load_dotenv
load_dotenv()

# URL API
USDA_API_BASE_URL = "https://api.nal.usda.gov/fdc/v1"
EDAMAM_API_BASE_URL = "https://api.edamam.com/api/food-database/v2/parser"

async def test_edamam(query: str = "bread"):
    """Test della connessione all'API Edamam."""
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY")
    
    if not app_id or not app_key:
        print("Errore: credenziali Edamam non trovate.")
        return
    
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "ingr": query,
        "nutrition-type": "cooking"
    }
    
    # Aggiunto header richiesto da Edamam
    headers = {
        "Edamam-Account-User": "healthylife_app_user"
    }
    
    print(f"Testando API Edamam con query: {query}")
    print(f"Parametri: {params}")
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(EDAMAM_API_BASE_URL, params=params, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            hints = data.get("hints", [])
            
            print(f"Risposta API Edamam:")
            print(f"Stato: {response.status_code}")
            print(f"Numero di risultati: {len(hints)}")
            
            if hints:
                print("\nPrimi 3 risultati:")
                for i, hint in enumerate(hints[:3]):
                    food = hint.get("food", {})
                    print(f"{i+1}. {food.get('label', 'N/A')} - {food.get('foodId', 'N/A')}")
            else:
                print("\nNessun risultato trovato.")
            
            return True
    except httpx.RequestError as e:
        print(f"Errore di connessione: {e}")
        return False
    except httpx.HTTPStatusError as e:
        print(f"Errore HTTP: {e}")
        print(f"Dettagli risposta: {e.response.text}")
        return False
    except Exception as e:
        print(f"Errore imprevisto: {e}")
        return False

async def test_usda(query: str = "bread"):
    """Test della connessione all'API USDA."""
    api_key = os.getenv("USDA_API_KEY")
    
    if not api_key:
        print("Errore: API key USDA non trovata.")
        return
    
    params = {
        "api_key": api_key,
        "query": query,
        "pageSize": 10,
        "dataType": ["Survey (FNDDS)", "Foundation", "SR Legacy"]
    }
    
    print(f"Testando API USDA con query: {query}")
    print(f"API Key: {api_key}")
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(f"{USDA_API_BASE_URL}/foods/search", params=params)
            response.raise_for_status()
            
            data = response.json()
            foods = data.get("foods", [])
            
            print(f"Risposta API USDA:")
            print(f"Stato: {response.status_code}")
            print(f"Numero di risultati: {len(foods)}")
            
            if foods:
                print("\nPrimi 3 risultati:")
                for i, food in enumerate(foods[:3]):
                    print(f"{i+1}. {food.get('description', 'N/A')} - {food.get('fdcId', 'N/A')}")
            else:
                print("\nNessun risultato trovato.")
                
            return True
    except httpx.RequestError as e:
        print(f"Errore di connessione: {e}")
        return False
    except httpx.HTTPStatusError as e:
        print(f"Errore HTTP: {e}")
        print(f"Dettagli risposta: {e.response.text}")
        return False
    except Exception as e:
        print(f"Errore imprevisto: {e}")
        return False

async def main():
    print("=== TEST CONNESSIONE API ===")
    print("\n[1] Test API Edamam")
    await test_edamam("bread")
    print("\n[2] Test API Edamam in italiano")
    await test_edamam("pane")
    
    print("\n[3] Test API USDA")
    await test_usda("bread")
    print("\n[4] Test API USDA in italiano")
    await test_usda("pane")

if __name__ == "__main__":
    asyncio.run(main())
