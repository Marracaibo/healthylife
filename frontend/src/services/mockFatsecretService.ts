// Servizio di mock per FatSecret API, utile per testing
import { FoodSearchResult, FoodDetail, ImportedFood } from './fatsecretService';

// Dati di esempio per la ricerca - Lista ampliata
const mockFoods: FoodSearchResult[] = [
  // Cereali e derivati
  {
    id: '1',
    name: 'Pane integrale',
    description: '100g, circa 247 calorie',
    calories: 247
  },
  {
    id: '2',
    name: 'Pasta di grano duro',
    description: '100g, circa 371 calorie',
    calories: 371
  },
  {
    id: '3',
    name: 'Riso bianco',
    description: '100g, circa 130 calorie',
    calories: 130
  },
  {
    id: '101',
    name: 'Cereali da colazione - Corn Flakes',
    description: '100g, circa 384 calorie',
    calories: 384
  },
  {
    id: '102',
    name: 'Cereali da colazione - Muesli',
    description: '100g, circa 410 calorie',
    calories: 410
  },
  {
    id: '103',
    name: 'Cereali da colazione - Fiocchi d\'avena',
    description: '100g, circa 379 calorie',
    calories: 379
  },
  {
    id: '104',
    name: 'Farina di grano tenero',
    description: '100g, circa 364 calorie',
    calories: 364
  },
  {
    id: '105',
    name: 'Pane bianco',
    description: '100g, circa 265 calorie',
    calories: 265
  },
  {
    id: '106',
    name: 'Pane di segale',
    description: '100g, circa 259 calorie',
    calories: 259
  },
  {
    id: '107',
    name: 'Riso integrale',
    description: '100g, circa 111 calorie',
    calories: 111
  },
  {
    id: '108',
    name: 'Pasta integrale',
    description: '100g, circa 339 calorie',
    calories: 339
  },

  // Proteine animali
  {
    id: '4',
    name: 'Pollo (petto)',
    description: '100g, circa 165 calorie',
    calories: 165
  },
  {
    id: '5',
    name: 'Salmone',
    description: '100g, circa 208 calorie',
    calories: 208
  },
  {
    id: '6',
    name: 'Uova',
    description: '1 uovo medio (50g), circa 78 calorie',
    calories: 78
  },
  {
    id: '201',
    name: 'Tacchino (petto)',
    description: '100g, circa 104 calorie',
    calories: 104
  },
  {
    id: '202',
    name: 'Manzo (bistecca)',
    description: '100g, circa 271 calorie',
    calories: 271
  },
  {
    id: '203',
    name: 'Maiale (lombata)',
    description: '100g, circa 242 calorie',
    calories: 242
  },
  {
    id: '204',
    name: 'Tonno in scatola al naturale',
    description: '100g, circa 116 calorie',
    calories: 116
  },
  {
    id: '205',
    name: 'Merluzzo',
    description: '100g, circa 82 calorie',
    calories: 82
  },
  {
    id: '206',
    name: 'Gamberetti',
    description: '100g, circa 85 calorie',
    calories: 85
  },

  // Latticini
  {
    id: '7',
    name: 'Latte intero',
    description: '100ml, circa 64 calorie',
    calories: 64
  },
  {
    id: '8',
    name: 'Yogurt greco',
    description: '100g, circa 59 calorie',
    calories: 59
  },
  {
    id: '301',
    name: 'Formaggio Parmigiano',
    description: '100g, circa 431 calorie',
    calories: 431
  },
  {
    id: '302',
    name: 'Mozzarella',
    description: '100g, circa 280 calorie',
    calories: 280
  },
  {
    id: '303',
    name: 'Latte parzialmente scremato',
    description: '100ml, circa 46 calorie',
    calories: 46
  },
  {
    id: '304',
    name: 'Yogurt bianco',
    description: '100g, circa 61 calorie',
    calories: 61
  },
  {
    id: '305',
    name: 'Ricotta',
    description: '100g, circa 174 calorie',
    calories: 174
  },

  // Frutta
  {
    id: '9',
    name: 'Mela',
    description: '1 mela media (182g), circa 95 calorie',
    calories: 95
  },
  {
    id: '10',
    name: 'Banana',
    description: '1 banana media (118g), circa 105 calorie',
    calories: 105
  },
  {
    id: '401',
    name: 'Arancia',
    description: '1 arancia media (131g), circa 62 calorie',
    calories: 62
  },
  {
    id: '402',
    name: 'Fragole',
    description: '100g, circa 32 calorie',
    calories: 32
  },
  {
    id: '403',
    name: 'Ananas',
    description: '100g, circa 50 calorie',
    calories: 50
  },
  {
    id: '404',
    name: 'Pera',
    description: '1 pera media (178g), circa 101 calorie',
    calories: 101
  },
  {
    id: '405',
    name: 'Kiwi',
    description: '1 kiwi (69g), circa 42 calorie',
    calories: 42
  },
  {
    id: '406',
    name: 'Uva',
    description: '100g, circa 69 calorie',
    calories: 69
  },
  {
    id: '407',
    name: 'Avocado',
    description: '1/2 avocado (68g), circa 114 calorie',
    calories: 114
  },

  // Verdure
  {
    id: '501',
    name: 'Insalata (lattuga)',
    description: '100g, circa 15 calorie',
    calories: 15
  },
  {
    id: '502',
    name: 'Pomodoro',
    description: '1 pomodoro medio (123g), circa 22 calorie',
    calories: 22
  },
  {
    id: '503',
    name: 'Carota',
    description: '1 carota media (61g), circa 25 calorie',
    calories: 25
  },
  {
    id: '504',
    name: 'Broccoli',
    description: '100g, circa 34 calorie',
    calories: 34
  },
  {
    id: '505',
    name: 'Spinaci',
    description: '100g, circa 23 calorie',
    calories: 23
  },
  {
    id: '506',
    name: 'Patate',
    description: '1 patata media (173g), circa 161 calorie',
    calories: 161
  },
  {
    id: '507',
    name: 'Zucchine',
    description: '100g, circa 17 calorie',
    calories: 17
  },
  {
    id: '508',
    name: 'Melanzane',
    description: '100g, circa 25 calorie',
    calories: 25
  },
  {
    id: '509',
    name: 'Peperoni',
    description: '100g, circa 31 calorie',
    calories: 31
  },

  // Legumi
  {
    id: '601',
    name: 'Fagioli borlotti cotti',
    description: '100g, circa 93 calorie',
    calories: 93
  },
  {
    id: '602',
    name: 'Ceci cotti',
    description: '100g, circa 164 calorie',
    calories: 164
  },
  {
    id: '603',
    name: 'Lenticchie cotte',
    description: '100g, circa 116 calorie',
    calories: 116
  },
  {
    id: '604',
    name: 'Piselli',
    description: '100g, circa 81 calorie',
    calories: 81
  },

  // Frutta secca e semi
  {
    id: '701',
    name: 'Mandorle',
    description: '100g, circa 576 calorie',
    calories: 576
  },
  {
    id: '702',
    name: 'Noci',
    description: '100g, circa 654 calorie',
    calories: 654
  },
  {
    id: '703',
    name: 'Semi di chia',
    description: '100g, circa 486 calorie',
    calories: 486
  },
  {
    id: '704',
    name: 'Semi di lino',
    description: '100g, circa 534 calorie',
    calories: 534
  },

  // Grassi e oli
  {
    id: '801',
    name: 'Olio d\'oliva',
    description: '1 cucchiaio (13.5g), circa 119 calorie',
    calories: 119
  },
  {
    id: '802',
    name: 'Burro',
    description: '1 cucchiaio (14g), circa 102 calorie',
    calories: 102
  },
  {
    id: '803',
    name: 'Olio di semi di girasole',
    description: '1 cucchiaio (13.6g), circa 120 calorie',
    calories: 120
  },

  // Dolci e snack
  {
    id: '901',
    name: 'Cioccolato fondente',
    description: '100g, circa 598 calorie',
    calories: 598
  },
  {
    id: '902',
    name: 'Gelato alla vaniglia',
    description: '100g, circa 207 calorie',
    calories: 207
  },
  {
    id: '903',
    name: 'Patatine (chips)',
    description: '100g, circa 536 calorie',
    calories: 536
  },
  {
    id: '904',
    name: 'Barretta energetica',
    description: '1 barretta (35g), circa 150 calorie',
    calories: 150
  },
  {
    id: '905',
    name: 'Biscotti secchi',
    description: '100g, circa 457 calorie',
    calories: 457
  }
];

