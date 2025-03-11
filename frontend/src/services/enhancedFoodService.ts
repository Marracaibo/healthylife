/**
 * Enhanced Food Service
 * 
 * This service provides methods to interact with the backend food API
 * which combines multiple food data sources (USDA, Open Food Facts, etc.)
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

// Types
export interface Nutrient {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface Food {
  food_id: string;
  food_name: string;
  brand_name?: string;
  serving_size?: number;
  serving_unit?: string;
  image_url?: string;
  nutrients: Nutrient;
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

/**
 * Search for foods across multiple food databases
 * 
 * @param query The search term to find foods
 * @param maxResults Maximum number of results to return (default: 25)
 * @returns Array of food items or empty array if error
 */
export const searchFoods = async (query: string, maxResults: number = 25): Promise<Food[]> => {
  try {
    const response = await axios.get<FoodSearchResponse>(`${API_BASE_URL}/food/search`, {
      params: { query, max_results: maxResults }
    });
    
    if (response.data.success) {
      return response.data.foods || [];
    } else {
      console.warn(`Food search failed: ${response.data.error}`);
      return [];
    }
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
};

/**
 * Get detailed information about a specific food by its ID
 * 
 * @param foodId The ID of the food
 * @param source The source database (optional)
 * @returns Food object or null if not found
 */
export const getFoodDetails = async (foodId: string, source?: string): Promise<Food | null> => {
  try {
    const response = await axios.get<FoodDetailsResponse>(`${API_BASE_URL}/food/details`, {
      params: { food_id: foodId, source }
    });
    
    if (response.data.success) {
      return response.data.food || null;
    } else {
      console.warn(`Food details failed: ${response.data.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting food details:', error);
    return null;
  }
};

/**
 * Get food information by barcode
 * 
 * @param barcode The barcode of the food product
 * @returns Food object or null if not found
 */
export const getFoodByBarcode = async (barcode: string): Promise<Food | null> => {
  try {
    const response = await axios.get<FoodDetailsResponse>(`${API_BASE_URL}/food/barcode`, {
      params: { barcode }
    });
    
    if (response.data.success) {
      return response.data.food || null;
    } else {
      console.warn(`Barcode lookup failed: ${response.data.error}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting food by barcode:', error);
    return null;
  }
};

/**
 * Format nutrients to ensure consistent display
 * 
 * @param nutrients Raw nutrient data from API
 * @returns Formatted nutrient object with default values for missing nutrients
 */
export const formatNutrients = (nutrients: Nutrient): Nutrient => {
  return {
    calories: nutrients.calories || 0,
    protein: nutrients.protein || 0,
    carbs: nutrients.carbs || 0,
    fat: nutrients.fat || 0,
    fiber: nutrients.fiber || 0,
    sugar: nutrients.sugar || 0
  };
};

/**
 * Get the data source name in a user-friendly format
 * 
 * @param source Source identifier from API
 * @returns User-friendly source name
 */
export const getSourceName = (source: string): string => {
  switch (source.toLowerCase()) {
    case 'usda':
      return 'USDA FoodData Central';
    case 'openfoodfacts':
    case 'open food facts':
      return 'Open Food Facts';
    default:
      return source;
  }
};

// Export default object for convenience
const enhancedFoodService = {
  searchFoods,
  getFoodDetails,
  getFoodByBarcode,
  formatNutrients,
  getSourceName
};

export default enhancedFoodService;
