/**
 * Test diretto delle API backend
 */

const testBackendEndpoints = async () => {
  try {
    // Test endpoint di ricerca alimenti - query in inglese
    console.log('\n=== TEST API RICERCA ALIMENTI (INGLESE) ===')
    const englishQuery = 'bread';
    console.log(`Ricerca per "${englishQuery}"...`);
    const englishResponse = await fetch(`http://localhost:8000/api/hybrid-food/search?query=${encodeURIComponent(englishQuery)}`);
    const englishData = await englishResponse.json();
    console.log('Risultati:', englishData);
    
    // Test endpoint di ricerca alimenti - query in italiano
    console.log('\n=== TEST API RICERCA ALIMENTI (ITALIANO) ===')
    const italianQuery = 'pane';
    console.log(`Ricerca per "${italianQuery}"...`);
    const italianResponse = await fetch(`http://localhost:8000/api/hybrid-food/search?query=${encodeURIComponent(italianQuery)}`);
    const italianData = await italianResponse.json();
    console.log('Risultati:', italianData);
    
    console.log('\n=== TEST COMPLETATO ===')
  } catch (error) {
    console.error('Errore durante il test:', error);
  }
};

// Esegui il test
testBackendEndpoints();
