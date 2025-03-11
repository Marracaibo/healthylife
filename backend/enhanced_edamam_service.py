import os
import logging
from typing import Dict, Any, Optional, List
import aiohttp
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione del logging
logger = logging.getLogger(__name__)

class EnhancedEdamamService:
    """
    Servizio migliorato per l'API Edamam che fornisce risultati dettagliati
    con informazioni nutrizionali complete e etichette dietetiche.
    """
    
    def __init__(self):
        # URL e endpoint per API Recipe Search
        self.SEARCH_ENDPOINT = "https://api.edamam.com/api/recipes/v2"
        self.FOOD_DETAILS_ENDPOINT = "https://api.edamam.com/api/recipes/v2"
        
        # Credenziali
        self.app_id = os.getenv("EDAMAM_APP_ID")
        self.app_key = os.getenv("EDAMAM_APP_KEY")
        self.user_id = "ikhh"  # Username visualizzato nell'interfaccia Edamam
        
        # URL di base per l'API Recipe Search
        self.search_url = self.SEARCH_ENDPOINT
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.warning("Credenziali Edamam mancanti. Imposta EDAMAM_APP_ID e EDAMAM_APP_KEY nel file .env")
        else:
            logger.info(f"Inizializzato EnhancedEdamamService con App ID: {self.app_id}")
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict:
        """
        Cerca alimenti tramite API Edamam.
        
        Args:
            query: Il termine di ricerca
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Un dizionario con i risultati della ricerca formattati secondo le aspettative del test.
        """
        try:
            logger.info(f"Ricerca alimenti con API Edamam: {query}")
            
            # Preparazione parametri
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "q": query,  # Cambiato da 'ingr' a 'q' per la ricerca
                "type": "public",
                "random": "false"
            }
            
            # Intestazioni per l'autenticazione
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            # Richiesta all'API Edamam
            logger.debug(f"Request URL: {self.search_url}")
            async with aiohttp.ClientSession() as session:
                async with session.get(self.search_url, params=params, headers=headers) as response:
                    # Controllo risposta
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Errore API Edamam ({response.status}): {error_text}")
                        return {"results": [], "query": query}
                        
                    # Elaborazione risultati
                    results = await response.json()
                    
                    # Per il test specifico, restituisci nel formato originale
                    if "hits" in results:
                        formatted_list = []
                        for hit in results["hits"][:max_results]:
                            recipe = hit.get("recipe", {})
                            
                            # Estrai i nutrienti principali
                            nutrients = recipe.get("totalNutrients", {})
                            
                            # Calcola i macronutrienti
                            protein = nutrients.get("PROCNT", {}).get("quantity", 0)
                            fat = nutrients.get("FAT", {}).get("quantity", 0)
                            carbs = nutrients.get("CHOCDF", {}).get("quantity", 0)
                            
                            # Estrai le etichette dietetiche
                            health_labels = recipe.get("healthLabels", [])
                            diet_labels = recipe.get("dietLabels", [])
                            cautions = recipe.get("cautions", [])
                            
                            # Combina tutte le etichette
                            all_labels = diet_labels + health_labels
                            
                            # Crea un oggetto risultato dettagliato
                            result = {
                                "id": recipe.get("uri", "").split("#recipe_")[-1],  # Estrai l'ID dalla URI
                                "name": recipe.get("label", ""),
                                "description": f"Fonte: {recipe.get('source', '')}",
                                "image": recipe.get("image", ""),
                                "calories": recipe.get("calories", 0),
                                "servings": recipe.get("yield", 1),
                                "macros": {
                                    "protein": round(protein, 1),
                                    "fat": round(fat, 1),
                                    "carbs": round(carbs, 1)
                                },
                                "nutrients": {
                                    "cholesterol": round(nutrients.get("CHOLE", {}).get("quantity", 0), 1),
                                    "sodium": round(nutrients.get("NA", {}).get("quantity", 0), 1),
                                    "calcium": round(nutrients.get("CA", {}).get("quantity", 0), 1),
                                    "magnesium": round(nutrients.get("MG", {}).get("quantity", 0), 1),
                                    "potassium": round(nutrients.get("K", {}).get("quantity", 0), 1),
                                    "iron": round(nutrients.get("FE", {}).get("quantity", 0), 1)
                                },
                                "health_labels": all_labels,
                                "cautions": cautions,
                                "source": "edamam"
                            }
                            
                            formatted_list.append(result)
                        
                        return {
                            "query": query,
                            "results": formatted_list
                        }
                    else:
                        # Se l'API non restituisce risultati, restituisci una lista vuota
                        return {"results": [], "query": query}
                    
        except Exception as e:
            logger.error(f"Errore durante la ricerca di alimenti: {str(e)}", exc_info=True)
            return {"results": [], "query": query}
    
    async def get_food(self, food_id: str) -> Optional[Dict[str, Any]]:
        """
        Ottiene i dettagli completi di un alimento specifico utilizzando l'API Recipe Search di Edamam.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            
        Returns:
            Un dizionario contenente i dettagli completi dell'alimento
        """
        logger.info(f"EnhancedEdamam: Recupero dettagli per ID: {food_id}")
        
        # Verifica che le credenziali siano disponibili
        if not self.app_id or not self.app_key:
            logger.error("Credenziali Edamam mancanti. Impossibile recuperare i dettagli.")
            return None
        
        try:
            # URL per i dettagli della ricetta
            url = f"{self.FOOD_DETAILS_ENDPOINT}/{food_id}"
            
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
                        logger.info(f"EnhancedEdamam: Dettagli ricevuti per ID: {food_id}")
                        
                        recipe = data.get("recipe", {})
                        
                        # Estrai i nutrienti
                        nutrients = recipe.get("totalNutrients", {})
                        
                        # Calcola i macronutrienti
                        protein = nutrients.get("PROCNT", {}).get("quantity", 0)
                        fat = nutrients.get("FAT", {}).get("quantity", 0)
                        carbs = nutrients.get("CHOCDF", {}).get("quantity", 0)
                        
                        # Estrai le etichette dietetiche
                        health_labels = recipe.get("healthLabels", [])
                        diet_labels = recipe.get("dietLabels", [])
                        cautions = recipe.get("cautions", [])
                        
                        # Combina tutte le etichette
                        all_labels = diet_labels + health_labels
                        
                        # Crea un oggetto dettaglio completo
                        food_details = {
                            "id": food_id,
                            "name": recipe.get("label", ""),
                            "description": f"Fonte: {recipe.get('source', '')}",
                            "image": recipe.get("image", ""),
                            "calories": recipe.get("calories", 0),
                            "servings": recipe.get("yield", 1),
                            "macros": {
                                "protein": round(protein, 1),
                                "fat": round(fat, 1),
                                "carbs": round(carbs, 1)
                            },
                            "nutrients": {
                                "cholesterol": round(nutrients.get("CHOLE", {}).get("quantity", 0), 1),
                                "sodium": round(nutrients.get("NA", {}).get("quantity", 0), 1),
                                "calcium": round(nutrients.get("CA", {}).get("quantity", 0), 1),
                                "magnesium": round(nutrients.get("MG", {}).get("quantity", 0), 1),
                                "potassium": round(nutrients.get("K", {}).get("quantity", 0), 1),
                                "iron": round(nutrients.get("FE", {}).get("quantity", 0), 1)
                            },
                            "diet_labels": all_labels,
                            "cautions": cautions,
                            "ingredients": recipe.get("ingredientLines", []),
                            "source": "edamam"
                        }
                        
                        return food_details
                    else:
                        error_text = await response.text()
                        logger.error(f"Errore nel recupero dettagli EnhancedEdamam: Status {response.status}")
                        logger.error(f"Dettagli errore: {error_text}")
                        return None
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli EnhancedEdamam: {str(e)}")
            return None

    async def get_food_details(self, food_id: str) -> Dict:
        """
        Ottiene i dettagli completi di un alimento specifico utilizzando l'API Edamam.
        
        Args:
            food_id: L'ID Edamam dell'alimento
            
        Returns:
            Un dizionario contenente i dettagli nutrizionali dell'alimento.
        """
        try:
            logger.info(f"Recupero dettagli dell'alimento con ID: {food_id}")
            
            # Prepariamo i parametri per la richiesta Edamam
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "foodId": food_id,
                "measure": "serving"  # Utilizziamo serving come unità di misura predefinita
            }
            
            # Intestazioni per l'autenticazione
            headers = {
                "Edamam-Account-User": self.user_id
            }
            
            # Effettuiamo la richiesta a Edamam - utilizziamo la FOOD_DETAILS_ENDPOINT
            food_details_url = "https://api.edamam.com/api/food-database/v2/parser"
            logger.debug(f"Request URL: {food_details_url}")
            
            # Utilizziamo la sessione HTTP già inizializzata
            if not hasattr(self, 'session') or self.session is None or self.session.closed:
                self.session = aiohttp.ClientSession()
                
            async with self.session.get(food_details_url, params=params, headers=headers) as response:
                # Verifica che la risposta sia valida
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Errore API Edamam ({response.status}): {error_text}")
                    return None
                    
                # Elabora la risposta
                data = await response.json()
                if not data or "ingredients" not in data or not data["ingredients"]:
                    logger.warning(f"Nessun dato valido restituito per l'alimento: {food_id}")
                    return None
                
                # Estrai i dati rilevanti dalla risposta Edamam
                ingredients = data["ingredients"][0]  # Prendiamo il primo ingrediente
                parsed = ingredients.get("parsed", [{}])[0] if "parsed" in ingredients and ingredients["parsed"] else {}
                
                # Se non ci sono dati parsati, prova a usare i food del primo ingrediente
                if not parsed and "food" in ingredients:
                    parsed = ingredients["food"]
                
                # Verifica che abbiamo dati validi
                if not parsed:
                    logger.warning(f"Impossibile elaborare i dati per l'alimento: {food_id}")
                    return None
                
                # Costruisci la risposta
                result = {
                    "id": food_id,
                    "label": parsed.get("label", parsed.get("food", "")),
                    "nutrients": parsed.get("nutrients", {}),
                    "category": parsed.get("category", "Generic"),
                    "categoryLabel": parsed.get("categoryLabel", "Generic"),
                    "image": parsed.get("image", None),
                    "brand": parsed.get("brand", ""),
                    "foodContentsLabel": parsed.get("foodContentsLabel", ""),
                    "serving_qty": 1,
                    "serving_unit": parsed.get("measure", "serving")
                }
                
                logger.debug(f"Dettagli recuperati per l'alimento {food_id}: {result}")
                return result
        except Exception as e:
            logger.error(f"Errore durante il recupero dei dettagli dell'alimento: {str(e)}", exc_info=True)
            return None

    async def _format_search_results(self, results, max_results=10) -> Dict:
        """
        Formatta i risultati di ricerca nel formato atteso dal frontend.
        
        Args:
            results: I risultati grezzi dall'API Edamam
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Un dizionario formattato con i risultati della ricerca.
        """
        try:
            foods = []
            
            # Elabora ogni risultato
            for hit in results.get("hints", [])[:max_results]:
                if "food" not in hit:
                    continue
                    
                food = hit["food"]
                measures = hit.get("measures", [])
                
                # Trova la misura preferita (preferendo serving, quindi 100g)
                serving_measure = None
                for measure in measures:
                    if measure.get("label", "").lower() == "serving":
                        serving_measure = measure
                        break
                
                # Se non troviamo serving, usiamo la prima misura o 100g come fallback
                if not serving_measure and measures:
                    serving_measure = measures[0]
                
                nutrients = food.get("nutrients", {})
                calories = round(nutrients.get("ENERC_KCAL", 0))
                protein = round(nutrients.get("PROCNT", 0), 1)
                fat = round(nutrients.get("FAT", 0), 1)
                carbs = round(nutrients.get("CHOCDF", 0), 1)
                
                # Estrai le etichette alimentari
                health_labels = food.get("healthLabels", [])
                diet_labels = food.get("dietLabels", [])
                
                # Formatta le etichette in un formato leggibile
                formatted_labels = []
                
                # Aggiungi etichette dietetiche
                for label in diet_labels:
                    formatted_labels.append(label.replace("_", " ").title())
                
                # Mappa le etichette di salute in etichette più user-friendly
                health_label_map = {
                    "VEGAN": "Vegan",
                    "VEGETARIAN": "Vegetarian",
                    "PESCATARIAN": "Pescatarian",
                    "EGG_FREE": "Egg Free",
                    "DAIRY_FREE": "Dairy Free",
                    "PEANUT_FREE": "Peanut Free",
                    "TREE_NUT_FREE": "Tree Nut Free",
                    "SOY_FREE": "Soy Free",
                    "FISH_FREE": "Fish Free",
                    "SHELLFISH_FREE": "Shellfish Free",
                    "PORK_FREE": "Pork Free",
                    "RED_MEAT_FREE": "Red Meat Free",
                    "CRUSTACEAN_FREE": "Crustacean Free",
                    "CELERY_FREE": "Celery Free",
                    "MUSTARD_FREE": "Mustard Free",
                    "SESAME_FREE": "Sesame Free",
                    "LUPINE_FREE": "Lupine Free",
                    "MOLLUSK_FREE": "Mollusk Free",
                    "ALCOHOL_FREE": "Alcohol Free",
                    "KOSHER": "Kosher",
                    "SUGAR_CONSCIOUS": "Sugar Conscious",
                    "LOW_SUGAR": "Low Sugar",
                    "LOW_POTASSIUM": "Low Potassium",
                    "KIDNEY_FRIENDLY": "Kidney Friendly",
                    "KETO_FRIENDLY": "Keto Friendly",
                    "LOW_SODIUM": "Low Sodium"
                }
                
                for label in health_labels:
                    if label in health_label_map:
                        formatted_labels.append(health_label_map[label])
                
                # Estrai micronutrienti
                micronutrients = {
                    "cholesterol": round(nutrients.get("CHOLE", 0)),
                    "sodium": round(nutrients.get("NA", 0)),
                    "calcium": round(nutrients.get("CA", 0)),
                    "magnesium": round(nutrients.get("MG", 0)),
                    "potassium": round(nutrients.get("K", 0)),
                    "iron": round(nutrients.get("FE", {}).get("quantity", 0), 1)
                }
                
                # Crea l'oggetto del risultato
                food_item = {
                    "food_id": food.get("foodId", ""),
                    "food_name": food.get("label", ""),
                    "brand_name": food.get("brand", ""),
                    "food_description": f"Per serving - Calories: {calories}kcal | Fat: {fat}g | Carbs: {carbs}g | Protein: {protein}g",
                    "food_url": "",
                    "food_image": food.get("image", ""),
                    "calories": calories,
                    "serving_description": serving_measure.get("label", "Serving") if serving_measure else "Serving",
                    "macros": {
                        "protein": protein,
                        "fat": fat,
                        "carbs": carbs
                    },
                    "micronutrients": micronutrients,
                    "health_labels": formatted_labels
                }
                
                foods.append(food_item)
            
            # Restituisci nel formato atteso dal frontend
            return {
                "foods": {
                    "food": foods,
                    "max_results": max_results,
                    "total_results": len(foods),
                    "page_number": 0
                }
            }
            
        except Exception as e:
            logger.error(f"Errore durante la formattazione dei risultati della ricerca: {str(e)}", exc_info=True)
            return {"foods": {"food": [], "max_results": max_results, "total_results": 0, "page_number": 0}}
