/**
 * Utility per la gestione del database IndexedDB per il salvataggio dei dati offline
 */

// Definizioni di tipi per i dati offline
export type SyncableAction = {
  id: string; // UUID unico per l'azione
  timestamp: number; // Timestamp di creazione
  endpoint: string; // Endpoint API da chiamare
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Metodo HTTP
  data?: any; // Dati da inviare
  syncStatus: 'pending' | 'syncing' | 'completed' | 'failed'; // Stato di sincronizzazione
  retryCount: number; // Numero di tentativi di sincronizzazione
  errorMessage?: string; // Messaggio di errore in caso di fallimento
};

// Tipi di store disponibili nel database
type StoreNames = 'workouts' | 'meals' | 'progress' | 'syncQueue' | 'foods' | 'searchMappings' | 'barcodeMappings';

// Versione del database
const DB_VERSION = 3; // Aumentato a 3 per forzare la ricreazione del database
const DB_NAME = 'healthyLifeOfflineDBv3'; // Cambiato nome per evitare conflitti

// Aggiungi un flag per tenere traccia se il database è stato inizializzato
let dbInitialized = false;

/**
 * Inizializza e apre la connessione al database IndexedDB
 */
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB non u00e8 supportato in questo browser'));
      return;
    }

    // Funzione per eliminare i vecchi database
    const deleteOldDatabases = () => {
      try {
        // Lista di database obsoleti da eliminare
        const oldDBs = ['healthyLifeApp', 'healthyLifeOfflineDB', 'healthyLifeOfflineDBv2'];
        
        // Elimina i vecchi database uno alla volta
        oldDBs.forEach(dbName => {
          try {
            const deleteRequest = indexedDB.deleteDatabase(dbName);
            deleteRequest.onsuccess = () => {
              console.log(`Database ${dbName} eliminato con successo`);
            };
            deleteRequest.onerror = (e) => {
              console.log(`Errore nell'eliminazione del database ${dbName}:`, e);
            };
          } catch (err) {
            console.error(`Errore nella richiesta di eliminazione per ${dbName}:`, err);
          }
        });
      } catch (err) {
        console.error('Errore generale nell\'eliminazione dei vecchi database:', err);
      }
    };

    // Elimina i vecchi database prima di procedere
    deleteOldDatabases();
    
    // Aspetta un po' prima di aprire il nuovo database
    setTimeout(() => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
          console.error('Errore nell\'apertura del database:', event);
          reject(new Error('Impossibile aprire il database'));
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          console.log('Database aperto con successo:', DB_NAME);
          dbInitialized = true;
          resolve(db);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          console.log('Aggiornamento del database in corso...');

          // Crea gli object store necessari se non esistono
          if (!db.objectStoreNames.contains('workouts')) {
            const workoutsStore = db.createObjectStore('workouts', { keyPath: 'id' });
            workoutsStore.createIndex('date', 'date', { unique: false });
            workoutsStore.createIndex('programId', 'programId', { unique: false });
          }

          if (!db.objectStoreNames.contains('meals')) {
            const mealsStore = db.createObjectStore('meals', { keyPath: 'id' });
            mealsStore.createIndex('date', 'date', { unique: false });
            mealsStore.createIndex('type', 'type', { unique: false });
          }

          if (!db.objectStoreNames.contains('progress')) {
            const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
            progressStore.createIndex('date', 'date', { unique: false });
            progressStore.createIndex('type', 'type', { unique: false });
          }

          if (!db.objectStoreNames.contains('syncQueue')) {
            const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
            syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
            syncQueueStore.createIndex('syncStatus', 'syncStatus', { unique: false });
            syncQueueStore.createIndex('endpoint', 'endpoint', { unique: false });
          }

          // Nuovi object store per la gestione degli alimenti offline
          if (!db.objectStoreNames.contains('foods')) {
            const foodsStore = db.createObjectStore('foods', { keyPath: 'food_id' });
            foodsStore.createIndex('food_name', 'food_name', { unique: false });
            foodsStore.createIndex('brand_name', 'brand_name', { unique: false });
            foodsStore.createIndex('source', 'source', { unique: false });
            if (event.oldVersion < 2) {
              console.log('Creato store foods');
            }
          }

          if (!db.objectStoreNames.contains('searchMappings')) {
            const searchMappingsStore = db.createObjectStore('searchMappings', { keyPath: 'id' });
            searchMappingsStore.createIndex('query', 'query', { unique: false });
            searchMappingsStore.createIndex('timestamp', 'timestamp', { unique: false });
            if (event.oldVersion < 2) {
              console.log('Creato store searchMappings');
            }
          }

          if (!db.objectStoreNames.contains('barcodeMappings')) {
            const barcodeMappingsStore = db.createObjectStore('barcodeMappings', { keyPath: 'id' });
            barcodeMappingsStore.createIndex('barcode', 'barcode', { unique: false });
            barcodeMappingsStore.createIndex('timestamp', 'timestamp', { unique: false });
            if (event.oldVersion < 2) {
              console.log('Creato store barcodeMappings');
            }
          }

          console.log('Database upgrade completato');
        };
      } catch (err) {
        console.error('Errore nell\'apertura del database:', err);
        reject(new Error('Impossibile aprire il database'));
      }
    }, 1000); // Aspetta 1 secondo prima di aprire il database
  });
};

/**
 * Aggiunge un elemento a uno store del database
 */
