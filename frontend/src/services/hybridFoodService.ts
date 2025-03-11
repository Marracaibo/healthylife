/**
 * Hybrid Food Service
 * 
 * This service provides methods to interact with the hybrid USDA-Edamam food API
 * which combines multiple food data sources for better coverage.
 */

import axios from 'axios';
import { 
  API_BASE_URL, 
  DEFAULT_SEARCH_RESULTS, 
  DEFAULT_CACHE_ENABLED,
  FoodSource,
  SOURCE_DISPLAY_NAMES,
  NUTRIENT_NAMES
} from '../config/constants';
import { createLogger } from '../utils/logger';
import { addToSyncQueue, getItem, addItem, updateItem } from '../utils/offlineDatabase';
import { v4 as uuidv4 } from 'uuid';
import { fetchWithRetry } from './apiConnectionService';

const logger = createLogger('HybridFoodService');

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
  source?: string;
  barcode?: string;
  pendingSync?: boolean;
  localId?: string;
  portion?: {
    type: 'unit' | 'weight';
    standard_quantity: string;
  };
}

export interface FoodSearchResponse {
  success: boolean;
  source: string;
  foods: Food[];
  usda_count?: number;
  edamam_count?: number;
  error?: string;
}

export interface FoodDetailsResponse {
  success: boolean;
  source: string;
  food: Food;
  error?: string;
}

/**
 * Prepara la query di ricerca
 * @param query La query di ricerca originale
 * @returns La query originale senza modifiche
 */
export const prepareSearchQuery: (query: string) => string = (query: string): string => {
  // Restituisce semplicemente la query originale senza alcuna elaborazione
  return query;
}

/**
 * Search for foods using hybrid USDA-Edamam approach
 * 
 * @param query The search term to find foods
 * @param maxResults Maximum number of results to return (default: 25)
 * @returns Array of food items or empty array if error
 */
export const searchFoods = async (
  query: string, 
  maxResults: number = DEFAULT_SEARCH_RESULTS
): Promise<Food[]> => {
  try {
    if (!query || query.trim().length === 0) {
      logger.warn('Empty search query provided');
      return [];
    }

    // Usa direttamente la query senza traduzione
    const searchQuery = query.trim();
    logger.info(`Searching for: ${searchQuery}`);
    
    // Cache key based on query and max results
    const cache_key = `food_search_${searchQuery.toLowerCase()}_${maxResults}`;
    
    // Check if we have cached results
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cache_key);
      if (cachedResults) {
        try {
          logger.info(`Retrieved ${searchQuery} results from cache`);
          return JSON.parse(cachedResults);
        } catch (e) {
          logger.error(`Error parsing cached results: ${e}`);
          localStorage.removeItem(cache_key);
        }
      }
    }

    // Verifica se siamo offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      return searchOfflineFoods(query);
    }
    
    try {
      const response = await fetchWithRetry({
        url: `${API_BASE_URL}/hybrid-food/search`,
        method: 'GET',
        params: { 
          query: searchQuery, 
          max_results: maxResults, 
          use_cache: DEFAULT_CACHE_ENABLED
        },
        timeout: 10000 // Aumentato il timeout a 10 secondi
      }, 2); // 2 tentativi di retry in caso di fallimento
      
      // La risposta del backend ora ha una struttura diversa
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Trasforma i risultati nel formato atteso dal frontend
        const foods = response.data.results.map((item: any) => {
          // Gestione migliorata dei brand
          let brandName = item.brand || "";
          
          // Se è vuoto, impostalo come stringa vuota per evitare di visualizzare 'Unknown'
          if (brandName === 'Unknown') {
            brandName = "";
          }
          
          return {
            food_id: item.food_id || "",
            food_name: item.food_name || "",
            brand_name: brandName,
            serving_size: item.serving_size || "100g",
            serving_unit: item.serving_unit || "g",
            image_url: item.image_url || "",
            nutrients: {
              calories: parseFloat(item.nutrition?.calories) || 100,  // Valore di default 100 calorie
              protein: parseFloat(item.nutrition?.protein) || 0,
              carbs: parseFloat(item.nutrition?.carbs) || 0,
              fat: parseFloat(item.nutrition?.fat) || 0
            },
            source: item.source || "",
            portion: {
              type: detectPortionType(item.food_name, item.serving_size),
              standard_quantity: item.serving_size || "100g"
            }
          };
        });
        
        // Log dettagliato per debugging
        logger.info(`Ricerca completata con successo per "${query}". Trovati ${foods.length} risultati.`);
        
        // Salva i risultati nel database locale per uso offline
        await saveSearchResultsForOffline(query, foods);
        
        return foods;
      } else {
        // Riduciamo i log per le ricerche senza risultati
        logger.warn(`Food search returned no results for query: ${query}`);
        return [];
      }
    } catch (apiError) {
      // Gestione specifica degli errori API
      logger.error(`Errore API durante la ricerca degli alimenti: ${apiError}`);
      
      // Prova a cercare nel database locale come fallback
      logger.info('Tentativo di recupero risultati dal database locale come fallback');
      return searchOfflineFoods(query);
    }
  } catch (error) {
    logger.error('Error searching foods:', error);
    
    // Se siamo offline, prova a cercare nel database locale
    if (!navigator.onLine) {
      return searchOfflineFoods(query);
    }
    
    return [];
  }
};

