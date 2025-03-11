# Guida all'Integrazione di API Alimentari per il Mercato Italiano

Questa guida fornisce informazioni dettagliate su come integrare diverse API alimentari per migliorare il database nutrizionale dell'applicazione HealthyLifeApp, con particolare attenzione al mercato italiano.

## 1. Open Food Facts API

### Descrizione
Open Food Facts è un database alimentare gratuito e open source con una buona copertura di prodotti italiani. È completamente gratuito e non richiede registrazione per l'utilizzo di base.

### Registrazione
Non è necessaria alcuna registrazione per utilizzare l'API di base.

### Endpoint principali
- **Ricerca prodotti**: `https://it.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&action=process&json=1`
- **Dettagli prodotto per codice a barre**: `https://it.openfoodfacts.org/api/v0/product/{barcode}.json`

### Esempio di implementazione
```python
import aiohttp
import logging

class OpenFoodFactsService:
    def __init__(self, country="it"):
        self.base_url = f"https://{country}.openfoodfacts.org"
        self.search_url = f"{self.base_url}/cgi/search.pl"
        self.product_url = f"{self.base_url}/api/v0/product"
        
    async def search_food(self, query, max_results=10):
        """Cerca alimenti nel database Open Food Facts."""
        try:
            params = {
                "search_terms": query,
                "search_simple": 1,
                "action": "process",
                "json": 1,
                "page_size": max_results
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(self.search_url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._format_search_results(data, max_results)
                    else:
                        logging.error(f"Errore nella ricerca Open Food Facts: {response.status}")
                        return None
        except Exception as e:
            logging.error(f"Errore durante la ricerca Open Food Facts: {str(e)}")
            return None
            
    def _format_search_results(self, data, max_results):
        """Formatta i risultati della ricerca nel formato standard dell'app."""
        results = []
        
        if "products" in data and data["products"]:
            for product in data["products"][:max_results]:
                if "product_name" in product and product["product_name"]:
                    result = {
                        "id": product.get("code", ""),
                        "name": product.get("product_name", ""),
                        "description": self._format_description(product),
                        "brand": product.get("brands", ""),
                        "calories": self._get_nutrient_value(product, "energy-kcal"),
                        "serving_size": product.get("serving_size", None)
                    }
                    results.append(result)
        
        return {
            "results": results,
            "total_results": len(results),
            "page_number": 0,
            "max_results": max_results
        }
        
    def _format_description(self, product):
        """Crea una descrizione formattata per il prodotto."""
        nutrients = []
        
        if "nutriments" in product:
            n = product["nutriments"]
            if "energy-kcal_100g" in n:
                nutrients.append(f"Calories: {n['energy-kcal_100g']}kcal")
            if "fat_100g" in n:
                nutrients.append(f"Fat: {n['fat_100g']}g")
            if "carbohydrates_100g" in n:
                nutrients.append(f"Carbs: {n['carbohydrates_100g']}g")
            if "proteins_100g" in n:
                nutrients.append(f"Protein: {n['proteins_100g']}g")
        
        if nutrients:
            return f"Per 100g - {' | '.join(nutrients)}"
        return ""
        
    def _get_nutrient_value(self, product, nutrient):
        """Estrae il valore di un nutriente specifico."""
        if "nutriments" in product and f"{nutrient}_100g" in product["nutriments"]:
            return product["nutriments"][f"{nutrient}_100g"]
        return None
```

## 2. Edamam Food Database API

### Configurazione

L'integrazione con Edamam richiede le seguenti credenziali:

- `EDAMAM_APP_ID`: L'ID dell'applicazione Edamam
- `EDAMAM_APP_KEY`: La chiave API dell'applicazione Edamam

Queste credenziali devono essere configurate nel file `.env`.

### Autenticazione

Per autenticare le richieste all'API Edamam, è necessario includere l'header `Edamam-Account-User` con l'username dell'account Edamam. Questo è implementato nel servizio Edamam.

### Funzionalità

Il servizio Edamam supporta le seguenti funzionalità:

1. **Ricerca di alimenti**: Utilizza l'API Recipe Search per cercare ricette in base a una query.
2. **Dettagli alimento**: Recupera i dettagli nutrizionali di una ricetta specifica.

### Esempio di utilizzo

```python
from edamam_service import EdamamService

# Inizializza il servizio
edamam_service = EdamamService()

# Cerca alimenti
results = await edamam_service.search_food("pizza margherita", max_results=3)

# Recupera dettagli di un alimento specifico
food_id = results["results"][0]["id"]
details = await edamam_service.get_food(food_id)
```

### Note importanti

- L'API Edamam richiede l'header `Edamam-Account-User` per l'autenticazione.
- L'API Recipe Search restituisce ricette complete con informazioni nutrizionali.
- I risultati della ricerca includono calorie, porzioni e altri dettagli nutrizionali.

### Troubleshooting

