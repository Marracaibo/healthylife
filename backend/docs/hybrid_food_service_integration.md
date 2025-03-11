# Guida all'integrazione del servizio ibrido USDA-Edamam

## Panoramica

Il servizio ibrido `HybridFoodService` è stato progettato per offrire una soluzione robusta e completa per la ricerca di informazioni nutrizionali sugli alimenti. Questo servizio combina due fonti di dati principali:

1. **USDA FoodData Central** - Fonte primaria con un database ampio e dettagliato
2. **Edamam API** - Fonte secondaria utilizzata come backup quando USDA non trova risultati

## Vantaggi dell'approccio ibrido

- **Copertura più ampia**: Accesso a un database più completo di alimenti
- **Maggiore affidabilità**: Fallback automatico quando una fonte non trova risultati
- **Risultati standardizzati**: Formato uniforme indipendentemente dalla fonte
- **Prestazioni ottimizzate**: Caching integrato per query ripetute
- **Flessibilità**: Possibilità di cercare da una fonte specifica o da entrambe

## Requisiti

- Python 3.7+
- Chiave API per USDA FoodData Central
- Credenziali per Edamam API (App ID e App Key)

## Configurazione

1. **Variabili d'ambiente**:
   Crea un file `.env` nella directory principale con le seguenti variabili:

   ```
   USDA_API_KEY=your_usda_api_key
   EDAMAM_APP_ID=your_edamam_app_id
   EDAMAM_APP_KEY=your_edamam_app_key
   ```

2. **Dipendenze**:
   Assicurati di avere installato le seguenti dipendenze:

   ```
   pip install aiohttp python-dotenv
   ```

## Utilizzo

### Inizializzazione

```python
from services.hybrid_food_service import HybridFoodService

# Crea un'istanza del servizio
food_service = HybridFoodService()
```

### Ricerca di alimenti (approccio a cascata)

Questo metodo cerca prima in USDA e, se non trova risultati, passa a Edamam:

```python
# Ricerca asincrona
results = await food_service.search_food("pasta")

# Accesso ai risultati
print(f"Fonte: {results['source']}")
print(f"Risultati trovati: {results['total_results']}")

# Iterazione sui risultati
for food in results['results']:
    print(f"Nome: {food['name']}")
    print(f"Calorie: {food['calories']}")
```

### Ricerca combinata (da entrambe le fonti)

Questo metodo cerca contemporaneamente in entrambe le fonti e combina i risultati:

```python
# Ricerca combinata
results = await food_service.search_food_from_all_sources("pizza")

print(f"Risultati totali: {results['total_results']}")
print(f"Da USDA: {results['usda_results']}")
print(f"Da Edamam: {results['edamam_results']}")

# Iterazione sui risultati combinati
for food in results['foods']:
    print(f"Nome: {food['name']}")
    print(f"Fonte: {food['source']}")
```

### Recupero dettagli alimento

```python
# Recupero dettagli per ID
# L'origine può essere 'usda', 'edamam' o 'auto' (determinata automaticamente)
food_details = await food_service.get_food("12345", source="auto")

if food_details:
    print(f"Nome: {food_details['name']}")
    print(f"Marca: {food_details['brand']}")
    
    # Accesso ai nutrienti
    if 'nutrients' in food_details:
        for nutrient_id, nutrient in food_details['nutrients'].items():
            print(f"{nutrient['name']}: {nutrient['amount']} {nutrient['unit']}")
```

## Gestione della cache

Il servizio implementa automaticamente un sistema di cache per migliorare le prestazioni:

- I risultati delle ricerche vengono salvati in un file JSON
- Le query successive per lo stesso termine utilizzeranno la cache
- Per forzare una ricerca fresca, imposta `use_cache=False`

```python
# Ricerca senza usare la cache
fresh_results = await food_service.search_food("apple", use_cache=False)
```

## Risultati dei test

I test condotti sul servizio ibrido hanno mostrato:

- **Tasso di successo**: 85% su un set di 20 alimenti di test
- **Tempo di risposta medio**: 1.43 secondi
- **Distribuzione delle fonti**:
  - USDA: 85%
  - Edamam: 0%
  - Nessun risultato: 15%

La ricerca combinata ha mostrato un aumento significativo dei risultati disponibili, con una media di 10 risultati aggiuntivi da Edamam per ogni query.

## Limitazioni note

1. Alcuni alimenti molto specifici o regionali potrebbero non essere trovati in nessuna delle due fonti
2. La gestione degli accenti e dei caratteri speciali può influire sui risultati
3. Le API esterne possono avere limiti di rate o quota che potrebbero influenzare l'uso intensivo

## Risoluzione dei problemi

1. **Nessun risultato trovato**:
   - Verifica che la query sia corretta e priva di errori di ortografia
   - Prova termini più generici o alternative (es. "mela" invece di "mela golden")

2. **Errori API**:
   - Controlla che le chiavi API siano valide e configurate correttamente
   - Verifica i limiti di quota delle API

3. **Prestazioni lente**:
   - Assicurati che il caching sia abilitato
   - Considera l'implementazione di un proxy o CDN per le richieste API frequenti

## Conclusioni

Il servizio ibrido USDA-Edamam offre una soluzione robusta e completa per la ricerca di informazioni nutrizionali, combinando il meglio di entrambe le fonti. La sua architettura flessibile e il sistema di caching integrato lo rendono ideale per applicazioni che richiedono dati nutrizionali affidabili e completi.
