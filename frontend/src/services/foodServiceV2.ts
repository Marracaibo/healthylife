/**
 * Food Service V2
 * 
 * Servizio per interagire con l'API Food Search V2 che utilizza FatSecret OAuth 2.0
 */

import axios from 'axios';
import { 
  API_BASE_URL, 
  DEFAULT_SEARCH_RESULTS,
  DEFAULT_CACHE_ENABLED 
} from '../config/constants';
import { createLogger } from '../utils/logger';
import { fetchWithRetry } from './apiConnectionService';

const logger = createLogger('FoodServiceV2');

// Tipi
export interface Nutrient {
  calories?: string | number;
  protein?: string | number;
  carbs?: string | number;
  fat?: string | number;
  fiber?: string | number;
  sugar?: string | number;
  sodium?: string | number;
  cholesterol?: string | number;
}

export interface Serving {
  serving_description?: string;
  serving_size?: string | number;
  serving_unit?: string;
  calories?: string | number;
  protein?: string | number;
  carbs?: string | number;
  fat?: string | number;
}

export interface Food {
  food_id: string;
  food_name: string;
  brand?: string;
  nutrition: Nutrient;
  servings?: Serving[];
  source?: string;
  description?: string;
}

export interface SearchResponse {
  results: Food[];
  metadata: {
    query: string;
    timestamp: string;
    count: number;
    elapsed_time: number;
    source: string;
  };
}

export interface FoodDetailsResponse {
  food: Food;
  metadata: {
    food_id: string;
    timestamp: string;
    elapsed_time: number;
    source: string;
  };
}

/**
 * Cerca alimenti utilizzando l'API Food Search V2
 * 
 * @param query Termine di ricerca
 * @param maxResults Numero massimo di risultati (default: 10)
 * @returns Lista di alimenti trovati
 */
