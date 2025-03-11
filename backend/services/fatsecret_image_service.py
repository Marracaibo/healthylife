import os
import logging
import requests
import json
import base64
from typing import Dict, Any, List, Optional
from services.fatsecret_oauth2_service import FatSecretOAuth2Service

# Configurazione del logger
logger = logging.getLogger(__name__)

class FatSecretImageService:
    """Servizio per interagire con l'API Image Recognition di FatSecret"""
    
    def __init__(self):
        """Inizializza il servizio FatSecret Image Recognition"""
        self.oauth_service = FatSecretOAuth2Service()
        self.api_url = "https://platform.fatsecret.com/rest/image-recognition/v1"
        self.use_mock = os.environ.get("USE_MOCK_FATSECRET", "false").lower() == "true"
        
        # Mock data per test offline
        self.mock_responses = {
            "mock_image": {
                "food_response": [
                    {
                        "food_id": 38821,
                        "food_entry_name": "Pizza Margherita",
                        "eaten": {
                            "singular_description": "",
                            "plural_description": "",
                            "units": 1.0,
                            "metric_description": "g",
                            "total_metric_amount": 100.0,
                            "per_unit_metric_amount": 100,
                            "total_nutritional_content": {
                                "calories": "250",
                                "carbohydrate": "28.5",
                                "protein": "10.6",
                                "fat": "10.8",
                                "saturated_fat": "4.5",
                                "fiber": "1.8",
                                "sodium": "615"
                            }
                        },
                        "suggested_serving": {
                            "serving_id": 38646,
                            "serving_description": "1 slice (100g)",
                            "metric_serving_description": "g",
                            "metric_measure_amount": 100.000,
                            "number_of_units": "1"
                        }
                    }
                ]
            }
        }
    
    def process_image(self, image_base64: str, region: str = "Italy", language: str = "it", 
    eaten_foods: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Elabora un'immagine tramite l'API Image Recognition di FatSecret
        
        Args:
            image_base64: Immagine codificata in base64
            region: Regione per la localizzazione dei risultati
            language: Lingua dell'output
            eaten_foods: Lista opzionale di alimenti già consumati per migliorare l'accuratezza
            
        Returns:
            Dictionary con i risultati elaborati
        """
        logger.info(f"Elaborazione immagine (regione: {region}, lingua: {language})")
        
        # Se eaten_foods è None, inizializza una lista vuota
        if eaten_foods is None:
            eaten_foods = []
        
        # Prima prova con l'API reale se possibile
        if not self.use_mock:
            try:
                # Ottieni un token per l'API Image Recognition usando scope premier
                token = self.oauth_service.get_oauth2_token(scope="premier")
                
                # Se non riesci, prova con scope basic
                if not token:
                    logger.warning("Impossibile ottenere token per scope 'premier', tentativo con scope 'basic'")
                    token = self.oauth_service.get_oauth2_token(scope="basic")
                
                if token:
                    # Prepara la richiesta per l'API Image Recognition
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {token}"
                    }
                    
                    payload = {
                        "image_b64": image_base64,
                        "region": region,
                        "language": language,
                        "include_food_data": True,
                        "eaten_foods": eaten_foods
                    }
                    
                    # Effettua la richiesta all'API Image Recognition
                    response = requests.post(
                        self.api_url,
                        json=payload,
                        headers=headers
                    )
                    
                    # Verifica la risposta
                    if response.status_code == 200:
                        return response.json()
                    else:
                        logger.error(f"Errore API Image Recognition: {response.status_code} - {response.text}")
                else:
                    logger.error("Impossibile ottenere token per FatSecret API")
            
            except Exception as e:
                logger.error(f"Errore durante l'elaborazione con API Image Recognition: {str(e)}")
        else:
            logger.info("Modalità mock abilitata per l'API Image Recognition")
        
        # Se siamo arrivati qui, l'API reale non ha funzionato o è disabilitata, usa il mock
        return self._get_mock_response()
    
    def _get_mock_response(self) -> Dict[str, Any]:
        """Genera una risposta simulata per il riconoscimento dell'immagine
        
        Returns:
            Dictionary con i risultati simulati
        """
        logger.info("Generazione risposta mock per riconoscimento immagine")
        
        mock_response = self.mock_responses["mock_image"]
        mock_response["status"] = "mock_response"
        
        return mock_response

# Istanza singleton del servizio
fatsecret_image_service = FatSecretImageService()
