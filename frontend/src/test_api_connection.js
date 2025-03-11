// Test script per verificare la connessione all'API e la funzionalità di ricerca

const API_BASE_URL = 'http://localhost:8000/api';

// Funzione per testare la connessione base
async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/docs`);
    console.log('Test connessione base:', response.status === 200 ? 'OK' : 'FALLITO');
    return response.status === 200;
  } catch (error) {
    console.error('Errore durante il test di connessione:', error);
    return false;
  }
}

// Funzione per testare la ricerca alimenti senza traduzioni
async function testFoodSearchDirect(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/hybrid-food/search?query=${encodeURIComponent(query)}&max_results=5`);
    const data = await response.json();
    console.log(`Test ricerca diretta per "${query}":`, response.status === 200 ? 'OK' : 'FALLITO');
    console.log('Risultati:', data.results ? data.results.length : 0);
    return data;
  } catch (error) {
    console.error(`Errore durante la ricerca diretta per "${query}":`, error);
    return null;
  }
}

// Funzione principale di test
async function runTests() {
  console.log('=== INIZIO TEST CONNESSIONE API ===');
  console.log('Timestamp:', new Date().toISOString());
  
  // Test 1: Connessione base
  const connectionResult = await testConnection();
  
  // Test 2: Ricerca alimenti in inglese
  if (connectionResult) {
    console.log('\n--- Test Ricerca Alimenti ---');
    await testFoodSearchDirect('bread');
    await testFoodSearchDirect('apple');
  }
  
  console.log('\n=== FINE TEST CONNESSIONE API ===');
}

// Esegui i test
runTests();
