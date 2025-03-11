"""
Test script to verify the integration of the hybrid food service.

This script tests the connection between the hybrid food service 
and the FastAPI routes to ensure they are properly integrated.
"""

import os
import sys
import json
import asyncio
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Function to test the hybrid food service API endpoints
async def test_hybrid_food_api():
    """Test the hybrid food service API endpoints."""
    base_url = "http://localhost:8000/api/hybrid-food"
    
    print("\n=== Testing Hybrid Food Service API Integration ===\n")
    
    # Test the server connection
    try:
        # Health check to ensure the server is running
        health_response = requests.get("http://localhost:8000/health")
        health_response.raise_for_status()
        print("✅ Backend server is running")
    except Exception as e:
        print(f"❌ Cannot connect to backend server: {str(e)}")
        print("Make sure the backend server is running on http://localhost:8000")
        return False
    
    # Test the search endpoint
    try:
        query = "pasta"
        print(f"\nTesting search endpoint with query: '{query}'")
        
        search_response = requests.get(
            f"{base_url}/search",
            params={"query": query, "max_results": 5, "use_cache": True}
        )
        
        search_response.raise_for_status()
        search_data = search_response.json()
        
        if search_data.get("success"):
            print(f"✅ Search endpoint returned {len(search_data.get('foods', []))} results")
            print(f"   Source: {search_data.get('source', 'unknown')}")
            
            # Print first result
            if search_data.get('foods'):
                first_food = search_data['foods'][0]
                print(f"   First result: {first_food.get('food_name')} - {first_food.get('nutrients', {}).get('calories')} kcal")
        else:
            print(f"⚠️ Search returned no results: {search_data.get('error', 'unknown error')}")
    except Exception as e:
        print(f"❌ Error testing search endpoint: {str(e)}")
        return False
    
    # Test the search-combined endpoint
    try:
        query = "pizza"
        print(f"\nTesting combined search endpoint with query: '{query}'")
        
        search_response = requests.get(
            f"{base_url}/search-combined",
            params={"query": query, "max_results": 5, "use_cache": True}
        )
        
        search_response.raise_for_status()
        search_data = search_response.json()
        
        if search_data.get("success"):
            print(f"✅ Combined search endpoint returned {len(search_data.get('foods', []))} results")
            print(f"   USDA results: {search_data.get('usda_count', 0)}")
            print(f"   Edamam results: {search_data.get('edamam_count', 0)}")
            
            # Print sources distribution
            sources = {}
            for food in search_data.get('foods', []):
                source = food.get('source', 'unknown')
                sources[source] = sources.get(source, 0) + 1
            
            for source, count in sources.items():
                print(f"   {source}: {count} items")
        else:
            print(f"⚠️ Combined search returned no results: {search_data.get('error', 'unknown error')}")
    except Exception as e:
        print(f"❌ Error testing combined search endpoint: {str(e)}")
        return False
    
    print("\n=== Integration Test Complete ===")
    return True

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_hybrid_food_api())
