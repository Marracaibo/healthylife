/**
 * Test isolato per diagnosticare il problema con hybridFoodService
 */

// Importa il servizio
const hybridFoodService = require('../services/hybridFoodService').default;

// Testa le funzioni del servizio
console.log('=== TEST ISOLATO DEL SERVIZIO HYBRID FOOD ===');

// Verifica che l'oggetto importato sia definito
console.log('1. hybridFoodService è definito:', !!hybridFoodService);

// Verifica che le funzioni siano definite
console.log('2. prepareSearchQuery è definita:', typeof hybridFoodService.prepareSearchQuery === 'function');
console.log('3. searchFoods è definita:', typeof hybridFoodService.searchFoods === 'function');
console.log('4. searchCombinedFoods è definita:', typeof hybridFoodService.searchCombinedFoods === 'function');

// Verifica il comportamento delle funzioni
const testQuery = 'bread';
console.log(`5. prepareSearchQuery risultato:`, hybridFoodService.prepareSearchQuery ? hybridFoodService.prepareSearchQuery(testQuery) : 'funzione non disponibile');

// Mostra le chiavi disponibili nell'oggetto
console.log('6. Chiavi disponibili nell\'oggetto hybridFoodService:', Object.keys(hybridFoodService));

// Verifica se esportazione è corretta
console.log('7. Verifica del valore di module.exports:', module.exports);

console.log('=== FINE TEST ===');
