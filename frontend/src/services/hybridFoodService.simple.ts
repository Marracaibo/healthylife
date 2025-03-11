/**
 * Hybrid Food Service (Versione semplificata)
 * 
 * Questa versione u00e8 stata completamente riscritta per eliminare
 * ogni riferimento al sistema di traduzione e garantire la compatibilitu00e0.
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
import { addToSyncQueue, getItem, addItem } from '../utils/offlineDatabase';
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
 * Ricerca alimenti usando l'approccio ibrido USDA-Edamam
 * 
 * @param query Il termine di ricerca
 * @param maxResults Numero massimo di risultati (default: 25)
 * @returns Array di alimenti o array vuoto in caso di errore
 */
const searchFoods = async (query: string, maxResults = DEFAULT_SEARCH_RESULTS): Promise<Food[]> => {
  try {
    // Verifica parametri
    if (!query || query.trim().length === 0) {
      logger.warn('Fornita query di ricerca vuota');
      return [];
    }
    
    // Pulisci la query
    const searchQuery = query.trim();
    logger.info(`Ricerca: ${searchQuery}`);
    
    // Chiave cache
    const cacheKey = `food_search_${searchQuery.toLowerCase()}_${maxResults}`;
    
    // Controlla cache
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cacheKey);
      if (cachedResults) {
        try {
          logger.info(`Recuperati risultati per "${searchQuery}" dalla cache`);
          return JSON.parse(cachedResults);
        } catch (e) {
          logger.error(`Errore parsing risultati cache: ${e}`);
          localStorage.removeItem(cacheKey);
        }
      }
    }
    
    // Verifica offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      return searchOfflineFoods(query);
    }
    
    // Chiamata API
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/hybrid-food/search`,
      method: 'GET',
      params: { 
        query: searchQuery, 
        max_results: maxResults,
        use_cache: DEFAULT_CACHE_ENABLED
      },
      timeout: 10000
    });
    
    // Elabora risposta
    if (response.data && response.data.success) {
      const foods: Food[] = response.data.foods || [];
      
      // Salva in cache
      if (DEFAULT_CACHE_ENABLED && foods.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(foods));
      }
      
      // Salva per uso offline
      if (foods.length > 0) {
        saveSearchResultsForOffline(searchQuery, foods).catch(err => 
          logger.error('Errore salvataggio risultati offline:', err)
        );
      }
      
      return foods;
    } else {
      // Gestione errore
      const errorMsg = response.data?.error || 'Errore server';
      logger.warn(`Ricerca alimenti fallita: ${errorMsg}`);
      return [];
    }
  } catch (error) {
    logger.error('Errore durante la ricerca alimenti:', error);
    return [];
  }
};

/**
 * Ricerca alimenti usando sia USDA che Edamam, combinando i risultati
 * 
 * @param query Il termine di ricerca
 * @param maxResults Numero massimo di risultati (default: 25)
 * @returns Array di alimenti o array vuoto in caso di errore
 */
const searchCombinedFoods = async (query: string, maxResults = DEFAULT_SEARCH_RESULTS): Promise<Food[]> => {
  try {
    // Verifica parametri
    if (!query || query.trim().length === 0) {
      logger.warn('Fornita query di ricerca vuota');
      return [];
    }
    
    // Pulisci la query
    const searchQuery = query.trim();
    logger.info(`Ricerca combinata: ${searchQuery}`);
    
    // Chiave cache
    const cacheKey = `combined_food_search_${searchQuery.toLowerCase()}_${maxResults}`;
    
    // Controlla cache
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cacheKey);
      if (cachedResults) {
        try {
          logger.info(`Recuperati risultati combinati per "${searchQuery}" dalla cache`);
          return JSON.parse(cachedResults);
        } catch (e) {
          logger.error(`Errore parsing risultati cache: ${e}`);
          localStorage.removeItem(cacheKey);
        }
      }
    }
    
    // Verifica offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      return searchOfflineFoods(query);
    }
    
    // Chiamata API
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/hybrid-food/combined-search`,
      method: 'GET',
      params: { 
        query: searchQuery, 
        max_results: maxResults,
        use_cache: DEFAULT_CACHE_ENABLED
      },
      timeout: 15000 // Timeout piu00f9 lungo perchu00e9 interroga piu00f9 API
    });
    
    // Elabora risposta
    if (response.data && response.data.success) {
      const foods: Food[] = response.data.foods || [];
      
      // Salva in cache
      if (DEFAULT_CACHE_ENABLED && foods.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(foods));
      }
      
      // Salva per uso offline
      if (foods.length > 0) {
        saveSearchResultsForOffline(searchQuery, foods).catch(err => 
          logger.error('Errore salvataggio risultati offline:', err)
        );
      }
      
      return foods;
    } else {
      // Gestione errore
      const errorMsg = response.data?.error || 'Errore server';
      logger.warn(`Ricerca combinata alimenti fallita: ${errorMsg}`);
      return [];
    }
  } catch (error) {
    logger.error('Errore durante la ricerca combinata alimenti:', error);
    return [];
  }
};

