import os
import json
import time
import asyncio
import re
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

# Configurazione logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Importa i servizi
# Sostituiamo il vecchio servizio FatSecret con il nuovo servizio OAuth 2.0
from services.fatsecret_oauth2_service import search_foods as fatsecret_search, find_id_for_barcode
from services.usda_food_service import USDAFoodService

# Configurazione
CACHE_DIR = "cache"
CACHE_TTL_DAYS = 7  # Durata della cache in giorni
MAX_RESULTS = 10    # Numero massimo di risultati da restituire

class HybridFoodSearch:
    """Servizio ibrido di ricerca alimenti che utilizza FatSecret e USDA API.
    
    Questa implementazione priorizza FatSecret come fonte primaria per la sua velocità
    e alto tasso di successo, particolarmente con alimenti italiani.
    USDA viene utilizzato come fallback e fonte di dati nutrizionali dettagliati.
    """
    
    def __init__(self):
        """Inizializza il servizio ibrido."""
        # Inizializza il servizio USDA
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = os.getenv("USDA_API_KEY", "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm")
        
        # Crea la directory cache se non esiste
        os.makedirs(CACHE_DIR, exist_ok=True)
        
        # Mappa dei sinonimi italiani -> inglesi per migliorare le ricerche
        self.italian_synonyms = {
            "parmigiano": "parmesan",
            "mozzarella": "mozzarella cheese",
            "prosciutto crudo": "prosciutto",
            "prosciutto cotto": "cooked ham",
            "gorgonzola": "blue cheese",
            "lasagne": "lasagna",
            "tiramisù": "tiramisu",
            "caffè": "coffee"
        }
    
    async def search(self, query: str, max_results: int = 10, detailed: bool = False) -> Dict:
        """Esegue una ricerca ibrida utilizzando FatSecret e USDA.
        
        Args:
            query: Termine di ricerca
            max_results: Numero massimo di risultati
            detailed: Se True, recupera informazioni nutrizionali dettagliate
        
        Returns:
            Dizionario con i risultati e metadati
        """
        start_time = time.time()
        search_metadata = {
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "sources_used": []
        }
        
        # Log dettagliato per debugging
        logger = logging.getLogger(__name__)
        logger.info(f"Ricerca avviata per query: '{query}', max_results: {max_results}, detailed: {detailed}")
        
        # 1. Verifica nella cache
        cached_results = self._check_cache(query)
        if cached_results:
            search_metadata["source"] = "cache"
            search_metadata["cached_timestamp"] = cached_results.get("timestamp")
            logger.info(f"Risultati trovati nella cache per '{query}'")
            return {
                "results": cached_results.get("results", [])[:max_results],
                "metadata": search_metadata
            }
        
        normalized_results = []
        
        # 2. Applica sinonimi se necessario
        search_query = query
        for italian, english in self.italian_synonyms.items():
            if italian.lower() in query.lower():
                search_query = query.lower().replace(italian.lower(), english)
                search_metadata["translated_query"] = search_query
                logger.info(f"Query tradotta da '{query}' a '{search_query}'")
                break
        
        # 3. Cerca prima con FatSecret
        try:
            # Esegui la ricerca in modo sincrono
            logger.info(f"Chiamata a FatSecret per '{search_query}'")
            fatsecret_results = fatsecret_search(search_query, max_results=max_results*2)
            logger.info(f"Ricevuti {len(fatsecret_results)} risultati da FatSecret")
            logger.debug(f"Risultati grezzi da FatSecret: {fatsecret_results}")
            
            search_metadata["sources_used"].append("fatsecret")
            
            if fatsecret_results and len(fatsecret_results) > 0:
                normalized_results = self._normalize_fatsecret_results(fatsecret_results)
                logger.info(f"Normalizzati {len(normalized_results)} risultati da FatSecret")
        except Exception as e:
            search_metadata["fatsecret_error"] = str(e)
            logger.error(f"Errore durante la ricerca con FatSecret: {e}")
        
        # 4. Se non abbiamo risultati da FatSecret o vogliamo dati dettagliati, prova USDA
        if not normalized_results or detailed:
            try:
                usda_response = await self.usda_service.search_food(search_query, page_size=max_results*2)
                search_metadata["sources_used"].append("usda")
                
                if "foods" in usda_response and len(usda_response["foods"]) > 0:
                    usda_normalized = self._normalize_usda_results(usda_response["foods"])
                    
                    # Se non abbiamo risultati da FatSecret, usa USDA
                    if not normalized_results:
                        normalized_results = usda_normalized
                    # Altrimenti arricchisci i risultati FatSecret con dati USDA
                    elif detailed:
                        normalized_results = self._merge_results(normalized_results, usda_normalized)
            except Exception as e:
                search_metadata["usda_error"] = str(e)
                logger.error(f"Errore durante la ricerca con USDA: {e}")
        
        # 5. Salva nella cache e restituisci i risultati
        if normalized_results:
            self._save_to_cache(query, normalized_results)
        
        search_metadata["elapsed_time"] = time.time() - start_time
        search_metadata["result_count"] = len(normalized_results)
        
        return {
            "results": normalized_results[:max_results],
            "metadata": search_metadata
        }
    
    async def get_food_by_barcode(self, barcode: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti utilizzando un codice a barre.
        
        Args:
            barcode: Il codice a barre da cercare (formato GTIN-13)
            max_results: Numero massimo di risultati da restituire
            
        Returns:
            Risultati della ricerca con informazioni sull'alimento
        """
        logging.info(f"Ricerca alimento con codice a barre: {barcode}")
        
        # Verifica se abbiamo risultati in cache
        cache_key = f"barcode_{barcode}"
        cached_results = self._check_cache(cache_key)
        if cached_results:
            logging.info(f"Risultati trovati in cache per codice a barre {barcode}")
            return cached_results.get("results", {})
        
        try:
            # Prima proviamo con FatSecret
            food_id = await self._get_fatsecret_food_id_by_barcode(barcode)
            
            if food_id:
                # Se troviamo un food_id, cerchiamo i dettagli dell'alimento
                logging.info(f"Trovato food_id {food_id} per codice a barre {barcode} su FatSecret")
                
                # Cerca l'alimento usando l'ID trovato
                search_results = await fatsecret_search(food_id, max_results=1, search_type="id")
                
                if search_results and len(search_results) > 0:
                    # Normalizza i risultati nel formato comune
                    foods = self._normalize_fatsecret_results(search_results)
                    
                    # Aggiungi il codice a barre ai risultati
                    for food in foods:
                        food["barcode"] = barcode
                    
                    # Prepara la risposta
                    response = {
                        "foods": foods,
                        "total_results": len(foods),
                        "source": "fatsecret",
                        "success": True
                    }
                    
                    # Salva in cache
                    self._save_to_cache(cache_key, response)
                    
                    return response
            
            # Se FatSecret non ha trovato risultati, proviamo con OpenFoodFacts
            logging.info(f"Nessun risultato trovato su FatSecret, provo con OpenFoodFacts per il codice a barre {barcode}")
            
            # Importiamo qui per evitare dipendenze circolari
            from openfoodfacts_service import OpenFoodFactsService
            
            # Creiamo un'istanza del servizio OpenFoodFacts
            off_service = OpenFoodFactsService()
            
            # Cerchiamo il prodotto tramite codice a barre
            off_result = await off_service.get_food_by_barcode(barcode)
            
            if off_result and "food" in off_result:
                # Convertiamo il risultato nel formato standard
                food_data = off_result["food"]
                
                # Creiamo un oggetto food nel formato standard
                food = {
                    "food_id": barcode,  # Usiamo il barcode come ID
                    "food_name": food_data.get("food_name", ""),
                    "food_description": food_data.get("food_description", ""),
                    "brand": food_data.get("brand_name", ""),
                    "serving_id": "0",
                    "serving_description": food_data.get("serving_description", "100g"),
                    "serving_url": "",
                    "barcode": barcode,
                    "nutrients": food_data.get("nutrients", {})
                }
                
                # Prepara la risposta
                response = {
                    "foods": [food],
                    "total_results": 1,
                    "source": "openfoodfacts",
                    "success": True
                }
                
                # Salva in cache
                self._save_to_cache(cache_key, response)
                
                logging.info(f"Trovato risultato su OpenFoodFacts per codice a barre {barcode}")
                return response
            
            # Se arriviamo qui, non abbiamo trovato risultati né su FatSecret né su OpenFoodFacts
            logging.info(f"Nessun risultato trovato per il codice a barre {barcode} su nessun servizio")
            
            # Risposta vuota
            return {
                "foods": [],
                "total_results": 0,
                "source": "unknown",
                "success": False,
                "error": f"Nessun alimento trovato per il codice a barre {barcode}"
            }
            
        except Exception as e:
            logging.error(f"Errore nella ricerca per codice a barre: {str(e)}")
            return {
                "foods": [],
                "total_results": 0,
                "source": "unknown",
                "success": False,
                "error": f"Errore durante la ricerca: {str(e)}"
            }
    
    async def _get_fatsecret_food_id_by_barcode(self, barcode: str) -> Optional[str]:
        """
        Ottiene l'ID dell'alimento da FatSecret dato un codice a barre.
        
        Args:
            barcode: Il codice a barre in formato GTIN-13
        
        Returns:
            L'ID dell'alimento se trovato, altrimenti None
        """
        try:
            # Utilizziamo l'endpoint food.find_id_for_barcode di FatSecret
            # Questo è implementato nel modulo fatsecret_oauth2_service
            food_id = await find_id_for_barcode(barcode)
            return food_id
        except Exception as e:
            logging.error(f"Errore nella ricerca dell'ID per codice a barre: {e}")
            return None
    
    def _check_cache(self, query: str) -> Optional[Dict]:
        """Verifica se esistono risultati nella cache per la query specificata."""
        cache_key = self._get_cache_key(query)
        cache_file = os.path.join(CACHE_DIR, f"{cache_key}.json")
        
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cache_data = json.load(f)
                
                # Verifica se la cache è ancora valida
                timestamp = datetime.fromisoformat(cache_data.get("timestamp", ""))
                if datetime.now() - timestamp < timedelta(days=CACHE_TTL_DAYS):
                    return cache_data
            except:
                pass
        
        return None
    
    def _save_to_cache(self, query: str, results: List) -> None:
        """Salva i risultati nella cache."""
        cache_key = self._get_cache_key(query)
        cache_file = os.path.join(CACHE_DIR, f"{cache_key}.json")
        
        try:
            cache_data = {
                "query": query,
                "timestamp": datetime.now().isoformat(),
                "results": results
            }
            
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, ensure_ascii=False, indent=2)
        except:
            pass  # Ignora errori di caching
    
    def _get_cache_key(self, query: str) -> str:
        """Genera una chiave cache per la query."""
        # Normalizza e pulisci la query per usarla come nome file
        key = query.lower().strip()
        key = ''.join(c if c.isalnum() else '_' for c in key)
        return key
    
    def _normalize_fatsecret_results(self, results: List) -> List[Dict]:
        """Normalizza i risultati da FatSecret nel formato comune."""
        normalized_results = []

        # Elenco di brand italiani comuni
        italian_brands = [
            "Barilla", "Mulino Bianco", "De Cecco", "Rummo", "Divella", "La Molisana", 
            "Voiello", "Garofalo", "Buitoni", "Rana", "Galbani", "Granarolo", "Parmalat",
            "Ferrero", "Kinder", "Nutella", "Pavesi", "Bauli", "Motta", "Perugina",
            "Lavazza", "Illy", "Kimbo", "Algida", "Sammontana", "Bertolli", "Cirio",
            "Mutti", "Star", "Knorr", "Findus", "Simmenthal", "Rio Mare", "Valfrutta",
            "Yoga", "San Benedetto", "Ferrarelle", "San Pellegrino", "Levissima"
        ]
        
        for item in results:
            food_id = item.get("food_id", "")
            food_name = item.get("food_name", "")
            food_type = item.get("food_type", "Generic")
            desc = item.get("food_description", "")
            
            # Estrai nutrienti dalla descrizione
            nutrients = {}
            
            # Estrazione calorie
            if "Calories:" in desc:
                calories_part = desc.split('Calories:')[1].split('|')[0].strip() if '|' in desc.split('Calories:')[1] else desc.split('Calories:')[1].strip()
                nutrients["calories"] = calories_part.replace('kcal', '').strip()
            
            # Estrazione grassi
            if "Fat:" in desc:
                fat_part = desc.split('Fat:')[1].split('|')[0].strip() if '|' in desc.split('Fat:')[1] else desc.split('Fat:')[1].strip()
                nutrients["fat"] = fat_part.replace('g', '').strip()
            
            # Estrazione carboidrati
            if "Carbs:" in desc:
                carbs_part = desc.split('Carbs:')[1].split('|')[0].strip() if '|' in desc.split('Carbs:')[1] else desc.split('Carbs:')[1].strip()
                nutrients["carbs"] = carbs_part.replace('g', '').strip()
            
            # Estrazione proteine
            if "Protein:" in desc:
                protein_part = desc.split('Protein:')[1].split('|')[0].strip() if '|' in desc.split('Protein:')[1] else desc.split('Protein:')[1].strip()
                nutrients["protein"] = protein_part.replace('g', '').strip()
            
            # Rileva brand dal nome dell'alimento o dal food_type
            brand = None
            
            # 1. Prima controlla se food_type è un brand (non Generic)
            if food_type != "Generic" and food_type != "Brand":
                brand = food_type
            
            # 2. Poi controlla se il nome dell'alimento contiene un brand italiano noto
            if not brand or brand == "Generic" or brand == "Brand":
                for italian_brand in italian_brands:
                    if italian_brand.lower() in food_name.lower():
                        brand = italian_brand
                        break
            
            # 3. Controlla anche se c'è un pattern "Brand: XYZ" nel nome o nella descrizione
            brand_pattern = re.search(r'brand:\s*([\w\s]+)', food_name.lower() + ' ' + desc.lower())
            if brand_pattern and (not brand or brand == "Generic" or brand == "Brand"):
                brand = brand_pattern.group(1).strip().title()
            
            # Crea l'oggetto normalizzato
            normalized_item = {
                "food_id": food_id,
                "food_name": food_name, 
                "brand": brand,  # Può essere None
                "serving_size": "100",  # Default a 100g
                "serving_unit": "g",
                "image_url": "",  # FatSecret non fornisce immagini
                "nutrition": nutrients,
                "source": "fatsecret"
            }
            
            normalized_results.append(normalized_item)
        
        return normalized_results
    
    def _normalize_usda_results(self, results: List) -> List[Dict]:
        """Normalizza i risultati da USDA in un formato standard."""
        normalized = []
        
        for item in results:
            # Estrai le informazioni nutrizionali
            nutrients = {}
            if "foodNutrients" in item:
                for nutrient in item.get("foodNutrients", []):
                    name = nutrient.get("nutrientName", "").lower()
                    value = nutrient.get("value", 0)
                    
                    if "energy" in name and "kcal" in nutrient.get("unitName", "").lower():
                        nutrients["calories"] = str(value)
                    elif "protein" in name:
                        nutrients["protein"] = str(value)
                    elif "carbohydrate" in name:
                        nutrients["carbs"] = str(value)
                    elif "lipid" in name or "fat" in name:
                        nutrients["fat"] = str(value)
                    elif "fiber" in name:
                        nutrients["fiber"] = str(value)
            
            # Crea il record normalizzato
            normalized.append({
                "food_id": str(item.get('fdcId', '')),
                "food_name": item.get('description', ''),
                "brand": item.get('brand_owner', 'Generic') if item.get('brand_owner') else item.get('brand_name', 'Generic'),
                "source": "usda",
                "nutrition": nutrients,
                "serving_size": f"{item.get('servingSize', '')} {item.get('servingSizeUnit', '')}" if 'servingSize' in item else "100g",
                "original_data": item
            })
        
        return normalized
    
    def _merge_results(self, fatsecret_results: List, usda_results: List) -> List:
        """Combina e arricchisce i risultati di FatSecret con dati USDA."""
        # Strategia semplice: per ogni elemento FatSecret, cerca corrispondenze in USDA
        # e arricchisci con dati nutrizionali aggiuntivi se disponibili
        
        merged = fatsecret_results.copy()
        
        for i, fs_item in enumerate(merged):
            fs_name = fs_item["food_name"].lower()
            
            # Cerca una corrispondenza in USDA
            for usda_item in usda_results:
                usda_name = usda_item["food_name"].lower()
                
                # Verifica se c'è una corrispondenza approssimativa nel nome
                if (fs_name in usda_name or usda_name in fs_name or 
                    (len(fs_name) > 4 and any(word in usda_name for word in fs_name.split() if len(word) > 4))):
                    
                    # Aggiungi nutrienti mancanti da USDA
                    for key, value in usda_item["nutrition"].items():
                        if key not in fs_item["nutrition"] or not fs_item["nutrition"][key]:
                            merged[i]["nutrition"][key] = value
                    
                    # Aggiungi flag che indica che i dati sono stati arricchiti
                    merged[i]["source"] = "hybrid"
                    merged[i]["enriched"] = True
                    
                    # Non cercare altre corrispondenze per questo elemento
                    break
        
        return merged

# Esempio d'uso
async def main():
    service = HybridFoodSearch()
    results = await service.search("parmigiano reggiano", max_results=3, detailed=True)
    
    print(f"Risultati per 'parmigiano reggiano':")
    for item in results["results"]:
        print(f"- {item['food_name']} ({item['source']})")
        print(f"  Nutrienti: {item['nutrition']}")
        print()
    
    print(f"Metadati: {results['metadata']}")

if __name__ == "__main__":
    asyncio.run(main())
