# Esempio di integrazione del servizio ibrido USDA-Edamam

Questo documento mostra come integrare il nuovo servizio ibrido USDA-Edamam sia nel backend che nel frontend dell'applicazione HealthyLifeApp.

## Integrazione Backend

### 1. Registra l'API nell'applicazione FastAPI

In `app.py` o `main.py`, aggiungi:

```python
from api.hybrid_food_api import router as hybrid_food_router

# Aggiungi il router all'applicazione
app.include_router(hybrid_food_router)
```

### 2. Configurazione del servizio

Assicurati che le variabili d'ambiente necessarie siano configurate nel file `.env`:

```
USDA_API_KEY=your_usda_api_key
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key
```

## Integrazione Frontend

### 1. Configurazione dell'URL base dell'API

Assicurati che l'URL base dell'API sia configurato correttamente nel file `.env`:

```typescript
// In .env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Utilizzo del servizio ibrido nel componente FoodSearchDialog

Il componente `FoodSearchDialog` è stato aggiornato per utilizzare il servizio ibrido invece del servizio FatSecret precedente:

```typescript
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as hybridFoodService from '../services/hybridFoodService';

// ...

const FoodSearchDialog: React.FC<FoodSearchDialogProps> = ({
  open,
  onClose,
  onFoodSelect,
  title,
  selectedMeal
}) => {
  // ...
  
  const handleFoodSearch = async (query: string) => {
    // ...
    try {
      let results: FoodSearchResult[] = [];
      
      if (searchMode === 'hybrid') {
        // Usa il servizio ibrido
        const hybridResults = await hybridFoodService.searchFoods(query);
        
        // Mappa i risultati nel formato atteso
        results = hybridResults.map(food => ({
          id: food.food_id,
          name: food.food_name,
          description: food.description || '',
          calories: food.nutrients?.calories || 0,
          macros: {
            protein: food.nutrients?.protein || 0,
            carbs: food.nutrients?.carbohydrates || 0,
            fat: food.nutrients?.fat || 0
          },
          health_labels: food.health_labels || []
        }));
      }
      // ...
    } catch (error) {
      // ...
    }
  };
  
  // ...
}
```

### 3. Componente di esempio HybridFoodServiceExample

È disponibile anche un componente di esempio `HybridFoodServiceExample` che mostra come utilizzare il servizio ibrido:

```typescript
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container 
} from '@mui/material';
import * as hybridFoodService from '../../services/hybridFoodService';

const HybridFoodServiceExample: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [useCombinedSearch, setUseCombinedSearch] = useState(false);
  
  const handleSearch = async () => {
    setLoading(true);
    
    try {
      let searchResults;
      
      if (useCombinedSearch) {
        // Effettua una ricerca combinata
        searchResults = await hybridFoodService.searchCombinedFoods(query);
      } else {
        // Effettua una ricerca standard (a cascata)
        searchResults = await hybridFoodService.searchFoods(query);
      }
      
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // ...
}
```

## Test dell'integrazione

Per verificare che l'integrazione funzioni correttamente:

1. Apri la pagina del diario alimentare
2. Clicca su "Aggiungi pasto" o "Modifica pasto"
3. Nel dialog di ricerca alimenti, cerca un alimento (es. "mela", "pollo", "pasta")
4. Verifica che i risultati vengano visualizzati correttamente
5. Seleziona un alimento e specifica la porzione
6. Clicca su "Aggiungi" e verifica che l'alimento venga aggiunto al pasto

## Risoluzione dei problemi comuni

### Nessun risultato dalla ricerca

Se la ricerca non restituisce risultati:

1. Verifica che le chiavi API siano configurate correttamente nel file `.env` del backend
2. Controlla i log del backend per eventuali errori nelle chiamate API
3. Verifica che il servizio ibrido stia cercando sia su USDA che su Edamam

### Errori nella visualizzazione dei dettagli dell'alimento

Se i dettagli dell'alimento non vengono visualizzati correttamente:

1. Controlla la risposta dell'API nei log del browser
2. Verifica che la mappatura dei campi nel componente `FoodSearchDialog` sia corretta
3. Assicurati che il formato della porzione sia valido (es. "100g", "1 porzione")

## Ottimizzazioni implementate

### Debounce nella ricerca

Per migliorare le prestazioni e ridurre il numero di chiamate API non necessarie, è stato implementato un meccanismo di debounce nella ricerca degli alimenti:

```typescript
// Implementazione del debounce nella ricerca
const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newQuery = e.target.value;
  setQuery(newQuery);
  
  // Implementa il debounce
  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }
  
  if (newQuery.length >= 2) {
    debounceTimeout.current = setTimeout(() => {
      // Esegui la ricerca qui
      performSearch(newQuery);
    }, 500); // Attendi 500ms prima di eseguire la ricerca
  }
};
```

Questo approccio offre i seguenti vantaggi:

1. **Riduzione delle chiamate API**: La ricerca viene eseguita solo dopo che l'utente ha smesso di digitare per 500ms
2. **Migliore esperienza utente**: Meno messaggi di errore nei log del browser
3. **Risparmio di risorse**: Riduzione del carico sul server e sulle API esterne

### Riduzione dei log non necessari

I messaggi di log per le ricerche senza risultati sono stati ridotti per evitare di riempire la console con messaggi non utili:

```typescript
if (response.data.error && !response.data.error.includes('No results found')) {
  console.warn(`Food search failed: ${response.data.error}`);
}
```

## Funzionalità chiave

1. **Ricerca a cascata**: Il servizio prova prima USDA e, se non trova risultati, utilizza Edamam.
2. **Ricerca combinata**: È possibile cercare da entrambe le fonti contemporaneamente per risultati più completi.
3. **Caching**: I risultati delle ricerche sono memorizzati nella cache per migliorare le prestazioni.
4. **Interfaccia standardizzata**: I risultati sono formattati in modo coerente, indipendentemente dalla fonte.
5. **Resilienza**: Il sistema gestisce correttamente gli errori e i casi in cui nessuna fonte trova risultati.

## Test

Per testare l'integrazione:

1. Avvia il backend:
   ```
   cd backend
   python main.py
   ```

2. Avvia il frontend:
   ```
   cd frontend
   npm start
   ```

3. Naviga a una pagina che utilizza il componente di ricerca alimenti e verifica che:
   - La ricerca funzioni per alimenti comuni (dovrebbero venire da USDA)
   - La ricerca funzioni per alimenti specifici (potrebbe richiedere Edamam come fallback)
   - La ricerca combinata mostri risultati da entrambe le fonti
   - Il caching funzioni (le ricerche ripetute dovrebbero essere più veloci)
   - La selezione e l'aggiunta di alimenti funzionino correttamente
