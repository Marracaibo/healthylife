# Integrazione Barcode Scanner PWA per HealthyLife

Questo documento descrive l'implementazione avanzata del barcode scanner integrato con la Progressive Web App (PWA) HealthyLife, che consente di scansionare codici a barre di alimenti e ottenere informazioni nutrizionali anche in modalità offline.

## Tecnologie utilizzate

- **Shape Detection API**: Per il riconoscimento avanzato dei codici a barre (con fallback per browser non compatibili)
- **IndexedDB**: Per la memorizzazione locale dei dati scansionati e la sincronizzazione differita
- **Web Share API**: Per condividere facilmente gli alimenti scansionati
- **Service Worker**: Per il supporto offline completo e la sincronizzazione in background
- **Vibration API**: Per feedback tattile durante la scansione

## Architettura dell'implementazione

### 1. Utility per funzionalità native (`nativeCapabilities.ts`)

Il file `nativeCapabilities.ts` fornisce un'interfaccia unificata per l'accesso alle API native del dispositivo:

- Rilevamento e lettura di codici a barre (Shape Detection API)
- Gestione della fotocamera del dispositivo
- Vibrazione per feedback tattile
- Condivisione di contenuti (Web Share API)
- Gestione delle notifiche push

### 2. Servizio ibrido migliorato (`hybridFoodService.ts`)

Il servizio `hybridFoodService.ts` è stato migliorato per supportare:

- Ricerca di alimenti tramite codice a barre
- Funzionamento offline completo con database locale
- Accodamento delle richieste quando offline
- Sincronizzazione automatica quando la connessione viene ripristinata

### 3. Componente BarcodeScanner migliorato

Il componente `BarcodeScanner.tsx` ora supporta:

- Rilevamento automatico dei codici a barre (quando il browser lo supporta)
- Funzionamento offline con notifiche appropriate
- Vibrazione come feedback alla scansione
- Condivisione dei risultati tramite Web Share API
- Interfaccia utente reattiva che si adatta allo stato della connessione

## Guida all'utilizzo

### Scansione di un codice a barre

1. Dalla pagina principale, clicca sull'icona del barcode scanner
2. Consenti l'accesso alla fotocamera se richiesto
3. Inquadra il codice a barre di un prodotto alimentare
4. Se il browser supporta la Shape Detection API, il codice verrà rilevato automaticamente
5. Altrimenti, sarà necessario inserire manualmente il codice

### Funzionamento offline

L'app è progettata per funzionare anche senza connessione Internet:

1. Se si scansiona un codice a barre già visto in precedenza, i dati verranno caricati dal database locale
2. Se si scansiona un nuovo codice mentre si è offline, la richiesta verrà accodata
3. Quando la connessione viene ripristinata, le richieste in coda verranno elaborate automaticamente
4. Una notifica informerà l'utente quando i dati offline saranno sincronizzati

### Condivisione dei risultati

Dopo aver scansionato un codice a barre e ottenuto informazioni sull'alimento:

1. Clicca sul pulsante "Condividi" accanto all'alimento
2. Seleziona l'app o il metodo con cui desideri condividere le informazioni
3. Le informazioni condivise includeranno il nome dell'alimento e i dati nutrizionali principali

## Note tecniche importanti

### Compatibilità browser

La Shape Detection API non è supportata da tutti i browser. L'app implementa una strategia di rilevamento delle funzionalità e utilizza metodi alternativi quando necessario:

- Se la Shape Detection API è disponibile: scansione automatica in tempo reale
- Altrimenti: input manuale del codice a barre

### Gestione dello stato offline

L'app utilizza diverse tecniche per garantire un'esperienza fluida anche offline:

1. **Service worker** per intercettare le richieste di rete
2. **IndexedDB** per memorizzare localmente alimenti e codici a barre
3. **Background Sync API** per sincronizzare i dati quando si torna online
4. **Eventi `online` e `offline`** per adattare l'interfaccia utente allo stato della connessione

### Sicurezza

- L'accesso alla fotocamera richiede un'esplicita autorizzazione dell'utente
- I dati memorizzati localmente sono utilizzati solo all'interno dell'app
- Le richieste di sincronizzazione in background sono protette e validate

## Risoluzione dei problemi

### La fotocamera non si avvia

- Verifica che il browser abbia i permessi necessari per accedere alla fotocamera
- Alcuni browser richiedono HTTPS per l'accesso alla fotocamera
- Su iOS, solo Safari supporta completamente l'accesso alla fotocamera

### La scansione automatica non funziona

- La Shape Detection API potrebbe non essere supportata dal tuo browser
- Prova a utilizzare Google Chrome per la migliore compatibilità
- Assicurati che il codice a barre sia ben illuminato e inquadrato

### Problemi di sincronizzazione offline

- Verifica che il service worker sia registrato correttamente
- Controlla che IndexedDB sia supportato e funzionante nel tuo browser
- Alcuni browser in modalità privata/incognito potrebbero limitare IndexedDB

## Future estensioni

1. Supporto per la scansione di codici QR con informazioni nutrizionali avanzate
2. Miglioramento del riconoscimento visivo degli alimenti tramite Machine Learning
3. Integrazione con database alimentari locali per un funzionamento completamente offline
4. Personalizzazione delle notifiche push basate sugli alimenti scansionati recentemente
