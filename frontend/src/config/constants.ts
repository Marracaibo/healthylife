/**
 * Application constants
 */

// API configuration 
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Food service modes
export enum FoodServiceMode {
  STANDARD = 'standard',
  HYBRID = 'hybrid',
  COMBINED = 'combined',
  FATSECRET = 'fatsecret'
}

// Default values
export const DEFAULT_SEARCH_RESULTS = 25;
export const DEFAULT_CACHE_ENABLED = true;

// Food service sources
export enum FoodSource {
  USDA = 'usda',
  EDAMAM = 'edamam', 
  HYBRID = 'hybrid',
  FATSECRET = 'fatsecret',
  UNKNOWN = 'unknown'
}

// Mapping for display names
export const SOURCE_DISPLAY_NAMES = {
  [FoodSource.USDA]: 'USDA FoodData Central',
  [FoodSource.EDAMAM]: 'Edamam',
  [FoodSource.HYBRID]: 'Multiple Sources',
  [FoodSource.FATSECRET]: 'FatSecret',
  [FoodSource.UNKNOWN]: 'Unknown Source'
};

// Nutrient names
export const NUTRIENT_NAMES = {
  CALORIES: 'Energy',
  PROTEIN: 'Protein',
  CARBS: 'Carbohydrates', 
  FAT: 'Total lipid (fat)',
  FIBER: 'Fiber, total dietary',
  SUGAR: 'Sugars, total including NLEA'
};

// Enable verbose logging for debugging
export const ENABLE_DEBUG_LOGGING = true;

// Servizio di ricerca alimenti predefinito (v1 o v2)
export const DEFAULT_FOOD_SERVICE_VERSION = 'v2';
