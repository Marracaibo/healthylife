import requests
import json
import time
from requests.auth import HTTPBasicAuth

# Credenziali FatSecret corrette
CLIENT_ID = "ec9eca046ec44dd281a8c3c409211f7d"  # OAuth 2.0 Client ID
CLIENT_SECRET = "b187d2b15882439a80084b0e01b8c20f"  # OAuth 2.0 Client Secret

# Endpoint OAuth 2.0 (da documentazione)
TOKEN_URL = "https://oauth.fatsecret.com/connect/token"
API_URL = "https://platform.fatsecret.com/rest/server.api"

# Timeout impostato a 10 secondi
TIMEOUT = 10

def get_oauth2_token():
    """Ottieni un OAuth 2.0 token usando il metodo corretto (Basic Auth)"""
    try:
        print("\nOttengo il token OAuth 2.0 usando Basic Auth...")
        start_time = time.time()
        
        # Prepara l'autenticazione Basic (username=client_id, password=client_secret)
        auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
        
        # Prepara gli header
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        # Prepara i parametri della richiesta
        data = {
            "grant_type": "client_credentials",
            "scope": "basic"
        }
        
        # Esegui la richiesta POST
        print("Invio richiesta al server...")
        response = requests.post(TOKEN_URL, auth=auth, headers=headers, data=data, timeout=TIMEOUT)
        
        elapsed = time.time() - start_time
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            access_token = result.get("access_token")
            token_type = result.get("token_type")
            expires_in = result.get("expires_in")
            
            print("\n✅ Token ottenuto con successo!")
            print(f"Token type: {token_type}")
            print(f"Scadenza: {expires_in} secondi")
            
            return access_token
        else:
            print(f"\n❌ Errore nell'ottenere il token: {response.text}")
            return None
    except Exception as e:
        print(f"\n❌ Eccezione durante la richiesta del token: {str(e)}")
        return None

def search_food_oauth2(token, query="pizza"):
    """Esegui una ricerca di cibo usando OAuth 2.0"""
    if not token:
        print("\nImpossibile eseguire la ricerca: token non disponibile")
        return
    
    try:
        print(f"\nRicerca di '{query}' con OAuth 2.0...")
        start_time = time.time()
        
        # Prepara gli header con il Bearer token
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Prepara i parametri per la ricerca
        params = {
            "method": "foods.search",
            "search_expression": query,
            "format": "json",
            "max_results": 3
        }
        
        # Esegui la richiesta POST (come indicato nella documentazione)
        print("Invio richiesta di ricerca...")
        response = requests.post(API_URL, headers=headers, data=params, timeout=TIMEOUT)
        
        elapsed = time.time() - start_time
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            # Verifica se ci sono risultati
            if 'foods' in result and 'food' in result['foods']:
                foods = result['foods']['food']
                foods_list = foods if isinstance(foods, list) else [foods]
                count = len(foods_list)
                
                print(f"\n✅ Ricerca riuscita! Trovati {count} risultati\n")
                
                # Mostra i primi 3 risultati
                for i, food in enumerate(foods_list[:3]):
                    print(f"{i+1}. {food.get('food_name', 'Nome sconosciuto')}")
                    if 'food_description' in food:
                        print(f"   Descrizione: {food['food_description'][:100]}...")
                    if 'brand_name' in food and food['brand_name']:
                        print(f"   Marca: {food['brand_name']}")
                    print("")
                
                return foods_list
            else:
                print("\n⚠️ Nessun risultato trovato o formato inaspettato")
                print(f"Risposta: {json.dumps(result)[:200]}...")
                return []
        else:
            print(f"\n❌ Errore nella richiesta di ricerca: {response.text}")
            return []
    except Exception as e:
        print(f"\n❌ Eccezione durante la ricerca: {str(e)}")
        return []

# Esegui i test
if __name__ == "__main__":
    print("===== Test di FatSecret con OAuth 2.0 (Implementazione Corretta) =====")
    print("Questo script utilizza il metodo di autenticazione Basic come specificato nella documentazione")
    
    # Ottieni un token OAuth 2.0
    token = get_oauth2_token()
    
    if token:
        # Test di ricerca con diversi cibi
        search_food_oauth2(token, "pizza")
        search_food_oauth2(token, "pasta")
    
    print("\n===== Test completato =====")
