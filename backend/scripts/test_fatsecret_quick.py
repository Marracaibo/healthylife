import requests
import time
import json
import base64
import urllib.parse
import hmac
import hashlib

# FatSecret API credentials
CONSUMER_KEY = "b187d2b15882439a80084b0e01b8c20f"
CONSUMER_SECRET = "ec9eca046ec44dd281a8c3c409211f7d"
API_URL = "https://platform.fatsecret.com/rest/server.api"

# Timeout impostato a 5 secondi per ogni richiesta
TIMEOUT = 5

# Massimo numero di tentativi
MAX_RETRIES = 2

def generate_oauth_params(method):
    timestamp = str(int(time.time()))
    nonce = base64.b64encode(str(timestamp).encode()).decode().strip("=")
    
    return {
        'oauth_consumer_key': CONSUMER_KEY,
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': timestamp,
        'oauth_nonce': nonce,
        'oauth_version': '1.0',
        'format': 'json',
        'method': method
    }

def create_signature(method, url, params):
    sorted_params = sorted(params.items())
    param_string = "&".join([f"{urllib.parse.quote(str(k))}={urllib.parse.quote(str(v))}" for k, v in sorted_params])
    
    signature_base_string = "&".join([
        "POST",
        urllib.parse.quote(url, safe=""),
        urllib.parse.quote(param_string, safe="")
    ])
    
    signing_key = f"{urllib.parse.quote(CONSUMER_SECRET, safe="")}&"
    
    signature = base64.b64encode(
        hmac.new(
            signing_key.encode(),
            signature_base_string.encode(),
            hashlib.sha1
        ).digest()
    ).decode()
    
    return signature

def test_fatsecret_api():
    print("\n==== Test Rapido API FatSecret ====\n")
    print("Eseguo un test veloce con timeout di 5 secondi per richiesta...\n")
    
    # Test OAuth 1.0
    try:
        print("Test 1: OAuth 1.0 foods.search")
        start_time = time.time()
        
        # Prepara parametri OAuth
        oauth_params = generate_oauth_params("foods.search")
        search_params = {'search_expression': 'apple', 'max_results': 5}
        all_params = {**oauth_params, **search_params}
        
        # Genera firma
        signature = create_signature("POST", API_URL, all_params)
        all_params['oauth_signature'] = signature
        
        # Invia richiesta con timeout
        response = requests.post(API_URL, data=all_params, timeout=TIMEOUT)
        
        elapsed = time.time() - start_time
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'foods' in result and 'food' in result['foods']:
                foods = result['foods']['food']
                count = len(foods) if isinstance(foods, list) else 1
                print(f"Successo! Trovati {count} risultati")
            else:
                print("Risposta valida ma nessun risultato trovato")
        else:
            print(f"Errore: {response.text[:100]}...")
    
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f"Timeout dopo {elapsed:.2f} secondi")
        print("L'API FatSecret non risponde entro il timeout specificato")
    
    except Exception as e:
        print(f"Errore: {str(e)}")
    
    # Test OAuth 2.0
    try:
        print("\nTest 2: OAuth 2.0 token request")
        start_time = time.time()
        
        # FatSecret API OAuth 2.0 endpoint
        token_url = "https://oauth.fatsecret.com/connect/token"
        
        # Credenziali per Basic Auth
        credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        # Prepara header e dati
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'client_credentials',
            'scope': 'basic'
        }
        
        # Invia richiesta con timeout
        token_response = requests.post(token_url, headers=headers, data=data, timeout=TIMEOUT)
        
        elapsed = time.time() - start_time
        print(f"Tempo impiegato: {elapsed:.2f} secondi")
        print(f"Status: {token_response.status_code}")
        
        if token_response.status_code == 200:
            print("Successo! Token OAuth 2.0 ottenuto")
        else:
            print(f"Errore: {token_response.text[:100]}...")
    
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f"Timeout dopo {elapsed:.2f} secondi")
        print("L'API OAuth 2.0 non risponde entro il timeout specificato")
    
    except Exception as e:
        print(f"Errore: {str(e)}")
    
    print("\n==== Conclusioni ====")
    print("1. Se entrambe le richieste vanno in timeout: Verificare connessione e whitelisting IP")
    print("2. Se OAuth 1.0 funziona ma OAuth 2.0 no: Usa l'approccio OAuth 1.0")
    print("3. Se OAuth 2.0 funziona ma OAuth 1.0 no: Usa l'approccio OAuth 2.0")
    print("4. Se entrambi falliscono con errori (non timeout): Verificare le credenziali")

# Esegui il test con limite di tempo complessivo
if __name__ == "__main__":
    print("Inizio test rapido dell'API FatSecret (max 15 secondi)")
    
    # Imposta un timer complessivo
    overall_start = time.time()
    
    try:
        test_fatsecret_api()
    except Exception as e:
        print(f"\nErrore durante l'esecuzione dei test: {str(e)}")
    
    overall_elapsed = time.time() - overall_start
    print(f"\nTest completato in {overall_elapsed:.2f} secondi")