export const addItem = async <T>(storeName: StoreNames, item: T): Promise<T> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);

    request.onsuccess = () => {
      console.log(`Item aggiunto con successo allo store ${storeName}`);
      resolve(item);
    };

    request.onerror = (event) => {
      console.error(`Errore nell'aggiunta dell'item allo store ${storeName}:`, event);
      reject(new Error(`Impossibile aggiungere l'item allo store ${storeName}`));
    };

    transaction.oncomplete = () => db.close();
  });
};

/**
 * Aggiorna un elemento in uno store del database
 */
export const updateItem = async <T>(storeName: StoreNames, item: T): Promise<T> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);

    request.onsuccess = () => {
      console.log(`Item aggiornato con successo nello store ${storeName}`);
      resolve(item);
    };

    request.onerror = (event) => {
      console.error(`Errore nell'aggiornamento dell'item nello store ${storeName}:`, event);
      reject(new Error(`Impossibile aggiornare l'item nello store ${storeName}`));
    };

    transaction.oncomplete = () => db.close();
  });
};

/**
 * Recupera un elemento da uno store del database tramite ID
 */
export const getItem = async <T>(storeName: StoreNames, id: string): Promise<T | null> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result as T | undefined;
      db.close();
      resolve(result || null);
    };

    request.onerror = (event) => {
      console.error(`Errore nel recupero dell'item dallo store ${storeName}:`, event);
      db.close();
      reject(new Error(`Impossibile recuperare l'item dallo store ${storeName}`));
    };
  });
};

/**
 * Recupera tutti gli elementi da uno store del database
 */
export const getAllItems = async <T>(storeName: StoreNames): Promise<T[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result as T[];
      db.close();
      resolve(results);
    };

    request.onerror = (event) => {
      console.error(`Errore nel recupero degli item dallo store ${storeName}:`, event);
      db.close();
      reject(new Error(`Impossibile recuperare gli item dallo store ${storeName}`));
    };
  });
};

/**
 * Elimina un elemento da uno store del database tramite ID
 */
export const deleteItem = async (storeName: StoreNames, id: string): Promise<void> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log(`Item eliminato con successo dallo store ${storeName}`);
      db.close();
      resolve();
    };

    request.onerror = (event) => {
      console.error(`Errore nell'eliminazione dell'item dallo store ${storeName}:`, event);
      db.close();
      reject(new Error(`Impossibile eliminare l'item dallo store ${storeName}`));
    };
  });
};

/**
 * Aggiunge un'azione alla coda di sincronizzazione
 */
export const addToSyncQueue = async (action: Omit<SyncableAction, 'id' | 'timestamp' | 'syncStatus' | 'retryCount'>): Promise<SyncableAction> => {
  const syncAction: SyncableAction = {
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    syncStatus: 'pending',
    retryCount: 0
  };

  return await addItem<SyncableAction>('syncQueue', syncAction);
};

/**
 * Recupera tutte le azioni in attesa di sincronizzazione
 */
export const getPendingSyncActions = async (): Promise<SyncableAction[]> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('syncStatus');
    const request = index.getAll('pending');

    request.onsuccess = () => {
      const results = request.result as SyncableAction[];
      db.close();
      resolve(results);
    };

    request.onerror = (event) => {
      console.error('Errore nel recupero delle azioni di sincronizzazione pendenti:', event);
      db.close();
      reject(new Error('Impossibile recuperare le azioni di sincronizzazione pendenti'));
    };
  });
};

/**
 * Aggiorna lo stato di un'azione nella coda di sincronizzazione
 */
export const updateSyncActionStatus = async (
  id: string,
  status: SyncableAction['syncStatus'],
  errorMessage?: string
): Promise<void> => {
  const syncAction = await getItem<SyncableAction>('syncQueue', id);
  
  if (!syncAction) {
    throw new Error(`Azione di sincronizzazione con ID ${id} non trovata`);
  }

  const updatedAction: SyncableAction = {
    ...syncAction,
    syncStatus: status,
    retryCount: status === 'failed' ? syncAction.retryCount + 1 : syncAction.retryCount,
    errorMessage: errorMessage
  };

  await updateItem<SyncableAction>('syncQueue', updatedAction);
};

/**
 * Sincronizza tutte le azioni pendenti con il server
 */
export const syncPendingActions = async (): Promise<{ success: number; failed: number }> => {
  if (!navigator.onLine) {
    console.log('Dispositivo offline, la sincronizzazione sarà tentata quando la connessione sarà disponibile');
    return { success: 0, failed: 0 };
  }

  const pendingActions = await getPendingSyncActions();
  let successCount = 0;
  let failedCount = 0;

  for (const action of pendingActions) {
    try {
      // Aggiorna lo stato dell'azione a 'syncing'
      await updateSyncActionStatus(action.id, 'syncing');

      // Effettua la chiamata API
      const response = await fetch(action.endpoint, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: action.data ? JSON.stringify(action.data) : undefined
      });

      if (!response.ok) {
        throw new Error(`Errore nella sincronizzazione: ${response.status} ${response.statusText}`);
      }

      // Aggiorna lo stato dell'azione a 'completed'
      await updateSyncActionStatus(action.id, 'completed');
      successCount++;
      
    } catch (error) {
      console.error(`Errore durante la sincronizzazione dell'azione ${action.id}:`, error);
      // Aggiorna lo stato dell'azione a 'failed'
      await updateSyncActionStatus(action.id, 'failed', error instanceof Error ? error.message : String(error));
      failedCount++;
    }
  }

  console.log(`Sincronizzazione completata: ${successCount} azioni sincronizzate con successo, ${failedCount} fallite`);
  return { success: successCount, failed: failedCount };
};
