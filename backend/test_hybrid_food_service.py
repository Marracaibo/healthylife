"""
Test per il servizio ibrido HybridFoodService.

Questo script testa il servizio ibrido che combina USDA FoodData Central 
ed Edamam per la ricerca di alimenti.
"""

import os
import sys
import json
import asyncio
import logging
import time
from datetime import datetime
from typing import Dict, List, Any

# Configura il logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Aggiungi la directory corrente al path per importare i moduli
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importa il servizio ibrido
from services.hybrid_food_service import HybridFoodService

# Lista di alimenti da testare (mix di alimenti comuni e italiani)
TEST_FOODS = [
    "apple",
    "banana",
    "chicken breast",
    "salmon",
    "olive oil",
    "pasta barilla",
    "parmigiano reggiano",
    "prosciutto di parma",
    "mozzarella di bufala",
    "tiramisu",
    "chicken cacciatore",
    "risotto",
    "lasagna",
    "pizza margherita",
    "gelato",
    # Alimenti più specifici che potrebbero non essere in USDA
    "pastiera napoletana",
    "cantucci toscani",
    "culurgiones",
    "seadas sarde",
    "casoncelli bergamaschi"
]

async def test_hybrid_service():
    """Testa il servizio ibrido con una lista di alimenti."""
    print("Testing Hybrid Food Service...")
    
    # Crea il servizio ibrido
    service = HybridFoodService()
    
    # Prepara le directory per i risultati
    os.makedirs("test_results/hybrid_food_service", exist_ok=True)
    
    # Inizializza i risultati
    results = []
    
    # Testa ogni alimento
    for food in TEST_FOODS:
        print(f"  Searching for '{food}'...")
        
        # Esegui la ricerca
        start_time = time.time()
        result = await service.search_food(food)
        end_time = time.time()
        
        # Calcola il tempo di risposta
        response_time = end_time - start_time
        
        # Determina la fonte
        source = result.get("source", "none")
        total_results = result.get("total_results", 0)
        
        # Stampa i risultati
        print(f"    Found {total_results} results from {source} in {response_time:.2f}s")
        
        # Aggiungi ai risultati
        result_entry = {
            "food": food,
            "success": total_results > 0,
            "source": source,
            "results": total_results,
            "response_time": response_time,
            "details": result
        }
        results.append(result_entry)
    
    # Salva i risultati dettagliati
    with open("test_results/hybrid_food_service/detailed_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Crea un riepilogo
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_foods": len(TEST_FOODS),
        "success_count": sum(1 for r in results if r["success"]),
        "average_response_time": sum(r["response_time"] for r in results) / len(results),
        "source_distribution": {
            "usda": sum(1 for r in results if r["source"] == "usda"),
            "edamam": sum(1 for r in results if r["source"] == "edamam"),
            "none": sum(1 for r in results if r["source"] == "none"),
            "error": sum(1 for r in results if r["source"] == "error")
        }
    }
    
    # Calcola la percentuale di successo
    summary["success_rate"] = (summary["success_count"] / summary["total_foods"]) * 100
    
    # Salva il riepilogo
    with open("test_results/hybrid_food_service/summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    # Genera un report in markdown
    generate_markdown_report(results, summary)
    
    print("\nDetailed results saved to test_results/hybrid_food_service/detailed_results.json")
    print("Summary saved to test_results/hybrid_food_service/summary.json")
    print("Report saved to test_results/hybrid_food_service/report.md")

def generate_markdown_report(results: List[Dict[str, Any]], summary: Dict[str, Any]):
    """Genera un report in markdown dai risultati del test."""
    with open("test_results/hybrid_food_service/report.md", "w", encoding="utf-8") as f:
        f.write("# Hybrid Food Service Test Results\n\n")
        
        # Riepilogo
        f.write("## Summary\n\n")
        f.write(f"- **Total Foods Tested**: {summary['total_foods']}\n")
        f.write(f"- **Success Rate**: {summary['success_rate']:.1f}%\n")
        f.write(f"- **Average Response Time**: {summary['average_response_time']:.2f}s\n\n")
        
        # Distribuzione delle fonti
        f.write("## Source Distribution\n\n")
        f.write("| Source | Count | Percentage |\n")
        f.write("|--------|-------|------------|\n")
        for source, count in summary["source_distribution"].items():
            percentage = (count / summary["total_foods"]) * 100
            f.write(f"| {source.capitalize()} | {count} | {percentage:.1f}% |\n")
        f.write("\n")
        
        # Alimenti trovati per fonte
        f.write("## Foods Found by Source\n\n")
        
        # Raggruppa per fonte
        foods_by_source = {}
        for result in results:
            source = result["source"]
            if source not in foods_by_source:
                foods_by_source[source] = []
            foods_by_source[source].append(result["food"])
        
        # Stampa gli alimenti per ogni fonte
        for source, foods in foods_by_source.items():
            f.write(f"### {source.capitalize()}\n\n")
            for food in foods:
                f.write(f"- {food}\n")
            f.write("\n")
        
        # Risultati dettagliati per alimento
        f.write("## Detailed Results by Food\n\n")
        for result in results:
            food = result["food"]
            f.write(f"### {food.capitalize()}\n\n")
            f.write(f"- **Success**: {'Yes' if result['success'] else 'No'}\n")
            f.write(f"- **Source**: {result['source']}\n")
            f.write(f"- **Results**: {result['results']}\n")
            f.write(f"- **Response Time**: {result['response_time']:.2f}s\n\n")

async def test_combined_search():
    """Testa la ricerca combinata del servizio ibrido."""
    print("\nTesting Combined Search...")
    
    # Crea il servizio ibrido
    service = HybridFoodService()
    
    # Seleziona alcuni alimenti per il test
    test_foods = ["apple", "pasta", "pizza", "tiramisu", "culurgiones"]
    
    # Testa ogni alimento
    for food in test_foods:
        print(f"  Combined search for '{food}'...")
        
        # Esegui la ricerca combinata
        start_time = time.time()
        result = await service.search_food_from_all_sources(food)
        end_time = time.time()
        
        # Calcola il tempo di risposta
        response_time = end_time - start_time
        
        # Ottieni i conteggi
        total_results = result.get("total_results", 0)
        usda_results = result.get("usda_results", 0)
        edamam_results = result.get("edamam_results", 0)
        
        # Stampa i risultati
        print(f"    Found {total_results} total results ({usda_results} from USDA, {edamam_results} from Edamam) in {response_time:.2f}s")
    
    print("\nCombined search test completed.")

async def main():
    """Funzione principale che esegue tutti i test."""
    await test_hybrid_service()
    await test_combined_search()

if __name__ == "__main__":
    asyncio.run(main())
