import requests
import json
import time
import base64
import urllib.parse
import hmac
import hashlib

# FatSecret API credentials
CONSUMER_KEY = "b187d2b15882439a80084b0e01b8c20f"
CONSUMER_SECRET = "ec9eca046ec44dd281a8c3c409211f7d"
API_URL = "https://platform.fatsecret.com/rest/server.api"

# Timeout impostato a 5 secondi
TIMEOUT = 5

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

def test_search(query):
    try:
        print(f"\nRicerca per: '{query}'")
        start_time = time.time()
        
        # Prepara parametri OAuth
        oauth_params = generate_oauth_params("foods.search")
        search_params = {'search_expression': query, 'max_results': 3}
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
                foods_list = foods if isinstance(foods, list) else [foods]
                count = len(foods_list)
                print(f"Successo! Trovati {count} risultati")
                
                # Mostra i primi 3 risultati
                for i, food in enumerate(foods_list[:3]):
                    print(f"\n{i+1}. {food.get('food_name', 'Nome sconosciuto')}")
                    if 'food_description' in food:
                        print(f"   Descrizione: {food['food_description'][:100]}...")
                    if 'brand_name' in food and food['brand_name']:
                        print(f"   Marca: {food['brand_name']}")
                
                return True
            else:
                print("Risposta valida ma nessun risultato trovato")
                if 'error' in result:
                    print(f"Errore API: {result['error']}")
                return False
        else:
            print(f"Errore: {response.text[:100]}...")
            return False
    
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f"Timeout dopo {elapsed:.2f} secondi")
        return False
    
    except Exception as e:
        print(f"Errore: {str(e)}")
        return False

# Lista di cibi da testare
def test_multiple_searches():
    queries = [
        "pizza",         # Italiano
        "pasta",         # Italiano
        "hamburger",     # Internazionale
        "chicken",       # Ingrediente comune
        "apple"          # Frutta
    ]
    
    success_count = 0
    
    for query in queries:
        if test_search(query):
            success_count += 1
    
    print(f"\nRisultati del test: {success_count}/{len(queries)} ricerche riuscite")

# Esegui il test
if __name__ == "__main__":
    print("===== Test di Ricerca FatSecret =====")
    print("Questo script testa la ricerca di vari cibi tramite l'API FatSecret")
    print("Utilizzo: OAuth 1.0 con timeout di 5 secondi per richiesta")
    
    test_multiple_searches()
