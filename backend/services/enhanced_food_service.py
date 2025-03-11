"""
Enhanced Food Service

This service combines multiple food API services to provide comprehensive
food and nutrition information with fallback mechanisms.
"""

import os
import json
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Import our service implementations
from services.usda_food_service import USDAFoodService
from services.open_food_facts_service import OpenFoodFactsService

# Load environment variables
load_dotenv()

class EnhancedFoodService:
    """
    Enhanced Food Service that combines multiple food API services
    with fallback mechanisms for improved reliability.
    """
    
    def __init__(self):
        """Initialize all the food services."""
        self.usda_service = USDAFoodService()
        self.open_food_facts_service = OpenFoodFactsService()
        
        # Determine which services are available based on API keys
        self.usda_available = bool(os.getenv("USDA_API_KEY"))
        
        # Open Food Facts doesn't require an API key
        self.open_food_facts_available = True
    
    async def search_food(self, query: str, page_size: int = 25) -> Dict[str, Any]:
        """
        Search for foods across all available services.
        
        Args:
            query: The search term to find foods
            page_size: Number of results per page
            
        Returns:
            Dictionary containing combined search results
        """
        results = {
            "success": False,
            "source": None,
            "foods": [],
            "error": None
        }
        
        # Try USDA first if available
        if self.usda_available:
            try:
                usda_results = await self.usda_service.search_food(query, page_size)
                if "error" not in usda_results and usda_results.get("foods", []):
                    formatted_results = await self.usda_service.format_search_results(usda_results)
                    results["success"] = True
                    results["source"] = "USDA"
                    results["foods"] = formatted_results
                    return results
            except Exception as e:
                print(f"USDA search error: {str(e)}")
                # Continue to next service
        
        # Try Open Food Facts if USDA failed or is unavailable
        if self.open_food_facts_available:
            try:
                off_results = await self.open_food_facts_service.search_food(query, page_size)
                if "error" not in off_results and off_results.get("products", []):
                    formatted_results = await self.open_food_facts_service.format_search_results(off_results)
                    results["success"] = True
                    results["source"] = "Open Food Facts"
                    results["foods"] = formatted_results
                    return results
            except Exception as e:
                print(f"Open Food Facts search error: {str(e)}")
                # Continue to next service or return error
        
        # If we get here, all services failed
        if not results["success"]:
            results["error"] = "No results found across all available food services"
        
        return results
    
    async def get_food_details(self, food_id: str, source: str = None) -> Dict[str, Any]:
        """
        Get detailed information about a specific food by its ID.
        
        Args:
            food_id: The ID of the food
            source: The source service to use (USDA, OpenFoodFacts, etc.)
            
        Returns:
            Dictionary containing detailed food information
        """
        results = {
            "success": False,
            "source": None,
            "food": {},
            "error": None
        }
        
        # If source is specified, try that service first
        if source:
            if source.lower() == "usda" and self.usda_available:
                try:
                    food_details = await self.usda_service.get_food_details(food_id)
                    if "error" not in food_details:
                        formatted_food = await self.usda_service.format_food_data(food_details)
                        results["success"] = True
                        results["source"] = "USDA"
                        results["food"] = formatted_food
                        return results
                except Exception as e:
                    print(f"USDA details error: {str(e)}")
            
            elif source.lower() == "openfoodfacts" and self.open_food_facts_available:
                try:
                    food_details = await self.open_food_facts_service.get_product_by_barcode(food_id)
                    if "error" not in food_details and food_details.get("status") != 0:
                        formatted_food = await self.open_food_facts_service.format_food_data(food_details)
                        results["success"] = True
                        results["source"] = "Open Food Facts"
                        results["food"] = formatted_food
                        return results
                except Exception as e:
                    print(f"Open Food Facts details error: {str(e)}")
        
        # If source not specified or the specified source failed, try all available services
        
        # Try USDA
        if self.usda_available:
            try:
                food_details = await self.usda_service.get_food_details(food_id)
                if "error" not in food_details:
                    formatted_food = await self.usda_service.format_food_data(food_details)
                    results["success"] = True
                    results["source"] = "USDA"
                    results["food"] = formatted_food
                    return results
            except Exception as e:
                print(f"USDA details error: {str(e)}")
        
        # Try Open Food Facts
        if self.open_food_facts_available:
            try:
                food_details = await self.open_food_facts_service.get_product_by_barcode(food_id)
                if "error" not in food_details and food_details.get("status") != 0:
                    formatted_food = await self.open_food_facts_service.format_food_data(food_details)
                    results["success"] = True
                    results["source"] = "Open Food Facts"
                    results["food"] = formatted_food
                    return results
            except Exception as e:
                print(f"Open Food Facts details error: {str(e)}")
        
        # If we get here, all services failed
        if not results["success"]:
            results["error"] = "Food details not found across all available food services"
        
        return results
    
    async def get_food_by_barcode(self, barcode: str) -> Dict[str, Any]:
        """
        Get food information by barcode.
        
        Args:
            barcode: The barcode of the food product
            
        Returns:
            Dictionary containing food information
        """
        results = {
            "success": False,
            "source": None,
            "food": {},
            "error": None
        }
        
        # Open Food Facts is best for barcode lookups
        if self.open_food_facts_available:
            try:
                food_details = await self.open_food_facts_service.get_product_by_barcode(barcode)
                if "error" not in food_details and food_details.get("status") != 0:
                    formatted_food = await self.open_food_facts_service.format_food_data(food_details)
                    results["success"] = True
                    results["source"] = "Open Food Facts"
                    results["food"] = formatted_food
                    return results
            except Exception as e:
                print(f"Open Food Facts barcode error: {str(e)}")
        
        # If we get here, all services failed
        if not results["success"]:
            results["error"] = "Food not found by barcode"
        
        return results


# Example usage
async def test_enhanced_food_service():
    """Test function to demonstrate Enhanced Food Service usage."""
    service = EnhancedFoodService()
    
    # Search for a food
    search_results = await service.search_food("apple")
    print(f"Search results from {search_results.get('source', 'unknown')}:")
    print(f"Found {len(search_results.get('foods', []))} foods")
    
    # Get details for the first result if available
    if search_results.get("success") and search_results.get("foods"):
        first_food = search_results["foods"][0]
        food_id = first_food["food_id"]
        source = search_results["source"]
        
        food_details = await service.get_food_details(food_id, source)
        if food_details.get("success"):
            food = food_details["food"]
            print(f"\nFood details from {food_details.get('source', 'unknown')}:")
            print(f"Name: {food.get('food_name')}")
            print(f"Brand: {food.get('brand_name', 'N/A')}")
            print(f"Calories: {food.get('nutrients', {}).get('calories', 'N/A')}")
            print(f"Protein: {food.get('nutrients', {}).get('protein', 'N/A')}g")
            print(f"Carbs: {food.get('nutrients', {}).get('carbs', 'N/A')}g")
            print(f"Fat: {food.get('nutrients', {}).get('fat', 'N/A')}g")
    
    # Test barcode lookup
    barcode_results = await service.get_food_by_barcode("3017620422003")  # Example: Nutella barcode
    if barcode_results.get("success"):
        food = barcode_results["food"]
        print(f"\nBarcode lookup from {barcode_results.get('source', 'unknown')}:")
        print(f"Name: {food.get('food_name')}")
        print(f"Brand: {food.get('brand_name', 'N/A')}")
        print(f"Calories: {food.get('nutrients', {}).get('calories', 'N/A')}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_enhanced_food_service())
