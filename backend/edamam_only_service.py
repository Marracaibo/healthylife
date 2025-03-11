import os
import logging
from typing import Dict, Any, Optional, List
import aiohttp
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione del logging
logger = logging.getLogger(__name__)

class EdamamOnlyService:
    """
    Servizio che utilizza esclusivamente l'API Edamam per la ricerca di alimenti,
    ottimizzato per fornire risultati dettagliati e completi.
    """
    
    def __init__(self):
        # Ottieni le credenziali dall'ambiente
        self.app_id = os.getenv("EDAMAM_APP_ID")
        self.app_key = os.getenv("EDAMAM_APP_KEY")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.warning("Credenziali Edamam mancanti. Imposta EDAMAM_APP_ID e EDAMAM_APP_KEY nel file .env")
        else:
            logger.info(f"Inizializzato EdamamOnlyService con App ID: {self.app_id}")
        
        # Imposta l'ID utente per l'header Edamam-Account-User
        self.user_id = "ikhh"  # Username visualizzato nell'interfaccia Edamam
        
        # URL di base per l'API Food Database (non Recipe Search)
        self.base_url = "https://api.edamam.com/api/food-database/v2/parser"
        self.search_url = self.base_url
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti nel database Edamam utilizzando la Food Database API.
        
        Args:
            query: La query di ricerca
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Un dizionario contenente i risultati della ricerca
        """
        logger.info(f"EdamamOnly: Ricerca di '{query}' con max risultati: {max_results}")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.error("Credenziali Edamam mancanti. Impossibile effettuare la ricerca.")
            return {"results": []}
        
        try:
            # Parametri per la richiesta - modifichiamo per la Food Database API
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "ingr": query,          # il parametro è 'ingr' non 'q' per Food Database API
                "nutrition-type": "cooking"
            }
            
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            async with aiohttp.ClientSession() as session:
                # Aumentiamo il timeout a 30 secondi
                async with session.get(self.search_url, params=params, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        hits = data.get("hints", [])
                        logger.info(f"EdamamOnly: Ricevuti {len(hits)} risultati")
                        
                        # Trasforma i risultati nel formato standard
                        results = []
                        
                        for hit in hits[:max_results]:
                            food = hit.get("food", {})
                            
                            # Estrai i nutrienti principali
                            nutrients = food.get("nf_serving_size_qty", 0)
                            
                            # Calcola i macronutrienti
                            protein = food.get("nf_protein", 0)
                            fat = food.get("nf_total_fat", 0)
                            carbs = food.get("nf_total_carbohydrate", 0)
                            
                            # Estrai le etichette dietetiche
                            health_labels = []
                            diet_labels = []
                            
                            # Crea un oggetto risultato standardizzato
                            result = {
                                "id": food.get("uri", "").split("#food_")[-1],
                                "name": food.get("label", ""),
                                "description": "",
                                "image": "",
                                "calories": food.get("nf_calories", 0),
                                "servings": nutrients,
                                "protein": round(protein, 1),
                                "fat": round(fat, 1),
                                "carbs": round(carbs, 1),
                                "diet_labels": diet_labels,
                                "health_labels": health_labels
                            }
                            
                            results.append(result)
                        
                        return {
                            "query": query,
                            "count": len(results),
                            "results": results
                        }
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nella ricerca EdamamOnly: Status {response.status}")
                        logger.error(f"Dettagli errore: {error_text}")
                        return {"results": []}
        except Exception as e:
            logger.error(f"Errore durante la ricerca EdamamOnly: {str(e)}")
            return {"results": []}
    
    async def get_food(self, food_id: str) -> Optional[Dict[str, Any]]:
        """
        Ottiene i dettagli di un alimento specifico utilizzando l'API Food Database di Edamam.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            
        Returns:
            Un dizionario contenente i dettagli dell'alimento
        """
        logger.info(f"EdamamOnly: Recupero dettagli per ID: {food_id}")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.error("Credenziali Edamam mancanti. Impossibile recuperare i dettagli.")
            return None
        
        try:
            # URL per i dettagli della ricetta
            url = f"{self.base_url}?ingr={food_id}"
            
            # Parametri per la richiesta
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "nutrition-type": "cooking"
            }
            
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"EdamamOnly: Dettagli ricevuti per ID: {food_id}")
                        
                        food = data.get("hints", [{}])[0].get("food", {})
                        
                        # Estrai i nutrienti
                        nutrients = food.get("nf_serving_size_qty", 0)
                        
                        # Calcola i macronutrienti
                        protein = food.get("nf_protein", 0)
                        fat = food.get("nf_total_fat", 0)
                        carbs = food.get("nf_total_carbohydrate", 0)
                        
                        # Estrai i nutrienti specifici
                        cholesterol = food.get("nf_cholesterol", 0)
                        sodium = food.get("nf_sodium", 0)
                        calcium = food.get("nf_calcium", 0)
                        magnesium = food.get("nf_magnesium", 0)
                        potassium = food.get("nf_potassium", 0)
                        iron = food.get("nf_iron", 0)
                        
                        # Estrai le etichette dietetiche
                        health_labels = []
                        diet_labels = []
                        
                        # Crea un oggetto dettaglio standardizzato
                        food_details = {
                            "id": food.get("uri", "").split("#food_")[-1],
                            "name": food.get("label", ""),
                            "description": "",
                            "image": "",
                            "calories": food.get("nf_calories", 0),
                            "servings": nutrients,
                            "protein": round(protein, 1),
                            "fat": round(fat, 1),
                            "carbs": round(carbs, 1),
                            "cholesterol": round(cholesterol, 1),
                            "sodium": round(sodium, 1),
                            "calcium": round(calcium, 1),
                            "magnesium": round(magnesium, 1),
                            "potassium": round(potassium, 1),
                            "iron": round(iron, 1),
                            "diet_labels": diet_labels,
                            "health_labels": health_labels,
                            "ingredients": []
                        }
                        
                        return food_details
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nel recupero dettagli EdamamOnly: Status {response.status}")
                        logger.error(f"Dettagli errore: {error_text}")
                        return None
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli EdamamOnly: {str(e)}")
            return None
