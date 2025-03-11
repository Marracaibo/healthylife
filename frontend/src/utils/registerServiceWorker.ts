/**
 * Utility per registrare il service worker
 */
import { openDatabase, addToSyncQueue, syncPendingActions, SyncableAction } from './offlineDatabase';

// Registra il service worker
export const registerServiceWorker = async (): Promise<void> => {
  // Disabilitato temporaneamente
  console.log('Service Worker registration disabled');
  
  // Verifica se ci sono service worker registrati e li rimuove
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service Worker unregistered successfully');
      }
    } catch (error) {
      console.error('Error unregistering Service Worker:', error);
    }
  }
};

// Mostra una notifica per aggiornare l'app
export const showUpdateNotification = (): void => {
  console.log('Update notification disabled');
};

// Verifica e richiede le autorizzazioni per le notifiche push
export const requestNotificationPermission = async (): Promise<boolean> => {
  console.log('Notification permission request disabled');
  return false;
};

// Verifica se l'app è in modalità standalone (installata)
export const isAppInstalled = (): boolean => {
  return false;
};

// Salva i dati offline quando la connessione è assente e aggiunge alla coda di sincronizzazione
export const saveDataForSync = async (
  endpoint: string, 
  method: SyncableAction['method'], 
  data?: any
): Promise<SyncableAction> => {
  console.log('Offline data sync disabled');
  throw new Error('Offline sync is temporarily disabled');
};

// Funzione per sincronizzare i dati quando la connessione è ripristinata
export const syncOfflineData = async (): Promise<void> => {
  console.log('Offline data sync disabled');
};

// Ascoltatori per monitorare lo stato della connessione
export const setupNetworkListeners = (onOffline: () => void, onOnline: () => void): void => {
  // Disabilitato temporaneamente
};
