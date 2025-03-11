from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel
import os
from datetime import datetime
import logging
import json
import traceback

from database import get_db
# Importa i servizi
from fatsecret_service import FatSecretService
from mock_fatsecret_service import MockFatSecretService
from aggregated_food_service import AggregatedFoodService
from openfoodfacts_service import OpenFoodFactsService
from edamam_service import EdamamService
from edamam_only_service import EdamamOnlyService
from edamam_aggregated_service import EdamamAggregatedService
from enhanced_edamam_service import EnhancedEdamamService
import models
import schemas

router = APIRouter(
    prefix="/api/fatsecret",
    tags=["fatsecret"]
)

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Istanze dei servizi
mock_service = MockFatSecretService()
fatsecret_service = FatSecretService()
openfoodfacts_service = OpenFoodFactsService(country="it")
edamam_service = EdamamService()
edamam_only_service = EdamamOnlyService()
edamam_aggregated_service = EdamamAggregatedService()
aggregated_service = AggregatedFoodService()
enhanced_edamam_service = EnhancedEdamamService()

# Determina quale servizio utilizzare in base all'ambiente
USE_MOCK = os.getenv("USE_MOCK_FATSECRET", "true").lower() == "true"
USE_AGGREGATOR = os.getenv("USE_FOOD_AGGREGATOR", "true").lower() == "true"
USE_EDAMAM_ONLY = os.getenv("USE_EDAMAM_ONLY", "false").lower() == "true"
USE_EDAMAM_AGGREGATED = os.getenv("USE_EDAMAM_AGGREGATED", "false").lower() == "true"
USE_ENHANCED_EDAMAM = os.getenv("USE_ENHANCED_EDAMAM", "false").lower() == "true"

# Determina il servizio da utilizzare in ordine di priorità
if USE_MOCK:
    logger.info("Utilizzando il servizio mock per FatSecret")
    service = mock_service
elif USE_ENHANCED_EDAMAM:
    logger.info("Utilizzando il servizio Edamam migliorato")
    service = enhanced_edamam_service
elif USE_EDAMAM_ONLY:
    logger.info("Utilizzando il servizio Edamam esclusivo")
    service = edamam_only_service
elif USE_EDAMAM_AGGREGATED:
    logger.info("Utilizzando il servizio aggregato basato su Edamam")
    service = edamam_aggregated_service
elif USE_AGGREGATOR:
    logger.info("Utilizzando il servizio aggregato (FatSecret + OpenFoodFacts + Edamam)")
    service = aggregated_service
else:
    logger.info("Utilizzando il servizio reale FatSecret")
    service = fatsecret_service