/**
 * Ottiene informazioni dettagliate su un alimento specifico
 *
 * @param foodId L'ID dell'alimento
 * @param source La sorgente del database (opzionale)
 * @returns Oggetto Food o null se non trovato
 */
const getFoodDetails = async (foodId: string, source?: string): Promise<Food | null> => {
  try {
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/hybrid-food/details/${foodId}`,
      method: 'GET',
      params: { source },
      timeout: 10000
    });
    
    if (response.data && response.data.success && response.data.food) {
      return response.data.food;
    }
    return null;
  } catch (error) {
    logger.error(`Errore recupero dettagli alimento ${foodId}:`, error);
    return null;
  }
};

/**
 * Ricerca alimento per codice a barre usando il database USDA
 * 
 * @param barcode Il codice a barre/UPC da cercare
 * @param maxResults Numero massimo di risultati (default: 10)
 * @returns Array di alimenti o array vuoto in caso di errore
 */
const searchByBarcode = async (barcode: string, maxResults = 10): Promise<Food[]> => {
  try {
    // Verifica offline
    if (!navigator.onLine) {
      logger.warn('Dispositivo offline, ricerca nel database locale');
      return searchOfflineBarcode(barcode);
    }
    
    const cacheKey = `barcode_search_${barcode}`;
    
    // Controlla cache
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cacheKey);
      if (cachedResults) {
        try {
          return JSON.parse(cachedResults);
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
    }
    
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/hybrid-food/barcode/${barcode}`,
      method: 'GET',
      params: { max_results: maxResults },
      timeout: 10000
    });
    
    if (response.data && response.data.success) {
      const foods = response.data.foods || [];
      
      // Salva in cache
      if (DEFAULT_CACHE_ENABLED && foods.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(foods));
      }
      
      // Salva associazione barcode
      if (foods.length > 0) {
        const foodIds = foods.map(food => food.food_id);
        saveBarcodeMapping(barcode, foodIds).catch(err => 
          logger.error('Errore salvataggio mappatura barcode:', err)
        );
      }
      
      return foods;
    }
    return [];
  } catch (error) {
    logger.error(`Errore ricerca barcode ${barcode}:`, error);
    return [];
  }
};

/**
 * Formatta i nutrienti per garantire visualizzazione coerente
 * 
 * @param nutrients Dati nutrienti grezzi dall'API
 * @returns Oggetto nutriente formattato con valori predefiniti per nutrienti mancanti
 */
