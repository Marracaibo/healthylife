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

# Configura console per output semplice
print_separator = lambda: print("\n" + "=" * 80 + "\n")

# Cibi da testare
TEST_FOODS = [
    "pizza",
    "pasta",
    "apple",
    "chicken",
    "salmon",
    "chocolate"
]

class ServiceTester:
    def __init__(self):
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = os.getenv("USDA_API_KEY", "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm")
        self.max_results = 3
        self.results = {}
    
    async def test_fatsecret(self, food):
        """Testa FatSecret con OAuth 1.0 (metodo funzionante)."""
        print(f"FatSecret - Ricerca '{food}'...")
        try:
            start_time = time.time()
            results = fatsecret_search(food, max_results=self.max_results)
            elapsed = time.time() - start_time
            
            if results and len(results) > 0:
                print(f"  ✓ Trovati {len(results)} risultati in {elapsed:.2f}s")
                food_names = [item.get('food_name', 'N/A') for item in results[:3]]
                print(f"  Primi risultati: {', '.join(food_names)}")
                
                # Dettagli primo risultato
                if len(results) > 0:
                    first = results[0]
                    print(f"  Dettagli primo risultato:")
                    print(f"    - Nome: {first.get('food_name', 'N/A')}")
                    print(f"    - Descrizione: {first.get('food_description', 'N/A')[:100]}...")
                
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
        """Testa USDA."""
        print(f"USDA - Ricerca '{food}'...")
        try:
            start_time = time.time()
            results = await self.usda_service.search_food(food, page_size=self.max_results)
            elapsed = time.time() - start_time
            
            foods = results.get("foods", [])
            if foods and len(foods) > 0:
                print(f"  ✓ Trovati {len(foods)} risultati in {elapsed:.2f}s")
                food_names = [item.get('description', 'N/A') for item in foods[:3]]
                print(f"  Primi risultati: {', '.join(food_names)}")
                
                # Dettagli primo risultato
                if len(foods) > 0:
                    first = foods[0]
                    print(f"  Dettagli primo risultato:")
                    print(f"    - Nome: {first.get('description', 'N/A')}")
                    print(f"    - Marca: {first.get('brandName', 'Generic')}")
                    print(f"    - ID: {first.get('fdcId', 'N/A')}")
                
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
    
    async def run_comparison(self):
        """Esegue il confronto tra i servizi."""
        print("\n====================================================")
        print("   CONFRONTO SERVIZI FATSECRET E USDA")
        print("   Test eseguito il", datetime.now().strftime("%d/%m/%Y %H:%M"))
        print("====================================================\n")
        
        # Statistiche
        stats = {
            "fatsecret": {"success": 0, "no_results": 0, "error": 0, "total_time": 0},
            "usda": {"success": 0, "no_results": 0, "error": 0, "total_time": 0}
        }
        
        # Test ogni cibo
        for food in TEST_FOODS:
            print(f"\nTESTANDO: '{food.upper()}'")
            print("-" * 20)
            
            # Esegui i test
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
            
            print_separator()
        
        # Stampa statistiche
        print("\nSTATISTICHE RIEPILOGATIVE")
        print("=" * 30)
        
        # Utilizzo di una tabella più semplice per evitare problemi di formattazione
        print(f"{'Servizio':<15} | {'Successi':<15} | {'Vuoti':<8} | {'Errori':<8} | {'Tempo totale':<15} | {'Tempo medio':<12}")
        print("-" * 80)
        
        for service, data in stats.items():
            success_rate = data["success"] / len(TEST_FOODS) * 100
            avg_time = data["total_time"] / len(TEST_FOODS) if data["total_time"] > 0 else 0
            
            print(f"{service:<15} | {data['success']} ({success_rate:.1f}%){'':>5} | {data['no_results']:<8} | {data['error']:<8} | {data['total_time']:.2f}s{'':<10} | {avg_time:.2f}s")
        
        # Determina il servizio migliore
        best_service = max(["fatsecret", "usda"], 
                         key=lambda s: stats[s]["success"] / len(TEST_FOODS))
        
        fastest_service = min(["fatsecret", "usda"],
                            key=lambda s: stats[s]["total_time"] / max(stats[s]["success"], 1))
        
        print("\nCONCLUSIONI:")
        print(f"- Servizio più affidabile: {best_service.upper()} con {stats[best_service]['success']}/{len(TEST_FOODS)} ricerche riuscite")
        print(f"- Servizio più veloce: {fastest_service.upper()} con tempo medio di {stats[fastest_service]['total_time']/max(stats[fastest_service]['success'], 1):.2f}s per ricerca")
        
        # Suggerimenti per il servizio ibrido
        print("\nSUGGERIMENTI PER IL SERVIZIO IBRIDO:")
        services_by_reliability = sorted(["fatsecret", "usda"], 
                                       key=lambda s: stats[s]["success"],
                                       reverse=True)
        
        print(f"- Ordine consigliato: {' -> '.join(services_by_reliability)}")
        
        # Salva risultati in JSON
        os.makedirs("test_results", exist_ok=True)
        result_file = f"test_results/services_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(result_file, "w", encoding="utf-8") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "foods_tested": TEST_FOODS,
                "results": self.results,
                "statistics": stats
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\nRisultati salvati in: {result_file}")

async def main():
    tester = ServiceTester()
    await tester.run_comparison()

if __name__ == "__main__":
    asyncio.run(main())
