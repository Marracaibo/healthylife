# Test Periodici delle API di Ricerca Alimenti

Questo documento fornisce istruzioni su come configurare e utilizzare i test automatici per verificare il corretto funzionamento delle API di ricerca alimenti.

## Panoramica

Il sistema di test periodici è stato progettato per:

1. Verificare che le API USDA FoodData Central ed Edamam siano accessibili e funzionanti
2. Controllare che le chiavi API siano configurate correttamente
3. Generare report dettagliati sui risultati dei test
4. Inviare notifiche in caso di problemi (opzionale)

## Requisiti

- Python 3.6+
- Accesso al backend dell'applicazione HealthyLifeApp
- Chiavi API configurate nel file `.env`

## Configurazione

### 1. Variabili d'Ambiente

Assicurati che le seguenti variabili siano configurate nel file `.env`:

```
# API Keys
USDA_API_KEY=your_usda_api_key_here
EDAMAM_APP_ID=your_edamam_app_id_here
EDAMAM_APP_KEY=your_edamam_app_key_here

# Notifiche Email (opzionali)
EMAIL_NOTIFICATION=false  # Impostare su 'true' per attivare le notifiche
EMAIL_FROM=sender@example.com
EMAIL_TO=admin@example.com
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_username
SMTP_PASSWORD=your_password
```

### 2. Directory di Log

I test generano log e report nella directory `logs`. Assicurati che questa directory esista e sia scrivibile:

```bash
mkdir -p backend/logs
```

## Esecuzione Manuale

Per eseguire manualmente i test:

```bash
cd backend
python scripts/scheduled_api_test.py
```

Il comando restituirà:
- Codice di uscita `0` se i test sono riusciti (almeno una API funziona)
- Codice di uscita `1` se entrambe le API sono fallite

## Pianificazione dei Test

### Windows (Task Scheduler)

1. Apri Task Scheduler (`taskschd.msc` dal menu Start)
2. Seleziona "Crea attività base"
3. Assegna un nome (es. "HealthyLifeApp API Test")
4. Scegli la frequenza (giornaliera, settimanale, ecc.)
5. Come azione, seleziona "Avvia un programma"
6. Imposta il programma da avviare:
   - Programma/script: `python` o il percorso completo dell'eseguibile Python
   - Argomenti: `scripts/scheduled_api_test.py`
   - Inizia in: `C:\percorso\completo\a\HealthyLifeApp\backend`

### Linux/macOS (Cron)

Aggiungi una voce cron (esempio per esecuzione giornaliera alle 8:00):

```bash
# Apri il crontab
crontab -e

# Aggiungi questa riga
0 8 * * * cd /percorso/a/HealthyLifeApp/backend && /usr/bin/python scripts/scheduled_api_test.py >> logs/cron_api_test.log 2>&1
```

## Interpretazione dei Report

I report vengono salvati in `backend/logs/api_test_report.json` e contengono:

- Timestamp dell'esecuzione
- Stato di ciascuna API (success, partial, failed)
- Dettagli di ciascuna query di test
- Tasso di successo
- Avvisi di configurazione

### Esempio di Report

```json
{
  "timestamp": "2025-03-04T12:30:45.123456",
  "usda_api": {
    "status": "success",
    "details": {
      "queries": {
        "apple": {
          "status": "success",
          "count": 25,
          "time": 1.23,
          "first_result": "APPLE"
        },
        ...
      },
      "success_rate": 1.0
    }
  },
  "edamam_api": { ... },
  "config_valid": true,
  "warnings": []
}
```

## Risoluzione dei Problemi

Se i test falliscono:

1. Verifica che le chiavi API siano valide e correttamente configurate
2. Controlla che la connessione internet sia attiva
3. Verifica che i servizi USDA ed Edamam siano online
4. Controlla i limiti di utilizzo delle API (rate limits)
5. Esamina i file di log per errori specifici

## Supporto

Per supporto o segnalazioni di problemi, contatta il team di sviluppo all'indirizzo [dev@healthylifeapp.example.com](mailto:dev@healthylifeapp.example.com)
