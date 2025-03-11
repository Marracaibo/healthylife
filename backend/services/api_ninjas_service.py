"""
API Ninjas Food Service

This service provides methods to interact with the API Ninjas (formerly CalorieNinjas)
for retrieving food and nutrition information.
"""

import aiohttp
from typing import Dict, List, Any, Optional

class APINinjasService:
    """Service for interacting with the API Ninjas nutrition API."""
    
    BASE_URL = "https://api.api-ninjas.com/v1/nutrition"
    
    def __init__(self, api_key: str = None):
        """Initialize the API Ninjas Service with API key."""
        self.api_key = api_key
        if not self.api_key:
            print("Warning: API Ninjas API key not provided")
    
    async def search_food(self, query: str) -> Dict[str, Any]:
        """
        Search for nutrition information for a food item.
        
        Args:
            query: The food item to search for (e.g., "1 cup rice" or "banana")
            
        Returns:
            Dictionary containing nutrition information
        """
        params = {
            "query": query
        }
        
        headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL, params=params, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"Error searching food: {error_text}")
                    return {"error": f"API request failed with status {response.status}", "details": error_text}
    
    async def format_food_data(self, food_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Format the API Ninjas API response into a standardized format compatible with our application.
        
        Args:
            food_data: Raw food data from the API Ninjas API
            
        Returns:
            Formatted food data in our application's standard format
        """
        try:
            if not food_data or isinstance(food_data, dict) and "error" in food_data:
                return {"error": "No food data found or error in response"}
            
            # Take the first item if it's a list
            food_item = food_data[0] if isinstance(food_data, list) and food_data else food_data
            
            # Extract basic food information
            formatted_data = {
                "food_id": f"ninja_{food_item.get('name', '').replace(' ', '_').lower()}",
                "food_name": food_item.get("name", "Unknown Food"),
                "brand_name": "",  # API Ninjas doesn't provide brand information
                "serving_size": food_item.get("serving_size_g", 100),
                "serving_unit": "g",
                "nutrients": {
                    "calories": food_item.get("calories", 0),
                    "protein": food_item.get("protein_g", 0),
                    "carbs": food_item.get("carbohydrates_total_g", 0),
                    "fat": food_item.get("fat_total_g", 0),
                    "fiber": food_item.get("fiber_g", 0),
                    "sugar": food_item.get("sugar_g", 0)
                }
            }
            
            return formatted_data
        except Exception as e:
            print(f"Error formatting food data: {str(e)}")
            return {"error": f"Failed to format food data: {str(e)}"}
    
    async def format_search_results(self, search_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Format search results into a standardized list for the application.
        
        Args:
            search_results: Raw search results from the API Ninjas API
            
        Returns:
            List of formatted food items
        """
        formatted_results = []
        
        try:
            if not search_results or isinstance(search_results, dict) and "error" in search_results:
                return []
            
            for item in search_results:
                # Basic food information
                formatted_food = {
                    "food_id": f"ninja_{item.get('name', '').replace(' ', '_').lower()}",
                    "food_name": item.get("name", "Unknown Food"),
                    "brand_name": "",  # API Ninjas doesn't provide brand information
                    "serving_size": item.get("serving_size_g", 100),
                    "serving_unit": "g",
                    "nutrients": {
                        "calories": item.get("calories", 0),
                        "protein": item.get("protein_g", 0),
                        "carbs": item.get("carbohydrates_total_g", 0),
                        "fat": item.get("fat_total_g", 0),
                        "fiber": item.get("fiber_g", 0),
                        "sugar": item.get("sugar_g", 0)
                    }
                }
                
                formatted_results.append(formatted_food)
                
            return formatted_results
        except Exception as e:
            print(f"Error formatting search results: {str(e)}")
            return [{"error": f"Failed to format search results: {str(e)}"}]


# Example usage
async def test_api_ninjas_service(api_key: str):
    """Test function to demonstrate API Ninjas Service usage."""
    service = APINinjasService(api_key)
    
    # Search for a food
    search_results = await service.search_food("banana")
    print(f"API Ninjas results for 'banana':")
    
    if isinstance(search_results, list) and search_results:
        print(f"Found {len(search_results)} results")
        
        # Format the search results
        formatted_results = await service.format_search_results(search_results)
        
        for item in formatted_results:
            print(f"\nFood: {item['food_name']}")
            print(f"Serving: {item['serving_size']} {item['serving_unit']}")
            print(f"Calories: {item['nutrients']['calories']}")
            print(f"Protein: {item['nutrients']['protein']}g")
            print(f"Carbs: {item['nutrients']['carbs']}g")
            print(f"Fat: {item['nutrients']['fat']}g")
    else:
        print(f"Error or no results: {search_results}")


if __name__ == "__main__":
    import asyncio
    import sys
    
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        asyncio.run(test_api_ninjas_service(api_key))
    else:
        print("Please provide an API key as a command line argument")
