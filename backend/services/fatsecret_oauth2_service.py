import os
import logging
import requests
import json
from typing import List, Dict, Any, Optional

# Configurazione del logger
logger = logging.getLogger(__name__)

# Configurazione API FatSecret
FATSECRET_CLIENT_ID = os.environ.get("FATSECRET_CLIENT_ID")
FATSECRET_CLIENT_SECRET = os.environ.get("FATSECRET_CLIENT_SECRET")

# Per debug, se non ci sono le credenziali nelle variabili d'ambiente
if not FATSECRET_CLIENT_ID or not FATSECRET_CLIENT_SECRET:
    logger.warning("Credenziali FatSecret non trovate nelle variabili d'ambiente. Usando valori di default per debug.")
    # Questi sono solo placeholder, non sono credenziali reali
    FATSECRET_CLIENT_ID = "ec9eca046ec44dd281a8c3c409211f7d"
    FATSECRET_CLIENT_SECRET = "4fa804f604ab42dc81c5996da43a4b7b"


class FatSecretOAuth2Service:
    """Servizio per interagire con l'API FatSecret utilizzando OAuth 2.0"""
    
    def __init__(self):
        """Inizializza il servizio FatSecret"""
        self.token = None
        self.token_url = "https://oauth.fatsecret.com/connect/token"
        self.api_url = "https://platform.fatsecret.com/rest/server.api"
        self.client_id = FATSECRET_CLIENT_ID
        self.client_secret = FATSECRET_CLIENT_SECRET
    
    def _get_token(self) -> str:
        """Ottiene un token OAuth 2.0 da FatSecret"""
        try:
            # Prepara l'autenticazione
            auth_data = {
                "grant_type": "client_credentials",
                "scope": "basic barcode nlp"
            }
            
            # Effettua la richiesta per il token
            response = requests.post(
                self.token_url,
                auth=(self.client_id, self.client_secret),
                data=auth_data
            )
            
            # Verifica la risposta
            if response.status_code != 200:
                logger.error(f"Errore nell'ottenere il token: {response.status_code} - {response.text}")
                return None
            
            # Estrai il token
            token_data = response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                logger.error("Token non trovato nella risposta")
                return None
            
            logger.debug(f"Token OAuth 2.0 ottenuto con successo")
            return access_token
            
        except Exception as e:
            logger.error(f"Errore durante l'ottenimento del token: {e}")
            return None
    
    def get_oauth2_token(self, scope: str = "basic") -> str:
        """Ottiene un token OAuth 2.0 con uno scope specifico"""
        try:
            # Prepara l'autenticazione
            auth_data = {
                "grant_type": "client_credentials",
                "scope": scope
            }
            
            # Effettua la richiesta per il token
            response = requests.post(
                self.token_url,
                auth=(self.client_id, self.client_secret),
                data=auth_data
            )
            
            # Verifica la risposta
            if response.status_code != 200:
                logger.error(f"Errore nell'ottenere il token: {response.status_code} - {response.text}")
                return None
                
            # Estrai il token dalla risposta
            token_data = response.json()
            return token_data.get("access_token")
            
        except Exception as e:
            logger.error(f"Errore durante l'ottenimento del token OAuth 2.0: {str(e)}")
            return None
    
    def search_foods(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Cerca alimenti utilizzando l'API FatSecret"""
        logger.info(f"Ricerca alimenti con query: '{query}', max_results: {max_results}")
        
        try:
            # Ottieni il token se non è già disponibile
            if not self.token:
                self.token = self._get_token()
                
            if not self.token:
                logger.error("Impossibile ottenere il token OAuth 2.0")
                return []
            
            # Prepara i parametri per la ricerca
            search_params = {
                "method": "foods.search",
                "search_expression": query,
                "max_results": max_results,
                "format": "json"
            }
            
            # Prepara gli headers con il token
            headers = {
                "Authorization": f"Bearer {self.token}"
            }
            
            # Effettua la richiesta di ricerca
            response = requests.get(
                self.api_url,
                params=search_params,
                headers=headers
            )
            
            # Verifica la risposta
            if response.status_code != 200:
                logger.error(f"Errore nella ricerca: {response.status_code} - {response.text}")
                # Se il token è scaduto, prova a ottenerne uno nuovo
                if response.status_code == 401:
                    logger.info("Token scaduto, ottengo un nuovo token")
                    self.token = self._get_token()
                    if self.token:
                        # Riprova con il nuovo token
                        headers = {"Authorization": f"Bearer {self.token}"}
                        response = requests.get(self.api_url, params=search_params, headers=headers)
                        if response.status_code != 200:
                            logger.error(f"Errore nella ricerca con nuovo token: {response.status_code} - {response.text}")
                            return []
                    else:
                        return []
                else:
                    return []
            
            # Estrai i risultati
            results = response.json()
            
            # Debug: stampa i risultati grezzi
            logger.debug(f"Risultati grezzi: {json.dumps(results, indent=2)}")
            
            # Normalizza i risultati
            return self._normalize_results(results)
            
        except Exception as e:
            logger.error(f"Errore durante la ricerca: {e}")
            return []
    
    def _normalize_results(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Normalizza i risultati dell'API FatSecret"""
        normalized_results = []
        
        try:
            # Verifica se ci sono risultati
            if 'foods' in results and 'food' in results['foods']:
                food_results = results['foods']['food']
                
                # Verifica se è un singolo elemento o una lista
                if not isinstance(food_results, list):
                    food_results = [food_results]
                
                # Processa ogni alimento
                for food in food_results:
                    food_id = food.get("food_id", "")
                    food_name = food.get("food_name", "")
                    
                    # Determina il brand
                    brand = food.get("brand_name", "")
                    if not brand or brand == "":
                        food_type = food.get("food_type", "")
                        brand = food_type if food_type and food_type != "Generic" else "Generic"
                    
                    # Estrai la descrizione
                    description = food.get("food_description", "")
                    
                    # Estrai informazioni nutrizionali dalla descrizione
                    nutrition = {}
                    if description:
                        parts = description.split("|")
                        for part in parts:
                            part = part.strip()
                            if "Calories:" in part:
                                calories = part.replace("Calories:", "").strip()
                                nutrition["calories"] = calories
                            elif "Fat:" in part:
                                fat = part.replace("Fat:", "").strip()
                                nutrition["fat"] = fat
                            elif "Carbs:" in part:
                                carbs = part.replace("Carbs:", "").strip()
                                nutrition["carbs"] = carbs
                            elif "Protein:" in part:
                                protein = part.replace("Protein:", "").strip()
                                nutrition["protein"] = protein
                    
                    # Aggiungi l'alimento normalizzato
                    normalized_results.append({
                        "food_id": food_id,
                        "food_name": food_name,
                        "brand": brand,
                        "description": description,
                        "nutrition": nutrition,
                        "source": "fatsecret"
                    })
            
            return normalized_results
            
        except Exception as e:
            logger.error(f"Errore durante la normalizzazione dei risultati: {e}")
            return []
    
    def get_food_details(self, food_id: str) -> Dict[str, Any]:
        """Ottiene i dettagli di un alimento specifico"""
        logger.info(f"Ottengo dettagli per food_id: {food_id}")
        
        try:
            # Ottieni il token se non è già disponibile
            if not self.token:
                self.token = self._get_token()
                
            if not self.token:
                logger.error("Impossibile ottenere il token OAuth 2.0")
                return {}
            
            # Prepara i parametri per i dettagli
            details_params = {
                "method": "food.get.v2",
                "food_id": food_id,
                "format": "json"
            }
            
            # Prepara gli headers con il token
            headers = {
                "Authorization": f"Bearer {self.token}"
            }
            
            # Effettua la richiesta per i dettagli
            response = requests.get(
                self.api_url,
                params=details_params,
                headers=headers
            )
            
            # Verifica la risposta
            if response.status_code != 200:
                logger.error(f"Errore nell'ottenere i dettagli: {response.status_code} - {response.text}")
                # Se il token è scaduto, prova a ottenerne uno nuovo
                if response.status_code == 401:
                    logger.info("Token scaduto, ottengo un nuovo token")
                    self.token = self._get_token()
                    if self.token:
                        # Riprova con il nuovo token
                        headers = {"Authorization": f"Bearer {self.token}"}
                        response = requests.get(self.api_url, params=details_params, headers=headers)
                        if response.status_code != 200:
                            logger.error(f"Errore nell'ottenere i dettagli con nuovo token: {response.status_code} - {response.text}")
                            return {}
                    else:
                        return {}
                else:
                    return {}
            
            # Estrai i dettagli
            food_data = response.json()
            
            # Debug: stampa i dettagli grezzi
            logger.debug(f"Dettagli grezzi: {json.dumps(food_data, indent=2)}")
            
            # Normalizza i dettagli
            return self._normalize_food_details(food_data)
            
        except Exception as e:
            logger.error(f"Errore durante l'ottenimento dei dettagli: {e}")
            return {}
    
    def _normalize_food_details(self, food_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizza i dettagli di un alimento"""
        try:
            # Verifica se ci sono dati
            if "food" not in food_data:
                return {}
            
            food = food_data["food"]
            food_id = food.get("food_id", "")
            food_name = food.get("food_name", "")
            food_type = food.get("food_type", "")
            brand = food.get("brand_name", "Generic")
            
            # Informazioni nutrizionali dettagliate
            nutrition = {}
            servings = []
            
            if "servings" in food and "serving" in food["servings"]:
                servings_data = food["servings"]["serving"]
                if not isinstance(servings_data, list):
                    servings_data = [servings_data]
                
                servings = servings_data
                
                # Usa la porzione per 100g se disponibile
                std_serving = None
                for s in servings_data:
                    if s.get("serving_description", "").lower() == "100g" or \
                       (s.get("metric_serving_amount", "") == "100" and s.get("metric_serving_unit", "") == "g"):
                        std_serving = s
                        break
                
                # Altrimenti usa la prima porzione
                if not std_serving and servings_data:
                    std_serving = servings_data[0]
                
                if std_serving:
                    nutrition = {
                        "calories": std_serving.get("calories", "0"),
                        "fat": std_serving.get("fat", "0"),
                        "saturated_fat": std_serving.get("saturated_fat", "0"),
                        "polyunsaturated_fat": std_serving.get("polyunsaturated_fat", "0"),
                        "monounsaturated_fat": std_serving.get("monounsaturated_fat", "0"),
                        "carbs": std_serving.get("carbohydrate", "0"),
                        "sugar": std_serving.get("sugar", "0"),
                        "fiber": std_serving.get("fiber", "0"),
                        "protein": std_serving.get("protein", "0"),
                        "sodium": std_serving.get("sodium", "0"),
                        "potassium": std_serving.get("potassium", "0"),
                        "cholesterol": std_serving.get("cholesterol", "0"),
                        "serving_size": std_serving.get("metric_serving_amount", "100"),
                        "serving_unit": std_serving.get("metric_serving_unit", "g"),
                        "serving_description": std_serving.get("serving_description", "100g")
                    }
            
            return {
                "food_id": food_id,
                "food_name": food_name,
                "food_type": food_type,
                "brand": brand,
                "servings": servings,
                "nutrition": nutrition,
                "source": "fatsecret"
            }
            
        except Exception as e:
            logger.error(f"Errore durante la normalizzazione dei dettagli: {e}")
            return {}
    
    def find_id_for_barcode(self, barcode: str) -> Optional[str]:
        """
        Cerca l'ID di un alimento utilizzando il suo codice a barre.
        
        FatSecret supporta i seguenti formati di codici a barre:
        - EAN-13 e EAN-8 (codici a barre europei)
        - UPC-A (Universal Product Code)
        
        Args:
            barcode: Il codice a barre da cercare (formato GTIN-13/EAN-13/UPC-A)
        
        Returns:
            L'ID dell'alimento se trovato, altrimenti None
        """
        try:
            # Ottieni il token se non è già disponibile
            if not self.token:
                self.token = self._get_token()
                
            if not self.token:
                logger.error("Impossibile ottenere il token OAuth 2.0")
                return None
            
            # Prepara i parametri per la ricerca
            search_params = {
                "method": "food.find_id_for_barcode",
                "barcode": barcode,
                "region": "Italy",  # Specifica la regione per i codici a barre italiani
                "format": "json"
            }
            
            # Log dei parametri di ricerca
            logger.info(f"Parametri di ricerca barcode: {search_params}")
            
            # Prepara gli headers con il token
            headers = {
                "Authorization": f"Bearer {self.token}"
            }
            
            # Effettua la richiesta di ricerca
            response = requests.get(
                self.api_url,
                params=search_params,
                headers=headers
            )
            
            # Log della risposta completa per debug
            logger.info(f"Risposta API barcode - Status: {response.status_code}")
            logger.debug(f"Risposta API barcode - Headers: {response.headers}")
            logger.debug(f"Risposta API barcode - Content: {response.text}")
            
            # Verifica la risposta
            if response.status_code != 200:
                logger.error(f"Errore nella ricerca: {response.status_code} - {response.text}")
                # Se il token è scaduto, prova a ottenerne uno nuovo
                if response.status_code == 401:
                    logger.info("Token scaduto, ottengo un nuovo token")
                    self.token = self._get_token()
                    if self.token:
                        # Riprova con il nuovo token
                        headers = {"Authorization": f"Bearer {self.token}"}
                        response = requests.get(self.api_url, params=search_params, headers=headers)
                        if response.status_code != 200:
                            logger.error(f"Errore nella ricerca con nuovo token: {response.status_code} - {response.text}")
                            return None
                    else:
                        return None
                else:
                    return None
            
            # Estrai i risultati
            results = response.json()
            
            # Debug: stampa i risultati grezzi
            logger.debug(f"Risultati grezzi: {json.dumps(results, indent=2)}")
            
            # Normalizza i risultati
            if 'foods' in results and 'food' in results['foods']:
                food_results = results['foods']['food']
                
                # Verifica se è un singolo elemento o una lista
                if not isinstance(food_results, list):
                    food_results = [food_results]
                
                # Restituisci l'ID del primo alimento trovato
                if food_results:
                    return food_results[0].get("food_id", "")
            
            # Controlla se c'è un food_id diretto nella risposta (per food.find_id_for_barcode)
            if 'food_id' in results:
                return results['food_id']
                
            logger.info(f"Nessun risultato trovato per il codice a barre {barcode}")
            return None
            
        except Exception as e:
            logger.error(f"Errore durante la ricerca dell'ID tramite codice a barre: {e}")
            return None


# Istanza singleton del servizio
fatsecret_service = FatSecretOAuth2Service()


# Funzioni di utilità per l'uso diretto
def search_foods(query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Cerca alimenti utilizzando l'API FatSecret"""
    return fatsecret_service.search_foods(query, max_results)


def get_food_details(food_id: str) -> Dict[str, Any]:
    """Ottiene i dettagli di un alimento specifico"""
    return fatsecret_service.get_food_details(food_id)


def find_id_for_barcode(barcode: str) -> Optional[str]:
    """
    Cerca l'ID di un alimento utilizzando il suo codice a barre.
    
    FatSecret supporta i seguenti formati di codici a barre:
    - EAN-13 e EAN-8 (codici a barre europei)
    - UPC-A (Universal Product Code)
    
    Args:
        barcode: Il codice a barre da cercare (formato GTIN-13/EAN-13/UPC-A)
        
    Returns:
        L'ID dell'alimento se trovato, altrimenti None
    """
    try:
        # Ottieni l'ID dell'alimento tramite il servizio FatSecret
        food_id = fatsecret_service.find_id_for_barcode(barcode)
        return food_id
    except Exception as e:
        logger.error(f"Errore nella ricerca dell'ID tramite codice a barre: {e}")
        return None