// Dettagli degli alimenti - Per semplicità manteniamo solo alcuni dettagli
// In una situazione reale, dovremmo avere dettagli per tutti gli alimenti
const mockFoodDetails: Record<string, FoodDetail> = {
  '1': {
    food_id: '1',
    food_name: 'Pane integrale',
    food_type: 'Generic',
    brand_name: '',
    serving_id: '0',
    serving_description: '100g',
    serving_url: '',
    metric_serving_amount: 100,
    metric_serving_unit: 'g',
    calories: 247,
    carbohydrate: 41.3,
    protein: 13.4,
    fat: 2.9,
    saturated_fat: 0.4,
    polyunsaturated_fat: 1.1,
    monounsaturated_fat: 0.6,
    trans_fat: 0,
    cholesterol: 0,
    sodium: 603,
    potassium: 230,
    fiber: 7.4,
    sugar: 5.7,
    vitamin_a: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0
  },

  // Utilizziamo una funzione per generare dettagli standard per gli ID mancanti
  // Il resto del codice rimarrà invariato
};

/**
 * Funzione helper per generare dettagli predefiniti per un alimento
 */
const generateDefaultDetails = (id: string): FoodDetail => {
  const food = mockFoods.find(f => f.id === id);
  
  if (!food) {
    throw new Error(`Alimento con ID ${id} non trovato`);
  }
  
  return {
    food_id: id,
    food_name: food.name,
    food_type: 'Generic',
    brand_name: '',
    serving_id: '0',
    serving_description: '100g',
    serving_url: '',
    metric_serving_amount: 100,
    metric_serving_unit: 'g',
    calories: food.calories,
    carbohydrate: 0,
    protein: 0,
    fat: 0,
    saturated_fat: 0,
    polyunsaturated_fat: 0,
    monounsaturated_fat: 0,
    trans_fat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    fiber: 0,
    sugar: 0,
    vitamin_a: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0
  };
};

