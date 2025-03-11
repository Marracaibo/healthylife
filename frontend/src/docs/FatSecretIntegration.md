# Integrazione FatSecret nella HealthyLife App

## Panoramica

L'integrazione con l'API FatSecret permette agli utenti di cercare alimenti all'interno del nostro pianificatore pasti manuale. In ambiente di sviluppo, utilizziamo un servizio mock per simulare le risposte dell'API.

## Funzionalità

- **Ricerca alimenti**: Cerca alimenti nel database FatSecret
- **Dettagli alimenti**: Visualizza informazioni dettagliate su un alimento specifico
- **Aggiunta al piano**: Aggiunge alimenti selezionati ai pasti giornalieri
- **Gestione errori**: Gestisce la mancanza di connessione con il backend

## Implementazione

L'implementazione si basa su due servizi principali:

1. `fatsecretService.ts`: Servizio principale per l'interazione con l'API FatSecret
2. `mockFatsecretService.ts`: Servizio mock che simula le risposte dell'API per lo sviluppo e i test

Il sistema è progettato per utilizzare automaticamente il servizio mock quando:
- Il backend non è raggiungibile
- La variabile d'ambiente `USE_MOCK_FATSECRET` è impostata su `true`

## Test

Sono stati implementati vari livelli di test:

1. **Test unitari**: Verificano il corretto funzionamento dei singoli servizi
2. **Test dei componenti**: Verificano il corretto funzionamento dell'UI
3. **Test manuali**: Istruzioni per testare manualmente il sistema

### Esecuzione dei test

Per eseguire i test automatici:

```bash
# Esegui tutti i test
npm test

# Esegui solo i test relativi a FatSecret
npm run test:fatsecret

# Esegui i test con report di copertura
npm run test:coverage
```

Per i test manuali, seguire le istruzioni nel file `src/test/manualTests.md`.

## Configurazione

### Backend

Nel file `.env` del backend, è possibile configurare:

```
USE_MOCK_FATSECRET=true  # Usa sempre il mock service
FATSECRET_CONSUMER_KEY=your_key  # Chiave per l'API reale
FATSECRET_CONSUMER_SECRET=your_secret  # Secret per l'API reale
```

### Frontend

Il frontend rileva automaticamente se il backend sta utilizzando il mock service o l'API reale.

## Risoluzione problemi

### Il backend non risponde

Se il backend non è raggiungibile, il frontend utilizzerà automaticamente il servizio mock. Non è necessario alcun intervento da parte dell'utente.

### Errori di ricerca

Se la ricerca di alimenti non funziona:

1. Verificare che il backend sia in esecuzione
2. Controllare i log della console per errori specifici
3. Provare a utilizzare il servizio mock
4. Riavviare l'applicazione

## Sviluppi futuri

- Migliorare l'interfaccia utente per la visualizzazione dei dettagli degli alimenti
- Aggiungere la possibilità di salvare alimenti preferiti
- Implementare il supporto per barcode scanning
- Migliorare le prestazioni di ricerca con cache locale
