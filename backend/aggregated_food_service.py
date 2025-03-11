import logging
from typing import Dict, Any, List, Optional
from fatsecret_service import FatSecretService
from edamam_service import EdamamService
from openfoodfacts_service import OpenFoodFactsService

logger = logging.getLogger(__name__)

class AggregatedFoodService:
    """
    Servizio che aggrega i risultati da diverse API alimentari.
    Attualmente supporta FatSecret, Edamam e OpenFoodFacts.
    
    Strategia di fallback:
    1. FatSecret (fonte primaria)
    2. OpenFoodFacts (fallback secondario)
    3. Edamam (fallback terziario - attualmente non funzionante correttamente)
    """
    
    def __init__(self):
        self.fatsecret_service = FatSecretService()
        self.edamam_service = EdamamService()
        self.openfoodfacts_service = OpenFoodFactsService()
        logger.info("Inizializzato AggregatedFoodService con tutti i servizi disponibili")
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti in tutti i servizi disponibili e aggrega i risultati.
        
        Args:
            query: La query di ricerca
            max_results: Il numero massimo di risultati da restituire
            
        Returns:
            Un dizionario contenente i risultati aggregati
        """
        logger.info(f"AggregatedFoodService: Ricerca di '{query}' con max risultati: {max_results}")
        
        all_results = []
        
        # Priorità: FatSecret, poi OpenFoodFacts, poi Edamam
        # Questo perché FatSecret ha dati più accurati per gli alimenti
        
        # 1. Cerca su FatSecret
        if self.fatsecret_service:
            try:
                fatsecret_results = await self.fatsecret_service.search_food(query, max_results)
                if fatsecret_results and "results" in fatsecret_results and fatsecret_results["results"]:
                    logger.info(f"FatSecret ha trovato {len(fatsecret_results['results'])} risultati")
                    
                    # Aggiungi un prefisso agli ID per identificare la fonte
                    for result in fatsecret_results["results"]:
                        result["id"] = f"fatsecret-{result['id']}"
                        result["source"] = "fatsecret"
                    
                    all_results.extend(fatsecret_results["results"])
                else:
                    logger.info("FatSecret non ha trovato risultati")
            except Exception as e:
                logger.error(f"Errore durante la ricerca FatSecret: {str(e)}")
        
        # 2. Se non abbiamo abbastanza risultati, cerca su OpenFoodFacts
        if len(all_results) < max_results and self.openfoodfacts_service:
            remaining = max_results - len(all_results)
            try:
                off_results = await self.openfoodfacts_service.search_food(query, remaining)
                if off_results and "results" in off_results and off_results["results"]:
                    logger.info(f"OpenFoodFacts ha trovato {len(off_results['results'])} risultati")
                    
                    # Aggiungi un prefisso agli ID per identificare la fonte
                    for result in off_results["results"]:
                        result["id"] = f"off-{result['id']}"
                        result["source"] = "openfoodfacts"
                    
                    all_results.extend(off_results["results"])
                else:
                    logger.info("OpenFoodFacts non ha trovato risultati")
            except Exception as e:
                logger.error(f"Errore durante la ricerca OpenFoodFacts: {str(e)}")
        
        # 3. Se ancora non abbiamo abbastanza risultati, cerca su Edamam
        if len(all_results) < max_results and self.edamam_service:
            remaining = max_results - len(all_results)
            try:
                edamam_results = await self.edamam_service.search_food(query, remaining)
                if edamam_results and "results" in edamam_results and edamam_results["results"]:
                    logger.info(f"Edamam ha trovato {len(edamam_results['results'])} risultati")
                    
                    # Per Edamam, manteniamo l'ID originale ma aggiungiamo la fonte
                    for result in edamam_results["results"]:
                        result["source"] = "edamam"
                    
                    all_results.extend(edamam_results["results"])
                else:
                    logger.info("Edamam non ha trovato risultati")
            except Exception as e:
                logger.error(f"Errore durante la ricerca Edamam: {str(e)}")
        
        # Limita il numero totale di risultati
        all_results = all_results[:max_results]
        
        logger.info(f"AggregatedFoodService: Restituiti {len(all_results)} risultati totali")
        
        return {
            "results": all_results
        }
        
    async def get_food(self, food_id: str) -> Dict[str, Any]:
        """
        Ottiene i dettagli di un alimento specifico utilizzando il servizio appropriato.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            
        Returns:
            Un dizionario contenente i dettagli dell'alimento
        """
        logger.info(f"AggregatedFoodService: Recupero dettagli per ID: {food_id}")
        
        try:
            # Determina quale servizio utilizzare in base all'ID
            if food_id.startswith("fatsecret-"):
                # FatSecret ID
                real_id = food_id.replace("fatsecret-", "")
                return await self.fatsecret_service.get_food(real_id)
            elif food_id.startswith("off-"):
                # OpenFoodFacts ID
                real_id = food_id.replace("off-", "")
                return await self.openfoodfacts_service.get_food(real_id)
            elif "-" not in food_id:
                # Potrebbe essere un ID di FatSecret senza prefisso
                return await self.fatsecret_service.get_food(food_id)
            else:
                # Potrebbe essere un ID di Edamam (non ha un prefisso specifico)
                try:
                    return await self.edamam_service.get_food(food_id)
                except Exception as e:
                    logger.error(f"Errore durante il recupero dettagli da Edamam: {str(e)}")
                    return None
        except Exception as e:
            logger.error(f"Formato ID alimento non riconosciuto: {food_id}")
            return None
