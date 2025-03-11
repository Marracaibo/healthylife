"""
Hybrid Food API

API routes for the hybrid USDA-Edamam food service.
"""

from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
from services.hybrid_food_service import HybridFoodService

router = APIRouter(prefix="/api/hybrid-food", tags=["hybrid-food"])

async def get_food_service():
    """Dependency to get the HybridFoodService instance."""
    return HybridFoodService()

@router.get("/search")
async def search_food(
    query: str = Query(..., description="Food search query"),
    max_results: int = Query(25, description="Maximum number of results to return"),
    use_cache: bool = Query(True, description="Whether to use cached results"),
    food_service: HybridFoodService = Depends(get_food_service)
):
    """
    Search for foods using the hybrid USDA-Edamam approach.
    
    Args:
        query: The search term to find foods
        max_results: Maximum number of results to return (default: 25)
        use_cache: Whether to use cached results (default: True)
        
    Returns:
        Dictionary containing search results
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    results = await food_service.search_food(query, use_cache)
    
    # Format the response to match the frontend expectations
    response = {
        "success": results["total_results"] > 0,
        "source": results["source"],
        "foods": []
    }
    
    # Format the food items
    for item in results.get("results", [])[:max_results]:
        food = {
            "food_id": item.get("id", ""),
            "food_name": item.get("name", ""),
            "brand_name": item.get("brand", ""),
            "nutrients": {
                "calories": item.get("calories", 0),
            },
            "ingredients": item.get("description", "")
        }
        response["foods"].append(food)
    
    if not response["success"]:
        response["error"] = f"No results found for '{query}'"
        
    return response

@router.get("/search-combined")
async def search_combined(
    query: str = Query(..., description="Food search query"),
    max_results: int = Query(25, description="Maximum number of results to return"),
    use_cache: bool = Query(True, description="Whether to use cached results"),
    food_service: HybridFoodService = Depends(get_food_service)
):
    """
    Search for foods using both USDA and Edamam APIs and combine the results.
    
    Args:
        query: The search term to find foods
        max_results: Maximum number of results to return (default: 25)
        use_cache: Whether to use cached results (default: True)
        
    Returns:
        Dictionary containing combined search results
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    results = await food_service.search_food_from_all_sources(query, use_cache)
    
    # Format the response to match the frontend expectations
    response = {
        "success": results["total_results"] > 0,
        "source": "hybrid",
        "foods": []
    }
    
    # Format the food items
    for item in results.get("foods", [])[:max_results]:
        food = {
            "food_id": item.get("id", ""),
            "food_name": item.get("name", ""),
            "brand_name": item.get("brand", ""),
            "nutrients": {
                "calories": item.get("calories", 0),
            },
            "ingredients": item.get("description", ""),
            "source": item.get("source", "unknown")
        }
        response["foods"].append(food)
    
    # Add source info
    response["usda_count"] = results.get("usda_results", 0)
    response["edamam_count"] = results.get("edamam_results", 0)
    
    if not response["success"]:
        response["error"] = f"No results found for '{query}'"
        
    return response

@router.get("/details")
async def get_food_details(
    food_id: str = Query(..., description="Food ID"),
    source: Optional[str] = Query("auto", description="Source database (usda, edamam, auto)"),
    food_service: HybridFoodService = Depends(get_food_service)
):
    """
    Get detailed information about a specific food by its ID.
    
    Args:
        food_id: The ID of the food
        source: The source database (usda, edamam, or auto to detect automatically)
        
    Returns:
        Dictionary containing detailed food information
    """
    if not food_id:
        raise HTTPException(status_code=400, detail="Food ID is required")
    
    result = await food_service.get_food(food_id, source)
    
    if not result:
        raise HTTPException(
            status_code=404, 
            detail=f"Food with ID {food_id} not found in {source} database"
        )
    
    # Format the response to match the frontend expectations
    nutrients = result.get("nutrients", {})
    response = {
        "success": True,
        "source": result.get("source", "unknown"),
        "food": {
            "food_id": food_id,
            "food_name": result.get("name", ""),
            "brand_name": result.get("brand", ""),
            "nutrients": {
                "calories": _extract_nutrient(nutrients, "Energy"),
                "protein": _extract_nutrient(nutrients, "Protein"),
                "carbs": _extract_nutrient(nutrients, "Carbohydrates"),
                "fat": _extract_nutrient(nutrients, "Total lipid (fat)"),
                "fiber": _extract_nutrient(nutrients, "Fiber, total dietary"),
                "sugar": _extract_nutrient(nutrients, "Sugars, total including NLEA")
            },
            "ingredients": result.get("description", "")
        }
    }
    
    return response

def _extract_nutrient(nutrients, name):
    """Helper function to extract nutrient values."""
    for key, nutrient in nutrients.items():
        if nutrient.get("name") == name:
            return nutrient.get("amount", 0)
    return 0
