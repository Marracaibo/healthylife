import os
import logging
import requests
import json
from typing import Dict, Any, List, Optional
from services.fatsecret_oauth2_service import FatSecretOAuth2Service

# Configurazione del logger
logger = logging.getLogger(__name__)

class FatSecretNLPService:
    """Servizio per interagire con l'API NLP di FatSecret"""
    
    def __init__(self):
        """Inizializza il servizio FatSecret NLP"""
        self.oauth_service = FatSecretOAuth2Service()
        self.api_url = "https://platform.fatsecret.com/rest/natural-language-processing/v1"
        self.use_mock = os.environ.get("USE_MOCK_FATSECRET", "false").lower() == "true"
        
        # Mock data per test offline
        self.mock_responses = {
            "pizza": {
                "foods": [
                    {
                        "id": "12345",
                        "name": "Pizza Margherita",
                        "brand": "Pizzeria Napoletana",
                        "description": "Pizza tradizionale con pomodoro, mozzarella e basilico",
                        "serving_description": "1 fetta (150g)",
                        "nutrition": {
                            "calories": 285,
                            "protein": 12.3,
                            "carbohydrate": 35.6,
                            "fat": 9.8
                        }
                    }
                ]
            },
            "coca cola": {
                "foods": [
                    {
                        "id": "67890",
                        "name": "Coca Cola",
                        "brand": "Coca-Cola Company",
                        "description": "Bevanda gassata",
                        "serving_description": "1 lattina (330ml)",
                        "nutrition": {
                            "calories": 139,
                            "protein": 0,
                            "carbohydrate": 35,
                            "fat": 0
                        }
                    }
                ]
            },
            "pasta": {
                "foods": [
                    {
                        "id": "23456",
                        "name": "Pasta al pomodoro",
                        "brand": "Generic",
                        "description": "Pasta con salsa di pomodoro",
                        "serving_description": "1 porzione (200g)",
                        "nutrition": {
                            "calories": 320,
                            "protein": 10,
                            "carbohydrate": 60,
                            "fat": 5
                        }
                    }
                ]
            }
        }
    
    def process_user_input(self, user_input: str, region: str = "Italy", language: str = "it") -> Dict[str, Any]:
        """Elabora l'input dell'utente tramite l'API NLP di FatSecret
        
        Args:
            user_input: Testo dell'utente da elaborare
            region: Regione per la localizzazione dei risultati
            language: Lingua dell'input
            
        Returns:
            Dictionary con i risultati elaborati
        """
        logger.info(f"Elaborazione input utente: '{user_input}' (regione: {region}, lingua: {language})")
        
        # Prima prova con l'API reale se possibile
        if not self.use_mock:
            try:
                # Prova ad ottenere un token per l'API NLP con scope premier invece di nlp
                token = self.oauth_service.get_oauth2_token(scope="premier")
                
                # Se non riesci, prova con scope basic
                if not token:
                    logger.warning("Impossibile ottenere token per scope 'premier', tentativo con scope 'basic'")
                    token = self.oauth_service.get_oauth2_token(scope="basic")
                
                if token:
                    # Prepara la richiesta per l'API NLP
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {token}"
                    }
                    
                    payload = {
                        "user_input": user_input,
                        "region": region,
                        "language": language,
                        "include_food_data": True,
                        "eaten_foods": []
                    }
                    
                    # Effettua la richiesta all'API NLP
                    response = requests.post(
                        self.api_url,
                        json=payload,
                        headers=headers
                    )
                    
                    # Verifica la risposta
                    if response.status_code == 200:
                        return response.json()
                    else:
                        logger.error(f"Errore API NLP: {response.status_code} - {response.text}")
                else:
                    logger.error("Impossibile ottenere token per FatSecret API")
            
            except Exception as e:
                logger.error(f"Errore durante l'elaborazione con API NLP: {str(e)}")
        else:
            logger.info("Modalità mock abilitata per l'API NLP")
        
        # Se siamo arrivati qui, l'API reale non ha funzionato o è disabilitata, usa il mock
        return self._get_mock_response(user_input)
    
    def _get_mock_response(self, user_input: str) -> Dict[str, Any]:
        """Genera una risposta simulata per l'input dell'utente
        
        Args:
            user_input: Testo dell'utente da elaborare
            
        Returns:
            Dictionary con i risultati simulati
        """
        logger.info(f"Generazione risposta mock per input: '{user_input}'")
        
        # Normalizza l'input e trova parole chiave
        lower_input = user_input.lower()
        
        # Trova corrispondenze con le parole chiave nel mock database
        found_foods = []
        
        for keyword, response in self.mock_responses.items():
            if keyword.lower() in lower_input:
                found_foods.extend(response["foods"])
        
        # Se non sono stati trovati alimenti, restituisci un risultato vuoto
        if not found_foods:
            return {"foods": [], "status": "mock_response"}
        
        return {"foods": found_foods, "status": "mock_response"}

# Istanza singleton del servizio
fatsecret_nlp_service = FatSecretNLPService()
