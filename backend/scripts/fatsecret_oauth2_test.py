import requests
import json
import time
import base64

# Credenziali FatSecret corrette
CLIENT_ID = "ec9eca046ec44dd281a8c3c409211f7d"  # Questa è la OAuth 2.0 Client ID
CLIENT_SECRET = "b187d2b15882439a80084b0e01b8c20f"  # Questa è la OAuth 2.0 Client Secret

# Endpoint OAuth 2.0
TOKEN_URL = "https://oauth.fatsecret.com/connect/token"
API_URL = "https://platform.fatsecret.com/rest/server.api"

# Timeout impostato a 5 secondi
TIMEOUT = 5

def test_oauth2_token():
    """Prova a ottenere un access token usando OAuth 2.0"""
    try:
        print("Test di autenticazione OAuth 2.0...")
        start_time = time.time()
        
        # Crea le credenziali base64 per l'autenticazione
        credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        # Prepara gli header per la richiesta del token
        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        # Prepara i dati per la richiesta del token
        data = {
            "grant_type": "client_credentials",
            "scope": "basic"
        }
        
        # Invia la richiesta per ottenere un token
        print("Invio richiesta per ottenere un token...")
        response = requests.post(TOKEN_URL, headers=headers, data=data, timeout=TIMEOUT)
        elapsed = time.time() - start_time
        
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get("access_token")
            token_type = token_data.get("token_type")
            expires_in = token_data.get("expires_in")
            
            print(f"\nToken ottenuto con successo!")
            print(f"Token type: {token_type}")
            print(f"Expires in: {expires_in} secondi")
            
            # Restituisci il token per test successivi
            return access_token
        else:
            print(f"Errore nella richiesta del token: {response.text[:200]}")
            return None
    
    except requests.exceptions.Timeout:
        print(f"Timeout nella richiesta del token dopo {TIMEOUT} secondi")
        return None
    except Exception as e:
        print(f"Errore nella richiesta del token: {str(e)}")
        return None

def test_search_with_oauth2(access_token, query="pizza"):
    """Testa la ricerca usando OAuth 2.0"""
    if access_token is None:
        print("\nImpossibile effettuare la ricerca: token non disponibile")
        return False
    
    try:
        print(f"\nTest di ricerca OAuth 2.0 per '{query}'...")
        start_time = time.time()
        
        # Prepara gli header per la richiesta di ricerca
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Prepara i parametri per la ricerca
        params = {
            "method": "foods.search",
            "search_expression": query,
            "format": "json",
            "max_results": 3
        }
        
        # Invia la richiesta di ricerca
        print("Invio richiesta di ricerca...")
        response = requests.get(API_URL, headers=headers, params=params, timeout=TIMEOUT)
        elapsed = time.time() - start_time
        
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            # Verifica se ci sono risultati
            if 'foods' in result and 'food' in result['foods']:
                foods = result['foods']['food']
                foods_list = foods if isinstance(foods, list) else [foods]
                count = len(foods_list)
                
                print(f"\nRicerca riuscita! Trovati {count} risultati")
                
                # Mostra i primi 3 risultati
                for i, food in enumerate(foods_list[:3]):
                    print(f"\n{i+1}. {food.get('food_name', 'Nome sconosciuto')}")
                    if 'food_description' in food:
                        print(f"   Descrizione: {food['food_description'][:100]}...")
                    if 'brand_name' in food and food['brand_name']:
                        print(f"   Marca: {food['brand_name']}")
                
                return True
            else:
                print(f"\nRicerca senza risultati o formato non riconosciuto")
                print(f"Contenuto risposta: {json.dumps(result)[:200]}...")
                return False
        else:
            print(f"\nErrore nella ricerca: {response.text[:200]}")
            return False
    
    except requests.exceptions.Timeout:
        print(f"Timeout nella ricerca dopo {TIMEOUT} secondi")
        return False
    except Exception as e:
        print(f"Errore nella ricerca: {str(e)}")
        return False

# Esegui i test
if __name__ == "__main__":
    print("==== Test di FatSecret con OAuth 2.0 ====\n")
    
    # Test per ottenere il token
    access_token = test_oauth2_token()
    
    # Se abbiamo ottenuto un token, testa anche la ricerca
    if access_token:
        # Test di ricerca con "pizza"
        test_search_with_oauth2(access_token, "pizza")
        
        # Test di ricerca con "pasta"
        test_search_with_oauth2(access_token, "pasta")
    else:
        print("\nImpossibile procedere con i test di ricerca: token non ottenuto")
        
    print("\n==== Test completato ====\n")
