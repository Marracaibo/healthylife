"""
API Comparison Test Script

This script compares food search results from multiple APIs:
- USDA FoodData Central API
- API Ninjas (formerly CalorieNinjas)

It tests with common food queries and compares the results for completeness,
accuracy, and response time.
"""

import asyncio
import json
import os
import time
from typing import Dict, List, Any
import traceback

# Create output directory if it doesn't exist
os.makedirs("test_results/comparison", exist_ok=True)

# API Keys
USDA_API_KEY = "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm"
API_NINJAS_KEY = "TNEIZLg+ymxjvlbZT9wMdQ==EsLkylfTtpsNMSgv"

# Import services
from services.usda_food_service import USDAFoodService
from services.api_ninjas_service import APINinjasService

# Test food items
TEST_FOODS = [
    "banana",
    "apple",
    "chicken breast",
    "rice",
    "pasta",
    "broccoli",
    "salmon",
    "bread",
    "milk",
    "egg"
]

class APIComparisonTest:
    """Class to handle API comparison tests."""
    
    def __init__(self):
        """Initialize the API services."""
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = USDA_API_KEY
        
        self.ninjas_service = APINinjasService(API_NINJAS_KEY)
        
        self.results = {
            "summary": {},
            "detailed": {}
        }
    
    async def test_all_apis(self):
        """Run tests on all APIs with all test foods."""
        print("Starting API comparison tests...")
        
        for food in TEST_FOODS:
            print(f"\nTesting food item: {food}")
            self.results["detailed"][food] = {}
            
            try:
                # Test USDA API
                usda_result = await self.test_usda_api(food)
                self.results["detailed"][food]["usda"] = usda_result
            except Exception as e:
                print(f"  Error testing USDA API: {str(e)}")
                self.results["detailed"][food]["usda"] = {
                    "response_time": 0,
                    "success": False,
                    "error": str(e),
                    "result_count": 0,
                    "first_result": None,
                    "formatted_results": []
                }
            
            try:
                # Test API Ninjas
                ninjas_result = await self.test_api_ninjas(food)
                self.results["detailed"][food]["api_ninjas"] = ninjas_result
            except Exception as e:
                print(f"  Error testing API Ninjas: {str(e)}")
                self.results["detailed"][food]["api_ninjas"] = {
                    "response_time": 0,
                    "success": False,
                    "error": str(e),
                    "result_count": 0,
                    "first_result": None,
                    "formatted_results": []
                }
            
            # Compare results
            await self.compare_results(food)
        
        # Generate summary
        self.generate_summary()
        
        # Save results
        self.save_results()
        
        print("\nAPI comparison tests completed. Results saved to test_results/comparison directory.")
    
    async def test_usda_api(self, food: str) -> Dict[str, Any]:
        """Test the USDA FoodData Central API."""
        print(f"  Testing USDA API for '{food}'...")
        
        start_time = time.time()
        try:
            search_results = await self.usda_service.search_food(food)
            response_time = time.time() - start_time
            
            result = {
                "response_time": response_time,
                "success": False,
                "error": None,
                "result_count": 0,
                "first_result": None,
                "formatted_results": []
            }
            
            if "error" in search_results:
                result["error"] = search_results["error"]
                return result
            
            foods = search_results.get("foods", [])
            result["result_count"] = len(foods)
            
            if foods:
                result["success"] = True
                formatted_results = await self.usda_service.format_search_results(search_results)
                result["formatted_results"] = formatted_results
                
                if formatted_results:
                    result["first_result"] = formatted_results[0]
            
            print(f"    Found {result['result_count']} results in {result['response_time']:.2f} seconds")
            return result
        except Exception as e:
            print(f"    Error: {str(e)}")
            traceback.print_exc()
            raise
    
    async def test_api_ninjas(self, food: str) -> Dict[str, Any]:
        """Test the API Ninjas service."""
        print(f"  Testing API Ninjas for '{food}'...")
        
        start_time = time.time()
        try:
            search_results = await self.ninjas_service.search_food(food)
            response_time = time.time() - start_time
            
            result = {
                "response_time": response_time,
                "success": False,
                "error": None,
                "result_count": 0,
                "first_result": None,
                "formatted_results": []
            }
            
            if isinstance(search_results, dict) and "error" in search_results:
                result["error"] = search_results["error"]
                return result
            
            result["result_count"] = len(search_results) if isinstance(search_results, list) else 0
            
            if result["result_count"] > 0:
                result["success"] = True
                formatted_results = await self.ninjas_service.format_search_results(search_results)
                result["formatted_results"] = formatted_results
                
                if formatted_results:
                    result["first_result"] = formatted_results[0]
            
            print(f"    Found {result['result_count']} results in {result['response_time']:.2f} seconds")
            return result
        except Exception as e:
            print(f"    Error: {str(e)}")
            traceback.print_exc()
            raise
    
    async def compare_results(self, food: str):
        """Compare results from different APIs for the same food."""
        print(f"  Comparing results for '{food}'...")
        
        usda_result = self.results["detailed"][food]["usda"]
        ninjas_result = self.results["detailed"][food]["api_ninjas"]
        
        comparison = {
            "food": food,
            "usda_success": usda_result["success"],
            "api_ninjas_success": ninjas_result["success"],
            "usda_count": usda_result["result_count"],
            "api_ninjas_count": ninjas_result["result_count"],
            "usda_time": usda_result["response_time"],
            "api_ninjas_time": ninjas_result["response_time"],
            "nutrient_comparison": {}
        }
        
        # Compare nutrients if all APIs returned results
        if (usda_result["first_result"] and ninjas_result["first_result"]):
            
            nutrients = ["calories", "protein", "carbs", "fat"]
            
            for nutrient in nutrients:
                usda_value = usda_result["first_result"]["nutrients"].get(nutrient, "N/A")
                ninjas_value = ninjas_result["first_result"]["nutrients"].get(nutrient, "N/A")
                
                comparison["nutrient_comparison"][nutrient] = {
                    "usda": usda_value,
                    "api_ninjas": ninjas_value
                }
        
        self.results["detailed"][food]["comparison"] = comparison
        
        # Print comparison summary
        print(f"    USDA: {usda_result['result_count']} results in {usda_result['response_time']:.2f}s")
        print(f"    API Ninjas: {ninjas_result['result_count']} results in {ninjas_result['response_time']:.2f}s")
    
    def generate_summary(self):
        """Generate summary statistics from the test results."""
        print("\nGenerating summary statistics...")
        
        apis = ["usda", "api_ninjas"]
        summary = {
            "success_rate": {},
            "average_result_count": {},
            "average_response_time": {},
            "foods_with_results": {},
            "overall_recommendation": None
        }
        
        for api in apis:
            success_count = 0
            total_results = 0
            total_time = 0
            foods_with_results = []
            
            for food in TEST_FOODS:
                result = self.results["detailed"][food][api]
                if result["success"]:
                    success_count += 1
                    total_results += result["result_count"]
                    total_time += result["response_time"]
                    foods_with_results.append(food)
            
            success_rate = (success_count / len(TEST_FOODS)) * 100
            avg_results = total_results / max(success_count, 1)
            avg_time = total_time / max(success_count, 1)
            
            summary["success_rate"][api] = success_rate
            summary["average_result_count"][api] = avg_results
            summary["average_response_time"][api] = avg_time
            summary["foods_with_results"][api] = foods_with_results
        
        # Determine overall recommendation
        best_api = max(apis, key=lambda x: summary["success_rate"][x])
        fastest_api = min(apis, key=lambda x: summary["average_response_time"][x])
        
        summary["overall_recommendation"] = {
            "best_coverage": best_api,
            "fastest": fastest_api,
            "recommendation": "Based on the test results, we recommend using a combination of APIs for the best coverage and reliability."
        }
        
        self.results["summary"] = summary
        
        # Print summary
        print(f"  Success rates: USDA ({summary['success_rate']['usda']:.1f}%), "
              f"API Ninjas ({summary['success_rate']['api_ninjas']:.1f}%)")
        
        print(f"  Average response times: USDA ({summary['average_response_time']['usda']:.2f}s), "
              f"API Ninjas ({summary['average_response_time']['api_ninjas']:.2f}s)")
    
    def save_results(self):
        """Save test results to files."""
        print("\nSaving test results...")
        
        # Save detailed results
        with open("test_results/comparison/detailed_results.json", "w") as f:
            json.dump(self.results["detailed"], f, indent=2)
        
        # Save summary
        with open("test_results/comparison/summary.json", "w") as f:
            json.dump(self.results["summary"], f, indent=2)
        
        # Generate markdown report
        self.generate_markdown_report()
    
    def generate_markdown_report(self):
        """Generate a markdown report from the test results."""
        summary = self.results["summary"]
        
        report = "# Food API Comparison Report\n\n"
        
        # Add summary section
        report += "## Summary\n\n"
        report += "| API | Success Rate | Avg. Results | Avg. Response Time |\n"
        report += "|-----|-------------|--------------|--------------------|\n"
        
        for api in ["usda", "api_ninjas"]:
            api_name = {
                "usda": "USDA FoodData Central",
                "api_ninjas": "API Ninjas"
            }[api]
            
            report += f"| {api_name} | {summary['success_rate'][api]:.1f}% | "
            report += f"{summary['average_result_count'][api]:.1f} | "
            report += f"{summary['average_response_time'][api]:.2f}s |\n"
        
        # Add recommendation
        report += "\n## Recommendation\n\n"
        report += f"- Best coverage: **{summary['overall_recommendation']['best_coverage']}**\n"
        report += f"- Fastest API: **{summary['overall_recommendation']['fastest']}**\n\n"
        report += summary['overall_recommendation']['recommendation'] + "\n\n"
        
        # Add detailed results for each food
        report += "## Detailed Results\n\n"
        
        for food in TEST_FOODS:
            report += f"### {food.capitalize()}\n\n"
            
            comparison = self.results["detailed"][food]["comparison"]
            
            report += "| API | Success | Results | Response Time |\n"
            report += "|-----|---------|---------|---------------|\n"
            
            for api in ["usda", "api_ninjas"]:
                api_name = {
                    "usda": "USDA FoodData Central",
                    "api_ninjas": "API Ninjas"
                }[api]
                
                success = "Yes" if comparison[f"{api}_success"] else "No"
                count = comparison[f"{api}_count"]
                time = f"{comparison[f'{api}_time']:.2f}s"
                
                report += f"| {api_name} | {success} | {count} | {time} |\n"
            
            # Add nutrient comparison if available
            if "nutrient_comparison" in comparison and comparison["nutrient_comparison"]:
                report += "\n**Nutrient Comparison (First Result)**\n\n"
                report += "| Nutrient | USDA | API Ninjas |\n"
                report += "|----------|------|------------|\n"
                
                for nutrient, values in comparison["nutrient_comparison"].items():
                    report += f"| {nutrient.capitalize()} | {values['usda']} | {values['api_ninjas']} |\n"
            
            report += "\n"
        
        # Save the report
        with open("test_results/comparison/api_comparison_report.md", "w") as f:
            f.write(report)


async def main():
    """Run the API comparison tests."""
    tester = APIComparisonTest()
    await tester.test_all_apis()

if __name__ == "__main__":
    asyncio.run(main())
