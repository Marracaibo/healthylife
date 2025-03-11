# Integrazione del Servizio Ibrido USDA-Edamam

Questa guida illustra come avviare e testare l'integrazione del servizio ibrido USDA-Edamam nel HealthyLifeApp.

## Prerequisiti

### Backend

Assicurati di aver configurato correttamente le chiavi API nel file `.env` nella cartella `backend`:

```
USDA_API_KEY=your_usda_api_key
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key
```

### Frontend

Assicurati di aver configurato correttamente le variabili d'ambiente nel file `.env` nella cartella `frontend`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Avvio del Backend

1. Naviga alla cartella `backend`:
   ```bash
   cd HealthyLifeApp/backend
   ```

2. Attiva l'ambiente virtuale (se utilizzi uno):
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. Installa le dipendenze (se non l'hai già fatto):
   ```bash
   pip install -r requirements.txt
   ```

4. Avvia il server backend:
   ```bash
   python main.py
   ```

5. Il server sarà in ascolto all'indirizzo `http://localhost:8000`

## Avvio del Frontend

1. Apri un nuovo terminale e naviga alla cartella `frontend`:
   ```bash
   cd HealthyLifeApp/frontend
   ```

2. Installa le dipendenze (se non l'hai già fatto):
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

4. Il frontend sarà accessibile all'indirizzo mostrato nel terminale (solitamente `http://localhost:5173`)

## Test dell'Integrazione

### Test Backend

Per verificare che il servizio ibrido sia correttamente integrato nel backend:

1. Assicurati che il backend sia in esecuzione
2. Esegui lo script di test dell'integrazione:
   ```bash
   cd HealthyLifeApp/backend
   python test_hybrid_integration.py
   ```

Lo script testerà:
- La connessione al server
- L'endpoint di ricerca standard
- L'endpoint di ricerca combinata

### Test Frontend

Per testare l'integrazione frontend:

1. Accedi all'app nel browser
2. Dal menu laterale, seleziona "Test Servizio Ibrido"
3. Usa l'interfaccia per:
   - Cercare alimenti usando il servizio ibrido
   - Provare sia la ricerca standard che quella combinata
   - Visualizzare i dettagli degli alimenti trovati
   - Testare il dialog di ricerca alimenti

## Risoluzione dei Problemi

### Il backend non si avvia

- Verifica che tutte le dipendenze siano installate
- Controlla il file `.env` per assicurarti che le chiavi API siano configurate
- Verifica che la porta 8000 non sia già in uso

### Il frontend non si connette al backend

- Assicurati che il backend sia in esecuzione
- Verifica che la variabile d'ambiente `VITE_API_BASE_URL` in `.env` punti all'indirizzo corretto
- Controlla la console del browser per eventuali errori di CORS

### Errori relativi alle variabili d'ambiente

- Ricorda che in Vite le variabili d'ambiente devono iniziare con `VITE_` per essere accessibili nel codice
- Accedi alle variabili d'ambiente con `import.meta.env.VITE_NOME_VARIABILE` invece di `process.env`
- Dopo aver modificato il file `.env`, riavvia il server di sviluppo

### Gli endpoint del servizio ibrido non rispondono

- Verifica che i router siano stati correttamente registrati in `main.py`
- Controlla i log del backend per eventuali errori
- Assicurati che il servizio `HybridFoodService` sia correttamente inizializzato

## Struttura dell'Integrazione

L'integrazione del servizio ibrido coinvolge:

### Backend

- `services/hybrid_food_service.py`: Implementazione del servizio
- `routers/hybrid_food_service.py`: Endpoint API per il servizio
- L'importazione e registrazione del router in `main.py`

### Frontend

- `src/config/constants.ts`: Configurazione e costanti
- `src/services/hybridFoodService.ts`: Client per il servizio API
- `src/components/HybridFoodSearchDialog.tsx`: Componente UI per la ricerca
- `src/components/examples/HybridFoodServiceExample.tsx`: Pagina di esempio
- Registrazione della route in `App.tsx`
- Link nel menu laterale in `Layout.tsx`
