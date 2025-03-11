"""
Combined Food Service

This service integrates both USDA FoodData Central and API Ninjas
to provide comprehensive food data with fallback capabilities.
"""

import asyncio
import time
from typing import Dict, List, Any, Optional

from .usda_food_service import USDAFoodService
from .api_ninjas_service import APINinjasService

class CombinedFoodService:
    """Service that combines multiple food APIs for better coverage and reliability."""
    
    def __init__(self, usda_api_key: str, api_ninjas_key: str):
        """Initialize the combined food service with API keys."""
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = usda_api_key
        
        self.api_ninjas_service = APINinjasService(api_ninjas_key)
        
        # Cache for storing search results
        self.cache = {}
        self.cache_expiry = 3600  # Cache expiry in seconds (1 hour)
    
    async def search_food(self, query: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Search for food using multiple APIs with fallback.
        
        Args:
            query: The food search query
            use_cache: Whether to use cached results if available
            
        Returns:
            Dict containing combined search results and metadata
        """
        # Check cache first if enabled
        cache_key = f"search:{query.lower()}"
        if use_cache and cache_key in self.cache:
            cache_entry = self.cache[cache_key]
            if time.time() - cache_entry["timestamp"] < self.cache_expiry:
                return cache_entry["data"]
        
        # Start with USDA as primary
        start_time = time.time()
        usda_results = await self.usda_service.search_food(query)
        
        # Check if USDA returned valid results
        usda_success = False
        if "error" not in usda_results and usda_results.get("foods", []):
            usda_success = True
        
        # If USDA failed or returned no results, try API Ninjas
        api_ninjas_results = None
        if not usda_success:
            api_ninjas_results = await self.api_ninjas_service.search_food(query)
        
        # Format the results
        formatted_results = []
        source = "usda"
        
        if usda_success:
            formatted_results = await self.usda_service.format_search_results(usda_results)
        elif api_ninjas_results and isinstance(api_ninjas_results, list) and len(api_ninjas_results) > 0:
            formatted_results = await self.api_ninjas_service.format_search_results(api_ninjas_results)
            source = "api_ninjas"
        
        # Prepare the combined result
        result = {
            "query": query,
            "total_results": len(formatted_results),
            "source": source,
            "response_time": time.time() - start_time,
            "foods": formatted_results
        }
        
        # Cache the result if it has foods
        if formatted_results and use_cache:
            self.cache[cache_key] = {
                "timestamp": time.time(),
                "data": result
            }
        
        return result
    
    async def search_food_from_all_sources(self, query: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Search for food from all available sources and combine results.
        
        Args:
            query: The food search query
            use_cache: Whether to use cached results if available
            
        Returns:
            Dict containing combined search results from all sources
        """
        # Check cache first if enabled
        cache_key = f"search_all:{query.lower()}"
        if use_cache and cache_key in self.cache:
            cache_entry = self.cache[cache_key]
            if time.time() - cache_entry["timestamp"] < self.cache_expiry:
                return cache_entry["data"]
        
        # Start search tasks for all APIs concurrently
        start_time = time.time()
        usda_task = asyncio.create_task(self.usda_service.search_food(query))
        api_ninjas_task = asyncio.create_task(self.api_ninjas_service.search_food(query))
        
        # Wait for all tasks to complete
        await asyncio.gather(usda_task, api_ninjas_task)
        
        # Get results
        usda_results = usda_task.result()
        api_ninjas_results = api_ninjas_task.result()
        
        # Format results from each source
        usda_formatted = []
        api_ninjas_formatted = []
        
        if "error" not in usda_results and usda_results.get("foods", []):
            usda_formatted = await self.usda_service.format_search_results(usda_results)
        
        if api_ninjas_results and isinstance(api_ninjas_results, list) and len(api_ninjas_results) > 0:
            api_ninjas_formatted = await self.api_ninjas_service.format_search_results(api_ninjas_results)
        
        # Combine results, prioritizing USDA but including unique items from API Ninjas
        combined_results = usda_formatted.copy()
        
        # Add API Ninjas results that don't overlap with USDA
        # This is a simple approach - in production you might want more sophisticated deduplication
        usda_names = {item["food_name"].lower() for item in usda_formatted}
        for item in api_ninjas_formatted:
            if item["food_name"].lower() not in usda_names:
                item["source"] = "api_ninjas"
                combined_results.append(item)
            
        # Prepare the combined result
        result = {
            "query": query,
            "total_results": len(combined_results),
            "usda_results": len(usda_formatted),
            "api_ninjas_results": len(api_ninjas_formatted),
            "response_time": time.time() - start_time,
            "foods": combined_results
        }
        
        # Cache the result if it has foods
        if combined_results and use_cache:
            self.cache[cache_key] = {
                "timestamp": time.time(),
                "data": result
            }
        
        return result
    
    async def get_food_details(self, food_id: str, source: str = "usda") -> Dict[str, Any]:
        """
        Get detailed information about a specific food item.
        
        Args:
            food_id: The ID of the food item
            source: The source API ('usda' or 'api_ninjas')
            
        Returns:
            Dict containing detailed food information
        """
        # Check cache first
        cache_key = f"details:{source}:{food_id}"
        if cache_key in self.cache:
            cache_entry = self.cache[cache_key]
            if time.time() - cache_entry["timestamp"] < self.cache_expiry:
                return cache_entry["data"]
        
        result = None
        
        if source == "usda":
            result = await self.usda_service.get_food_details(food_id)
        elif source == "api_ninjas":
            # API Ninjas doesn't have a specific food details endpoint
            # We would need to implement a different approach or return an error
            result = {"error": "API Ninjas does not support detailed food lookup by ID"}
        else:
            result = {"error": f"Unknown source: {source}"}
        
        # Cache the result if valid
        if result and "error" not in result:
            self.cache[cache_key] = {
                "timestamp": time.time(),
                "data": result
            }
        
        return result
    
    def clear_cache(self):
        """Clear the entire cache."""
        self.cache = {}
    
    def clear_expired_cache(self):
        """Clear only expired cache entries."""
        current_time = time.time()
        keys_to_remove = []
        
        for key, cache_entry in self.cache.items():
            if current_time - cache_entry["timestamp"] >= self.cache_expiry:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.cache[key]
