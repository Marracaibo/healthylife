"""
Open Food Facts API Service

This service provides methods to interact with the Open Food Facts API
for retrieving food and nutrition information from their open database.
"""

import aiohttp
from typing import Dict, List, Any, Optional

class OpenFoodFactsService:
    """Service for interacting with the Open Food Facts API."""
    
    BASE_URL = "https://world.openfoodfacts.org/api/v0"
    
    async def search_food(self, query: str, page_size: int = 25, page: int = 1) -> Dict[str, Any]:
        """
        Search for foods in the Open Food Facts database.
        
        Args:
            query: The search term to find foods
            page_size: Number of results per page (default: 25)
            page: Page number for pagination (default: 1)
            
        Returns:
            Dictionary containing search results
        """
        endpoint = f"{self.BASE_URL}/search"
        params = {
            "search_terms": query,
            "page_size": page_size,
            "page": page,
            "json": 1
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint, params=params) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"Error searching food: {error_text}")
                    return {"error": f"API request failed with status {response.status}", "details": error_text}
    
    async def get_product_by_barcode(self, barcode: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific product by its barcode.
        
        Args:
            barcode: The barcode of the product
            
        Returns:
            Dictionary containing detailed product information
        """
        endpoint = f"{self.BASE_URL}/product/{barcode}.json"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    print(f"Error getting product details: {error_text}")
                    return {"error": f"API request failed with status {response.status}", "details": error_text}
    
    async def format_food_data(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format the Open Food Facts API response into a standardized format compatible with our application.
        
        Args:
            product_data: Raw product data from the Open Food Facts API
            
        Returns:
            Formatted food data in our application's standard format
        """
        try:
            # Check if product exists and has required data
            if not product_data.get("product"):
                return {"error": "Product data not found"}
            
            product = product_data["product"]
            
            # Extract basic food information
            formatted_data = {
                "food_id": product.get("code", ""),
                "food_name": product.get("product_name", ""),
                "brand_name": product.get("brands", ""),
                "serving_size": product.get("serving_quantity", None),
                "serving_unit": "g",  # Open Food Facts typically uses grams
                "image_url": product.get("image_url", ""),
                "nutrients": {}
            }
            
            # Extract nutrients from the nutriments object
            nutriments = product.get("nutriments", {})
            
            # Map common nutrients to our standard format
            if "proteins" in nutriments:
                formatted_data["nutrients"]["protein"] = nutriments.get("proteins", 0)
            if "carbohydrates" in nutriments:
                formatted_data["nutrients"]["carbs"] = nutriments.get("carbohydrates", 0)
            if "fat" in nutriments:
                formatted_data["nutrients"]["fat"] = nutriments.get("fat", 0)
            if "energy-kcal" in nutriments:
                formatted_data["nutrients"]["calories"] = nutriments.get("energy-kcal", 0)
            elif "energy" in nutriments:
                # Convert kJ to kcal if needed (approximate conversion)
                energy_kj = nutriments.get("energy", 0)
                formatted_data["nutrients"]["calories"] = round(energy_kj / 4.184)
            if "fiber" in nutriments:
                formatted_data["nutrients"]["fiber"] = nutriments.get("fiber", 0)
            if "sugars" in nutriments:
                formatted_data["nutrients"]["sugar"] = nutriments.get("sugars", 0)
            
            # Add additional useful information
            formatted_data["ingredients"] = product.get("ingredients_text", "")
            formatted_data["allergens"] = product.get("allergens", "")
            
            return formatted_data
        except Exception as e:
            print(f"Error formatting food data: {str(e)}")
            return {"error": f"Failed to format food data: {str(e)}"}
    
    async def format_search_results(self, search_results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Format search results into a standardized list for the application.
        
        Args:
            search_results: Raw search results from the Open Food Facts API
            
        Returns:
            List of formatted food items
        """
        formatted_results = []
        
        try:
            products = search_results.get("products", [])
            for product in products:
                # Basic food information
                formatted_food = {
                    "food_id": product.get("code", ""),
                    "food_name": product.get("product_name", ""),
                    "brand_name": product.get("brands", ""),
                    "image_url": product.get("image_small_url", ""),
                    "nutrients": {}
                }
                
                # Extract nutrients
                nutriments = product.get("nutriments", {})
                
                # Map common nutrients
                if "proteins" in nutriments:
                    formatted_food["nutrients"]["protein"] = nutriments.get("proteins", 0)
                if "carbohydrates" in nutriments:
                    formatted_food["nutrients"]["carbs"] = nutriments.get("carbohydrates", 0)
                if "fat" in nutriments:
                    formatted_food["nutrients"]["fat"] = nutriments.get("fat", 0)
                if "energy-kcal" in nutriments:
                    formatted_food["nutrients"]["calories"] = nutriments.get("energy-kcal", 0)
                elif "energy" in nutriments:
                    # Convert kJ to kcal if needed (approximate conversion)
                    energy_kj = nutriments.get("energy", 0)
                    formatted_food["nutrients"]["calories"] = round(energy_kj / 4.184)
                
                formatted_results.append(formatted_food)
                
            return formatted_results
        except Exception as e:
            print(f"Error formatting search results: {str(e)}")
            return [{"error": f"Failed to format search results: {str(e)}"}]


# Example usage
async def test_open_food_facts_service():
    """Test function to demonstrate Open Food Facts Service usage."""
    service = OpenFoodFactsService()
    
    # Search for a food
    search_results = await service.search_food("nutella")
    print(f"Found {search_results.get('count', 0)} products")
    
    # Get details for the first result if available
    if "products" in search_results and len(search_results["products"]) > 0:
        first_product_code = search_results["products"][0]["code"]
        product_details = await service.get_product_by_barcode(first_product_code)
        
        # Format the product details
        formatted_product = await service.format_food_data(product_details)
        print(f"Formatted product: {formatted_product['food_name']} by {formatted_product['brand_name']}")
        print(f"Calories: {formatted_product['nutrients'].get('calories', 'N/A')}")
        print(f"Protein: {formatted_product['nutrients'].get('protein', 'N/A')}g")
    
    # Format search results
    formatted_results = await service.format_search_results(search_results)
    print(f"Formatted {len(formatted_results)} search results")


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_open_food_facts_service())
