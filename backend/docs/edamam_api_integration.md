# Integrazione delle API Edamam

## Panoramica delle API Edamam disponibili

Edamam offre diverse API per diverse esigenze. È importante utilizzare l'API corretta per ogni caso d'uso:

1. **Food Database API**
   - Endpoint: `https://api.edamam.com/api/food-database/v2/parser`
   - Scopo: Cercare alimenti singoli (es. "banana", "mela", "pane")
   - Ideale per: Applicazioni di tracciamento nutrizionale, diario alimentare
   - Restituisce: Informazioni dettagliate su alimenti singoli con valori nutrizionali

2. **Recipe Search API**
   - Endpoint: `https://api.edamam.com/api/recipes/v2`
   - Scopo: Cercare ricette (es. "pasta al pomodoro", "banana bread")
   - Ideale per: Applicazioni di ricette, pianificazione pasti
   - Restituisce: Ricette complete con ingredienti e valori nutrizionali

3. **Nutrition Analysis API**
   - Endpoint: `https://api.edamam.com/api/nutrition-details`
   - Scopo: Analizzare il contenuto nutrizionale di una lista di ingredienti
   - Ideale per: Calcolare i valori nutrizionali di ricette personalizzate
   - Restituisce: Analisi nutrizionale dettagliata

## Configurazione delle credenziali

Ogni API richiede credenziali specifiche (app_id e app_key). Non è possibile utilizzare le credenziali di un'API per accedere a un'altra API.

### Configurazione nel file .env

```
# Recipe Search API (attualmente in uso)
EDAMAM_APP_ID=your_recipe_app_id
EDAMAM_APP_KEY=your_recipe_app_key

# Food Database API (da aggiungere)
EDAMAM_FOOD_APP_ID=your_food_app_id
EDAMAM_FOOD_APP_KEY=your_food_app_key
```

## Implementazione consigliata

Per la nostra applicazione, dovremmo utilizzare:

1. **Food Database API** per la ricerca di alimenti singoli nel diario alimentare
2. **Recipe Search API** per la ricerca di ricette nella pianificazione dei pasti

### Esempio di implementazione

```typescript
// Nel servizio EdamamService

// Per cercare alimenti singoli
async searchFoodItems(query: string): Promise<FoodItem[]> {
  const response = await axios.get(
    'https://api.edamam.com/api/food-database/v2/parser',
    {
      params: {
        app_id: this.foodAppId,
        app_key: this.foodAppKey,
        ingr: query
      }
    }
  );
  
  // Trasforma i risultati nel formato richiesto dall'applicazione
  return this.transformFoodDatabaseResults(response.data);
}

// Per cercare ricette
async searchRecipes(query: string): Promise<Recipe[]> {
  const response = await axios.get(
    'https://api.edamam.com/api/recipes/v2',
    {
      params: {
        app_id: this.recipeAppId,
        app_key: this.recipeAppKey,
        q: query,
        type: 'public'
      }
    }
  );
  
  // Trasforma i risultati nel formato richiesto dall'applicazione
  return this.transformRecipeResults(response.data);
}
```

## Prossimi passi

1. Registrare una nuova applicazione per la Food Database API su [Edamam Developer Dashboard](https://developer.edamam.com/admin/applications)
2. Aggiornare il file `.env` con le nuove credenziali
3. Modificare il servizio `EnhancedEdamamService` per utilizzare l'API corretta in base al contesto
4. Aggiornare i componenti frontend per gestire correttamente i diversi tipi di risultati