/**
 * Rileva il tipo di porzione basandosi sul nome dell'alimento e sulla porzione
 * @param foodName Nome dell'alimento
 * @param servingSize Dimensione della porzione
 * @returns Tipo di porzione ('unit' o 'weight')
 */
const detectPortionType = (foodName: string, servingSize: string): 'unit' | 'weight' => {
  const foodNameLower = foodName?.toLowerCase() || '';
  const servingSizeLower = servingSize?.toLowerCase() || '';
  
  // Alimenti che tipicamente si misurano in unità
  const unitFoods = ['banana', 'mela', 'arancia', 'uovo', 'pane', 'fetta', 'yogurt', 'pizza', 'pera', 'kiwi', 'mandarino', 'limone'];
  
  // Verifica se il nome dell'alimento contiene parole che suggeriscono unità
  for (const unitFood of unitFoods) {
    if (foodNameLower.includes(unitFood)) {
      return 'unit';
    }
  }
  
  // Se la porzione contiene unità come 'pezzo', 'fetta', ecc.
  if (servingSizeLower.includes('pezzo') || 
      servingSizeLower.includes('fetta') || 
      servingSizeLower.includes('unità') ||
      servingSizeLower.includes('porzione') ||
      servingSizeLower.includes('1 ')) {
    return 'unit';
  }
  
  // Per default, considera la porzione in peso
  return 'weight';
};

/**
 * Search for foods using both USDA and Edamam, combining results
 * 
 * @param query The search term to find foods
 * @param maxResults Maximum number of results to return (default: 25)
 * @returns Array of food items or empty array if error
 */
