# Free Food Nutrition API Alternatives

This document outlines free alternatives to the Edamam API for food nutrition data that can be integrated into our HealthyLifeApp application.

## 1. USDA FoodData Central API

The USDA FoodData Central API is developed and maintained by the US Department of Agriculture, providing access to authoritative food composition data.

### Key Features:
- **Comprehensive Database**: Access to five distinct data sets including Foundation Foods, Food and Nutrient Database for Dietary Studies, and more
- **Food Search Endpoint**: Returns foods that match desired search criteria
- **Food Details Endpoint**: Returns detailed nutritional information for specific foods
- **Free Usage**: Limited to 3600 requests per hour per IP address
- **Government Backed**: Reliable, verified nutrition data

### API Documentation:
- API Guide: https://fdc.nal.usda.gov/api-key-signup.html

### Integration Notes:
- Requires API key registration (free)
- RESTful API with JSON responses
- No commercial usage restrictions

## 2. Open Food Facts API

Open Food Facts is a free, open database of food products from around the world, maintained by a non-profit organization and volunteers.

### Key Features:
- **Extensive Database**: Contains product ingredients, nutrition facts, allergens, and additives
- **Barcode Scanning**: Lookup products by barcode
- **Search & Filter**: Search by product name or brand
- **Completely Free**: No usage limits or costs
- **Open Source**: Data can be used for any purpose

### API Documentation:
- API Wiki: https://wiki.openfoodfacts.org/API

### Integration Notes:
- No API key required
- Community-maintained data (may have some quality/consistency issues)
- RESTful API with JSON responses

## 3. API Ninjas (Previously CalorieNinjas)

API Ninjas provides a simple natural language engine and database of over 100,000 foods and drinks.

### Key Features:
- **Natural Language Processing**: Extract nutrition data from text
- **Image Text Recognition**: Extract nutrition data from images containing text
- **Comprehensive Nutrition Data**: Includes calories, macronutrients, and micronutrients
- **Free Tier**: Up to 10,000 API calls/month (no commercial use)

### API Documentation:
- API Documentation: https://calorieninjas.com/api

### Integration Notes:
- Requires API key registration
- Free tier doesn't allow commercial use
- Simple REST API with clean responses

## 4. FatSecret Platform API

FatSecret is a widely used food and nutrition database trusted by major companies like Amazon, Fitbit, and Samsung.

### Key Features:
- **Large Database**: Over 1 million verified food items
- **Branded Products**: Includes branded products and restaurant items
- **Basic Free Tier**: Available with attribution requirements

### API Documentation:
- Platform Documentation: https://platform.fatsecret.com/api/

### Integration Notes:
- Requires API key registration
- Free tier requires FatSecret attribution
- OAuth authentication

## 5. TheMealDB API

While primarily focused on recipes rather than nutritional data, TheMealDB can be useful for meal planning features.

### Key Features:
- **Recipe Database**: Extensive collection of recipes
- **Ingredient Lists**: Detailed ingredient information
- **Free Tier**: Up to 100 lookups per day

### API Documentation:
- API Documentation: https://www.themealdb.com/api.php

### Integration Notes:
- Limited nutritional information
- Better suited for recipe suggestions than detailed nutrition tracking

## Comparison Table

| API | Free Tier Limits | Commercial Use | Data Quality | Nutrition Focus | API Key Required |
|-----|------------------|----------------|--------------|-----------------|------------------|
| USDA FoodData Central | 3600 req/hour | Yes | High | High | Yes |
| Open Food Facts | Unlimited | Yes | Medium | High | No |
| API Ninjas | 10,000 req/month | No | Medium-High | High | Yes |
| FatSecret | Limited | Yes (with attribution) | High | High | Yes |
| TheMealDB | 100 lookups/day | Limited | Medium | Low | No |

## Recommendation

Based on our application needs, the **USDA FoodData Central API** appears to be the best free alternative to Edamam. It offers:

1. High-quality, verified nutritional data
2. Generous free tier limits suitable for our usage patterns
3. Permission for commercial use
4. Government-backed reliability

For backup or complementary data, the **Open Food Facts API** could be integrated to provide additional product information, especially for international foods that might not be well-represented in the USDA database.

## Next Steps

1. Register for a USDA FoodData Central API key
2. Create a prototype integration with our existing service architecture
3. Develop fallback mechanisms to handle rate limiting
4. Consider a hybrid approach using multiple APIs for the most comprehensive coverage
