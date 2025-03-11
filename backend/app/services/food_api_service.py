"""
Service for connecting to food databases (USDA FoodData Central and Edamam Recipe Search API).
"""

import httpx
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# URL constants
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
EDAMAM_API_BASE_URL = "https://api.edamam.com/search"

async def search_usda_foods(query: str, max_results: int, api_key: str, is_barcode: bool = False) -> List[Dict[Any, Any]]:
    """
    Search for foods using the USDA FoodData Central API.
    
    Args:
        query: The search query or barcode
        max_results: Maximum number of results to return
        api_key: USDA API key
        is_barcode: If True, the query is treated as a barcode/UPC
        
    Returns:
        List of food items
    """
    params = {
        "api_key": api_key,
        "query": query,
        "pageSize": max_results,
        "dataType": ["Survey (FNDDS)", "Foundation", "SR Legacy", "Branded"]
    }
    
    # Se è un codice a barre, impostiamo il filtro per i prodotti con UPC
    if is_barcode:
        logger.info(f"Searching USDA API for barcode: {query}")
        # Per i codici a barre, è importante includere i prodotti di marca che hanno UPC
        params["dataType"] = ["Branded"]
        # Alcuni codici a barre potrebbero avere spazi o caratteri speciali
        params["query"] = query.strip()
    else:
        logger.info(f"Searching USDA API for: {query}")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(USDA_API_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            foods = data.get("foods", [])
            
            # Transform to a standard format
            results = []
            for food in foods:
                # Extract nutrients
                nutrients = {}
                for nutrient in food.get("foodNutrients", []):
                    nutrient_name = nutrient.get("nutrientName", "").lower()
                    if nutrient_name in ["energy", "protein", "total lipid (fat)", "carbohydrate, by difference"]:
                        nutrients[nutrient_name] = {
                            "value": nutrient.get("value", 0),
                            "unit": nutrient.get("unitName", "").lower()
                        }
                
                # Create standardized food item
                results.append({
                    "id": str(food.get("fdcId", "")),
                    "name": food.get("description", ""),
                    "brand": food.get("brandOwner", "USDA"),
                    "source": "usda",
                    "category": food.get("foodCategory", ""),
                    "nutrients": {
                        "calories": nutrients.get("energy", {}).get("value", 0),
                        "protein": nutrients.get("protein", {}).get("value", 0),
                        "fat": nutrients.get("total lipid (fat)", {}).get("value", 0),
                        "carbs": nutrients.get("carbohydrate, by difference", {}).get("value", 0)
                    },
                    "serving_size": {
                        "amount": 100,
                        "unit": "g"
                    },
                    "barcode": query if is_barcode else None,
                    "image": food.get("foodImage", None)
                })
            
            logger.info(f"Found {len(results)} results from USDA API")
            return results
            
    except httpx.RequestError as e:
        logger.error(f"Error connecting to USDA API: {str(e)}")
        return []
    except httpx.HTTPStatusError as e:
        logger.error(f"USDA API returned error status: {e.response.status_code}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error searching USDA foods: {str(e)}")
        return []

async def search_edamam_foods(query: str, max_results: int, app_id: str, app_key: str) -> List[Dict[Any, Any]]:
    """
    Search for foods using the Edamam Recipe Search API.
    
    Args:
        query: The search query
        max_results: Maximum number of results to return
        app_id: Edamam application ID
        app_key: Edamam application key
        
    Returns:
        List of food items
    """
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "q": query,  
    }
    
    # Aggiunto header richiesto da Edamam con account utente
    headers = {
        "Edamam-Account-User": "ikhihi"  
    }
    
    logger.info(f"Searching Edamam API for: {query}")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(EDAMAM_API_BASE_URL, params=params, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            logger.info(f"Edamam returned {len(data.get('hits', []))} results")
            
            results = []
            for hit in data.get("hits", [])[:max_results]:
                recipe = hit.get("recipe", {})
                
                # Estrai i nutrienti se disponibili
                nutrients = {}
                if "totalNutrients" in recipe:
                    total_nutrients = recipe.get("totalNutrients", {})
                    nutrients = {
                        "calories": recipe.get("calories", 0),
                        "protein": total_nutrients.get("PROCNT", {}).get("quantity", 0) if "PROCNT" in total_nutrients else 0,
                        "fat": total_nutrients.get("FAT", {}).get("quantity", 0) if "FAT" in total_nutrients else 0,
                        "carbs": total_nutrients.get("CHOCDF", {}).get("quantity", 0) if "CHOCDF" in total_nutrients else 0
                    }
                
                # Crea un elemento food nel formato atteso
                food_item = {
                    "id": recipe.get("uri", "").split("#")[-1] if "uri" in recipe else "",
                    "name": recipe.get("label", ""),
                    "brand": "Edamam",
                    "source": "edamam",
                    "category": recipe.get("dishType", ["Recipe"])[0] if "dishType" in recipe else "Recipe",
                    "nutrients": nutrients,
                    "serving_size": {
                        "amount": 100,
                        "unit": "g"
                    },
                    "image": recipe.get("image")
                }
                
                results.append(food_item)
            
            return results
            
    except httpx.RequestError as e:
        logger.error(f"Error connecting to Edamam API: {str(e)}")
        return []
    except httpx.HTTPStatusError as e:
        logger.error(f"Edamam API returned error status: {e.response.status_code}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error searching Edamam foods: {str(e)}")
        return []