class FoodSearchResult(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    brand: Optional[str] = None
    calories: Optional[float] = None
    serving_size: Optional[str] = None

class FoodSearchResponse(BaseModel):
    results: List[FoodSearchResult]
    total_results: int
    page_number: int
    max_results: int

class AlimentoResponse(BaseModel):
    id: int
    nome: str
    calorie_per_100g: float
    proteine_per_100g: float
    carboidrati_per_100g: float
    grassi_per_100g: float
    unita_predefinita: str
    categoria: str

@router.get("/search", response_model=FoodSearchResponse)
async def search_food(
    query: str = Query(..., description="Termine di ricerca per gli alimenti"),
    max_results: int = Query(10, description="Numero massimo di risultati"),
    page_number: int = Query(0, description="Numero di pagina"),
    db: Session = Depends(get_db)
):
    """
    Cerca alimenti nel database di FatSecret.
    """
    logger.info(f"Ricerca alimenti per: '{query}', max_risultati: {max_results}")
    logger.info(f"Servizio in uso: {'Mock' if USE_MOCK else 'API Reale' if not USE_AGGREGATOR else 'Aggregato'}")
    
    try:
        # Ottieni la risposta dalla ricerca
        response = await service.search_food(query, max_results)
        logger.info(f"Risposta raw ricerca ricevuta, lunghezza: {len(str(response))}")
        logger.debug(f"Risposta completa: {response}")
        
        if "error" in response:
            logger.error(f"Errore nella risposta: {response['error']}")
            raise HTTPException(status_code=500, detail=response["error"])
        
        # Controlla se è vuota
        if not response:
            logger.warning("Risposta vuota dall'API FatSecret")
            return FoodSearchResponse(
                results=[],
                total_results=0,
                page_number=page_number,
                max_results=max_results
            )
        
        # Estrai i dati
        foods_response = response.get("foods", {})
        if not foods_response:
            logger.warning("Campo 'foods' non trovato nella risposta")
            return FoodSearchResponse(
                results=[],
                total_results=0,
                page_number=page_number,
                max_results=max_results
            )
        
        # Log struttura
        logger.info(f"Chiavi in foods_response: {foods_response.keys() if isinstance(foods_response, dict) else 'Non è un dizionario'}")
        
        total_results = int(foods_response.get("total_results", 0))
        logger.info(f"Totale risultati trovati: {total_results}")
        
        results = []
        foods = foods_response.get("food", [])
        
        if foods is None:
            logger.warning("Campo 'food' è None")
            foods = []
            
        logger.info(f"Tipo di foods: {type(foods)}")
        logger.info(f"Numero di alimenti restituiti: {len(foods) if isinstance(foods, list) else '1 (oggetto singolo)' if foods else '0 (vuoto)'}")
        
        if not isinstance(foods, list):
            logger.info("Convertendo alimento singolo in lista")
            foods = [foods]
        
        for food in foods:
            food_id = food.get("food_id", "")
            food_name = food.get("food_name", "")
            food_description = food.get("food_description", "")
            brand = food.get("brand_name", "")
            
            calories = None
            if "food_description" in food:
                desc = food["food_description"]
                if "kcal" in desc or "Calories:" in desc:
                    try:
                        if "Calories:" in desc:
                            # Formato: "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g"
                            calories_part = desc.split("Calories:")[1].split("|")[0].strip()
                            calories_str = calories_part.replace("kcal", "").strip()
                            calories = float(calories_str)
                        else:
                            # Formato vecchio
                            calories_str = desc.split("kcal")[0].strip().split()[-1]
                            calories = float(calories_str)
                    except Exception as e:
                        logger.warning(f"Errore nell'estrazione delle calorie: {str(e)}")
                        logger.warning(f"Descrizione: {desc}")
            
            results.append(FoodSearchResult(
                id=food_id,
                name=food_name,
                description=food_description,
                brand=brand,
                calories=calories,
                serving_size=None  
            ))
        
        logger.info(f"Risultati elaborati: {len(results)}")
        return FoodSearchResponse(
            results=results,
            total_results=total_results,
            page_number=page_number,
            max_results=max_results
        )
    except Exception as e:
        logger.error(f"Errore durante la ricerca: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/food/{food_id}")
async def get_food_details(
    food_id: str,
    db: Session = Depends(get_db)
):
    """
    Ottiene i dettagli di un alimento specifico da FatSecret.
    """
    try:
        response = await service.get_food(food_id)
        
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/import/{food_id}", response_model=AlimentoResponse)
async def import_food(
    food_id: str,
    db: Session = Depends(get_db)
):
    """
    Importa un alimento da FatSecret nel database locale.
    """
    try:
        # Ottieni i dettagli dell'alimento
        food_data = await service.get_food(food_id)
        
        if "error" in food_data:
            raise HTTPException(status_code=500, detail=food_data["error"])
        
        # Importa l'alimento nel database
        result = await service.import_food_to_db(food_data, db)
        
        # Gestisci sia il caso di un oggetto Alimento che di un dizionario
        if isinstance(result, dict):
            return AlimentoResponse(**result)
        else:
            # Se è un oggetto SQLAlchemy, converti in dizionario
            return AlimentoResponse(
                id=result.id,
                nome=result.nome,
                calorie_per_100g=result.calorie_per_100g,
                proteine_per_100g=result.proteine_per_100g,
                carboidrati_per_100g=result.carboidrati_per_100g,
                grassi_per_100g=result.grassi_per_100g,
                unita_predefinita=result.unita_predefinita,
                categoria=result.categoria
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test", response_model=Dict[str, Any])
async def test_fatsecret_connection():
    """
    Endpoint di test per verificare la connessione con FatSecret e le variabili d'ambiente
    """
    try:
        # Verifica se stiamo usando il mock o l'API reale
        is_mock = USE_MOCK
        
        # Raccoglie informazioni di diagnostica
        env_vars = {
            "USE_MOCK_FATSECRET": os.getenv("USE_MOCK_FATSECRET", "non impostato"),
            "FATSECRET_CONSUMER_KEY": "***" if os.getenv("FATSECRET_CONSUMER_KEY") else "non impostato",
            "FATSECRET_CONSUMER_SECRET": "***" if os.getenv("FATSECRET_CONSUMER_SECRET") else "non impostato",
        }
        
        # Esegue una ricerca di test per verificare la connettività
        search_results = None
        search_error = None
        try:
            search_results = await service.search_food("test", max_results=1)
        except Exception as search_e:
            search_error = str(search_e)
        
        return {
            "status": "success",
            "using_mock": is_mock,
            "environment": env_vars,
            "search_test": "ok" if search_results else "errore: nessun risultato",
            "search_error": search_error,
            "test_time": datetime.now().isoformat()
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc(),
            "using_mock": USE_MOCK,
            "test_time": datetime.now().isoformat()
        }

@router.get("/test_search")
async def test_search_food(
    query: str = Query(..., description="Termine di ricerca per gli alimenti"),
    max_results: Optional[int] = 10,
):
    """
    Endpoint di test che restituisce la risposta raw dell'API di FatSecret.
    """
    logger.info(f"TEST API: Ricerca alimenti per: '{query}', max_risultati: {max_results}")
    logger.info(f"TEST API: Servizio in uso: {'Mock' if USE_MOCK else 'API Reale' if not USE_AGGREGATOR else 'Aggregato'}")
    
    try:
        # Ottieni la risposta dalla ricerca e restituiscila direttamente
        response = await service.search_food(query, max_results)
        logger.info(f"TEST API: Risposta ricevuta con successo")
        return response
    except Exception as e:
        logger.error(f"TEST API: Errore durante la ricerca: {str(e)}")
        logger.error(f"TEST API: Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/test-openfoodfacts", response_model=Dict[str, Any])
async def test_openfoodfacts_api(
    query: str = Query(..., description="Query di ricerca"),
    max_results: int = Query(10, description="Numero massimo di risultati")
):
    """
    Endpoint di test che restituisce la risposta raw dell'API di Open Food Facts.
    """
    logger.info(f"TEST OpenFoodFacts API: Ricerca alimenti per: '{query}', max_risultati: {max_results}")
    
    try:
        # Utilizza l'istanza già creata
        response = await openfoodfacts_service.search_food(query, max_results)
        return response
    except Exception as e:
        logger.error(f"Errore durante il test dell'API OpenFoodFacts: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/test-enhanced-edamam")
async def test_enhanced_edamam(query: str, max_results: int = 10):
    """
    Endpoint di test per il servizio Edamam migliorato.
    Restituisce risultati di ricerca formattati secondo il nuovo formato.
    """
    logger.info(f"Test API Enhanced Edamam: Ricerca '{query}' (max: {max_results})")
    
    try:
        # Utilizza direttamente il servizio Edamam migliorato
        response = await enhanced_edamam_service.search_food(query, max_results)
        
        if not response or "results" not in response:
            logger.warning(f"Nessun risultato trovato per '{query}'")
            return {"foods": {"food": [], "max_results": max_results, "total_results": 0, "page_number": 0}}
        
        # Converti i risultati nel formato atteso dal frontend
        foods = []
        for item in response["results"]:
            food_item = {
                "food_id": item.get("id", ""),
                "food_name": item.get("name", ""),
                "food_description": item.get("description", ""),
                "brand_name": "Edamam",
                "calories": item.get("calories", 0),
                "macros": item.get("macros", {}),
                "health_labels": item.get("health_labels", [])
            }
            foods.append(food_item)
        
        formatted_response = {
            "foods": {
                "food": foods,
                "max_results": max_results,
                "total_results": len(foods),
                "page_number": 0
            }
        }
        
        logger.info(f"Trovati {len(foods)} risultati")
        return formatted_response
    except Exception as e:
        logger.error(f"Errore durante il test dell'API Enhanced Edamam: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Errore durante la ricerca: {str(e)}")

@router.get("/enhanced-food/{food_id}")
async def get_enhanced_food_details(food_id: str):
    """
    Ottiene i dettagli di un alimento specifico usando l'EnhancedEdamamService.
    Questa funzionalità è specifica per gli ID di alimenti di Edamam.
    """
    try:
        logger.info(f"Richiesta dettagli alimento Edamam migliorato: {food_id}")
        
        # Utilizziamo direttamente il servizio Edamam migliorato
        food_details = await enhanced_edamam_service.get_food_details(food_id)
        
        if not food_details:
            logger.warning(f"Nessun dettaglio trovato per l'alimento Edamam: {food_id}")
            raise HTTPException(status_code=404, detail="Alimento non trovato")
        
        # Formatta la risposta nel formato atteso dal frontend
        nutrients = food_details.get("nutrients", {})
        return {
            "food": {
                "food_id": food_id,
                "food_name": food_details.get("label", ""),
                "food_type": "Generic",
                "brand_name": food_details.get("brand", ""),
                "serving_id": "0",
                "serving_description": f"Per {food_details.get('serving_unit', 'serving')}",
                "serving_url": "",
                "metric_serving_amount": food_details.get("serving_qty", 100),
                "metric_serving_unit": food_details.get("serving_unit", "g"),
                "calories": nutrients.get("ENERC_KCAL", 0),
                "carbohydrate": nutrients.get("CHOCDF", 0),
                "protein": nutrients.get("PROCNT", 0),
                "fat": nutrients.get("FAT", 0),
                "saturated_fat": nutrients.get("FASAT", 0),
                "polyunsaturated_fat": nutrients.get("FAPU", 0),
                "monounsaturated_fat": nutrients.get("FAMS", 0),
                "trans_fat": nutrients.get("FATRN", 0),
                "cholesterol": nutrients.get("CHOLE", 0),
                "sodium": nutrients.get("NA", 0),
                "potassium": nutrients.get("K", 0),
                "fiber": nutrients.get("FIBTG", 0),
                "sugar": nutrients.get("SUGAR", 0),
                "vitamin_a": nutrients.get("VITA_RAE", 0),
                "vitamin_c": nutrients.get("VITC", 0),
                "calcium": nutrients.get("CA", 0),
                "iron": nutrients.get("FE", 0)
            }
        }
    except Exception as e:
        logger.error(f"Errore durante il recupero dei dettagli dell'alimento Edamam: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Errore durante il recupero dei dettagli: {str(e)}")
