/**
 * Script per eseguire facilmente i test dell'applicazione
 */

import { execSync } from 'child_process';

// Configurazioni
const config = {
  serviceTests: '../services/__tests__/mockFatsecretService.test.ts',
  componentTests: '../components/__tests__/ManualMealPlanner.test.tsx'
};

/**
 * Esegue i test specificati
 * @param {string} testPath - Percorso dei test da eseguire
 */
function runTest(testPath) {
  try {
    console.log(`\n\n==== Esecuzione test: ${testPath} ====\n`);
    execSync(`npx jest ${testPath} --verbose`, { stdio: 'inherit' });
    console.log(`\n✅ Test completati con successo: ${testPath}\n`);
  } catch (error) {
    console.error(`\n❌ Errore durante l'esecuzione dei test: ${testPath}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Esegue tutti i test
 */
function runAllTests() {
  console.log('\n🔍 Avvio dei test per l\'integrazione FatSecret...\n');
  
  // Esegui i test dei servizi
  runTest(config.serviceTests);
  
  // Esegui i test dei componenti
  runTest(config.componentTests);
  
  console.log('\n✨ Tutti i test sono stati completati con successo! ✨\n');
}

// Esegui tutti i test automaticamente
runAllTests();