/**
 * Cerca alimenti nel database mock
 * @param query Termine di ricerca
 * @param maxResults Numero massimo di risultati
 */
export const searchFoods = async (query: string, maxResults: number = 10): Promise<FoodSearchResult[]> => {
  console.log('[MOCK] Ricerca alimenti:', query);
  
  // Simuliamo un ritardo per rendere più realistico il mock
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Se la query è vuota, restituisci i primi N risultati
  if (!query || query.trim() === '') {
    return mockFoods.slice(0, maxResults);
  }
  
  // Normalizza la query per una ricerca più flessibile
  const normalizedQuery = query.toLowerCase().trim();
  
  // Cerca coincidenze esatte (per dare priorità)
  const exactMatches = mockFoods.filter(food => 
    food.name.toLowerCase() === normalizedQuery ||
    food.description.toLowerCase() === normalizedQuery
  );
  
  // Cerca coincidenze parziali
  const partialMatches = mockFoods.filter(food => {
    // Evita duplicati se già trovati nelle coincidenze esatte
    if (exactMatches.some(exact => exact.id === food.id)) {
      return false;
    }
    
    // Controlla se il nome o la descrizione contengono la query
    return food.name.toLowerCase().includes(normalizedQuery) ||
           food.description.toLowerCase().includes(normalizedQuery);
  });
  
  // Cerca coincidenze per parole singole (per query con più parole)
  const wordMatches = [];
  if (normalizedQuery.includes(' ')) {
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 2);
    
    for (const food of mockFoods) {
      // Evita duplicati se già trovati
      if (exactMatches.some(exact => exact.id === food.id) ||
          partialMatches.some(partial => partial.id === food.id)) {
        continue;
      }
      
      // Controlla se almeno una parola della query è presente
      const foodText = (food.name + ' ' + food.description).toLowerCase();
      if (queryWords.some(word => foodText.includes(word))) {
        wordMatches.push(food);
      }
    }
  }
  
  // Combina tutti i risultati dando precedenza alle corrispondenze esatte
  const combinedResults = [...exactMatches, ...partialMatches, ...wordMatches];
  
  // Limita il numero di risultati
  return combinedResults.slice(0, maxResults);
};

/**
 * Ottiene i dettagli di un alimento
 * @param foodId ID dell'alimento
 */
export const getFoodDetails = async (foodId: string): Promise<FoodDetail> => {
  console.log('[MOCK] Ottengo dettagli alimento:', foodId);
  
  // Simuliamo un ritardo per rendere più realistico il mock
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Ottieni i dettagli dell'alimento o genera dettagli predefiniti
  const details = mockFoodDetails[foodId] || generateDefaultDetails(foodId);
  
  if (!details) {
    throw new Error(`Dettagli per l'alimento con ID ${foodId} non trovati`);
  }
  
  return details;
};

/**
 * Converte un alimento FatSecret in un alimento dell'app
 */
export const convertFatSecretFoodToAppFood = (food: FoodDetail) => {
  return {
    name: food.food_name,
    amount: food.serving_description,
    calories: food.calories
  };
};

/**
 * Verifica lo stato del backend (mock)
 */
export const checkBackendStatus = async (): Promise<boolean> => {
  console.log('[MOCK] Verifica backend status');
  // In modalità mock il backend è sempre disponibile
  return true;
};

/**
 * Verifica la connessione con l'API FatSecret (mock)
 */
export const testFatSecretConnection = async (): Promise<{
  status: 'success' | 'error';
  error?: string;
  using_mock: boolean;
  backend_available: boolean;
  environment?: any;
}> => {
  console.log('[MOCK] Test connessione FatSecret');
  
  // Simuliamo un ritardo per rendere più realistico il mock
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    status: 'success',
    using_mock: true,
    backend_available: true,
    environment: {
      USE_MOCK_FATSECRET: "true",
      FATSECRET_CONSUMER_KEY: "***MOCK***",
      FATSECRET_CONSUMER_SECRET: "***MOCK***"
    }
  };
};