export const searchCombinedFoods = async (
  query: string, 
  maxResults: number = DEFAULT_SEARCH_RESULTS
): Promise<Food[]> => {
  try {
    if (!query || query.trim().length === 0) {
      logger.warn('Empty search query provided');
      return [];
    }

    // Usa direttamente la query senza traduzione
    const searchQuery = query.trim();
    logger.info(`Searching for (combined): ${searchQuery}`);

    // Cache key based on query and max results
    const cache_key = `combined_food_search_${searchQuery.toLowerCase()}_${maxResults}`;
    
    // Check if we have cached results
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cache_key);
      if (cachedResults) {
        try {
          logger.info(`Retrieved combined ${searchQuery} results from cache`);
          return JSON.parse(cachedResults);
        } catch (e) {
          logger.error(`Error parsing cached results: ${e}`);
          localStorage.removeItem(cache_key);
        }
      }
    }

    // Verifica se siamo offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      return searchOfflineFoods(query);
    }
    
    try {
      const response = await fetchWithRetry({
        url: `${API_BASE_URL}/hybrid-food/combined-search`,
        method: 'GET',
        params: { 
          query: searchQuery, 
          max_results: maxResults, 
          use_cache: DEFAULT_CACHE_ENABLED
        }
      }, 2);
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Trasforma i risultati nel formato atteso dal frontend
        const foods = response.data.results.map((item: any) => ({
          food_id: item.id || "",
          food_name: item.name || "",
          brand_name: item.brand || "",
          serving_size: item.serving_size?.amount || 100,
          serving_unit: item.serving_size?.unit || "g",
          image_url: item.image || "",
          nutrients: {
            calories: item.nutrients?.calories || 0,
            protein: item.nutrients?.protein || 0,
            carbs: item.nutrients?.carbs || 0,
            fat: item.nutrients?.fat || 0
          },
          source: item.source || ""
        }));
        
        logger.info(`Ricerca combinata completata con successo per "${query}". Trovati ${foods.length} risultati.`);
        
        await saveSearchResultsForOffline(query, foods);
        
        return foods;
      } else {
        logger.warn(`Combined food search returned no results for query: ${query}`);
        return [];
      }
    } catch (apiError) {
      logger.error(`Errore API durante la ricerca combinata: ${apiError}`);
      return searchOfflineFoods(query);
    }
  } catch (error) {
    logger.error('Error searching combined foods:', error);
    
    // Se siamo offline, prova a cercare nel database locale
    if (!navigator.onLine) {
      return searchOfflineFoods(query);
    }
    
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
    // Verifica se siamo offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      const cachedFood = await getItem<Food>('foods', foodId);
      return cachedFood;
    }
    
    const response = await axios.get<FoodDetailsResponse>(`${API_BASE_URL}/hybrid-food/food/${foodId}`, {
      params: { source }
    });
    
    if (response.data.success && response.data.food) {
      const food = response.data.food;
      
      // Salva nel database locale
      await saveToLocalDb('foods', food);
      
      return food;
    } else {
      logger.warn(`Food details fetch failed: ${response.data.error}`);
      return null;
    }
  } catch (error) {
    logger.error('Error fetching food details:', error);
    
    // Se siamo offline, prova a recuperare dal database locale
    if (!navigator.onLine) {
      const cachedFood = await getItem<Food>('foods', foodId);
      return cachedFood;
    }
    
    return null;
  }
};

/**
 * Search for food by barcode/UPC using USDA database
 * 
 * @param barcode The barcode/UPC to search for
 * @param maxResults Maximum number of results to return (default: 10)
 * @returns Array of food items or empty array if error
 */
export const searchByBarcode = async (
  barcode: string,
  maxResults: number = 10
): Promise<Food[]> => {
  try {
    // Verifica se siamo offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca del codice a barre nel database locale');
      const cachedResults = await searchOfflineBarcode(barcode);
      
      if (cachedResults.length > 0) {
        return cachedResults;
      }
      
      // Se non troviamo risultati offline, aggiungi alla coda di sincronizzazione
      await addToSyncQueue({
        endpoint: `${API_BASE_URL}/hybrid-food/barcode/${barcode}`,
        method: 'GET',
        data: { barcode }
      });
      
      // Crea un oggetto temporaneo per l'interfaccia utente
      const pendingFood: Food = {
        food_id: `pending_${uuidv4()}`,
        food_name: `Prodotto con codice ${barcode}`,
        barcode: barcode,
        serving_size: 100,
        serving_unit: 'g',
        nutrients: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        pendingSync: true,
        localId: uuidv4()
      };
      
      // Salva temporaneamente
      await saveToLocalDb('foods', pendingFood);
      
      return [pendingFood];
    }
    
    const response = await axios.get<FoodSearchResponse>(
      `${API_BASE_URL}/hybrid-food/barcode/${barcode}`,
      { params: { max_results: maxResults } }
    );
    
    if (response.data.success && response.data.foods) {
      const foods = response.data.foods;
      
      // Salva i risultati nel database locale per uso offline
      for (const food of foods) {
        food.barcode = barcode; // Assicurati che il codice a barre sia salvato
        await saveToLocalDb('foods', food);
      }
      
      // Salva anche l'associazione barcode -> food_ids
      await saveBarcodeMapping(barcode, foods.map(f => f.food_id));
      
      return foods;
    } else {
      logger.warn(`Barcode search failed: ${response.data.error || 'Unknown error'}`);
      return [];
    }
  } catch (error) {
    logger.error('Error searching by barcode:', error);
    
    // Se il dispositivo è offline, cerca nei dati salvati localmente
    if (!navigator.onLine) {
      return searchOfflineBarcode(barcode);
    }
    
    return [];
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
  if (!source) return 'Sconosciuto';
  
  const sourceKey = source.toLowerCase() as FoodSource;
  
  // Usa la mappatura predefinita dei nomi delle fonti
  return SOURCE_DISPLAY_NAMES[sourceKey] || source;
};

