import os
import sys
import time
import asyncio
import json
from datetime import datetime

# Aggiungi la directory principale al path per poter importare i moduli
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa i servizi
from services.fatsecret_service import search_foods as fatsecret_search
from services.usda_food_service import USDAFoodService

# Configura console per output
print_separator = lambda: print("\n" + "=" * 80 + "\n")

# Crea directory per i risultati se non esiste
os.makedirs("test_results", exist_ok=True)

# Alimenti e piatti da testare
TEST_FOODS = [
    # Alimenti italiani comuni nei supermercati
    "parmigiano reggiano",
    "prosciutto crudo",
    "prosciutto cotto",
    "mozzarella di bufala",
    "grana padano",
    "mortadella",
    "gorgonzola",
    "pecorino romano",
    "bresaola",
    "burrata",
    
    # Prodotti di marche italiane
    "nutella ferrero",
    "barilla spaghetti",
    "mulino bianco biscotti",
    "lavazza caffè",
    "san benedetto acqua",
    
    # Piatti italiani
    "lasagne alla bolognese",
    "tiramisù",
    "risotto ai funghi",
    "carbonara",
    "parmigiana di melanzane",
    "caprese",
    "pizza margherita",
    "ossobuco alla milanese",
    "cannoli siciliani",
    "ravioli ricotta e spinaci"
]

