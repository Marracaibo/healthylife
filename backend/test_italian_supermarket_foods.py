"""
Test script for Italian supermarket foods

This script tests how well different food APIs handle typical Italian
supermarket products and local food items.
"""

import asyncio
import json
import os
import time
from typing import Dict, List, Any

from services.usda_food_service import USDAFoodService
from services.api_ninjas_service import APINinjasService
from services.combined_food_service import CombinedFoodService

# API Keys
USDA_API_KEY = "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm"
API_NINJAS_KEY = "TNEIZLg+ymxjvlbZT9wMdQ==EsLkylfTtpsNMSgv"

# Create output directory if it doesn't exist
os.makedirs("test_results/italian_foods", exist_ok=True)

# List of typical Italian supermarket foods
ITALIAN_FOODS = [
    "pasta barilla",
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala",
    "gorgonzola",
    "olio extravergine di oliva",
    "pomodori san marzano",
    "pesto alla genovese",
    "panettone",
    "tiramisù",
    "gnocchi",
    "polenta",
    "bresaola",
    "pecorino romano",
    "aceto balsamico"
]

async def test_italian_foods():
    """Test how well the APIs handle Italian foods."""
    print("Testing APIs with Italian supermarket foods...")
    
    # Initialize services
    usda_service = USDAFoodService()
    usda_service.api_key = USDA_API_KEY
    
    api_ninjas_service = APINinjasService(API_NINJAS_KEY)
    
    combined_service = CombinedFoodService(USDA_API_KEY, API_NINJAS_KEY)
    
    results = {
        "usda": {},
        "api_ninjas": {},
        "combined": {}
    }
    
    # Test USDA API
    print("\nTesting USDA FoodData Central API:")
    for food in ITALIAN_FOODS:
        print(f"  Searching for '{food}'...")
        start_time = time.time()
        
        try:
            search_results = await usda_service.search_food(food)
            response_time = time.time() - start_time
            
            foods = search_results.get("foods", [])
            result_count = len(foods)
            
            print(f"    Found {result_count} results in {response_time:.2f}s")
            
            results["usda"][food] = {
                "success": "error" not in search_results,
                "result_count": result_count,
                "response_time": response_time,
                "first_result": foods[0] if foods else None
            }
        except Exception as e:
            print(f"    Error: {str(e)}")
            results["usda"][food] = {
                "success": False,
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    # Test API Ninjas
    print("\nTesting API Ninjas:")
    for food in ITALIAN_FOODS:
        print(f"  Searching for '{food}'...")
        start_time = time.time()
        
        try:
            search_results = await api_ninjas_service.search_food(food)
            response_time = time.time() - start_time
            
            result_count = len(search_results) if isinstance(search_results, list) else 0
            
            print(f"    Found {result_count} results in {response_time:.2f}s")
            
            results["api_ninjas"][food] = {
                "success": isinstance(search_results, list) and len(search_results) > 0,
                "result_count": result_count,
                "response_time": response_time,
                "first_result": search_results[0] if result_count > 0 else None
            }
        except Exception as e:
            print(f"    Error: {str(e)}")
            results["api_ninjas"][food] = {
                "success": False,
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    # Test Combined Service
    print("\nTesting Combined Service:")
    for food in ITALIAN_FOODS:
        print(f"  Searching for '{food}' from all sources...")
        start_time = time.time()
        
        try:
            search_results = await combined_service.search_food_from_all_sources(food)
            response_time = time.time() - start_time
            
            print(f"    Found {search_results['total_results']} total results "
                  f"(USDA: {search_results.get('usda_results', 0)}, "
                  f"API Ninjas: {search_results.get('api_ninjas_results', 0)}) "
                  f"in {response_time:.2f}s")
            
            results["combined"][food] = {
                "success": search_results['total_results'] > 0,
                "total_results": search_results['total_results'],
                "usda_results": search_results.get('usda_results', 0),
                "api_ninjas_results": search_results.get('api_ninjas_results', 0),
                "response_time": response_time,
                "first_result": search_results['foods'][0] if search_results['foods'] else None
            }
        except Exception as e:
            print(f"    Error: {str(e)}")
            results["combined"][food] = {
                "success": False,
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    # Save detailed results
    with open("test_results/italian_foods/detailed_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nDetailed results saved to test_results/italian_foods/detailed_results.json")
    
    # Generate summary
    generate_summary(results)

def generate_summary(results: Dict[str, Any]):
    """Generate a summary of the test results."""
    summary = {
        "usda": {
            "success_rate": 0,
            "average_results": 0,
            "average_response_time": 0,
            "foods_found": []
        },
        "api_ninjas": {
            "success_rate": 0,
            "average_results": 0,
            "average_response_time": 0,
            "foods_found": []
        },
        "combined": {
            "success_rate": 0,
            "average_results": 0,
            "average_response_time": 0,
            "foods_found": []
        }
    }
    
    # Calculate statistics for each API
    for api in ["usda", "api_ninjas", "combined"]:
        api_results = results[api]
        success_count = 0
        total_results = 0
        total_time = 0
        
        for food, result in api_results.items():
            if result.get("success", False):
                success_count += 1
                total_time += result["response_time"]
                
                if api == "combined":
                    total_results += result["total_results"]
                    summary[api]["foods_found"].append(food)
                else:
                    total_results += result["result_count"]
                    summary[api]["foods_found"].append(food)
        
        # Calculate averages
        total_foods = len(ITALIAN_FOODS)
        summary[api]["success_rate"] = (success_count / total_foods) * 100
        summary[api]["average_results"] = total_results / max(success_count, 1)
        summary[api]["average_response_time"] = total_time / max(success_count, 1)
    
    # Save summary
    with open("test_results/italian_foods/summary.json", "w") as f:
        json.dump(summary, f, indent=2)
    
    # Generate markdown report
    generate_markdown_report(results, summary)
    
    print("Summary saved to test_results/italian_foods/summary.json")
    print("Report saved to test_results/italian_foods/report.md")

def generate_markdown_report(results: Dict[str, Any], summary: Dict[str, Any]):
    """Generate a markdown report from the test results."""
    report = "# Italian Supermarket Foods API Test Results\n\n"
    
    # Add summary section
    report += "## Summary\n\n"
    report += "| API | Success Rate | Avg. Results | Avg. Response Time |\n"
    report += "|-----|-------------|--------------|--------------------|\n"
    
    for api in ["usda", "api_ninjas", "combined"]:
        api_name = {
            "usda": "USDA FoodData Central",
            "api_ninjas": "API Ninjas",
            "combined": "Combined Service"
        }[api]
        
        report += f"| {api_name} | {summary[api]['success_rate']:.1f}% | "
        report += f"{summary[api]['average_results']:.1f} | "
        report += f"{summary[api]['average_response_time']:.2f}s |\n"
    
    # Add foods found by each API
    report += "\n## Foods Found by Each API\n\n"
    
    for api in ["usda", "api_ninjas", "combined"]:
        api_name = {
            "usda": "USDA FoodData Central",
            "api_ninjas": "API Ninjas",
            "combined": "Combined Service"
        }[api]
        
        foods_found = summary[api]["foods_found"]
        report += f"### {api_name}\n\n"
        
        if foods_found:
            report += "- " + "\n- ".join(foods_found) + "\n\n"
        else:
            report += "No Italian foods found.\n\n"
    
    # Add detailed results for each food
    report += "## Detailed Results by Food\n\n"
    
    for food in ITALIAN_FOODS:
        report += f"### {food.capitalize()}\n\n"
        report += "| API | Success | Results | Response Time |\n"
        report += "|-----|---------|---------|---------------|\n"
        
        for api in ["usda", "api_ninjas", "combined"]:
            api_name = {
                "usda": "USDA FoodData Central",
                "api_ninjas": "API Ninjas",
                "combined": "Combined Service"
            }[api]
            
            result = results[api].get(food, {})
            success = "Yes" if result.get("success", False) else "No"
            
            if api == "combined":
                count = result.get("total_results", 0)
            else:
                count = result.get("result_count", 0)
                
            time = f"{result.get('response_time', 0):.2f}s"
            
            report += f"| {api_name} | {success} | {count} | {time} |\n"
        
        report += "\n"
    
    # Save the report
    with open("test_results/italian_foods/report.md", "w") as f:
        f.write(report)

async def main():
    """Run the test script."""
    await test_italian_foods()

if __name__ == "__main__":
    asyncio.run(main())
