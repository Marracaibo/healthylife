"""
Test script for comparing different food API services.

This script tests and compares the USDA FoodData Central API and 
Open Food Facts API for food search and nutrition data retrieval.
"""

import asyncio
import json
import os
from dotenv import load_dotenv
from services.usda_food_service import USDAFoodService
from services.open_food_facts_service import OpenFoodFactsService
from services.enhanced_food_service import EnhancedFoodService

# Load environment variables
load_dotenv()

# Create output directory if it doesn't exist
os.makedirs("test_results", exist_ok=True)

async def test_usda_api():
    """Test the USDA FoodData Central API."""
    print("\n===== Testing USDA FoodData Central API =====")
    
    # Check if API key is available
    api_key = os.getenv("USDA_API_KEY")
    if not api_key:
        print("USDA_API_KEY not found in environment variables. Skipping test.")
        return
    
    service = USDAFoodService()
    
    # Test food search
    print("\nSearching for 'banana'...")
    search_results = await service.search_food("banana")
    
    # Save raw results
    with open("test_results/usda_banana_search.json", "w") as f:
        json.dump(search_results, f, indent=2)
    
    # Format and display results
    if "foods" in search_results:
        print(f"Found {len(search_results['foods'])} results")
        formatted_results = await service.format_search_results(search_results)
        
        # Save formatted results
        with open("test_results/usda_banana_search_formatted.json", "w") as f:
            json.dump(formatted_results, f, indent=2)
        
        # Display first result
        if formatted_results:
            first_food = formatted_results[0]
            print(f"\nFirst result: {first_food['food_name']}")
            print(f"Nutrients: {first_food['nutrients']}")
    else:
        print(f"Error: {search_results.get('error', 'Unknown error')}")
    
    # Test food details
    if "foods" in search_results and search_results["foods"]:
        first_food_id = search_results["foods"][0]["fdcId"]
        print(f"\nGetting details for food ID {first_food_id}...")
        
        food_details = await service.get_food_details(first_food_id)
        
        # Save raw details
        with open("test_results/usda_food_details.json", "w") as f:
            json.dump(food_details, f, indent=2)
        
        # Format and display details
        formatted_food = await service.format_food_data(food_details)
        
        # Save formatted details
        with open("test_results/usda_food_details_formatted.json", "w") as f:
            json.dump(formatted_food, f, indent=2)
        
        print(f"Food name: {formatted_food['food_name']}")
        print(f"Serving size: {formatted_food['serving_size']} {formatted_food['serving_unit'] or ''}")
        print(f"Nutrients: {formatted_food['nutrients']}")

async def test_open_food_facts_api():
    """Test the Open Food Facts API."""
    print("\n===== Testing Open Food Facts API =====")
    
    service = OpenFoodFactsService()
    
    # Test food search
    print("\nSearching for 'banana'...")
    search_results = await service.search_food("banana")
    
    # Save raw results
    with open("test_results/off_banana_search.json", "w") as f:
        json.dump(search_results, f, indent=2)
    
    # Format and display results
    if "products" in search_results:
        print(f"Found {len(search_results['products'])} results")
        formatted_results = await service.format_search_results(search_results)
        
        # Save formatted results
        with open("test_results/off_banana_search_formatted.json", "w") as f:
            json.dump(formatted_results, f, indent=2)
        
        # Display first result
        if formatted_results:
            first_food = formatted_results[0]
            print(f"\nFirst result: {first_food['food_name']}")
            print(f"Brand: {first_food['brand_name']}")
            print(f"Nutrients: {first_food['nutrients']}")
    else:
        print(f"Error: {search_results.get('error', 'Unknown error')}")
    
    # Test barcode lookup
    barcode = "8076800195057"  # Example barcode for Barilla pasta
    print(f"\nLooking up barcode {barcode}...")
    
    product_details = await service.get_product_by_barcode(barcode)
    
    # Save raw details
    with open("test_results/off_barcode_lookup.json", "w") as f:
        json.dump(product_details, f, indent=2)
    
    # Format and display details
    if "product" in product_details:
        formatted_product = await service.format_food_data(product_details)
        
        # Save formatted details
        with open("test_results/off_barcode_lookup_formatted.json", "w") as f:
            json.dump(formatted_product, f, indent=2)
        
        print(f"Product name: {formatted_product['food_name']}")
        print(f"Brand: {formatted_product['brand_name']}")
        print(f"Nutrients: {formatted_product['nutrients']}")
    else:
        print(f"Error: {product_details.get('error', 'Unknown error')}")

async def test_enhanced_food_service():
    """Test the Enhanced Food Service that combines multiple APIs."""
    print("\n===== Testing Enhanced Food Service =====")
    
    service = EnhancedFoodService()
    
    # Test food search with different queries
    test_queries = ["apple", "chicken breast", "coca cola", "banana"]
    
    for query in test_queries:
        print(f"\nSearching for '{query}'...")
        search_results = await service.search_food(query)
        
        # Save results
        with open(f"test_results/enhanced_{query.replace(' ', '_')}_search.json", "w") as f:
            json.dump(search_results, f, indent=2)
        
        print(f"Source: {search_results.get('source', 'None')}")
        print(f"Success: {search_results.get('success', False)}")
        print(f"Found {len(search_results.get('foods', []))} foods")
        
        # Get details for first result if available
        if search_results.get("success") and search_results.get("foods"):
            first_food = search_results["foods"][0]
            food_id = first_food["food_id"]
            source = search_results["source"]
            
            print(f"\nGetting details for {first_food.get('food_name', 'unknown food')}...")
            food_details = await service.get_food_details(food_id, source)
            
            # Save details
            with open(f"test_results/enhanced_{query.replace(' ', '_')}_details.json", "w") as f:
                json.dump(food_details, f, indent=2)
            
            if food_details.get("success"):
                food = food_details["food"]
                print(f"Source: {food_details.get('source', 'None')}")
                print(f"Name: {food.get('food_name')}")
                print(f"Nutrients: {food.get('nutrients', {})}")
            else:
                print(f"Error: {food_details.get('error', 'Unknown error')}")
    
    # Test barcode lookup
    barcodes = ["3017620422003", "8076800195057"]  # Example barcodes
    
    for barcode in barcodes:
        print(f"\nLooking up barcode {barcode}...")
        barcode_results = await service.get_food_by_barcode(barcode)
        
        # Save results
        with open(f"test_results/enhanced_barcode_{barcode}.json", "w") as f:
            json.dump(barcode_results, f, indent=2)
        
        if barcode_results.get("success"):
            food = barcode_results["food"]
            print(f"Source: {barcode_results.get('source', 'None')}")
            print(f"Name: {food.get('food_name')}")
            print(f"Brand: {food.get('brand_name', 'N/A')}")
            print(f"Nutrients: {food.get('nutrients', {})}")
        else:
            print(f"Error: {barcode_results.get('error', 'Unknown error')}")

async def main():
    """Run all API tests."""
    print("===== Starting Food API Tests =====")
    
    # Test individual APIs
    await test_usda_api()
    await test_open_food_facts_api()
    
    # Test combined service
    await test_enhanced_food_service()
    
    print("\n===== Food API Tests Complete =====")
    print(f"Results saved in the 'test_results' directory")

if __name__ == "__main__":
    asyncio.run(main())
