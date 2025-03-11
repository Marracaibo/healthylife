/**
 * Script di test per verificare se il sistema di traduzione è completamente disabilitato
 */

import { prepareSearchQuery } from './services/hybridFoodService';
import { createLogger } from './utils/logger';

const logger = createLogger('TestTranslation');

// Test di varie query per verificare che non vengano tradotte
const testQueries = [
  'pane',
  'latte',
  'mela',
  'pasta',
  'carne',
  'pesce',
  'bread', // controllo inglese
  'milk'   // controllo inglese
];

// Esegui i test
function runTests() {
  logger.info('=== INIZIO TEST TRADUZIONE ===');
  
  testQueries.forEach(query => {
    const result = prepareSearchQuery(query);
    logger.info(`Query: "${query}" => "${result}" ${query === result ? '✓' : '❌ TRADOTTA!'}`);
  });
  
  logger.info('=== FINE TEST TRADUZIONE ===');
}

// Esponi la funzione di test
export const testTranslation = {
  runTests
};

// Esegui automaticamente il test se questo file viene caricato direttamente
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Aspetta un secondo per assicurarsi che tutto sia caricato
    setTimeout(() => {
      runTests();
    }, 1000);
  });
}

export default testTranslation;
