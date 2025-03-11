# Free Food API Integration Guide

This guide provides step-by-step instructions for integrating the free food API alternatives into the HealthyLifeApp application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting Up API Keys](#setting-up-api-keys)
3. [Integration with Frontend](#integration-with-frontend)
4. [Testing the Integration](#testing-the-integration)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before integrating the free food APIs, ensure you have:

1. Python 3.7+ installed
2. Required Python packages:
   - aiohttp
   - dotenv
3. A USDA FoodData Central API key (optional but recommended)

## Setting Up API Keys

### USDA FoodData Central API Key

1. Visit the [USDA FoodData Central API page](https://fdc.nal.usda.gov/api-key-signup.html)
2. Fill out the form to request an API key
3. You'll receive the API key via email
4. Add the API key to your `.env` file:

```
USDA_API_KEY=your_api_key_here
```

### Open Food Facts API

The Open Food Facts API doesn't require an API key, so no setup is needed.

## Integration with Frontend

### 1. Update the Food Service API Endpoint

In your frontend code, update the API endpoint to use the new Enhanced Food Service:

```typescript
// src/services/foodService.ts

export const searchFoods = async (query: string, maxResults: number = 25): Promise<Food[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/food/search`, {
      params: { query, max_results: maxResults }
    });
    return response.data.foods || [];
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
};

export const getFoodDetails = async (foodId: string, source: string): Promise<Food | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/food/details`, {
      params: { food_id: foodId, source }
    });
    return response.data.food || null;
  } catch (error) {
    console.error('Error getting food details:', error);
    return null;
  }
};

export const getFoodByBarcode = async (barcode: string): Promise<Food | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/food/barcode`, {
      params: { barcode }
    });
    return response.data.food || null;
  } catch (error) {
    console.error('Error getting food by barcode:', error);
    return null;
  }
};
```

### 2. Update the Backend API Routes

Create new routes in your backend to handle the enhanced food service:

```python
# routes.py or app.py

from services.enhanced_food_service import EnhancedFoodService

food_service = EnhancedFoodService()

@app.route('/api/food/search', methods=['GET'])
async def search_food():
    query = request.args.get('query', '')
    max_results = int(request.args.get('max_results', 25))
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    results = await food_service.search_food(query, max_results)
    return jsonify(results)

@app.route('/api/food/details', methods=['GET'])
async def get_food_details():
    food_id = request.args.get('food_id', '')
    source = request.args.get('source', None)
    
    if not food_id:
        return jsonify({"error": "food_id parameter is required"}), 400
    
    results = await food_service.get_food_details(food_id, source)
    return jsonify(results)

@app.route('/api/food/barcode', methods=['GET'])
async def get_food_by_barcode():
    barcode = request.args.get('barcode', '')
    
    if not barcode:
        return jsonify({"error": "barcode parameter is required"}), 400
    
    results = await food_service.get_food_by_barcode(barcode)
    return jsonify(results)
```

### 3. Update the Food Type Definitions

Update your TypeScript type definitions to match the new API response format:

```typescript
// src/types/Food.ts

export interface Food {
  food_id: string;
  food_name: string;
  brand_name?: string;
  serving_size?: number;
  serving_unit?: string;
  image_url?: string;
  nutrients: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
  ingredients?: string;
  allergens?: string;
}

export interface FoodSearchResponse {
  success: boolean;
  source: string;
  foods: Food[];
  error?: string;
}

export interface FoodDetailsResponse {
  success: boolean;
  source: string;
  food: Food;
  error?: string;
}
```

## Testing the Integration

### 1. Run the Test Script

Before integrating with the frontend, test the API services using the provided test script:

```bash
python test_food_apis.py
```

This will:
- Test the USDA FoodData Central API
- Test the Open Food Facts API
- Test the combined Enhanced Food Service
- Save test results to the `test_results` directory

### 2. Verify API Responses

Check the test results to ensure:
- Food search works correctly
- Food details can be retrieved
- Barcode lookup functions properly
- The Enhanced Food Service successfully combines multiple data sources

### 3. Test Frontend Integration

After updating the frontend code:
1. Start your backend server
2. Start your frontend development server
3. Test the food search functionality in the UI
4. Verify that food details display correctly
5. Test barcode scanning if implemented

## Troubleshooting

### USDA API Issues

- **401 Unauthorized**: Verify your API key is correct in the `.env` file
- **429 Too Many Requests**: You've exceeded the rate limit (3600 requests/hour)
- **Empty Results**: Try different search terms or check if the food exists in the database

### Open Food Facts API Issues

- **Empty Results**: The product may not exist in the database
- **Incomplete Data**: Some products may have incomplete nutritional information
- **Slow Response**: The API can be slower than commercial alternatives

### General Issues

- **No Results from Any Service**: Ensure your internet connection is working
- **Format Errors**: Check that the data formatting is working correctly
- **Missing Nutrients**: Not all foods have complete nutritional information

## Conclusion

By following this guide, you've successfully integrated free food API alternatives into your application. The Enhanced Food Service provides a robust solution that combines multiple data sources for comprehensive food and nutrition information.

For further assistance or to report issues, please contact the development team.
