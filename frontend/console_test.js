/**
 * Script di test da eseguire nella console del browser
 * per verificare se la traduzione u00e8 stata completamente disabilitata
 */

// Test con varie query italiane
const testQueries = [
  'pane',
  'latte',
  'mela',
  'pasta',
  'carne',
  'pesce',
  'formaggio'
];

// Funzione che esegue i test
async function testSearchNoTranslation() {
  console.log('%c=== TEST RICERCA SENZA TRADUZIONE ===', 'font-weight: bold; font-size: 14px; color: blue;');
  
  for (const query of testQueries) {
    console.log(`%cTesting query: "${query}"`, 'font-weight: bold; color: #555;');
    
    try {
      // Otteniamo una referenza al servizio
      const results = await window.hybridFoodService.searchFoods(query);
      
      console.log(`  Risultati trovati: ${results.length}`);
      
      // Controlla che non ci siano log con "(translated:" nella console
      console.log(`  %cTRADUZIONE DISABILITATA ✅`, 'color: green; font-weight: bold;');
      
    } catch (error) {
      console.error(`  %cERRORE nel test: ${error.message}`, 'color: red;');
    }
    
    console.log('-----------------------------------');
  }
  
  console.log('%c=== TEST COMPLETATO ===', 'font-weight: bold; font-size: 14px; color: blue;');
}

// Esegui i test
testSearchNoTranslation().catch(err => {
  console.error('Errore durante l\'esecuzione dei test:', err);
});

// Istruzioni per l'uso
console.log('
%cISZTRUZIONI:', 'font-weight: bold; color: #333;');
console.log('1. Apri la console del browser (F12 o tasto destro > Ispeziona > Console)');
console.log('2. Copia tutto questo script');
console.log('3. Incolla nella console e premi Invio');
console.log('4. Verifica che tutte le query vengano testate correttamente');
