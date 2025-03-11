# Servizio di Ricerca Alimentare Multilingue

## Panoramica

Il servizio di ricerca alimentare multilingue di HealthyLife App consente agli utenti di cercare alimenti nella propria lingua madre, attualmente con supporto dedicato per l'italiano, ottenendo risultati completi dalle API USDA FoodData Central ed Edamam.

## Problema Risolto

Il nostro servizio di ricerca alimenti originale utilizzava API esterne ottimizzate principalmente per la lingua inglese, risultando in:
- Risultati limitati o assenti quando si cercavano termini in italiano
- Necessità per gli utenti italiani di conoscere i termini inglesi degli alimenti
- Esperienza utente incoerente tra utenti di lingue diverse

## Soluzione Implementata

Abbiamo sviluppato un sistema integrato di traduzione che:

1. Rileva automaticamente le query in italiano
2. Utilizza un dizionario specializzato di termini alimentari per la traduzione
3. Invia le query tradotte alle API mantenendo la stessa interfaccia
4. Migliora significativamente la rilevanza dei risultati per gli utenti italiani

## Componenti Chiave

### 1. Servizio di Traduzione

Il `translation_service.py` gestisce:
- L'identificazione delle query in italiano
- La traduzione di termini alimentari specifici
- La traduzione di frasi composte parola per parola
- La gestione di termini non presenti nel dizionario

### 2. Validatore di Configurazione

Il `config_validator.py` garantisce:
- La corretta configurazione delle chiavi API
- Avvisi tempestivi in caso di configurazioni mancanti
- Log dettagliati dello stato di configurazione

### 3. Test Periodici API

Il `scheduled_api_test.py` fornisce:
- Test automatizzati della connettività delle API
- Report dettagliati sui risultati dei test
- Notifiche in caso di problemi con le API

## Architettura

```
                  ┌─────────────────┐
                  │     Cliente     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  API Endpoint   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
            ┌─────┤Servizio Ricerca │
            │     └────────┬────────┘
            │              │
            ▼              ▼
┌───────────────────┐    ┌─────────────────┐
│Servizio Traduzione│    │  Cache Ricerca  │
└───────────┬───────┘    └────────┬────────┘
            │                     │
            │                     │
            ▼                     ▼
┌───────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  API USDA Food    │◄───┤ Adapter Ricerca │────►    API Edamam   │
└───────────────────┘    └─────────────────┘    └─────────────────┘
```

## Funzionalità Principali

### Riconoscimento della Lingua

Il sistema rileva automaticamente quando una query è in italiano utilizzando:
- Pattern linguistici tipici
- Caratteri specifici dell'italiano
- Presenza di parole chiave italiane

```python
def is_italian(text):
    """Determina se il testo è probabilmente in italiano."""
    # Caratteri specifici italiani
    italian_chars = {'à', 'è', 'é', 'ì', 'ò', 'ù'}
    
    # Parole comuni italiane correlate al cibo
    italian_food_words = {'pasta', 'pizza', 'risotto', 'formaggio', 'pomodoro'}
    
    # Logica di rilevamento
    # ...
```

### Traduzione Specializzata

Il dizionario di traduzione è organizzato per categorie:
- Verdure e ortaggi
- Frutta
- Carni e proteine
- Piatti tipici italiani
- E molte altre...

```python
ITALIAN_TO_ENGLISH_FOOD_TERMS = {
    # Verdure e ortaggi
    "pomodoro": "tomato",
    "pomodori": "tomatoes",
    # ...
    
    # Frutta
    "mela": "apple",
    "mele": "apples",
    # ...
}
```

### Strategia di Traduzione Ibrida

Per ottenere i migliori risultati, il sistema utilizza:
1. **Traduzione diretta** per termini esatti nel dizionario
2. **Traduzione parola per parola** per frasi composte
3. **Mantenimento dei termini originali** quando la traduzione non è disponibile

## Configurazione e Utilizzo

### Variabili d'Ambiente

```
# API Keys (required)
USDA_API_KEY=your_usda_api_key
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

# Configuration (optional)
USE_EDAMAM_ONLY=false
USE_EDAMAM_AGGREGATED=true
USE_ENHANCED_EDAMAM=true

# Email Notifications (optional)
EMAIL_NOTIFICATION=false
EMAIL_FROM=sender@example.com
EMAIL_TO=admin@example.com
```

### Integrazione nel Flusso di Ricerca

```python
# Esempio di flusso di ricerca
query = "pomodori freschi"  # Query in italiano
translated_query = translate_food_query(query)  # "fresh tomatoes"
results = search_food_api(translated_query)  # Ricerca con query tradotta
return format_results(results, original_query=query)  # Presentazione dei risultati
```

## Benefici per gli Utenti

- **Accessibilità migliorata**: Gli utenti italiani possono utilizzare la propria lingua
- **Risultati più pertinenti**: Le ricerche in italiano restituiscono risultati completi
- **Esperienza coerente**: L'interfaccia e il comportamento rimangono invariati
- **Nessun cambiamento frontend**: Implementazione trasparente sul backend

## Test e Monitoraggio

- **Script di test automatizzati** per verificare la connettività API
- **Monitoraggio dei tempi di risposta** per rilevare problemi di performance
- **Analisi dei log** per identificare termini non tradotti frequentemente utilizzati
- **Test periodici** per garantire la continuità del servizio

## Espansione Futura

- **Integrazione di servizi di traduzione automatica** per termini non presenti nel dizionario
- **Supporto per altre lingue** oltre all'italiano
- **Apprendimento adattivo** per migliorare le traduzioni nel tempo
- **Database locale di alimenti italiani** per risultati ancora più accurati

## Risorse

- [Guida Utente per la Ricerca Multilingue](./MULTILINGUAL_SEARCH_USER_GUIDE.md)
- [Guida all'Espansione del Dizionario](./TRANSLATION_EXPANSION_GUIDE.md)
- [README dei Test Periodici](../backend/scripts/README_SCHEDULED_TESTS.md)

## Team e Supporto

Per domande o problemi relativi al servizio di ricerca multilingue, contattare:
- Team di sviluppo: [dev@healthylifeapp.example.com](mailto:dev@healthylifeapp.example.com)
- Supporto: [support@healthylifeapp.example.com](mailto:support@healthylifeapp.example.com)
