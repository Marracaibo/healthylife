"""
Test script for the Combined Food Service

This script tests the functionality of the CombinedFoodService
which integrates USDA FoodData Central and API Ninjas.
"""

import asyncio
import json
import os
import time

from services.combined_food_service import CombinedFoodService

# API Keys
USDA_API_KEY = "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm"
API_NINJAS_KEY = "TNEIZLg+ymxjvlbZT9wMdQ==EsLkylfTtpsNMSgv"

# Create output directory if it doesn't exist
os.makedirs("test_results/combined", exist_ok=True)

async def test_combined_service():
    """Test the combined food service functionality."""
    print("Testing Combined Food Service...")
    
    # Initialize the service
    service = CombinedFoodService(USDA_API_KEY, API_NINJAS_KEY)
    
    # Test foods
    test_foods = ["banana", "apple", "chicken breast", "broccoli", "salmon"]
    
    results = {}
    
    # Test standard search (with fallback)
    print("\nTesting standard search with fallback:")
    for food in test_foods:
        print(f"  Searching for '{food}'...")
        result = await service.search_food(food)
        
        print(f"    Found {result['total_results']} results from {result['source']} "
              f"in {result['response_time']:.2f}s")
        
        results[f"standard_{food}"] = result
    
    # Test combined search (from all sources)
    print("\nTesting combined search from all sources:")
    for food in test_foods:
        print(f"  Searching for '{food}' from all sources...")
        result = await service.search_food_from_all_sources(food)
        
        print(f"    Found {result['total_results']} total results "
              f"(USDA: {result['usda_results']}, API Ninjas: {result['api_ninjas_results']}) "
              f"in {result['response_time']:.2f}s")
        
        results[f"combined_{food}"] = result
    
    # Test caching
    print("\nTesting cache functionality:")
    food = "banana"
    
    # First search (should hit the API)
    print(f"  First search for '{food}'...")
    start_time = time.time()
    result1 = await service.search_food(food)
    first_search_time = time.time() - start_time
    
    # Second search (should hit the cache)
    print(f"  Second search for '{food}' (should use cache)...")
    start_time = time.time()
    result2 = await service.search_food(food)
    second_search_time = time.time() - start_time
    
    print(f"    First search: {first_search_time:.4f}s")
    print(f"    Second search: {second_search_time:.4f}s")
    print(f"    Cache speedup: {first_search_time / max(second_search_time, 0.0001):.1f}x")
    
    # Save results
    with open("test_results/combined/combined_service_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nTest results saved to test_results/combined/combined_service_results.json")
    
    # Generate a summary report
    generate_summary_report(results)

def generate_summary_report(results):
    """Generate a summary report from the test results."""
    report = "# Combined Food Service Test Results\n\n"
    
    # Add standard search results
    report += "## Standard Search Results (with Fallback)\n\n"
    report += "| Food | Results | Source | Response Time |\n"
    report += "|------|---------|--------|---------------|\n"
    
    for food in ["banana", "apple", "chicken breast", "broccoli", "salmon"]:
        result = results.get(f"standard_{food}")
        if result:
            report += f"| {food.capitalize()} | {result['total_results']} | {result['source']} | {result['response_time']:.2f}s |\n"
    
    # Add combined search results
    report += "\n## Combined Search Results (All Sources)\n\n"
    report += "| Food | Total Results | USDA Results | API Ninjas Results | Response Time |\n"
    report += "|------|--------------|--------------|-------------------|---------------|\n"
    
    for food in ["banana", "apple", "chicken breast", "broccoli", "salmon"]:
        result = results.get(f"combined_{food}")
        if result:
            report += f"| {food.capitalize()} | {result['total_results']} | {result['usda_results']} | {result['api_ninjas_results']} | {result['response_time']:.2f}s |\n"
    
    # Save the report
    with open("test_results/combined/combined_service_report.md", "w") as f:
        f.write(report)
    
    print("Summary report saved to test_results/combined/combined_service_report.md")

async def main():
    """Run the test script."""
    await test_combined_service()

if __name__ == "__main__":
    asyncio.run(main())
