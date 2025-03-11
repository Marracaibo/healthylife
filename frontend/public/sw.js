// Service worker per HealthyLife App
const CACHE_NAME = 'healthylife-v1';
const OFFLINE_URL = '/offline.html';

// File da mettere in cache al momento dell'installazione
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon.png',
  '/icons/badge-72x72.png',
  '/assets/images/logo.svg',
  '/assets/fonts/roboto.woff2'
];

// Installazione: mette in cache le risorse base e la pagina offline
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  
  // Forza l'attivazione immediata
  self.skipWaiting();
});

// Attivazione: elimina le cache vecchie
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Permette al service worker di controllare tutte le pagine all'interno del suo scope
  return self.clients.claim();
});

// Strategia di cache avanzata
self.addEventListener('fetch', (event) => {
  // Gestiamo solo le richieste GET
  if (event.request.method !== 'GET') return;
  
  // Non gestire le richieste a indirizzi esterni
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  const url = new URL(event.request.url);
  
  // Per le richieste API, usa network-first con fallback JSON
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Se la rete fallisce, restituisci una risposta di errore specifica per API
          return new Response(JSON.stringify({ error: 'Nessuna connessione di rete disponibile', offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // Per le risorse statiche, usa cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        return cacheResponse || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  // Per le richieste HTML, usa network-first con cache-fallback
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cacheResponse) => {
            return cacheResponse || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }
  
  // Per tutte le altre richieste, usa stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      if (cacheResponse) {
        // Abbiamo una risposta dalla cache, ma iniziamo comunque a fetchare in background
        // per aggiornare la cache per le richieste future
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.ok && networkResponse.status < 400) {
              // Assicuriamoci di clonare correttamente la risposta prima di usarla
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Fallimento silenzioso per gli aggiornamenti in background
          });

        return cacheResponse;
      }

      // Non abbiamo nulla in cache, quindi facciamo il fetch e aggiorniamo la cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Verifica se possiamo mettere in cache questa risposta
          if (networkResponse.ok && networkResponse.status < 400) {
            // Clona la risposta PRIMA di qualsiasi operazione
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse.clone(); // Ritorna sempre un clone per sicurezza
        })
        .catch((error) => {
          // Se fallisce il fetch e non abbiamo cache, prova a servire la pagina offline
          // ma solo per le richieste di pagine HTML
          if (event.request.headers.get('Accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
          console.error('Fetch failed and no cache available:', error);
          throw error;
        });
    })
  );
});

// Gestione delle sincronizzazioni in background
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync', event.tag);
  
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(syncPendingActions());
  }
});

// Funzione per sincronizzare le azioni pendenti
async function syncPendingActions() {
  try {
    // Recupera i dati salvati nell'IndexedDB
    const db = await openDatabase();
    const pendingActions = await getPendingSyncActions(db);
    
    console.log(`[Service Worker] Trovate ${pendingActions.length} azioni da sincronizzare`);
    
    // Per ogni azione, prova a inviarla al server
    for (const action of pendingActions) {
      try {
        // Aggiorna lo stato dell'azione a 'syncing'
        await updateSyncActionStatus(db, action.id, 'syncing');
        
        const response = await fetch(action.endpoint, {
          method: action.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: action.data ? JSON.stringify(action.data) : undefined
        });
        
        if (response.ok) {
          // Se l'invio è andato a buon fine, aggiorna lo stato a 'completed'
          await updateSyncActionStatus(db, action.id, 'completed');
          console.log(`[Service Worker] Sincronizzata con successo azione ${action.id}`);
        } else {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`[Service Worker] Errore nella sincronizzazione dell'azione ${action.id}:`, error);
        // Se l'invio è fallito, aggiorna lo stato a 'failed'
        await updateSyncActionStatus(db, action.id, 'failed', error.message);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Errore in syncPendingActions:', error);
  }
}

// Funzioni di utilità per gestire IndexedDB
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('healthyLifeOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Verifica e crea gli object store necessari
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncQueueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncQueueStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        syncQueueStore.createIndex('endpoint', 'endpoint', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutsStore = db.createObjectStore('workouts', { keyPath: 'id' });
        workoutsStore.createIndex('date', 'date', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('meals')) {
        const mealsStore = db.createObjectStore('meals', { keyPath: 'id' });
        mealsStore.createIndex('date', 'date', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('date', 'date', { unique: false });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingSyncActions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('syncStatus');
    const request = index.getAll('pending');
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateSyncActionStatus(db, id, status, errorMessage) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const request = store.get(id);
    
    request.onsuccess = () => {
      const action = request.result;
      if (!action) {
        reject(new Error(`Azione con ID ${id} non trovata`));
        return;
      }
      
      action.syncStatus = status;
      if (status === 'failed') {
        action.retryCount = (action.retryCount || 0) + 1;
        action.errorMessage = errorMessage;
      }
      
      const updateRequest = store.put(action);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestione del click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Gestisci azioni specifiche qui
    console.log('Notification action clicked:', event.action);
    return;
  }
  
  // Apri l'URL specificato nei dati della notifica
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((clientList) => {
      // Verifica se c'è già una finestra aperta e portala in primo piano
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Altrimenti apri una nuova finestra
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
