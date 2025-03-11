# Servizio Edamam per HealthyLifeApp

## Panoramica

Questo documento descrive l'implementazione del servizio Edamam ottimizzato per l'applicazione HealthyLifeApp. Il servizio è stato riprogettato per utilizzare esclusivamente l'API Edamam, rimuovendo le dipendenze da FatSecret e OpenFoodFacts, che si sono dimostrate meno affidabili.

## Servizi Implementati

### 1. EdamamOnlyService

Un servizio dedicato che utilizza esclusivamente l'API Edamam Recipe Search per fornire informazioni dettagliate sugli alimenti, inclusi:

- Informazioni nutrizionali complete (calorie, proteine, grassi, carboidrati)
- Micronutrienti (colesterolo, sodio, calcio, magnesio, potassio, ferro)
- Etichette dietetiche (senza glutine, vegetariano, ecc.)
- Lista degli ingredienti
- Informazioni sulla fonte

### 2. EdamamAggregatedService

Un servizio che mantiene l'interfaccia del precedente servizio aggregato, ma utilizza internamente solo EdamamOnlyService. Questo permette di mantenere la compatibilità con il codice esistente che si aspetta un servizio aggregato.

## Funzionalità Principali

- **Ricerca di alimenti**: Cerca alimenti utilizzando l'API Edamam e restituisce risultati dettagliati
- **Recupero dettagli**: Ottiene informazioni dettagliate su un alimento specifico
- **Gestione degli errori**: Implementa una gestione robusta degli errori per garantire che l'applicazione continui a funzionare anche in caso di problemi con l'API
- **Logging**: Fornisce un logging dettagliato per facilitare il debug

## Configurazione

Il servizio richiede le seguenti variabili d'ambiente:

- `EDAMAM_APP_ID`: L'ID dell'applicazione Edamam
- `EDAMAM_APP_KEY`: La chiave API dell'applicazione Edamam

Queste variabili devono essere definite nel file `.env` nella directory principale del progetto.

## Test

Sono stati implementati i seguenti script di test:

1. `test_edamam_only.py`: Testa il servizio EdamamOnlyService
2. `test_edamam_aggregated.py`: Testa il servizio EdamamAggregatedService

Per eseguire i test:

```bash
python test_edamam_only.py
python test_edamam_aggregated.py
```

## Formato dei Risultati

### Risultato di Ricerca

```json
{
  "query": "pollo",
  "count": 3,
  "results": [
    {
      "id": "e3d8487d974b4d36816112cdc5492469",
      "name": "Pollo Guisado (Chicken Stew) with Garlic Mashed Potatoes",
      "description": "seriouseats.com",
      "image": "https://edamam-product-images.s3.amazonaws.com/web-img/...",
      "calories": 4388,
      "servings": 4,
      "protein": 189.9,
      "fat": 278.6,
      "carbs": 244.9,
      "diet_labels": ["High-Fiber"],
      "health_labels": ["Egg-Free", "Peanut-Free", "Tree-Nut-Free", "Soy-Free", "Fish-Free", "Shellfish-Free"]
    },
    // Altri risultati...
  ]
}
```

### Dettagli Alimento

```json
{
  "id": "e3d8487d974b4d36816112cdc5492469",
  "name": "Pollo Guisado (Chicken Stew) with Garlic Mashed Potatoes",
  "description": "seriouseats.com",
  "image": "https://edamam-product-images.s3.amazonaws.com/web-img/...",
  "calories": 4388,
  "servings": 4,
  "protein": 189.9,
  "fat": 278.6,
  "carbs": 244.9,
  "cholesterol": 1020.0,
  "sodium": 3890.0,
  "calcium": 320.0,
  "magnesium": 260.0,
  "potassium": 4800.0,
  "iron": 25.0,
  "diet_labels": ["High-Fiber"],
  "health_labels": ["Egg-Free", "Peanut-Free", "Tree-Nut-Free", "Soy-Free", "Fish-Free", "Shellfish-Free"],
  "ingredients": [
    "Pollo Guisado (Chicken Stew)",
    "2 pounds bone-in chicken thighs or legs",
    "1 teaspoon Adobo seasoning",
    // Altri ingredienti...
  ]
}
```

## Miglioramenti Futuri

1. Implementare la cache dei risultati per ridurre le chiamate API
2. Aggiungere supporto per filtri dietetici (vegetariano, senza glutine, ecc.)
3. Migliorare la gestione delle porzioni e delle quantità
4. Implementare la ricerca avanzata con filtri per valori nutrizionali
