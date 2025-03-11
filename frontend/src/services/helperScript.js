/**
 * Script di pulizia cache per risolvere problemi di persistenza
 * Esegui nella console del browser
 */

// Cancella tutti i dati in localStorage
function clearLocalStorageData() {
  console.log('Cancellazione localStorage...');
  localStorage.clear();
  console.log('localStorage pulito!');
}

// Forza il ricaricamento di tutti i moduli JavaScript
function forceReloadJSModules() {
  console.log('Forza ricaricamento moduli JS...');
  
  // Simula un hard refresh
  window.location.reload(true);
}

// Funzione principale
function cleanupAndReload() {
  console.log('=== INIZIO PULIZIA CACHE ===');
  
  // Cancella localStorage
  clearLocalStorageData();
  
  console.log('Tutti i dati della cache sono stati cancellati.');
  console.log('Ricaricamento della pagina tra 2 secondi...');
  
  // Attendi brevemente prima di ricaricare
  setTimeout(() => {
    console.log('Ricaricamento...');
    forceReloadJSModules();
  }, 2000);
}

// Esegui la pulizia
cleanupAndReload();
