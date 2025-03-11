"""
Servizio ibrido per la ricerca di alimenti

Questo servizio combina USDA FoodData Central come fonte primaria
ed Edamam come backup per fornire risultati completi e affidabili.
"""

import os
import logging
import json
import time
from typing import Dict, List, Any, Optional
import aiohttp
from dotenv import load_dotenv

from services.usda_food_service import USDAFoodService
from edamam_only_service import EdamamOnlyService

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione del logging
logger = logging.getLogger(__name__)

class HybridFoodService:
    """
    Servizio ibrido che utilizza USDA FoodData Central come fonte primaria
    ed Edamam come backup per la ricerca di alimenti.
    """
    
    def __init__(self):
        """Inizializza il servizio ibrido con le API key dalle variabili d'ambiente."""
        # Ottieni le API key dall'ambiente
        self.usda_api_key = os.getenv("USDA_API_KEY", "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm")
        
        # Inizializza i servizi
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = self.usda_api_key
        self.edamam_service = EdamamOnlyService()
        
        # Inizializza la cache
        self.cache = {}
        self.cache_file = "cache/hybrid_food_service_cache.json"
        self._load_cache()
        
        logger.info("Inizializzato HybridFoodService")
    
    def _load_cache(self):
        """Carica la cache da file se esiste."""
        try:
            os.makedirs("cache", exist_ok=True)
            if os.path.exists(self.cache_file):
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self.cache = json.load(f)
                logger.info(f"Cache caricata con {len(self.cache)} elementi")
        except Exception as e:
            logger.error(f"Errore durante il caricamento della cache: {str(e)}")
            self.cache = {}
    
    def _save_cache(self):
        """Salva la cache su file."""
        try:
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(self.cache, f, ensure_ascii=False, indent=2)
            logger.info(f"Cache salvata con {len(self.cache)} elementi")
        except Exception as e:
            logger.error(f"Errore durante il salvataggio della cache: {str(e)}")
    
    async def search_food(self, query: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Cerca alimenti utilizzando USDA come fonte primaria e Edamam come backup.
        
        Args:
            query: La query di ricerca
            use_cache: Se utilizzare la cache per query ripetute
            
        Returns:
            Un dizionario contenente i risultati della ricerca
        """
        original_query = query
        logger.info(f"HybridService: Ricerca di '{query}'")
        
        # Normalizza la query per la cache (minuscolo e senza spazi extra)
        cache_key = query.lower().strip()
        
        # Controlla la cache
        if use_cache and cache_key in self.cache:
            logger.info(f"HybridService: Risultati trovati in cache per '{query}'")
            results = self.cache[cache_key]
            
            # Aggiorna la query nei risultati per mantenere quella originale
            results["query"] = original_query
            return results
        
        try:
            # Prima prova con USDA
            start_time = time.time()
            usda_results = await self.usda_service.search_food(query)
            usda_time = time.time() - start_time
            
            # Se USDA ha trovato risultati
            if usda_results and "foods" in usda_results and usda_results["foods"]:
                logger.info(f"HybridService: Trovati {len(usda_results['foods'])} risultati da USDA in {usda_time:.2f}s")
                
                # Formatta i risultati in un formato standard
                results = {
                    "query": original_query,  # Mantieni la query originale
                    "source": "usda",
                    "total_results": len(usda_results["foods"]),
                    "response_time": usda_time,
                    "results": []
                }
                
                for food in usda_results["foods"]:
                    result = {
                        "id": str(food.get("fdcId", "")),
                        "name": food.get("description", ""),
                        "description": food.get("ingredients", ""),
                        "brand": food.get("brandName", ""),
                        "calories": self._extract_calories(food),
                        "protein": self._extract_protein(food),
                        "carbs": self._extract_carbs(food),
                        "fat": self._extract_fat(food),
                        "source": "usda"
                    }
                    results["results"].append(result)
                
                # Salva nella cache
                if use_cache:
                    self.cache[cache_key] = results
                    self._save_cache()
                
                return results
            
            # Se USDA non ha trovato risultati, prova con Edamam
            logger.info(f"HybridService: Nessun risultato da USDA in {usda_time:.2f}s, provo con Edamam")
            start_time = time.time()
            edamam_results = await self.edamam_service.search_food(query)
            edamam_time = time.time() - start_time
            
            if edamam_results and "results" in edamam_results and edamam_results["results"]:
                logger.info(f"HybridService: Trovati {len(edamam_results['results'])} risultati da Edamam in {edamam_time:.2f}s")
                
                # Formatta i risultati
                results = {
                    "query": original_query,  # Mantieni la query originale
                    "source": "edamam",
                    "total_results": len(edamam_results["results"]),
                    "response_time": usda_time + edamam_time,
                    "results": []
                }
                
                # Aggiungi i risultati formattati
                for item in edamam_results["results"]:
                    # Assicurati che tutti i campi siano presenti e del tipo corretto
                    result = {
                        "id": str(item.get("id", "")),
                        "name": item.get("name", ""),
                        "description": item.get("description", ""),
                        "brand": "",
                        "calories": float(item.get("calories", 0)),
                        "protein": float(item.get("protein", 0)),
                        "carbs": float(item.get("carbs", 0)),
                        "fat": float(item.get("fat", 0)),
                        "source": "edamam"
                    }
                    results["results"].append(result)
                
                # Salva nella cache
                if use_cache:
                    self.cache[cache_key] = results
                    self._save_cache()
                
                return results
            
            # Se nessun servizio ha trovato risultati
            logger.info(f"HybridService: Nessun risultato trovato per '{query}' dopo {usda_time + edamam_time:.2f}s")
            results = {
                "query": original_query,  # Mantieni la query originale
                "source": "none",
                "total_results": 0,
                "response_time": usda_time + edamam_time,
                "results": []
            }
            
            # Salva nella cache anche i risultati vuoti per evitare ricerche ripetute
            if use_cache:
                self.cache[cache_key] = results
                self._save_cache()
            
            return results
            
        except Exception as e:
            logger.error(f"Errore durante la ricerca HybridService: {str(e)}")
            return {
                "query": original_query,  # Mantieni la query originale
                "source": "error",
                "total_results": 0,
                "error": str(e),
                "results": []
            }
    
    async def search_food_from_all_sources(self, query: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Cerca alimenti da tutte le fonti disponibili e combina i risultati.
        
        Args:
            query: La query di ricerca
            use_cache: Se utilizzare la cache per query ripetute
            
        Returns:
            Un dizionario contenente i risultati combinati della ricerca
        """
        original_query = query
        logger.info(f"HybridService: Ricerca combinata di '{query}' da tutte le fonti")
        
        # Normalizza la query per la cache
        cache_key = f"combined_{query.lower().strip()}"
        
        # Controlla la cache
        if use_cache and cache_key in self.cache:
            logger.info(f"HybridService: Risultati combinati trovati in cache per '{query}'")
            results = self.cache[cache_key]
            results["query"] = original_query  # Aggiorna la query con quella originale
            return results
        
        try:
            # Esegui ricerche parallele su entrambe le fonti
            start_time = time.time()
            
            # Ricerca su USDA
            usda_results = await self.usda_service.search_food(query)
            usda_foods = usda_results.get("foods", []) if usda_results else []
            
            # Ricerca su Edamam
            edamam_results = await self.edamam_service.search_food(query)
            edamam_foods = edamam_results.get("results", []) if edamam_results else []
            
            total_time = time.time() - start_time
            
            # Combina i risultati
            combined_results = []
            
            # Aggiungi risultati USDA
            usda_ids = set()
            for food in usda_foods:
                food_id = str(food.get("fdcId", ""))
                usda_ids.add(food_id)
                
                result = {
                    "id": food_id,
                    "name": food.get("description", ""),
                    "description": food.get("ingredients", ""),
                    "brand": food.get("brandName", ""),
                    "calories": self._extract_calories(food),
                    "protein": self._extract_protein(food),
                    "carbs": self._extract_carbs(food),
                    "fat": self._extract_fat(food),
                    "source": "usda"
                }
                combined_results.append(result)
            
            # Aggiungi risultati Edamam (solo quelli non già presenti da USDA)
            for food in edamam_foods:
                # Verifica se questo alimento è già presente nei risultati USDA
                # Confronta per nome perché gli ID sono diversi tra le API
                food_name = food.get("name", "").lower()
                if not any(r.get("name", "").lower() == food_name for r in combined_results):
                    combined_results.append(food)
            
            # Crea il risultato finale
            results = {
                "query": original_query,  # Mantieni la query originale
                "total_results": len(combined_results),
                "usda_results": len(usda_foods),
                "edamam_results": len(edamam_foods),
                "response_time": total_time,
                "foods": combined_results
            }
            
            # Salva nella cache
            if use_cache:
                self.cache[cache_key] = results
                self._save_cache()
            
            logger.info(f"HybridService: Trovati {len(combined_results)} risultati combinati in {total_time:.2f}s")
            return results
            
        except Exception as e:
            logger.error(f"Errore durante la ricerca combinata HybridService: {str(e)}")
            return {
                "query": original_query,  # Mantieni la query originale
                "total_results": 0,
                "usda_results": 0,
                "edamam_results": 0,
                "error": str(e),
                "foods": []
            }
    
    async def get_food(self, food_id: str, source: str = "auto") -> Optional[Dict[str, Any]]:
        """
        Ottiene i dettagli di un alimento specifico.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            source: La fonte da cui recuperare i dettagli ('usda', 'edamam', o 'auto')
            
        Returns:
            Un dizionario contenente i dettagli dell'alimento
        """
        logger.info(f"HybridService: Recupero dettagli per ID: {food_id}, fonte: {source}")
        
        # Controlla la cache
        cache_key = f"details_{source}_{food_id}"
        if cache_key in self.cache:
            logger.info(f"HybridService: Dettagli trovati in cache per ID: {food_id}")
            return self.cache[cache_key]
        
        try:
            # Se la fonte è 'auto', determina la fonte in base al formato dell'ID
            if source == "auto":
                # Gli ID USDA sono numerici
                if food_id.isdigit():
                    source = "usda"
                else:
                    source = "edamam"
            
            # Recupera i dettagli dalla fonte appropriata
            if source == "usda":
                food_details = await self.usda_service.get_food_details(food_id)
                
                if food_details:
                    # Formatta i dettagli in un formato standard
                    details = {
                        "id": food_id,
                        "name": food_details.get("description", ""),
                        "description": food_details.get("ingredients", ""),
                        "brand": food_details.get("brandName", ""),
                        "nutrients": self._extract_nutrients(food_details),
                        "source": "usda"
                    }
                    
                    # Salva nella cache
                    self.cache[cache_key] = details
                    self._save_cache()
                    
                    return details
                
            elif source == "edamam":
                food_details = await self.edamam_service.get_food(food_id)
                
                if food_details:
                    # Salva nella cache
                    self.cache[cache_key] = food_details
                    self._save_cache()
                    
                    return food_details
            
            logger.warning(f"HybridService: Nessun dettaglio trovato per ID: {food_id}, fonte: {source}")
            return None
            
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli HybridService: {str(e)}")
            return None
    
    def _extract_calories(self, food: Dict[str, Any]) -> float:
        """Estrae le calorie da un alimento USDA"""
        try:
            nutrients = food.get("foodNutrients", [])
            for nutrient in nutrients:
                if nutrient.get("nutrientName") == "Energy" and nutrient.get("unitName") == "KCAL":
                    return nutrient.get("value", 0)
            return 0
        except Exception:
            return 0
    
    def _extract_protein(self, food: Dict[str, Any]) -> float:
        """Estrae le proteine da un alimento USDA"""
        try:
            nutrients = food.get("foodNutrients", [])
            for nutrient in nutrients:
                if nutrient.get("nutrientName") == "Protein":
                    return nutrient.get("value", 0)
            return 0
        except Exception:
            return 0
            
    def _extract_carbs(self, food: Dict[str, Any]) -> float:
        """Estrae i carboidrati da un alimento USDA"""
        try:
            nutrients = food.get("foodNutrients", [])
            
            for nutrient in nutrients:
                nutrient_name = nutrient.get("nutrientName", "")
                # Controlliamo diversi nomi possibili per i carboidrati
                if nutrient_name in ["Carbohydrate, by difference", "Carbohydrates", "Total Carbohydrate"]:
                    return nutrient.get("value", 0)
            
            # Se non troviamo i carboidrati, proviamo a cercare con un approccio più flessibile
            for nutrient in nutrients:
                nutrient_name = nutrient.get("nutrientName", "").lower()
                if "carbohydrate" in nutrient_name or "carb" in nutrient_name:
                    return nutrient.get("value", 0)
            
            return 0
        except Exception as e:
            logger.error(f"Errore durante l'estrazione dei carboidrati: {str(e)}")
            return 0
            
    def _extract_fat(self, food: Dict[str, Any]) -> float:
        """Estrae i grassi da un alimento USDA"""
        try:
            nutrients = food.get("foodNutrients", [])
            for nutrient in nutrients:
                if nutrient.get("nutrientName") == "Total lipid (fat)":
                    return nutrient.get("value", 0)
            return 0
        except Exception:
            return 0
    
    def _extract_nutrients(self, food: Dict[str, Any]) -> Dict[str, Any]:
        """Estrae i nutrienti da un alimento USDA"""
        nutrients = {}
        
        try:
            food_nutrients = food.get("foodNutrients", [])
            
            for nutrient in food_nutrients:
                nutrient_id = nutrient.get("nutrientId")
                if nutrient_id:
                    nutrients[nutrient_id] = {
                        "name": nutrient.get("nutrientName", ""),
                        "amount": nutrient.get("value", 0),
                        "unit": nutrient.get("unitName", "")
                    }
            
            return nutrients
        except Exception as e:
            logger.error(f"Errore durante l'estrazione dei nutrienti: {str(e)}")
            return nutrients

    # Wrapper function per compatibilità
    async def search_foods(query: str, max_results: int = 10, detailed: bool = False, use_cache: bool = True):
        """Funzione di ricerca alimenti compatibile con le nuove implementazioni.
        
        Args:
            query: Query di ricerca
            max_results: Numero massimo di risultati
            detailed: Se includere dettagli nutrizionali
            use_cache: Se utilizzare la cache
            
        Returns:
            Risultati della ricerca
        """
        service = HybridFoodService()
        results = await service.search_food(query, use_cache=use_cache)
        
        # Limita i risultati
        if 'results' in results:
            results['results'] = results['results'][:max_results]
        
        return results
