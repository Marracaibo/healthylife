# Strategia di Implementazione del Servizio Ibrido di Ricerca Alimenti

## Contesto

Abbiamo condotto un'analisi approfondita di diverse API per la ricerca di informazioni alimentari, con particolare attenzione a:

1. **Test generici** su alimenti comuni internazionali
2. **Test specifici** su alimenti e piatti italiani

Le API testate sono state:
- **FatSecret API**
- **USDA FoodData Central API**
- **Edamam API** (temporaneamente esclusa a causa di problemi di autenticazione)

## Risultati Principali

### Test Generici

| Servizio | Successi | Tempo Medio |
|----------|----------|-------------|
| FatSecret | 100% | 0.85s |
| USDA | 100% | 0.97s |

### Test con Alimenti Italiani

| Servizio | Successi | Tempo Medio |
|----------|----------|-------------|
| FatSecret | 100% | 0.64s |
| USDA | 96% | 1.26s |

## Strategia di Implementazione Raccomandata

### 1. Architettura del Servizio Ibrido

```
[Richiesta Utente] → [Gestore Servizio Ibrido]
                      ↓
    ┌─────────────────┼─────────────────┐
    ↓                 ↓                 ↓
[FatSecret API] → [USDA API] → [Cache Locale]
    ↓                 ↓                 ↓
    └─────────────────┼─────────────────┘
                      ↓
             [Normalizzatore Risultati]
                      ↓
                [Risposta Utente]
```

### 2. Ordine di Priorità dei Servizi

1. **FatSecret API** (Prima chiamata)
   - Più veloce e con un tasso di successo eccellente
   - Particolarmente efficace con alimenti italiani
   - Formato risposta più semplice

2. **USDA API** (Fallback e arricchimento)
   - Utilizzata quando FatSecret non restituisce risultati
   - Utilizzata per arricchire i risultati con informazioni nutrizionali dettagliate
   - Eccellente per prodotti commerciali con marche specifiche

3. **Cache Locale** (Ottimizzazione)
   - Memorizza risultati frequenti per ridurre le chiamate API
   - Priorità sui piatti e prodotti italiani più cercati

### 3. Algoritmo di Ricerca

```python
def search_food(query, max_results=5):
    # 1. Verifica nella cache
    cached_results = check_cache(query)
    if cached_results:
        return cached_results
        
    # 2. Chiama FatSecret come servizio primario
    fatsecret_results = call_fatsecret_api(query, max_results)
    
    # 3. Se FatSecret non trova risultati, prova USDA
    if not fatsecret_results or len(fatsecret_results) == 0:
        usda_results = call_usda_api(query, max_results)
        if usda_results and len(usda_results) > 0:
            normalized_results = normalize_usda_results(usda_results)
            save_to_cache(query, normalized_results)
            return normalized_results
        return []
    
    # 4. Se abbiamo risultati da FatSecret ma vogliamo arricchirli
    if need_detailed_nutrition(query):
        usda_results = call_usda_api(query, max_results=1)  # Solo per il primo risultato
        enriched_results = enrich_fatsecret_with_usda(fatsecret_results, usda_results)
        save_to_cache(query, enriched_results)
        return enriched_results
    
    # 5. Salva in cache e restituisci i risultati FatSecret
    normalized_results = normalize_fatsecret_results(fatsecret_results)
    save_to_cache(query, normalized_results)
    return normalized_results
```

### 4. Normalizzazione dei Risultati

Creare un formato uniforme per i risultati provenienti da diverse API:

```json
{
  "food_id": "ID-univoco",
  "food_name": "Nome dell'alimento",
  "brand": "Marca (se disponibile)",
  "source": "fatsecret|usda",
  "nutrition": {
    "calories": 100,
    "protein": 12.5,
    "carbs": 5.2,
    "fat": 2.1,
    "fiber": 1.2
  },
  "serving_size": "100g",
  "original_data": { /* Dati originali completi */ }
}
```

### 5. Sistema di Cache

**Strategia di caching:**
- Cache locale con Redis o soluzione simile
- Priorità ai risultati più frequentemente cercati
- TTL (Time To Live) di 7 giorni per i dati
- Precaricamento dei prodotti e piatti italiani più comuni

**Struttura:**
```
KEY: query_normalizzata
VALUE: {
  "results": [...],
  "timestamp": "2025-03-07T12:34:56",
  "source": "fatsecret|usda|hybrid"
}
```

### 6. Ottimizzazioni per il Contesto Italiano

1. **Sinonimi e Traduzioni:**
   - Mappatura di nomi italiani → inglesi per migliorare la ricerca
   - Es: "Parmigiano Reggiano" → "Parmesan"

2. **Database Supplementare:**
   - Gestire un piccolo database di piatti tipici italiani non ben rappresentati nelle API
   - Priorità a DOP/IGP e piatti regionali

3. **Suggerimenti intelligenti:**
   - Se l'utente cerca "Pasta al ragù", suggerire anche "Pasta alla bolognese"

### 7. Configurazione di Fallback

In caso di errori o timeout delle API:

1. Provare il servizio alternativo
2. Utilizzare risultati dalla cache (anche se scaduti)
3. Mostrare suggerimenti basati su ricerche simili precedenti

## Piano di Implementazione

### Fase 1: Integrazione Base
- Implementare router per il servizio ibrido
- Risolvere conflitti di routing tra i diversi router
- Implementare la chiamata sequenziale a FatSecret → USDA

### Fase 2: Normalizzazione e Cache
- Implementare normalizzatore di risultati
- Aggiungere sistema di caching
- Creare meccanismo di fallback

### Fase 3: Ottimizzazioni
- Arricchire risultati combinando dati da diverse API
- Aggiungere supporto per sinonimi e traduzioni
- Creare database supplementare per piatti tipici italiani

### Fase 4: Monitoraggio e Miglioramento
- Tracciare tasso di successo delle ricerche
- Identificare alimenti problematici
- Migliorare continuamente il servizio

## Considerazioni Tecniche

### Gestione delle API Key
- Utilizzare variabili d'ambiente per le chiavi API
- Implementare rotazione delle chiavi se necessario

### Rate Limiting
- Monitorare i limiti di chiamate per ogni API
- Implementare strategia di throttling per evitare blocchi

### Log e Monitoraggio
- Registrare tutte le query e i loro risultati
- Monitorare tasso di successo, tempi di risposta e hit della cache

---

Questa strategia u00e8 stata sviluppata sulla base dei test condotti il 07/03/2025 e potrebbe richiedere aggiornamenti in base a cambiamenti nelle API o a requisiti futuri dell'applicazione.
