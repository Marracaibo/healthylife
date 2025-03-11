import requests
import os
import json
from dotenv import load_dotenv
from services.fatsecret_oauth2_service import FatSecretOAuth2Service

# Carica le variabili d'ambiente
load_dotenv()

# Inizializza il servizio FatSecret
fatsecret_service = FatSecretOAuth2Service()

# Test API FatSecret per verificare l'autenticazione e gli scope
def test_authentication_and_scopes():
    # Test con diversi scope
    scopes = ["basic", "barcode", "premier"]
    print("Test di autenticazione FatSecret con diversi scope:\n")
    
    for scope in scopes:
        print(f"Tentativo di ottenere token con scope '{scope}'...")
        token = fatsecret_service.get_oauth2_token(scope=scope)
        
        if token:
            print(f"Token ottenuto con successo per scope '{scope}'")
            # Mostra i primi 20 caratteri del token per verifica
            print(f"   Token: {token[:20]}...")
        else:
            print(f"Impossibile ottenere token per scope '{scope}'")
    
    print("\n" + "-"*50 + "\n")
    
    # Usa il token basic per una ricerca di test
    print("Test di ricerca alimenti con scope 'basic':\n")
    token = fatsecret_service.get_oauth2_token(scope="basic")
    
    if not token:
        print("Impossibile ottenere token per scope 'basic'")
        return
    
    # Prepara la richiesta per la ricerca
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Usa l'endpoint foods.search che dovrebbe funzionare con scope basic
    search_params = {
        "method": "foods.search",
        "search_expression": "pizza",
        "max_results": 3,
        "format": "json"
    }
    
    try:
        print("Effettuando richiesta di ricerca alimenti...")
        search_response = requests.get(
            "https://platform.fatsecret.com/rest/server.api",
            params=search_params,
            headers=headers
        )
        
        print(f"Stato risposta: {search_response.status_code}")
        
        if search_response.status_code == 200:
            result = search_response.json()
            print("Risposta ricevuta con successo!")
            print("\nRisultati (limitati):\n")
            # Mostra una versione ridotta del risultato per non intasare l'output
            if "foods" in result and "food" in result["foods"]:
                food_count = len(result["foods"]["food"])
                print(f"Trovati {food_count} alimenti. Primi 2 risultati:")
                for i, food in enumerate(result["foods"]["food"][:2]):
                    print(f"\n{i+1}. {food.get('food_name', 'N/A')}")
                    print(f"   - ID: {food.get('food_id', 'N/A')}")
                    print(f"   - Descrizione: {food.get('food_description', 'N/A')}")
            else:
                print("Nessun risultato trovato o formato inatteso")
        else:
            print(f"Errore nella richiesta: {search_response.status_code}")
            print(f"Dettagli: {search_response.text}")
    except Exception as e:
        print(f"Errore durante la ricerca: {str(e)}")
    
    print("\n" + "-"*50 + "\n")
    
    # Test dell'API NLP con scope premier invece di nlp
    print("Test API NLP con scope 'premier':\n")
    
    # Ottieni un token con scope premier
    nlp_token = fatsecret_service.get_oauth2_token(scope="premier")
    
    if not nlp_token:
        print("Impossibile ottenere token per scope 'premier', test NLP API non possibile")
        return
    
    # Prepara gli headers per la richiesta NLP
    nlp_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {nlp_token}"
    }
    
    user_input = "Ho mangiato una pizza margherita e una coca cola"
    nlp_payload = {
        "user_input": user_input,
        "region": "Italy",
        "language": "it",
        "include_food_data": True,
        "eaten_foods": []
    }
    
    try:
        print(f"Input: '{user_input}'")
        print("Effettuando richiesta all'API NLP...")
        nlp_response = requests.post(
            "https://platform.fatsecret.com/rest/natural-language-processing/v1",
            headers=nlp_headers,
            json=nlp_payload
        )
        
        print(f"Stato risposta: {nlp_response.status_code}")
        
        if nlp_response.status_code == 200:
            nlp_result = nlp_response.json()
            print("Risposta ricevuta con successo!")
            print("\nRisultati:\n")
            print(json.dumps(nlp_result, indent=2, ensure_ascii=False))
        else:
            print(f"Errore nella richiesta NLP: {nlp_response.status_code}")
            print(f"Dettagli: {nlp_response.text}")
            print("\nPossibili cause di errore:")
            print("1. L'indirizzo IP potrebbe non essere registrato nel portale FatSecret")
            print("2. Lo scope 'premier' potrebbe non includere l'accesso all'API NLP")
            print("3. Le credenziali potrebbero essere errate o scadute")
    except Exception as e:
        print(f"Errore durante l'elaborazione NLP: {str(e)}")

# Esegui i test
print("="*70)
print("DIAGNOSTICA COMPLETA API FATSECRET")
print("="*70)
test_authentication_and_scopes()
