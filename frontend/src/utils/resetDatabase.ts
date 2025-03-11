/**
 * Script per ripulire il database IndexedDB
 * Eseguire questo script una volta per eliminare completamente il database e permettere
 * la creazione di un nuovo database con tutti gli object store necessari
 */

export const resetIndexedDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Nome del database da eliminare
    const dbName = 'healthyLifeOfflineDB';
    
    console.log('Tentativo di eliminazione del database:', dbName);
    
    // Tentativo di eliminazione del database
    const request = indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = () => {
      console.log('Database eliminato con successo');
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Errore durante l\'eliminazione del database:', event);
      reject(new Error('Impossibile eliminare il database'));
    };
    
    request.onblocked = () => {
      console.warn('Eliminazione del database bloccata. Chiudere tutte le altre schede dell\'app.');
      alert('Eliminazione del database bloccata. Per favore, chiudi tutte le altre schede dell\'app e riprova.');
      reject(new Error('Eliminazione del database bloccata'));
    };
  });
};

// Funzione per visualizzare un bottone di reset nella UI
export const createResetDatabaseButton = (): void => {
  // Controlla se il bottone esiste già
  if (document.getElementById('reset-db-button')) return;
  
  // Crea il bottone
  const button = document.createElement('button');
  button.id = 'reset-db-button';
  button.innerText = 'Reset IndexedDB';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '10px 15px';
  button.style.backgroundColor = '#f44336';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  // Aggiungi l'evento click
  button.addEventListener('click', async () => {
    if (confirm('Sei sicuro di voler ripulire il database? Tutti i dati offline saranno persi.')) {
      try {
        await resetIndexedDB();
        alert('Database ripulito con successo. Ricarica la pagina per inizializzare il nuovo database.');
        location.reload();
      } catch (error) {
        console.error('Errore durante il reset del database:', error);
        alert(`Errore durante il reset del database: ${error.message}`);
      }
    }
  });
  
  // Aggiungi il bottone al DOM
  document.body.appendChild(button);
};
