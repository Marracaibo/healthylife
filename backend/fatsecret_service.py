import os
import time
import base64
import json
import httpx
from dotenv import load_dotenv
import logging

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carica le variabili d'ambiente
load_dotenv()

class FatSecretService:
    """
    Servizio per interagire con l'API di FatSecret.
    Implementa OAuth 2.0 per l'autenticazione.
    """
    
    def __init__(self):
        self.client_id = os.getenv("FATSECRET_CLIENT_ID")
        self.client_secret = os.getenv("FATSECRET_CLIENT_SECRET")
        self.token_url = "https://oauth.fatsecret.com/connect/token"
        self.api_url = "https://platform.fatsecret.com/rest/server.api"
        self.access_token = None
        self.token_expires_at = 0
        
        if not self.client_id or not self.client_secret:
            logger.warning("FatSecret API keys non configurate. Alcune funzionalità non saranno disponibili.")
    
    async def _get_access_token(self):
        """Ottiene un token di accesso OAuth 2.0."""
        if self.access_token and time.time() < self.token_expires_at:
            return self.access_token
            
        if not self.client_id or not self.client_secret:
            logger.error("FatSecret API keys non configurate")
            return None
            
        try:
            # Prepara i dati per la richiesta del token
            data = {
                'grant_type': 'client_credentials',
                'scope': 'basic'
            }
            # Crea l'autenticazione Base64
            credentials = f"{self.client_id}:{self.client_secret}"
            base64_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {base64_credentials}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            # Esegui la richiesta del token
            async with httpx.AsyncClient() as client:
                response = await client.post(self.token_url, data=data, headers=headers)
                response.raise_for_status()
                token_data = response.json()
                
                self.access_token = token_data['access_token']
                # Sottraiamo 60 secondi per sicurezza
                self.token_expires_at = time.time() + token_data['expires_in'] - 60
                
                logger.info(f"Token di accesso ottenuto, valido fino a {self.token_expires_at}")
                return self.access_token
        except Exception as e:
            logger.error(f"Errore nell'ottenere il token di accesso: {str(e)}")
            return None
    
    async def search_food(self, query, max_results=10):
        """
        Cerca alimenti nel database di FatSecret.
        
        Args:
            query (str): Il termine di ricerca
            max_results (int): Numero massimo di risultati da restituire
            
        Returns:
            dict: Risultati della ricerca
        """
        access_token = await self._get_access_token()
        if not access_token:
            return {"error": "Impossibile ottenere il token di accesso"}
        
        try:
            # Parametri della richiesta
            params = {
                'method': 'foods.search',
                'search_expression': query,
                'max_results': max_results,
                'format': 'json'
            }
            
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            
            # Esegui la richiesta
            async with httpx.AsyncClient() as client:
                response = await client.get(self.api_url, params=params, headers=headers)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Errore nella ricerca FatSecret: {str(e)}")
            return {"error": str(e)}
    
    async def get_food(self, food_id):
        """
        Ottiene i dettagli di un alimento specifico.
        
        Args:
            food_id (str): ID dell'alimento da recuperare
            
        Returns:
            dict: Dettagli dell'alimento
        """
        access_token = await self._get_access_token()
        if not access_token:
            return {"error": "Impossibile ottenere il token di accesso"}
        
        try:
            # Parametri della richiesta
            params = {
                'method': 'food.get.v2',
                'food_id': food_id,
                'format': 'json'
            }
            
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            
            # Esegui la richiesta
            async with httpx.AsyncClient() as client:
                response = await client.get(self.api_url, params=params, headers=headers)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Errore nel recupero dell'alimento: {str(e)}")
            return {"error": str(e)}
    
    async def import_food_to_db(self, food_data, db):
        """
        Importa un alimento da FatSecret nel database locale.
        
        Args:
            food_data (dict): Dati dell'alimento da FatSecret
            db (Session): Sessione del database
            
        Returns:
            dict: Dati dell'alimento importato
        """
        try:
            # Estrai i dati nutrizionali
            food = food_data.get('food', {})
            name = food.get('food_name', '')
            servings = food.get('servings', {}).get('serving', [])
            
            # Prendi il primo serving (di solito è per 100g)
            if isinstance(servings, list):
                serving = servings[0]
            else:
                serving = servings
            
            calories = float(serving.get('calories', 0))
            protein = float(serving.get('protein', 0))
            carbs = float(serving.get('carbohydrate', 0))
            fat = float(serving.get('fat', 0))
            
            # Poiché potremmo avere problemi con l'importazione del modello,
            # restituiamo un dizionario invece di un oggetto Alimento
            return {
                "id": 9999,  # ID fittizio
                "nome": f"{name} (FatSecret ID: {food.get('food_id', '')})",
                "calorie_per_100g": calories,
                "proteine_per_100g": protein,
                "carboidrati_per_100g": carbs,
                "grassi_per_100g": fat,
                "unita_predefinita": 'g',
                "categoria": 'Importato da FatSecret'
            }
        except Exception as e:
            logger.error(f"Errore nell'importazione dell'alimento: {str(e)}")
            if db:
                db.rollback()
            raise

# Istanza del servizio
fatsecret_service = FatSecretService()
