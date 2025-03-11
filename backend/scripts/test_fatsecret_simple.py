import os
import json
import time
import base64
import urllib.parse
import requests
import hmac
import hashlib

# FatSecret API credentials
CONSUMER_KEY = "b187d2b15882439a80084b0e01b8c20f"  # OAuth 1.0 Consumer Key
CONSUMER_SECRET = "ec9eca046ec44dd281a8c3c409211f7d"  # OAuth 1.0 Consumer Secret
API_URL = "https://platform.fatsecret.com/rest/server.api"

def generate_oauth_params(method):
    """Generate the OAuth parameters needed for the request"""
    timestamp = str(int(time.time()))
    nonce = base64.b64encode(str(timestamp).encode()).decode().strip("=")
    
    oauth_params = {
        'oauth_consumer_key': CONSUMER_KEY,
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': timestamp,
        'oauth_nonce': nonce,
        'oauth_version': '1.0',
        'format': 'json',
        'method': method
    }
    
    return oauth_params

def create_signature(method, url, params):
    """Create OAuth 1.0 signature"""
    # Sort the parameters
    sorted_params = sorted(params.items())
    
    # Create parameter string
    param_string = "&".join([f"{urllib.parse.quote(str(k))}={urllib.parse.quote(str(v))}" for k, v in sorted_params])
    
    # Create signature base string
    signature_base_string = "&".join([
        "POST",
        urllib.parse.quote(url, safe=""),
        urllib.parse.quote(param_string, safe="")
    ])
    
    # Create signing key
    signing_key = f"{urllib.parse.quote(CONSUMER_SECRET, safe="")}&"
    
    # Generate signature
    signature = base64.b64encode(
        hmac.new(
            signing_key.encode(),
            signature_base_string.encode(),
            hashlib.sha1
        ).digest()
    ).decode()
    
    return signature

def test_search_foods(query="apple"):
    """Basic test for FatSecret API foods.search"""
    print(f"\nTesting FatSecret API for query: '{query}'")
    try:
        # Generate OAuth parameters
        oauth_params = generate_oauth_params("foods.search")
        
        # Add search parameters
        search_params = {
            'search_expression': query,
            'max_results': 5,
            'page_number': 0
        }
        
        # Combine all parameters
        all_params = {**oauth_params, **search_params}
        
        # Generate signature
        signature = create_signature("POST", API_URL, all_params)
        all_params['oauth_signature'] = signature
        
        print("\nAPI Parameters:")
        for k, v in all_params.items():
            print(f"  {k}: {v}")
        
        # Make the request
        print("\nSending request to FatSecret API...")
        response = requests.post(API_URL, data=all_params)
        
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("\nResponse (first 500 characters):")
            print(response.text[:500] + "..." if len(response.text) > 500 else response.text)
            return True
        else:
            print(f"Error: {response.text}")
            return False
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False

# Test with OAuth 2.0
def test_oauth2():
    print("\nTesting OAuth 2.0 authentication")
    try:
        # FatSecret API OAuth 2.0 endpoints
        token_url = "https://oauth.fatsecret.com/connect/token"
        
        # Your OAuth 2.0 credentials
        client_id = "b187d2b15882439a80084b0e01b8c20f"  # Assuming this is your client ID
        client_secret = "ec9eca046ec44dd281a8c3c409211f7d"
        
        # Create Basic Auth credentials
        credentials = f"{client_id}:{client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        # Set up the headers and data for token request
        headers = {
            'Authorization': f'Basic {encoded_credentials}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'grant_type': 'client_credentials',
            'scope': 'basic'
        }
        
        print("Requesting access token...")
        token_response = requests.post(token_url, headers=headers, data=data)
        
        print(f"Status code: {token_response.status_code}")
        
        if token_response.status_code == 200:
            token_data = token_response.json()
            print("Access token received!")
            print(f"Token type: {token_data.get('token_type')}")
            print(f"Expires in: {token_data.get('expires_in')} seconds")
            
            # Try a search with the access token
            access_token = token_data.get('access_token')
            auth_headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Endpoint for search
            search_url = "https://platform.fatsecret.com/rest/server.api"
            search_params = {
                'method': 'foods.search',
                'search_expression': 'apple',
                'format': 'json'
            }
            
            print("\nTesting search with OAuth 2.0 token...")
            search_response = requests.get(search_url, headers=auth_headers, params=search_params)
            
            print(f"Search status code: {search_response.status_code}")
            
            if search_response.status_code == 200:
                print("\nSearch Response (first 500 characters):")
                print(search_response.text[:500] + "..." if len(search_response.text) > 500 else search_response.text)
                return True
            else:
                print(f"Search Error: {search_response.text}")
                return False
        else:
            print(f"Token Error: {token_response.text}")
            return False
    
    except Exception as e:
        print(f"OAuth 2.0 Exception: {str(e)}")
        return False

# Run the tests
if __name__ == "__main__":
    print("=== FatSecret API Test Script ===")
    print("This script will test both OAuth 1.0 and OAuth 2.0 methods")
    
    # Test OAuth 1.0
    print("\n=== Testing OAuth 1.0 ===")
    oauth1_result = test_search_foods()
    
    # Test OAuth 2.0
    print("\n=== Testing OAuth 2.0 ===")
    oauth2_result = test_oauth2()
    
    # Summary
    print("\n=== Test Results ===")
    print(f"OAuth 1.0 Test: {'PASSED' if oauth1_result else 'FAILED'}")
    print(f"OAuth 2.0 Test: {'PASSED' if oauth2_result else 'FAILED'}")
    
    if not oauth1_result and not oauth2_result:
        print("\nPossibili cause di errore:")
        print("1. Indirizzo IP non aggiunto alla whitelist di FatSecret")
        print("2. Credenziali errate o scadute")
        print("3. Problemi di connessione alla rete")
        print("4. Account FatSecret con restrizioni o limiti")
    elif oauth1_result:
        print("\nConsiglio: Usa OAuth 1.0 per le tue chiamate API")
    elif oauth2_result:
        print("\nConsiglio: Usa OAuth 2.0 per le tue chiamate API")
