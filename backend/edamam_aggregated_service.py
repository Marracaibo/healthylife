import logging
from typing import Dict, Any, Optional
from edamam_only_service import EdamamOnlyService

logger = logging.getLogger(__name__)

class EdamamAggregatedService:
    """
    Servizio che utilizza esclusivamente Edamam come fonte di dati alimentari,
    mantenendo l'interfaccia del servizio aggregato per compatibilità.
    """
    
    def __init__(self):
        self.edamam_service = EdamamOnlyService()
        logger.info("Inizializzato EdamamAggregatedService con Edamam come unica fonte")
        
    async def search_food(self, query: str, max_results: int = 10) -> Dict[str, Any]:
        """
        Cerca alimenti utilizzando esclusivamente il servizio Edamam.
        
        Args:
            query: La query di ricerca
            max_results: Il numero massimo di risultati da restituire
            
        Returns:
            Un dizionario contenente i risultati della ricerca
        """
        logger.info(f"EdamamAggregatedService: Ricerca di '{query}' con max risultati: {max_results}")
        
        try:
            # Utilizza direttamente il servizio Edamam
            results = await self.edamam_service.search_food(query, max_results)
            
            if results and "results" in results and results["results"]:
                logger.info(f"EdamamAggregatedService: Trovati {len(results['results'])} risultati")
                return results
            else:
                logger.info("EdamamAggregatedService: Nessun risultato trovato")
                return {"results": []}
        except Exception as e:
            logger.error(f"Errore durante la ricerca EdamamAggregatedService: {str(e)}")
            return {"results": []}
    
    async def get_food(self, food_id: str) -> Optional[Dict[str, Any]]:
        """
        Ottiene i dettagli di un alimento specifico utilizzando il servizio Edamam.
        
        Args:
            food_id: L'ID dell'alimento da recuperare
            
        Returns:
            Un dizionario contenente i dettagli dell'alimento
        """
        logger.info(f"EdamamAggregatedService: Recupero dettagli per ID: {food_id}")
        
        try:
            # Utilizza direttamente il servizio Edamam
            return await self.edamam_service.get_food(food_id)
        except Exception as e:
            logger.error(f"Errore durante il recupero dettagli EdamamAggregatedService: {str(e)}")
            return None
