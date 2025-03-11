# Servizio di Traduzione per la Ricerca Alimenti

Questo documento fornisce una panoramica del servizio di traduzione implementato per migliorare la ricerca di alimenti in italiano nell'app HealthyLife.

## Problema Risolto

Il servizio di ricerca alimenti dell'app HealthyLife utilizza principalmente due API esterne (USDA FoodData Central ed Edamam) che sono ottimizzate per la lingua inglese. Quando gli utenti cercano termini alimentari in italiano, i risultati possono essere scarsi o assenti, compromettendo l'esperienza utente.

## Soluzione Implementata

Abbiamo creato un sistema di traduzione dedicato che:

1. Rileva automaticamente le query in italiano
2. Traduce i termini alimentari italiani in inglese prima di inviarli alle API
3. Mantiene la stessa interfaccia API, per una migliore compatibilità con il frontend esistente
4. Migliora significativamente i risultati della ricerca per gli utenti italiani

## Componenti Principali

### 1. Servizio di Traduzione (`translation_service.py`)

Il cuore del sistema è un dizionario completo di termini alimentari italiani con le corrispondenti traduzioni inglesi. Il servizio offre:

- Traduzione diretta di termini comuni
- Traduzione parola per parola per frasi complesse
- Rilevamento automatico della lingua
- Fallback per termini non presenti nel dizionario

### 2. Validatore di Configurazione (`config_validator.py`)

Verifica che tutte le API necessarie siano correttamente configurate, fornendo:

- Controlli per le chiavi API obbligatorie
- Avvisi per configurazioni incomplete
- Integrazione con il meccanismo di avvio dell'applicazione
- Log dettagliati delle configurazioni

### 3. Test Periodici API (`scheduled_api_test.py`)

Script automatizzato per verificare regolarmente la connettività delle API:

- Test delle API USDA e Edamam con termini specifici
- Generazione di report dettagliati
- Notifiche email opzionali in caso di problemi
- Possibilità di pianificazione periodica

## Come Funziona il Servizio di Traduzione

### Esempio di Flusso:

1. L'utente cerca "pomodori freschi" nell'app
2. Il servizio di traduzione identifica la lingua come italiano
3. I termini vengono tradotti in "fresh tomatoes"
4. La query tradotta viene inviata alle API USDA ed Edamam
5. I risultati vengono restituiti all'utente, mantenendo la richiesta originale

### Strategie di Traduzione:

Il servizio implementa diverse strategie:

- **Traduzione diretta**: per termini specifici (es. "pomodori" → "tomatoes")
- **Traduzione combinata**: per frasi complesse, traduce ogni parola e le ricombina
- **Mantenimento dell'originale**: per termini non riconosciuti, li mantiene inalterati

## Struttura del Dizionario

Il dizionario di traduzione è organizzato per categorie:

- Verdure e ortaggi
- Frutta
- Carni e proteine
- Cereali e farinacei
- Latticini
- Erbe e spezie
- Metodi di cottura e preparazione
- Piatti tipici italiani
- Termini generali relativi al cibo

## Configurazione e Utilizzo

### Variabili d'Ambiente:

Configurare nel file `.env`:

```
# API Keys
USDA_API_KEY=your_usda_api_key_here
EDAMAM_APP_ID=your_edamam_app_id_here
EDAMAM_APP_KEY=your_edamam_app_key_here

# Configurazioni opzionali
USE_EDAMAM_ONLY=false
USE_EDAMAM_AGGREGATED=true
USE_ENHANCED_EDAMAM=true
```

### Testare il Servizio:

Per testare manualmente il servizio di traduzione:

```python
from services.translation_service import translate_food_query

# Esempi di utilizzo
italian_term = "pomodori freschi"
english_term = translate_food_query(italian_term)
print(f"'{italian_term}' tradotto in '{english_term}'")
```

## Manutenzione e Aggiornamento

### Ampliamento del Dizionario:

Per aggiungere nuovi termini al dizionario:

1. Modificare il file `translation_service.py`
2. Aggiungere nuove voci al dizionario `ITALIAN_TO_ENGLISH_FOOD_TERMS`
3. Riavviare l'applicazione per rendere effettive le modifiche

### Monitoraggio delle Prestazioni:

Analizzare i log dell'applicazione per identificare:
- Termini italiani non riconosciuti frequentemente cercati
- Problemi con le API esterne
- Tempi di risposta anomali

## Possibili Miglioramenti Futuri

1. **Integrazione di servizi di traduzione automatica** per termini non presenti nel dizionario
2. **Supporto per altre lingue** oltre all'italiano
3. **Apprendimento adattivo** per migliorare le traduzioni in base ai feedback degli utenti
4. **Cache delle traduzioni** per ottimizzare le prestazioni
5. **Espansione dei test** per coprire più casi d'uso

## Limitazioni Attuali

- **Dizionario statico**: limitato ai termini esplicitamente inclusi
- **Nessuna gestione delle ambiguità**: alcuni termini possono avere traduzioni diverse in contesti diversi
- **Focus sulla lingua italiana**: non ottimizzato per altre lingue
- **Termini dialettali o regionali**: potrebbero non essere riconosciuti

## Supporto

Per domande, suggerimenti o problemi relativi al servizio di traduzione, contattare il team di sviluppo all'indirizzo [dev@healthylifeapp.example.com](mailto:dev@healthylifeapp.example.com)
