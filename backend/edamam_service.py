import os
import logging
from typing import Dict, Any, Optional, List
import aiohttp
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione del logging
logger = logging.getLogger(__name__)

class EdamamService:
    def __init__(self):
        # Ottieni le credenziali dall'ambiente
        self.app_id = os.getenv("EDAMAM_APP_ID")
        self.app_key = os.getenv("EDAMAM_APP_KEY")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.warning("Credenziali Edamam mancanti. Imposta EDAMAM_APP_ID e EDAMAM_APP_KEY nel file .env")
        else:
            logger.info(f"Inizializzato EdamamService con App ID: {self.app_id}")
        
        # Imposta l'ID utente per l'header Edamam-Account-User
        # Questo è necessario per l'API Meal Planner
        self.user_id = "ikhh"  # Username visualizzato nell'interfaccia Edamam
        
        # URL di base per l'API Recipe Search
        self.base_url = "https://api.edamam.com/api/recipes/v2"
        self.search_url = self.base_url
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti nel database Edamam utilizzando la Recipe Search API.
        
        Args:
            query: La query di ricerca
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Un dizionario contenente i risultati della ricerca
        """
        logger.info(f"Edamam: Ricerca di '{query}' con max risultati: {max_results}")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.error("Credenziali Edamam mancanti. Impossibile effettuare la ricerca.")
            return None
        
        try:
            # Parametri per la richiesta
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "q": query,
                "type": "public",
                "random": "false"
            }
            
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            async with aiohttp.ClientSession() as session:
                # Aumentiamo il timeout a 30 secondi
                async with session.get(self.search_url, params=params, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Edamam: Ricevuti {len(data.get('hits', []))} risultati")
                        
                        # Trasforma i risultati nel formato standard
                        results = []
                        
                        for hit in data.get("hits", [])[:max_results]:
                            recipe = hit.get("recipe", {})
                            
                            # Crea un oggetto risultato standardizzato
                            result = {
                                "id": recipe.get("uri", "").split("#recipe_")[-1],  # Estrai l'ID dalla URI
                                "name": recipe.get("label", ""),
                                "description": f"Calorie: {recipe.get('calories', 0):.0f}",
                                "brand": recipe.get("source", ""),
                                "image": recipe.get("image", ""),
                                "calories": recipe.get("calories", 0),
                                "source": "edamam"
                            }
                            
                            results.append(result)
                        
                        return {
                            "query": query,
                            "results": results
                        }
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nella ricerca Edamam: Status {response.status}")
                        logger.error(f"Dettagli errore: {error_text}")
                        return None
        except Exception as e:
            logger.error(f"Errore durante la ricerca Edamam: {str(e)}")
            return None
    
    async def get_food(self, food_id: str) -> Optional[Dict[str, Any]]:
        """
        Ottiene i dettagli di un alimento specifico utilizzando l'API Recipe Search di Edamam.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            
        Returns:
            Un dizionario contenente i dettagli dell'alimento
        """
        logger.info(f"Edamam: Recupero dettagli per ID: {food_id}")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.error("Credenziali Edamam mancanti. Impossibile recuperare i dettagli.")
            return None
        
        try:
            # URL per i dettagli della ricetta
            url = f"{self.base_url}/{food_id}"
            
            # Parametri per la richiesta
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "type": "public"
            }
            
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Edamam: Dettagli ricevuti per ID: {food_id}")
                        
                        recipe = data.get("recipe", {})
                        
                        # Estrai i nutrienti
                        nutrients = {}
                        total_nutrients = recipe.get("totalNutrients", {})
                        
                        for key, nutrient in total_nutrients.items():
                            nutrients[key] = {
                                "label": nutrient.get("label", ""),
                                "quantity": nutrient.get("quantity", 0),
                                "unit": nutrient.get("unit", "")
                            }
                        
                        # Crea un oggetto dettaglio standardizzato
                        food_details = {
                            "id": food_id,
                            "name": recipe.get("label", ""),
                            "description": f"Fonte: {recipe.get('source', '')}",
                            "brand": recipe.get("source", ""),
                            "image": recipe.get("image", ""),
                            "calories": recipe.get("calories", 0),
                            "servings": [
                                {
                                    "amount": recipe.get("yield", 1),
                                    "description": f"Porzioni: {recipe.get('yield', 1)}",
                                    "nutrients": nutrients
                                }
                            ],
                            "source": "edamam"
                        }
                        
                        return food_details
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nel recupero dettagli Edamam: Status {response.status}")
                        logger.error(f"Dettagli errore: {error_text}")
                        return None
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli Edamam: {str(e)}")
            return None