const formatNutrients = (nutrients: Nutrient): Nutrient => {
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
 * Ottiene il nome della fonte dati in formato user-friendly
 * 
 * @param source Identificatore fonte dall'API
 * @returns Nome fonte user-friendly
 */
const getSourceName = (source: string): string => {
  if (!source) return 'Sconosciuto';
  
  const sourceLower = source.toLowerCase();
  for (const [key, value] of Object.entries(SOURCE_DISPLAY_NAMES)) {
    if (sourceLower.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return source; // Ritorna la stringa originale se non trovata
};

/**
 * Salva i risultati della ricerca nel database locale per uso offline
 */
const saveSearchResultsForOffline = async (query: string, foods: Food[]): Promise<void> => {
  try {
    // Salva ogni alimento individualmente
    for (const food of foods) {
      const foodWithId = {
        ...food,
        localId: food.localId || uuidv4() // Usa UUID esistente o creane uno nuovo
      };
      
      await saveToLocalDb('foods', foodWithId);
    }
    
    // Salva la query e gli ID associati
    const searchEntry = {
      id: uuidv4(),
      query: query.toLowerCase().trim(),
      foodIds: foods.map(f => f.food_id),
      timestamp: new Date().getTime()
    };
    
    await saveToLocalDb('foodSearches', searchEntry);
  } catch (error) {
    logger.error('Errore salvataggio risultati per offline:', error);
  }
};

/**
 * Salva l'associazione tra codice a barre e ID degli alimenti
 */
const saveBarcodeMapping = async (barcode: string, foodIds: string[]): Promise<void> => {
  try {
    const barcodeEntry = {
      id: uuidv4(),
      barcode,
      foodIds,
      timestamp: new Date().getTime()
    };
    
    await saveToLocalDb('barcodeMappings', barcodeEntry);
  } catch (error) {
    logger.error('Errore salvataggio mappatura barcode:', error);
  }
};

/**
 * Cerca alimenti nel database locale
 */
const searchOfflineFoods = async (query: string): Promise<Food[]> => {
  try {
    // Normalizza query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Ottieni tutte le ricerche
    const searches = await getItem('foodSearches', null) as Array<{query: string, foodIds: string[]}>;
    
    // Trova corrispondenza
    const matchingSearch = searches.find(s => s.query.includes(normalizedQuery) || normalizedQuery.includes(s.query));
    
    if (matchingSearch) {
      // Recupera alimenti per ID
      const foods: Food[] = [];
      
      for (const foodId of matchingSearch.foodIds) {
        const foodItems = await getItem('foods', {food_id: foodId}) as Food[];
        if (foodItems && foodItems.length > 0) {
          foods.push(foodItems[0]);
        }
      }
      
      return foods;
    }
    
    return [];
  } catch (error) {
    logger.error('Errore ricerca offline:', error);
    return [];
  }
};

/**
 * Cerca un codice a barre nel database locale
 */
const searchOfflineBarcode = async (barcode: string): Promise<Food[]> => {
  try {
    // Cerca mappatura del barcode
    const mappings = await getItem('barcodeMappings', {barcode}) as Array<{foodIds: string[]}>;
    
    if (mappings && mappings.length > 0) {
      const foodIds = mappings[0].foodIds;
      const foods: Food[] = [];
      
      // Recupera alimenti per ID
      for (const foodId of foodIds) {
        const foodItems = await getItem('foods', {food_id: foodId}) as Food[];
        if (foodItems && foodItems.length > 0) {
          foods.push(foodItems[0]);
        }
      }
      
      return foods;
    }
    
    return [];
  } catch (error) {
    logger.error('Errore ricerca barcode offline:', error);
    return [];
  }
};

/**
 * Salva un item nel database locale
 */
const saveToLocalDb = async <T>(storeName: string, item: T): Promise<void> => {
  try {
    await addItem(storeName as any, item);
  } catch (error) {
    logger.error(`Errore salvataggio nel DB locale (${storeName}):`, error);
  }
};

/**
 * Funzione che prepara la query di ricerca
 * Mantiene inalterata la query originale
 * 
 * @param query La query originale
 * @returns La stessa query senza modifiche
 */
const prepareSearchQuery = (query: string): string => {
  // Restituisce semplicemente la query originale
  return query;
};

// Esporta l'oggetto per comoditu00e0
const hybridFoodService = {
  searchFoods,
  searchCombinedFoods,
  getFoodDetails,
  searchByBarcode,
  formatNutrients,
  getSourceName,
  prepareSearchQuery,
  saveSearchResultsForOffline,
  saveBarcodeMapping,
  searchOfflineFoods
};

export default hybridFoodService;