/**
 * Salva i risultati della ricerca nel database locale per uso offline
 */
const saveSearchResultsForOffline = async (query: string, foods: Food[]): Promise<void> => {
  try {
    // Salva ogni alimento nel database
    for (const food of foods) {
      await saveToLocalDb('foods', food);
    }
    
    // Salva anche il mapping tra query e risultati
    const searchMapping = {
      id: `search_${query.toLowerCase().trim()}`,
      query: query.toLowerCase().trim(),
      foodIds: foods.map(food => food.food_id),
      timestamp: Date.now()
    };
    
    await saveToLocalDb('searchMappings', searchMapping);
  } catch (error) {
    logger.error('Error saving search results for offline use:', error);
  }
};

/**
 * Salva l'associazione tra codice a barre e ID degli alimenti
 */
const saveBarcodeMapping = async (barcode: string, foodIds: string[]): Promise<void> => {
  try {
    const mapping = {
      id: `barcode_${barcode}`,
      barcode,
      foodIds,
      timestamp: Date.now()
    };
    
    await saveToLocalDb('barcodeMappings', mapping);
  } catch (error) {
    logger.error('Error saving barcode mapping:', error);
  }
};

/**
 * Cerca alimenti nel database locale
 */
const searchOfflineFoods = async (query: string): Promise<Food[]> => {
  try {
    // Normalizza la query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Cerca nel mapping delle ricerche
    const searchMapping = await getItem('searchMappings', `search_${normalizedQuery}`);
    
    if (searchMapping && searchMapping.foodIds && searchMapping.foodIds.length > 0) {
      // Recupera gli alimenti dal database locale
      const foods: Food[] = [];
      
      for (const foodId of searchMapping.foodIds) {
        const food = await getItem('foods', foodId);
        if (food) foods.push(food);
      }
      
      return foods;
    }
    
    return [];
  } catch (error) {
    logger.error('Error searching offline foods:', error);
    return [];
  }
};

/**
 * Cerca un codice a barre nel database locale
 */
const searchOfflineBarcode = async (barcode: string): Promise<Food[]> => {
  try {
    // Cerca nel mapping dei codici a barre
    const mapping = await getItem('barcodeMappings', `barcode_${barcode}`);
    
    if (mapping && mapping.foodIds && mapping.foodIds.length > 0) {
      // Recupera gli alimenti dal database locale
      const foods: Food[] = [];
      
      for (const foodId of mapping.foodIds) {
        const food = await getItem('foods', foodId);
        if (food) foods.push(food);
      }
      
      return foods;
    }
    
    return [];
  } catch (error) {
    logger.error('Error searching offline barcode:', error);
    return [];
  }
};

/**
 * Salva un item nel database locale
 */
const saveToLocalDb = async <T>(storeName: 'foods' | 'searchMappings' | 'barcodeMappings', item: T): Promise<void> => {
  try {
    // Per gli alimenti e i mapping di ricerca, usa updateItem per sovrascrivere eventuali duplicati
    if (storeName === 'foods' || storeName === 'searchMappings' || storeName === 'barcodeMappings') {
      await updateItem(storeName, item);
    } else {
      // Per gli altri store, continua a usare addItem
      await addItem(storeName, item);
    }
  } catch (error) {
    logger.error(`Error saving to local DB (${storeName}):`, error);
    // Log dettagliato dell'errore per debug
    if (error instanceof Error) {
      logger.error(`Dettagli errore: ${error.message}`);
      logger.error(`Stack trace: ${error.stack}`);
    }
  }
};

// Export default object for convenience
const hybridFoodService = {
  prepareSearchQuery,
  searchFoods,
  searchCombinedFoods,
  getFoodDetails,
  searchByBarcode,
  formatNutrients,
  getSourceName,
  saveSearchResultsForOffline,
  saveBarcodeMapping,
  searchOfflineFoods
};

export default hybridFoodService;