- Se ricevi un errore 401 (Unauthorized), verifica che l'header `Edamam-Account-User` sia impostato correttamente.
- Se ricevi un errore 403 (Forbidden), verifica che le credenziali (APP_ID e APP_KEY) siano corrette.
- Se ricevi un errore 429 (Too Many Requests), hai superato il limite di richieste consentite dall'API.

### Integrazione con il servizio aggregato

Il servizio Edamam è integrato nel servizio aggregato (`AggregatedFoodService`) come terza opzione dopo FatSecret e OpenFoodFacts. Questo significa che verrà utilizzato solo se gli altri servizi non restituiscono risultati sufficienti.

Per identificare la fonte dei risultati, il servizio aggregato aggiunge un campo `source` a ciascun risultato con il valore "edamam".

## 3. Nutritionix API

### Descrizione
Nutritionix offre un database alimentare molto completo con supporto per il riconoscimento del linguaggio naturale. Sebbene sia principalmente focalizzato sul mercato statunitense, ha una buona copertura di alimenti internazionali.

### Registrazione
1. Visita [https://developer.nutritionix.com/](https://developer.nutritionix.com/)
2. Registrati per un account gratuito
3. Ottieni l'app_id e l'app_key

### Endpoint principali
- **Ricerca naturale**: `https://trackapi.nutritionix.com/v2/natural/nutrients`

### Esempio di implementazione
```python
import aiohttp
import logging
import os

class NutritionixService:
    def __init__(self):
        self.app_id = os.getenv("NUTRITIONIX_APP_ID")
        self.app_key = os.getenv("NUTRITIONIX_APP_KEY")
        self.base_url = "https://trackapi.nutritionix.com/v2"
        
    async def search_food(self, query, max_results=10):
        """Cerca alimenti nel database Nutritionix usando il linguaggio naturale."""
        try:
            headers = {
                "x-app-id": self.app_id,
                "x-app-key": self.app_key,
                "Content-Type": "application/json"
            }
            
            data = {
                "query": query,
                "locale": "it_IT"  # Imposta la località italiana
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/natural/nutrients", json=data, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._format_search_results(data, max_results)
                    else:
                        logging.error(f"Errore nella ricerca Nutritionix: {response.status}")
                        return None
        except Exception as e:
            logging.error(f"Errore durante la ricerca Nutritionix: {str(e)}")
            return None
            
    def _format_search_results(self, data, max_results):
        """Formatta i risultati della ricerca nel formato standard dell'app."""
        results = []
        
        if "foods" in data and data["foods"]:
            for food in data["foods"][:max_results]:
                result = {
                    "id": food.get("nix_item_id", "") or food.get("food_name", ""),
                    "name": food.get("food_name", ""),
                    "description": self._format_description(food),
                    "brand": food.get("brand_name", ""),
                    "calories": food.get("nf_calories"),
                    "serving_size": f"{food.get('serving_qty', '')} {food.get('serving_unit', '')}"
                }
                results.append(result)
        
        return {
            "results": results,
            "total_results": len(results),
            "page_number": 0,
            "max_results": max_results
        }
        
    def _format_description(self, food):
        """Crea una descrizione formattata per l'alimento."""
        serving = f"{food.get('serving_qty', '')} {food.get('serving_unit', '')}"
        nutrients = []
        
        nutrients.append(f"Calories: {food.get('nf_calories')}kcal")
        nutrients.append(f"Fat: {food.get('nf_total_fat')}g")
        nutrients.append(f"Carbs: {food.get('nf_total_carbohydrate')}g")
        nutrients.append(f"Protein: {food.get('nf_protein')}g")
        
        return f"Per {serving} - {' | '.join(nutrients)}"
```

## 4. Servizio Aggregato per il Mercato Italiano

Ecco un'implementazione di un servizio aggregato che combina tutte le API precedenti, con priorità per i risultati italiani:

```python
import asyncio
import logging

class ItalianFoodAggregator:
    def __init__(self):
        self.edamam = EdamamService(language="it")
        self.open_food_facts = OpenFoodFactsService(country="it")
        self.nutritionix = NutritionixService()
        self.fatsecret = FatSecretService()  # Il tuo servizio esistente
        
    async def search_food(self, query, max_results=10):
        """Cerca alimenti in tutte le API disponibili, con priorità per i risultati italiani."""
        try:
            # Esegui tutte le ricerche in parallelo
            tasks = [
                self.edamam.search_food(query, max_results),
                self.open_food_facts.search_food(query, max_results),
                self.nutritionix.search_food(query, max_results),
                self.fatsecret.search_food(query, max_results)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Raccogli tutti i risultati validi
            all_results = []
            for i, result in enumerate(results):
                if not isinstance(result, Exception) and result is not None:
                    source = ["Edamam", "OpenFoodFacts", "Nutritionix", "FatSecret"][i]
                    if "results" in result:
                        for item in result["results"]:
                            item["source"] = source
                            all_results.append(item)
            
            # Deduplicazione e ordinamento
            deduplicated = self._deduplicate_results(all_results)
            
            # Limita il numero di risultati
            final_results = deduplicated[:max_results]
            
            return {
                "results": final_results,
                "total_results": len(final_results),
                "page_number": 0,
                "max_results": max_results
            }
            
        except Exception as e:
            logging.error(f"Errore durante la ricerca aggregata: {str(e)}")
            return {
                "results": [],
                "total_results": 0,
                "page_number": 0,
                "max_results": max_results
            }
            
    def _deduplicate_results(self, results):
        """Rimuove i duplicati dai risultati basandosi sul nome."""
        seen_names = set()
        unique_results = []
        
        for result in results:
            name_lower = result["name"].lower()
            if name_lower not in seen_names:
                seen_names.add(name_lower)
                unique_results.append(result)
                
        return unique_results
```

## Configurazione dell'Ambiente

Per utilizzare queste API, aggiungi le seguenti variabili d'ambiente al tuo file `.env`:

```
# FatSecret API (esistente)
FATSECRET_CONSUMER_KEY=your_consumer_key
FATSECRET_CONSUMER_SECRET=your_consumer_secret

# Modalità di funzionamento
USE_MOCK_FATSECRET=true  # Imposta a false per utilizzare l'API reale
USE_FOOD_AGGREGATOR=true  # Imposta a true per utilizzare il servizio aggregato

# Edamam API (opzionale)
EDAMAM_APP_ID=your_app_id
EDAMAM_APP_KEY=your_app_key

# Nutritionix API (opzionale)
NUTRITIONIX_APP_ID=your_app_id
NUTRITIONIX_APP_KEY=your_app_key

# USDA API (opzionale)
USDA_API_KEY=your_api_key
```

Nota: Se `USE_MOCK_FATSECRET=true`, il sistema utilizzerà dati di esempio invece di chiamare l'API reale. Se `USE_FOOD_AGGREGATOR=true` e `USE_MOCK_FATSECRET=false`, il sistema utilizzerà prima FatSecret e poi Open Food Facts come fallback.

## Integrazione nell'Applicazione Esistente

Per integrare il servizio aggregato nell'applicazione esistente, modifica il file `routers/fatsecret.py` come segue:

```python
# Determina quale servizio utilizzare in base all'ambiente
USE_MOCK = os.getenv("USE_MOCK_FATSECRET", "true").lower() == "true"
USE_AGGREGATOR = os.getenv("USE_FOOD_AGGREGATOR", "false").lower() == "true"

if USE_MOCK:
    service = mock_fatsecret_service
elif USE_AGGREGATOR:
    service = ItalianFoodAggregator()
else:
    service = fatsecret_service
```

## Conclusioni

Questo approccio ibrido ti permetterà di:

1. Avere una copertura molto più ampia di alimenti, specialmente per il mercato italiano
2. Migliorare la qualità dei risultati di ricerca
3. Avere un fallback automatico se un'API non è disponibile
4. Mantenere la compatibilità con il codice esistente

Inizia implementando una API alla volta, testando accuratamente ogni integrazione prima di passare alla successiva.

## Servizio Aggregato

Il servizio aggregato combina risultati da più API alimentari, ma è attualmente configurato per utilizzare principalmente FatSecret a causa di problemi di connettività con le altre API:

1. **FatSecret** - Utilizzato come fonte primaria per la ricerca di alimenti
2. **Edamam** - Utilizzato come seconda opzione se FatSecret non trova risultati (attualmente non funzionante)
3. **OpenFoodFacts** - Utilizzato come ultima risorsa (attualmente non raggiungibile)

Questo ordine è stato scelto in base alla disponibilità e affidabilità delle API nel contesto attuale.

### Configurazione

Per abilitare il servizio aggregato, imposta la seguente variabile d'ambiente:

```
USE_FOOD_AGGREGATOR=true
```

### Identificazione della fonte

Gli ID degli alimenti restituiti dal servizio aggregato sono prefissati per identificare la fonte:

- `edamam-` - Alimenti provenienti da Edamam
- `off-` - Alimenti provenienti da OpenFoodFacts
- Nessun prefisso - Alimenti provenienti da FatSecret

Questo permette al sistema di sapere quale API utilizzare quando si richiedono i dettagli di un alimento specifico.

### Esempio di utilizzo

```python
from aggregated_food_service import AggregatedFoodService
from openfoodfacts_service import OpenFoodFactsService
from edamam_service import EdamamService
from fatsecret_service import FatSecretService

# Inizializza i servizi
off_service = OpenFoodFactsService(country="it")
edamam_service = EdamamService()
fatsecret_service = FatSecretService()

# Inizializza il servizio aggregato
aggregated_service = AggregatedFoodService(fatsecret_service, off_service, edamam_service)

# Cerca alimenti (proverà prima Edamam, poi FatSecret, infine OpenFoodFacts)
results = await aggregated_service.search_food("pasta", max_results=10)

# Ottieni dettagli di un alimento specifico
# Il sistema riconoscerà automaticamente la fonte in base al prefisso dell'ID
food_details = await aggregated_service.get_food("edamam-food_id")
food_details = await aggregated_service.get_food("off-8076809513722")
food_details = await aggregated_service.get_food("12345") # FatSecret
