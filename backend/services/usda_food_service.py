"""
USDA FoodData Central API Service

This service provides methods to interact with the USDA FoodData Central API
for retrieving food and nutrition information.
"""

import os
import aiohttp
import json
from dotenv import load_dotenv
from typing import Dict, List, Any, Optional

# Load environment variables
load_dotenv()

class USDAFoodService:
    """Service for interacting with the USDA FoodData Central API."""
    
    BASE_URL = "https://api.nal.usda.gov/fdc/v1"
    
    def __init__(self):
        """Initialize the USDA Food Service with API key from environment variables."""
        self.api_key = os.getenv("USDA_API_KEY")
        if not self.api_key:
            print("Warning: USDA_API_KEY not found in environment variables")
    
    async def search_food(self, query: str, page_size: int = 25, page_number: int = 1) -> Dict[str, Any]:
        """
        Search for foods in the USDA FoodData Central database.
        
        Args:
            query: The search term to find foods
            page_size: Number of results per page (default: 25)
            page_number: Page number for pagination (default: 1)
            
        Returns:
            Dictionary containing search results
        """
        endpoint = f"{self.BASE_URL}/foods/search"
        params = {
            "api_key": self.api_key,
            "query": query,
            "pageSize": page_size,
            "pageNumber": page_number,
            "dataType": ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"Error searching food: {error_text}")
                    return {"error": f"API request failed with status {response.status}", "details": error_text}
    
    async def get_food_details(self, food_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific food by its ID.
        
        Args:
            food_id: The USDA FoodData Central ID of the food
            
        Returns:
            Dictionary containing detailed food information
        """
        endpoint = f"{self.BASE_URL}/food/{food_id}"
        params = {
            "api_key": self.api_key,
            "format": "full"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"Error getting food details: {error_text}")
                    return {"error": f"API request failed with status {response.status}", "details": error_text}
    
    async def format_food_data(self, food_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format the USDA API response into a standardized format compatible with our application.
        
        Args:
            food_data: Raw food data from the USDA API
            
        Returns:
            Formatted food data in our application's standard format
        """
        try:
            # Extract basic food information
            formatted_data = {
                "food_id": food_data.get("fdcId", ""),
                "food_name": food_data.get("description", ""),
                "brand_name": food_data.get("brandName", ""),
                "serving_size": None,
                "serving_unit": None,
                "nutrients": {}
            }
            
            # Extract serving size information if available
            portions = food_data.get("foodPortions", [])
            if portions and len(portions) > 0:
                formatted_data["serving_size"] = portions[0].get("amount", None)
                formatted_data["serving_unit"] = portions[0].get("measureUnit", {}).get("name", None)
            
            # Extract nutrients
            nutrients = food_data.get("foodNutrients", [])
            for nutrient in nutrients:
                nutrient_data = nutrient.get("nutrient", {})
                nutrient_name = nutrient_data.get("name", "").lower()
                amount = nutrient.get("amount", 0)
                
                # Map common nutrients to our standard format
                if "protein" in nutrient_name:
                    formatted_data["nutrients"]["protein"] = amount
                elif "carbohydrate" in nutrient_name:
                    formatted_data["nutrients"]["carbs"] = amount
                elif "fat" in nutrient_name and "total" in nutrient_name:
                    formatted_data["nutrients"]["fat"] = amount
                elif "energy" in nutrient_name or "calorie" in nutrient_name:
                    formatted_data["nutrients"]["calories"] = amount
                elif "fiber" in nutrient_name:
                    formatted_data["nutrients"]["fiber"] = amount
                elif "sugar" in nutrient_name:
                    formatted_data["nutrients"]["sugar"] = amount
                
            return formatted_data
        except Exception as e:
            print(f"Error formatting food data: {str(e)}")
            return {"error": f"Failed to format food data: {str(e)}"}
    
    async def format_search_results(self, search_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Format search results into a standardized list for the application.
        
        Args:
            search_results: Raw search results from the USDA API
            
        Returns:
            List of formatted food items
        """
        formatted_results = []
        
        try:
            foods = search_results.get("foods", [])
            for food in foods:
                # Basic food information
                formatted_food = {
                    "food_id": food.get("fdcId", ""),
                    "food_name": food.get("description", ""),
                    "brand_name": food.get("brandName", ""),
                    "nutrients": {}
                }
                
                # Extract nutrients
                nutrients = food.get("foodNutrients", [])
                for nutrient in nutrients:
                    nutrient_name = nutrient.get("nutrientName", "").lower()
                    amount = nutrient.get("value", 0)
                    
                    # Map common nutrients
                    if "protein" in nutrient_name:
                        formatted_food["nutrients"]["protein"] = amount
                    elif "carbohydrate" in nutrient_name:
                        formatted_food["nutrients"]["carbs"] = amount
                    elif "fat" in nutrient_name and "total" in nutrient_name:
                        formatted_food["nutrients"]["fat"] = amount
                    elif "energy" in nutrient_name or "calorie" in nutrient_name:
                        formatted_food["nutrients"]["calories"] = amount
                
                formatted_results.append(formatted_food)
                
            return formatted_results
        except Exception as e:
            print(f"Error formatting search results: {str(e)}")
            return [{"error": f"Failed to format search results: {str(e)}"}]


# Example usage
async def test_usda_service():
    """Test function to demonstrate USDA Food Service usage."""
    service = USDAFoodService()
    
    # Search for a food
    search_results = await service.search_food("banana")
    print(json.dumps(search_results, indent=2))
    
    # Get details for the first result if available
    if "foods" in search_results and len(search_results["foods"]) > 0:
        first_food_id = search_results["foods"][0]["fdcId"]
        food_details = await service.get_food_details(first_food_id)
        print(json.dumps(food_details, indent=2))
        
        # Format the food details
        formatted_food = await service.format_food_data(food_details)
        print(json.dumps(formatted_food, indent=2))
    
    # Format search results
    formatted_results = await service.format_search_results(search_results)
    print(json.dumps(formatted_results, indent=2))


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_usda_service())
