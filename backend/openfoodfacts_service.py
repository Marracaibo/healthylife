import aiohttp
import logging
from typing import Dict, Any, List, Optional
import traceback

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenFoodFactsService:
    def __init__(self, country="it"):
        # Utilizziamo l'API globale invece di quella specifica per paese
        self.base_url = "https://world.openfoodfacts.org"
        self.search_url = f"{self.base_url}/cgi/search.pl"
        self.product_url = f"{self.base_url}/api/v0/product"
        logger.info(f"Inizializzato OpenFoodFactsService con base URL: {self.base_url}")
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti nel database Open Food Facts.
        
        Args:
            query: La query di ricerca
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Un dizionario con i risultati della ricerca
        """
        logger.info(f"OpenFoodFacts: Ricerca di '{query}' con max risultati: {max_results}")
        
        try:
            params = {
                "search_terms": query,
                "search_simple": 1,
                "action": "process",
                "json": 1,
                "page_size": max_results
            }
            
            async with aiohttp.ClientSession() as session:
                # Aumentiamo il timeout a 30 secondi
                async with session.get(self.search_url, params=params, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"OpenFoodFacts: Ricevuti {len(data.get('products', []))} risultati")
                        return self._format_search_results(data, max_results)
                    else:
                        logger.error(f"Errore nella ricerca OpenFoodFacts: Status {response.status}")
                        return self._empty_response(max_results)
        except Exception as e:
            logger.error(f"Errore durante la ricerca OpenFoodFacts: {str(e)}")
            logger.error(traceback.format_exc())
            return self._empty_response(max_results)
            
    async def get_food(self, food_id: str) -> Dict[str, Any]:
        """
        Ottiene i dettagli di un alimento specifico tramite il suo ID.
        
        Args:
            food_id: L'ID dell'alimento
            
        Returns:
            Un dizionario con i dettagli dell'alimento
        """
        logger.info(f"OpenFoodFacts: Richiesta dettagli per alimento ID: {food_id}")
        
        try:
            url = f"{self.product_url}/{food_id}.json"
            
            async with aiohttp.ClientSession() as session:
                # Aumentiamo il timeout a 30 secondi
                async with session.get(url, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("status") == 1:  # 1 indica successo
                            logger.info(f"OpenFoodFacts: Dettagli ricevuti per alimento ID: {food_id}")
                            return self._format_food_details(data)
                        else:
                            logger.error(f"OpenFoodFacts: Alimento non trovato con ID: {food_id}")
                            return {}
                    else:
                        logger.error(f"Errore nel recupero dettagli OpenFoodFacts: Status {response.status}")
                        return {}
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli OpenFoodFacts: {str(e)}")
            logger.error(traceback.format_exc())
            return {}
    
    async def get_food_by_barcode(self, barcode: str) -> Dict[str, Any]:
        """
        Ottiene i dettagli di un alimento tramite il suo codice a barre.
        
        Args:
            barcode: Il codice a barre del prodotto (EAN-13, UPC-A, ecc.)
            
        Returns:
            Un dizionario con i dettagli dell'alimento o un dizionario vuoto se non trovato
        """
        logger.info(f"OpenFoodFacts: Ricerca per codice a barre: {barcode}")
        
        try:
            # OpenFoodFacts usa il codice a barre come ID del prodotto
            url = f"{self.product_url}/{barcode}.json"
            
            async with aiohttp.ClientSession() as session:
                # Aumentiamo il timeout a 30 secondi
                async with session.get(url, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("status") == 1:  # 1 indica successo
                            logger.info(f"OpenFoodFacts: Prodotto trovato per codice a barre: {barcode}")
                            return self._format_food_details(data)
                        else:
                            logger.error(f"OpenFoodFacts: Prodotto non trovato per codice a barre: {barcode}")
                            return {}
                    else:
                        logger.error(f"Errore nella ricerca per codice a barre OpenFoodFacts: Status {response.status}")
                        return {}
        except Exception as e:
            logger.error(f"Errore durante la ricerca per codice a barre OpenFoodFacts: {str(e)}")
            logger.error(traceback.format_exc())
            return {}
    
    def _format_search_results(self, data: Dict[str, Any], max_results: int) -> Dict[str, Any]:
        """
        Formatta i risultati della ricerca nel formato standard dell'app.
        
        Args:
            data: I dati grezzi dalla risposta API
            max_results: Numero massimo di risultati
            
        Returns:
            Un dizionario formattato per l'app
        """
        results = []
        
        if "products" in data and data["products"]:
            for product in data["products"][:max_results]:
                if "product_name" in product and product["product_name"]:
                    result = {
                        "id": product.get("code", ""),
                        "name": product.get("product_name", ""),
                        "description": self._format_description(product),
                        "brand": product.get("brands", ""),
                        "calories": self._get_nutrient_value(product, "energy-kcal"),
                        "serving_size": product.get("serving_size", None)
                    }
                    results.append(result)
        
        logger.info(f"OpenFoodFacts: Formattati {len(results)} risultati")
        
        return {
            "results": results,
            "total_results": len(results),
            "page_number": 0,
            "max_results": max_results
        }
        
    def _format_food_details(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Formatta i dettagli di un alimento nel formato standard dell'app.
        
        Args:
            data: I dati grezzi dalla risposta API
            
        Returns:
            Un dizionario formattato per l'app
        """
        if "product" not in data:
            return {}
            
        product = data["product"]
        
        # Estrai i nutrienti
        nutrients = {}
        if "nutriments" in product:
            n = product["nutriments"]
            nutrients = {
                "calories": self._get_nutrient_value(product, "energy-kcal"),
                "fat": n.get("fat_100g"),
                "saturated_fat": n.get("saturated-fat_100g"),
                "carbohydrates": n.get("carbohydrates_100g"),
                "sugars": n.get("sugars_100g"),
                "fiber": n.get("fiber_100g"),
                "proteins": n.get("proteins_100g"),
                "salt": n.get("salt_100g"),
                "sodium": n.get("sodium_100g")
            }
        
        # Formatta il risultato
        result = {
            "food": {
                "food_id": product.get("code", ""),
                "food_name": product.get("product_name", ""),
                "food_description": self._format_description(product),
                "brand_name": product.get("brands", ""),
                "serving_id": "0",  # Non disponibile in OpenFoodFacts
                "serving_description": product.get("serving_size", "100g"),
                "serving_url": "",  # Non disponibile in OpenFoodFacts
                "nutrients": nutrients
            }
        }
        
        return result
        
    def _format_description(self, product: Dict[str, Any]) -> str:
        """
        Crea una descrizione formattata per il prodotto.
        
        Args:
            product: I dati del prodotto
            
        Returns:
            Una stringa formattata con la descrizione
        """
        nutrients = []
        
        if "nutriments" in product:
            n = product["nutriments"]
            if "energy-kcal_100g" in n:
                nutrients.append(f"Calories: {n['energy-kcal_100g']}kcal")
            if "fat_100g" in n:
                nutrients.append(f"Fat: {n['fat_100g']}g")
            if "carbohydrates_100g" in n:
                nutrients.append(f"Carbs: {n['carbohydrates_100g']}g")
            if "proteins_100g" in n:
                nutrients.append(f"Protein: {n['proteins_100g']}g")
        
        if nutrients:
            return f"Per 100g - {' | '.join(nutrients)}"
        return ""
        
    def _get_nutrient_value(self, product: Dict[str, Any], nutrient: str) -> Optional[float]:
        """
        Estrae il valore di un nutriente specifico.
        
        Args:
            product: I dati del prodotto
            nutrient: Il nome del nutriente
            
        Returns:
            Il valore del nutriente o None se non disponibile
        """
        if "nutriments" in product and f"{nutrient}_100g" in product["nutriments"]:
            return product["nutriments"][f"{nutrient}_100g"]
        return None
    
    def _empty_response(self, max_results: int) -> Dict[str, Any]:
        """
        Crea una risposta vuota.
        
        Args:
            max_results: Numero massimo di risultati
            
        Returns:
            Un dizionario vuoto formattato per l'app
        """
        return {
            "results": [],
            "total_results": 0,
            "page_number": 0,
            "max_results": max_results
        }