class TestAlimentiItaliani:
    def __init__(self):
        # Inizializza i servizi
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = os.getenv("USDA_API_KEY", "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm")
        self.max_results = 3
        self.results = {}
        
        # Prepara il file dei risultati
        self.timestamp = datetime.now()
        self.results_file = f"test_results/alimenti_italiani_{self.timestamp.strftime('%Y%m%d_%H%M%S')}.json"
    
    async def test_fatsecret(self, food):
        """Testa il servizio FatSecret."""
        print(f"FatSecret - Ricerca '{food}'...")
        try:
            start_time = time.time()
            results = fatsecret_search(food, max_results=self.max_results)
            elapsed = time.time() - start_time
            
            if results and len(results) > 0:
                print(f"  ✓ Trovati {len(results)} risultati in {elapsed:.2f}s")
                for i, item in enumerate(results[:self.max_results]):
                    print(f"    {i+1}. {item.get('food_name', 'N/A')} - {item.get('food_type', 'N/A')}")
                
                return {
                    "status": "success",
                    "count": len(results),
                    "time": elapsed,
                    "foods": results
                }
            else:
                print(f"  ✗ Nessun risultato in {elapsed:.2f}s")
                return {"status": "no_results", "time": elapsed}
        except Exception as e:
            print(f"  ✗ Errore: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    async def test_usda(self, food):
        """Testa il servizio USDA."""
        print(f"USDA - Ricerca '{food}'...")
        try:
            start_time = time.time()
            results = await self.usda_service.search_food(food, page_size=self.max_results)
            elapsed = time.time() - start_time
            
            foods = results.get("foods", [])
            if foods and len(foods) > 0:
                print(f"  ✓ Trovati {len(foods)} risultati in {elapsed:.2f}s")
                for i, item in enumerate(foods[:self.max_results]):
                    brand = item.get('brandOwner', 'Generic')
                    print(f"    {i+1}. {item.get('description', 'N/A')} - {brand}")
                
                return {
                    "status": "success",
                    "count": len(foods),
                    "time": elapsed,
                    "foods": foods
                }
            else:
                print(f"  ✗ Nessun risultato in {elapsed:.2f}s")
                return {"status": "no_results", "time": elapsed}
        except Exception as e:
            print(f"  ✗ Errore: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def analyze_service_comparison(self, stats):
        """Analizza e confronta le prestazioni dei servizi."""
        total_foods = len(TEST_FOODS)
        categories = {
            "supermercato": TEST_FOODS[:15],  # prodotti da supermercato
            "piatti": TEST_FOODS[15:]        # piatti italiani
        }
        
        category_stats = {}
        for category_name, foods in categories.items():
            category_stats[category_name] = {
                "fatsecret": {"success": 0, "no_results": 0, "error": 0},
                "usda": {"success": 0, "no_results": 0, "error": 0}
            }
            
            # Calcola statistiche per categoria
            for food in foods:
                if food in self.results:
                    for service in ["fatsecret", "usda"]:
                        if service in self.results[food]:
                            status = self.results[food][service]["status"]
                            category_stats[category_name][service][status] += 1
        
        print("\nANALISI PER CATEGORIA:\n")
        
        for category, cat_stats in category_stats.items():
            total_cat_foods = len(categories[category])
            print(f"CATEGORIA: {category.upper()} ({total_cat_foods} alimenti)")
            print("-" * 50)
            
            for service, service_stats in cat_stats.items():
                success_rate = service_stats["success"] / total_cat_foods * 100
                print(f"  {service.upper()}: {service_stats['success']}/{total_cat_foods} ({success_rate:.1f}%)")
            print()
        
        # Analisi complessiva
        print("\nRISULTATI COMPLESSIVI:\n")
        print(f"{'SERVIZIO':<12} | {'SUCCESSI':<16} | {'VUOTI':<8} | {'ERRORI':<8} | {'TEMPO TOTALE':<12} | {'TEMPO MEDIO':<10}")
        print("-" * 80)
        
        for service, data in stats.items():
            success_rate = data["success"] / total_foods * 100 if total_foods > 0 else 0
            avg_time = data["total_time"] / total_foods if data["total_time"] > 0 else 0
            
            print(f"{service:<12} | {data['success']}/{total_foods} ({success_rate:5.1f}%) | {data['no_results']:<8} | {data['error']:<8} | {data['total_time']:8.2f}s | {avg_time:6.2f}s")
    
    async def run_test(self):
        """Esegue i test su tutti gli alimenti definiti."""
        print("\n" + "=" * 80)
        print(f"   TEST ALIMENTI ITALIANI - {self.timestamp.strftime('%d/%m/%Y %H:%M')}")
        print("   FatSecret API vs USDA FoodData Central API")
        print("=" * 80 + "\n")
        
        # Statistiche complessive
        stats = {
            "fatsecret": {"success": 0, "no_results": 0, "error": 0, "total_time": 0},
            "usda": {"success": 0, "no_results": 0, "error": 0, "total_time": 0}
        }
        
        # Test ogni alimento
        progress = 0
        for food in TEST_FOODS:
            progress += 1
            print(f"\n[{progress}/{len(TEST_FOODS)}] TEST: '{food.upper()}'")
            print("-" * 40)
            
            # Esegui i test su entrambi i servizi
            fatsecret_result = await self.test_fatsecret(food)
            usda_result = await self.test_usda(food)
            
            # Salva risultati
            self.results[food] = {
                "fatsecret": fatsecret_result,
                "usda": usda_result
            }
            
            # Aggiorna statistiche
            for service, result in [("fatsecret", fatsecret_result), ("usda", usda_result)]:
                stats[service][result["status"]] += 1
                if "time" in result:
                    stats[service]["total_time"] += result["time"]
        
        # Analisi dei risultati
        print_separator()
        self.analyze_service_comparison(stats)
        
        # Determina il servizio migliore per cibi italiani
        best_service = max(["fatsecret", "usda"], 
                         key=lambda s: stats[s]["success"] / len(TEST_FOODS))
        
        print("\nCONCLUSIONI:")
        print(f"- Per alimenti e piatti italiani, il servizio più affidabile è: {best_service.upper()}")
        print(f"  con {stats[best_service]['success']}/{len(TEST_FOODS)} ({stats[best_service]['success']/len(TEST_FOODS)*100:.1f}%) ricerche riuscite")
        
        # Salva risultati completi in JSON
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump({
                "timestamp": self.timestamp.isoformat(),
                "foods_tested": TEST_FOODS,
                "results": self.results,
                "statistics": stats
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\nRisultati dettagliati salvati in: {self.results_file}")

async def main():
    tester = TestAlimentiItaliani()
    await tester.run_test()

if __name__ == "__main__":
    asyncio.run(main())
