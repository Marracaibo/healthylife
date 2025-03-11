"""
Food API Routes

This module defines the API routes for food search and nutrition data
using the Enhanced Food Service.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from services.enhanced_food_service import EnhancedFoodService

router = APIRouter(prefix="/api/food", tags=["food"])
food_service = EnhancedFoodService()

@router.get("/search")
async def search_food(
    query: str = Query(..., description="Food search query"),
    max_results: int = Query(25, description="Maximum number of results to return")
):
    """
    Search for foods across multiple food databases.
    
    Args:
        query: The search term to find foods
        max_results: Maximum number of results to return (default: 25)
        
    Returns:
        Dictionary containing search results from available food databases
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    results = await food_service.search_food(query, max_results)
    return results

@router.get("/details")
async def get_food_details(
    food_id: str = Query(..., description="Food ID"),
    source: Optional[str] = Query(None, description="Source database (USDA, OpenFoodFacts)")
):
    """
    Get detailed information about a specific food by its ID.
    
    Args:
        food_id: The ID of the food
        source: The source database (optional)
        
    Returns:
        Dictionary containing detailed food information
    """
    if not food_id:
        raise HTTPException(status_code=400, detail="food_id parameter is required")
    
    results = await food_service.get_food_details(food_id, source)
    
    if not results.get("success"):
        raise HTTPException(status_code=404, detail=results.get("error", "Food not found"))
    
    return results

@router.get("/barcode")
async def get_food_by_barcode(
    barcode: str = Query(..., description="Product barcode")
):
    """
    Get food information by barcode.
    
    Args:
        barcode: The barcode of the food product
        
    Returns:
        Dictionary containing food information
    """
    if not barcode:
        raise HTTPException(status_code=400, detail="barcode parameter is required")
    
    results = await food_service.get_food_by_barcode(barcode)
    
    if not results.get("success"):
        raise HTTPException(status_code=404, detail=results.get("error", "Food not found by barcode"))
    
    return results
