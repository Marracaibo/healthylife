import logging
from typing import Dict, Any

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockFatSecretService:
    """
    Servizio mock per simulare l'API di FatSecret durante lo sviluppo.
    """
    
    def __init__(self):
        self.client_id = "mock_client_id"
        self.client_secret = "mock_client_secret"
        logger.info("Utilizzando servizio FatSecret simulato per lo sviluppo")
    
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Simula la ricerca di alimenti.
        """
        logging.info(f"Mock FatSecret: Ricerca di '{query}' con max risultati: {max_results}")
        
        try:
            # Dati di esempio sempre disponibili
            mock_foods = [
                {
                    "food_id": "33691",
                    "food_name": "Pizza",
                    "food_description": "Per 100g - Calories: 267kcal | Fat: 10.10g | Carbs: 33.98g | Protein: 11.43g",
                    "food_type": "Generic",
                    "food_url": "https://www.fatsecret.com/calories-nutrition/generic/pizza-cheese"
                },
                {
                    "food_id": "35718",
                    "food_name": "Apple",
                    "food_description": "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g",
                    "food_type": "Generic",
                    "food_url": "https://www.fatsecret.com/calories-nutrition/usda/apples"
                },
                {
                    "food_id": "1123",
                    "food_name": "Mela",
                    "food_description": "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g",
                    "food_type": "Generic",
                    "food_url": "https://www.fatsecret.com/calories-nutrition/generic/apple"
                },
                {
                    "food_id": "2345",
                    "food_name": "Pasta",
                    "food_description": "Per 100g - Calories: 157kcal | Fat: 0.93g | Carbs: 30.86g | Protein: 5.76g",
                    "food_type": "Generic",
                    "food_url": "https://www.fatsecret.com/calories-nutrition/generic/pasta-fresh"
                }
            ]
            
            # Se la query è vuota, restituiamo tutti gli alimenti
            if not query:
                logging.info("Query vuota, restituisco tutti gli alimenti")
                filtered_foods = mock_foods[:max_results]
            else:
                # Filtra gli alimenti che contengono la query nel nome (case-insensitive)
                logging.info(f"Filtrando alimenti con query: '{query}'")
                filtered_foods = [food for food in mock_foods if query.lower() in food["food_name"].lower()]
                
            # Limita il numero di risultati
            filtered_foods = filtered_foods[:max_results]
            
            logging.info(f"Trovati {len(filtered_foods)} alimenti")
            logging.debug(f"Alimenti trovati: {filtered_foods}")
            
            # Struttura dati conforme alla risposta reale dell'API FatSecret
            response = {
                "foods": {
                    "food": filtered_foods,
                    "max_results": str(max_results),
                    "page_number": "0",
                    "total_results": str(len(filtered_foods))
                }
            }
            
            # Assicuriamoci che la risposta non sia vuota
            if not filtered_foods:
                logging.warning("Nessun alimento trovato, restituisco risultati di fallback")
                # Aggiungiamo almeno un risultato di fallback
                fallback_food = {
                    "food_id": "35718",
                    "food_name": "Apple (Fallback)",
                    "food_description": "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g",
                    "food_type": "Generic",
                    "food_url": "https://www.fatsecret.com/calories-nutrition/usda/apples"
                }
                response["foods"]["food"] = [fallback_food]
                response["foods"]["total_results"] = "1"
            
            logging.info(f"Restituisco risposta strutturata: {response}")
            return response
            
        except Exception as e:
            logging.error(f"Errore nel mock di ricerca: {str(e)}")
            logging.error(traceback.format_exc())
            return {
                "foods": {
                    "food": [],
                    "max_results": str(max_results),
                    "page_number": "0",
                    "total_results": "0"
                }
            }
    
    async def get_food(self, food_id: str) -> Dict[str, Any]:
        """
        Simula l'ottenimento dei dettagli di un alimento.
        """
        logger.info(f"Ottenimento dettagli simulato per ID: {food_id}")
        
        # Mappa di ID a dati di esempio
        mock_foods = {
            "33691": {
                "food_id": "33691",
                "food_name": "Pizza Margherita",
                "food_type": "Generic",
                "brand_name": "",
                "serving_id": "0",
                "serving_description": "100g",
                "serving_url": "https://example.com/serving/0",
                "metric_serving_amount": 100.0,
                "metric_serving_unit": "g",
                "calories": 271,
                "carbohydrate": 33.0,
                "protein": 11.0,
                "fat": 10.0,
                "saturated_fat": 4.5,
                "polyunsaturated_fat": 1.5,
                "monounsaturated_fat": 3.5,
                "trans_fat": 0.0,
                "cholesterol": 25.0,
                "sodium": 570.0,
                "potassium": 185.0,
                "fiber": 2.3,
                "sugar": 3.5,
                "vitamin_a": 15.0,
                "vitamin_c": 5.0,
                "calcium": 210.0,
                "iron": 1.8
            },
            "9003": {
                "food_id": "9003",
                "food_name": "Mela",
                "food_type": "Generic",
                "brand_name": "",
                "serving_id": "0",
                "serving_description": "1 mela media (182g)",
                "serving_url": "https://example.com/serving/0",
                "metric_serving_amount": 182.0,
                "metric_serving_unit": "g",
                "calories": 95,
                "carbohydrate": 25.0,
                "protein": 0.5,
                "fat": 0.3,
                "saturated_fat": 0.0,
                "polyunsaturated_fat": 0.1,
                "monounsaturated_fat": 0.0,
                "trans_fat": 0.0,
                "cholesterol": 0.0,
                "sodium": 2.0,
                "potassium": 195.0,
                "fiber": 4.4,
                "sugar": 19.0,
                "vitamin_a": 2.0,
                "vitamin_c": 14.0,
                "calcium": 11.0,
                "iron": 0.2
            },
            "20041": {
                "food_id": "20041",
                "food_name": "Pasta",
                "food_type": "Generic",
                "brand_name": "",
                "serving_id": "0",
                "serving_description": "100g (cruda)",
                "serving_url": "https://example.com/serving/0",
                "metric_serving_amount": 100.0,
                "metric_serving_unit": "g",
                "calories": 158,
                "carbohydrate": 31.0,
                "protein": 5.8,
                "fat": 0.9,
                "saturated_fat": 0.2,
                "polyunsaturated_fat": 0.3,
                "monounsaturated_fat": 0.1,
                "trans_fat": 0.0,
                "cholesterol": 0.0,
                "sodium": 6.0,
                "potassium": 58.0,
                "fiber": 1.8,
                "sugar": 0.6,
                "vitamin_a": 0.0,
                "vitamin_c": 0.0,
                "calcium": 7.0,
                "iron": 1.0
            }
        }
        
        # Aggiungi mappature per tutti gli altri alimenti nel database
        for food_id_key in ["1234567", "7654321", "9040", "9316", "9252", "9037", "11529", "11252", "11124", "23000", "10060", "15076", "16409", "20044", "18064", "1026", "1017", "1085", "33692", "33693", "33694", "35001", "35002"]:
            if food_id_key not in mock_foods:
                # Crea una struttura base per questo ID
                mock_foods[food_id_key] = {
                    "food_id": food_id_key,
                    "food_name": "Alimento Generico",
                    "food_type": "Generic",
                    "brand_name": "",
                    "serving_id": "0",
                    "serving_description": "100g",
                    "serving_url": "https://example.com/serving/0",
                    "metric_serving_amount": 100.0,
                    "metric_serving_unit": "g",
                    "calories": 100,
                    "carbohydrate": 10.0,
                    "protein": 5.0,
                    "fat": 5.0,
                    "saturated_fat": 1.0,
                    "polyunsaturated_fat": 1.0,
                    "monounsaturated_fat": 2.0,
                    "trans_fat": 0.0,
                    "cholesterol": 0.0,
                    "sodium": 50.0,
                    "potassium": 100.0,
                    "fiber": 2.0,
                    "sugar": 2.0,
                    "vitamin_a": 5.0,
                    "vitamin_c": 5.0,
                    "calcium": 50.0,
                    "iron": 1.0
                }
        
        if food_id in mock_foods:
            return {"food": mock_foods[food_id]}
        else:
            return {"error": f"Alimento con ID {food_id} non trovato"}
    
    async def import_food_to_db(self, food_data, db=None):
        """
        Simula l'importazione di un alimento nel database locale.
        """
        logger.info("Simulazione importazione alimento nel database locale")
        
        food = food_data.get("food", {})
        
        return {
            "id": int(food.get("food_id", 0)),
            "nome": food.get("food_name", ""),
            "calorie_per_100g": float(food.get("calories", 0)),
            "proteine_per_100g": float(food.get("protein", 0)),
            "carboidrati_per_100g": float(food.get("carbohydrate", 0)),
            "grassi_per_100g": float(food.get("fat", 0)),
            "unita_predefinita": "g",
            "categoria": food.get("food_type", "Altro")
        }

# Istanza del servizio
mock_fatsecret_service = MockFatSecretService()
