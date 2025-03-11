/**
 * Test isolato per il servizio hybridFoodService
 * 
 * Questo script ha lo scopo di verificare il funzionamento delle singole funzioni
 * senza dipendere dall'integrazione con altri componenti.
 */

// Mocking Axios
const mockAxios = {
  request: async (config) => {
    console.log('Axios richiesta:', config);
    
    // Simula risposta API per test
    return {
      data: {
        success: true,
        foods: [
          {
            food_id: 'test-123',
            food_name: 'Test Food',
            brand_name: 'Test Brand',
            nutrients: {
              calories: 100,
              protein: 10,
              carbs: 20,
              fat: 5
            },
            source: 'test-source'
          }
        ]
      }
    };
  }
};

// Mocking fetchWithRetry
const mockFetchWithRetry = async (config) => {
  console.log('fetchWithRetry chiamata con:', config);
  
  // Simula risposta API per test
  return {
    data: {
      success: true,
      foods: [
        {
          food_id: 'test-456',
          food_name: 'Test Food from API',
          brand_name: 'Test API Brand',
          nutrients: {
            calories: 200,
            protein: 15,
            carbs: 25,
            fat: 8
          },
          source: 'test-api-source'
        }
      ]
    }
  };
};

// Mocking localStorage
const mockLocalStorage = {
  items: {},
  getItem: function(key) {
    console.log('localStorage.getItem chiamato con:', key);
    return this.items[key] || null;
  },
  setItem: function(key, value) {
    console.log('localStorage.setItem chiamato con:', key, value);
    this.items[key] = value;
  },
  removeItem: function(key) {
    console.log('localStorage.removeItem chiamato con:', key);
    delete this.items[key];
  }
};

// Mocking navigator.onLine
Object.defineProperty(window.navigator, 'onLine', { value: true, writable: true });

// Mocking console con timestamp
const originalConsole = { ...console };
function timestampLog(...args) {
  const timestamp = new Date().toISOString();
  originalConsole.log(`[${timestamp}]`, ...args);
}

function timestampError(...args) {
  const timestamp = new Date().toISOString();
  originalConsole.error(`[${timestamp}] ERROR:`, ...args);
}

function timestampWarn(...args) {
  const timestamp = new Date().toISOString();
  originalConsole.warn(`[${timestamp}] WARN:`, ...args);
}

console.log = timestampLog;
console.error = timestampError;
console.warn = timestampWarn;

// Implementazione minimale del servizio per test
const prepareSearchQuery = (query) => {
  console.log('prepareSearchQuery chiamato con:', query);
  return query; // Versione semplificata senza traduzione
};

const searchFoods = async (query, maxResults = 25) => {
  console.log('searchFoods chiamato con:', query, maxResults);
  
  if (!query || query.trim().length === 0) {
    console.warn('Query vuota fornita a searchFoods');
    return [];
  }
  
  try {
    // Usa la funzione prepareSearchQuery
    const searchQuery = prepareSearchQuery(query.trim());
    console.log('Query preparata:', searchQuery);
    
    // Simula chiamata API
    const response = await mockFetchWithRetry({
      url: 'http://localhost:8000/api/hybrid-food/search',
      method: 'GET',
      params: { query: searchQuery, max_results: maxResults }
    });
    
    console.log('Risposta API:', response.data);
    
    if (response.data && response.data.success) {
      const foods = response.data.foods || [];
      return foods;
    }
    
    return [];
  } catch (error) {
    console.error('Errore in searchFoods:', error);
    return [];
  }
};

const searchCombinedFoods = async (query, maxResults = 25) => {
  console.log('searchCombinedFoods chiamato con:', query, maxResults);
  
  if (!query || query.trim().length === 0) {
    console.warn('Query vuota fornita a searchCombinedFoods');
    return [];
  }
  
  try {
    // Usa la funzione prepareSearchQuery
    const searchQuery = prepareSearchQuery(query.trim());
    console.log('Query preparata:', searchQuery);
    
    // Simula chiamata API
    const response = await mockFetchWithRetry({
      url: 'http://localhost:8000/api/hybrid-food/combined-search',
      method: 'GET',
      params: { query: searchQuery, max_results: maxResults }
    });
    
    console.log('Risposta API:', response.data);
    
    if (response.data && response.data.success) {
      const foods = response.data.foods || [];
      return foods;
    }
    
    return [];
  } catch (error) {
    console.error('Errore in searchCombinedFoods:', error);
    return [];
  }
};

// Test delle funzioni
async function runTests() {
  console.log('\n=== INIZIO TEST ISOLATO ===\n');
  
  // Test prepareSearchQuery
  console.log('\n--- Test prepareSearchQuery ---');
  const query1 = 'pane';
  const query2 = 'bread';
  
  console.log(`Query originale: "${query1}" => Risultato: "${prepareSearchQuery(query1)}"`);
  console.log(`Query originale: "${query2}" => Risultato: "${prepareSearchQuery(query2)}"`);
  
  // Test searchFoods
  console.log('\n--- Test searchFoods ---');
  try {
    const results1 = await searchFoods('bread');
    console.log(`Risultati per "bread":`, results1);
    
    const results2 = await searchFoods('pane');
    console.log(`Risultati per "pane":`, results2);
  } catch (e) {
    console.error('Errore nel test searchFoods:', e);
  }
  
  // Test searchCombinedFoods
  console.log('\n--- Test searchCombinedFoods ---');
  try {
    const results3 = await searchCombinedFoods('milk');
    console.log(`Risultati per "milk":`, results3);
    
    const results4 = await searchCombinedFoods('latte');
    console.log(`Risultati per "latte":`, results4);
  } catch (e) {
    console.error('Errore nel test searchCombinedFoods:', e);
  }
  
  console.log('\n=== FINE TEST ISOLATO ===\n');
}

// Esecuzione dei test
runTests();
