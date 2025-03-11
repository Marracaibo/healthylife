import { useState, useEffect, useCallback } from 'react';
import { saveDataForSync, setupNetworkListeners } from '../utils/registerServiceWorker';
import { 
  addItem, 
  updateItem, 
  getItem, 
  getAllItems, 
  deleteItem,
  SyncableAction 
} from '../utils/offlineDatabase';

type StoreNames = 'workouts' | 'meals' | 'progress' | 'syncQueue';
type OfflineStatus = 'online' | 'offline' | 'syncing';

/**
 * Hook personalizzato per gestire dati con funzionalitu00e0 offline
 * 
 * Fornisce funzioni per salvare, recuperare e sincronizzare dati
 * che funzionano sia online che offline
 */
export function useOfflineData<T extends { id: string }>(apiEndpoint: string, storeName: StoreNames) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkStatus, setNetworkStatus] = useState<OfflineStatus>(navigator.onLine ? 'online' : 'offline');

  // Inizializza il monitoraggio dello stato della rete
  useEffect(() => {
    setupNetworkListeners(
      // Callback per quando va offline
      () => setNetworkStatus('offline'),
      // Callback per quando torna online
      () => {
        setNetworkStatus('syncing');
        syncData().finally(() => setNetworkStatus('online'));
      }
    );

    // Imposta lo stato iniziale
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');

    // Carica i dati iniziali
    loadData();

    return () => {
      // Non u00e8 necessario rimuovere gli ascoltatori di setupNetworkListeners
      // poichu00e9 sono gestiti globalmente
    };
  }, []);

  // Carica i dati dal server o dal database locale
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedData: T[];

      if (navigator.onLine) {
        // Se online, prova a caricare i dati dal server
        try {
          const response = await fetch(apiEndpoint);
          if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
          fetchedData = await response.json();
          
          // Salva i dati nel database locale per l'accesso offline
          for (const item of fetchedData) {
            await updateItem(storeName, item);
          }
        } catch (onlineError) {
          console.warn('Impossibile caricare i dati online, utilizzo dati offline:', onlineError);
          // Se il caricamento online fallisce, carica da offline
          fetchedData = await getAllItems<T>(storeName);
        }
      } else {
        // Se offline, carica i dati dal database locale
        fetchedData = await getAllItems<T>(storeName);
      }

      setData(fetchedData);
    } catch (err) {
      console.error('Errore nel caricamento dei dati:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, storeName]);

  // Salva un nuovo elemento
  const saveItem = useCallback(async (item: Omit<T, 'id'>): Promise<T> => {
    try {
      if (navigator.onLine) {
        // Se online, invia al server e poi salva in locale
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const savedItem = await response.json() as T;
        
        // Salva nel database locale
        await addItem<T>(storeName, savedItem);
        
        // Aggiorna lo stato
        setData(prev => [...prev, savedItem]);
        return savedItem;
      } else {
        // Se offline, genera un ID temporaneo e salva in locale
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const tempItem = { ...item, id: tempId } as unknown as T;
        
        // Salva nel database locale
        await addItem<T>(storeName, tempItem);
        
        // Aggiungi alla coda di sincronizzazione
        await saveDataForSync(
          apiEndpoint,
          'POST',
          item
        );
        
        // Aggiorna lo stato
        setData(prev => [...prev, tempItem]);
        return tempItem;
      }
    } catch (err) {
      console.error('Errore nel salvataggio dell\'elemento:', err);
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [apiEndpoint, storeName]);

  // Aggiorna un elemento esistente
  const updateItemById = useCallback(async (id: string, updates: Partial<T>): Promise<T> => {
    try {
      // Recupera l'elemento esistente
      const existingItem = await getItem<T>(storeName, id);
      if (!existingItem) throw new Error(`Elemento con ID ${id} non trovato`);
      
      // Crea l'elemento aggiornato
      const updatedItem = { ...existingItem, ...updates } as T;
      
      if (navigator.onLine) {
        // Se online, invia al server e poi aggiorna in locale
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        });

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const savedItem = await response.json() as T;
        
        // Aggiorna nel database locale
        await updateItem<T>(storeName, savedItem);
        
        // Aggiorna lo stato
        setData(prev => prev.map(item => item.id === id ? savedItem : item));
        return savedItem;
      } else {
        // Se offline, aggiorna in locale e aggiungi alla coda di sincronizzazione
        await updateItem<T>(storeName, updatedItem);
        
        // Aggiungi alla coda di sincronizzazione
        await saveDataForSync(
          `${apiEndpoint}/${id}`,
          'PUT',
          updatedItem
        );
        
        // Aggiorna lo stato
        setData(prev => prev.map(item => item.id === id ? updatedItem : item));
        return updatedItem;
      }
    } catch (err) {
      console.error(`Errore nell'aggiornamento dell'elemento ${id}:`, err);
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [apiEndpoint, storeName]);

  // Elimina un elemento
  const deleteItemById = useCallback(async (id: string): Promise<void> => {
    try {
      if (navigator.onLine) {
        // Se online, elimina dal server e poi dal database locale
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        
        // Elimina dal database locale
        await deleteItem(storeName, id);
      } else {
        // Se offline, elimina dal database locale e aggiungi alla coda di sincronizzazione
        await deleteItem(storeName, id);
        
        // Aggiungi alla coda di sincronizzazione
        await saveDataForSync(
          `${apiEndpoint}/${id}`,
          'DELETE'
        );
      }
      
      // Aggiorna lo stato
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Errore nell'eliminazione dell'elemento ${id}:`, err);
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [apiEndpoint, storeName]);

  // Sincronizza i dati offline con il server
  const syncData = useCallback(async (): Promise<void> => {
    // La sincronizzazione viene avviata automaticamente quando si torna online
    // grazie a setupNetworkListeners, ma puu00f2 anche essere avviata manualmente
    if (!navigator.onLine) {
      console.warn('Impossibile sincronizzare: connessione offline');
      return;
    }
    
    setNetworkStatus('syncing');
    try {
      // Ricarica i dati dal server
      await loadData();
      setNetworkStatus('online');
    } catch (err) {
      console.error('Errore durante la sincronizzazione:', err);
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
      throw err instanceof Error ? err : new Error(String(err));
    }
  }, [loadData]);

  return {
    data,               // I dati attuali
    loading,            // Stato di caricamento
    error,              // Errore, se presente
    networkStatus,      // Stato della rete ('online', 'offline', 'syncing')
    saveItem,           // Funzione per salvare un nuovo elemento
    updateItem: updateItemById,  // Funzione per aggiornare un elemento
    deleteItem: deleteItemById,  // Funzione per eliminare un elemento
    refreshData: loadData,       // Funzione per ricaricare i dati
    syncData,           // Funzione per sincronizzare i dati manualmente
  };
}

export default useOfflineData;