export const searchFoods = async (
  query: string,
  maxResults: number = DEFAULT_SEARCH_RESULTS
): Promise<Food[]> => {
  try {
    if (!query || query.trim().length === 0) {
      logger.warn('Query di ricerca vuota');
      return [];
    }

    // Pulisci la query
    const searchQuery = query.trim();
    logger.info(`Ricerca per: ${searchQuery}`);

    // Chiave per la cache basata sulla query e sul numero massimo di risultati
    const cacheKey = `food_search_v2_${searchQuery.toLowerCase()}_${maxResults}`;

    // Controlla se abbiamo risultati nella cache
    if (DEFAULT_CACHE_ENABLED) {
      const cachedResults = localStorage.getItem(cacheKey);
      if (cachedResults) {
        try {
          logger.info(`Recuperati risultati per "${searchQuery}" dalla cache`);
          return JSON.parse(cachedResults);
        } catch (e) {
          logger.error(`Errore nel parsing dei risultati nella cache: ${e}`);
          localStorage.removeItem(cacheKey);
        }
      }
    }

    // Effettua la richiesta
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/food-search-v2/search`,
      method: 'GET',
      params: {
        query: searchQuery,
        max_results: maxResults
      },
      timeout: 10000 // 10 secondi
    }, 2); // 2 tentativi

    // Verifica la risposta
    if (response.data && response.data.results) {
      const foods = response.data.results;

      // Salva nella cache
      if (DEFAULT_CACHE_ENABLED && foods.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(foods));
        logger.info(`Salvati ${foods.length} risultati nella cache per "${searchQuery}"`);
      }

      return foods;
    }

    logger.warn(`Nessun risultato trovato per "${searchQuery}"`);
    return [];
  } catch (error) {
    logger.error(`Errore durante la ricerca: ${error}`);
    return [];
  }
};

/**
 * Ottiene i dettagli di un alimento specifico
 * 
 * @param foodId ID dell'alimento
 * @returns Dettagli dell'alimento o null in caso di errore
 */
export const getFoodDetails = async (foodId: string): Promise<Food | null> => {
  try {
    if (!foodId) {
      logger.warn('ID alimento non valido');
      return null;
    }

    logger.info(`Richiesta dettagli per alimento ID: ${foodId}`);

    // Chiave per la cache
    const cacheKey = `food_details_v2_${foodId}`;

    // Controlla la cache
    if (DEFAULT_CACHE_ENABLED) {
      const cachedDetails = localStorage.getItem(cacheKey);
      if (cachedDetails) {
        try {
          logger.info(`Recuperati dettagli per ID ${foodId} dalla cache`);
          return JSON.parse(cachedDetails);
        } catch (e) {
          logger.error(`Errore nel parsing dei dettagli nella cache: ${e}`);
          localStorage.removeItem(cacheKey);
        }
      }
    }

    // Effettua la richiesta
    const response = await fetchWithRetry({
      url: `${API_BASE_URL}/food-search-v2/food/${foodId}`,
      method: 'GET',
      timeout: 10000
    }, 2);

    // Verifica la risposta
    if (response.data && response.data.food) {
      const food = response.data.food;

      // Salva nella cache
      if (DEFAULT_CACHE_ENABLED) {
        localStorage.setItem(cacheKey, JSON.stringify(food));
        logger.info(`Salvati dettagli per ID ${foodId} nella cache`);
      }

      return food;
    }

    logger.warn(`Nessun dettaglio trovato per ID ${foodId}`);
    return null;
  } catch (error) {
    logger.error(`Errore durante il recupero dei dettagli: ${error}`);
    return null;
  }
};

/**
 * Converte le informazioni nutrizionali per renderle compatibili con il sistema esistente
 * 
 * @param food Oggetto alimento dal nuovo servizio
 * @returns Oggetto alimento compatibile con il sistema esistente
 */
export const convertToLegacyFormat = (food: Food): any => {
  // Estrai valori numerici dalle informazioni nutrizionali
  const extractNumber = (value: string | number | undefined): number => {
    if (typeof value === 'undefined') return 0;
    if (typeof value === 'number') return value;
    
    // Gestione speciale per il formato "Per 100g - 158kcal"
    if (value.includes('kcal')) {
      const match = value.match(/([\d.]+)kcal/);
      return match ? parseFloat(match[1]) : 0;
    }
    
    // Gestione per formati come "30.86g"
    const match = value.toString().match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Determina il tipo di porzione
  const determinePortionType = (foodName: string, servingUnit?: string): 'unit' | 'weight' => {
    const unitKeywords = ['pezzo', 'unità', 'porzione', 'fetta', 'pz', 'unit', 'piece', 'oz'];
    
    // Se il nome dell'alimento o l'unità di servizio contengono parole chiave di unità
    if (unitKeywords.some(keyword => foodName.toLowerCase().includes(keyword.toLowerCase())) ||
        (servingUnit && unitKeywords.some(keyword => servingUnit.toLowerCase().includes(keyword.toLowerCase())))) {
      return 'unit';
    }
    
    return 'weight';
  };

  return {
    food_id: food.food_id,
    food_name: food.food_name,
    brand_name: food.brand && food.brand !== 'Generic' ? food.brand : '',
    serving_size: food.nutrition?.serving_size || 100,
    serving_unit: food.nutrition?.serving_unit || 'g',
    image_url: '', // Il nuovo servizio non fornisce URL dell'immagine
    nutrients: {
      calories: extractNumber(food.nutrition?.calories),
      protein: extractNumber(food.nutrition?.protein),
      carbs: extractNumber(food.nutrition?.carbs),
      fat: extractNumber(food.nutrition?.fat),
      fiber: extractNumber(food.nutrition?.fiber),
      sugar: extractNumber(food.nutrition?.sugar)
    },
    description: food.description || '',
    source: food.source || 'fatsecret',
    portion: {
      type: determinePortionType(food.food_name, food.nutrition?.serving_unit),
      standard_quantity: `${food.nutrition?.serving_size || 100}${food.nutrition?.serving_unit || 'g'}`
    }
  };
};

// Esporta l'oggetto di servizio per comodità
const foodServiceV2 = {
  searchFoods,
  getFoodDetails,
  convertToLegacyFormat
};

export default foodServiceV2;
