"""
Test script per il servizio ibrido USDA-Edamam

Questo script testa l'efficacia di un approccio ibrido che utilizza
USDA FoodData Central come fonte primaria ed Edamam come backup.
"""

import asyncio
import json
import os
import time
import logging
from typing import Dict, List, Any

from services.usda_food_service import USDAFoodService
from edamam_only_service import EdamamOnlyService

# Configurazione del logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# API Keys
USDA_API_KEY = "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm"

# Create output directory if it doesn't exist
os.makedirs("test_results/hybrid_service", exist_ok=True)

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

class USDAEdamamHybridService:
    """
    Servizio ibrido che utilizza USDA FoodData Central come fonte primaria
    ed Edamam come backup.
    """
    
    def __init__(self, usda_api_key: str):
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = usda_api_key
        self.edamam_service = EdamamOnlyService()
        self.cache = {}
        logger.info("Inizializzato USDAEdamamHybridService")
        
    async def search_food(self, query: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Cerca alimenti utilizzando USDA come fonte primaria e Edamam come backup.
        
        Args:
            query: La query di ricerca
            use_cache: Se utilizzare la cache per query ripetute
            
        Returns:
            Un dizionario contenente i risultati della ricerca
        """
        logger.info(f"HybridService: Ricerca di '{query}'")
        
        # Controlla la cache
        cache_key = query.lower()
        if use_cache and cache_key in self.cache:
            logger.info(f"HybridService: Risultati trovati in cache per '{query}'")
            return self.cache[cache_key]
        
        try:
            # Prima prova con USDA
            usda_results = await self.usda_service.search_food(query)
            
            # Se USDA ha trovato risultati
            if usda_results and "foods" in usda_results and usda_results["foods"]:
                logger.info(f"HybridService: Trovati {len(usda_results['foods'])} risultati da USDA")
                
                # Formatta i risultati in un formato standard
                results = {
                    "query": query,
                    "source": "usda",
                    "total_results": len(usda_results["foods"]),
                    "results": []
                }
                
                for food in usda_results["foods"]:
                    result = {
                        "id": food.get("fdcId", ""),
                        "name": food.get("description", ""),
                        "description": food.get("ingredients", ""),
                        "brand": food.get("brandName", ""),
                        "calories": self._extract_calories(food),
                        "source": "usda"
                    }
                    results["results"].append(result)
                
                # Salva nella cache
                if use_cache:
                    self.cache[cache_key] = results
                
                return results
            
            # Se USDA non ha trovato risultati, prova con Edamam
            logger.info(f"HybridService: Nessun risultato da USDA, provo con Edamam")
            edamam_results = await self.edamam_service.search_food(query)
            
            if edamam_results and "results" in edamam_results and edamam_results["results"]:
                logger.info(f"HybridService: Trovati {len(edamam_results['results'])} risultati da Edamam")
                
                # Formatta i risultati
                results = {
                    "query": query,
                    "source": "edamam",
                    "total_results": len(edamam_results["results"]),
                    "results": edamam_results["results"]
                }
                
                # Salva nella cache
                if use_cache:
                    self.cache[cache_key] = results
                
                return results
            
            # Se nessun servizio ha trovato risultati
            logger.info(f"HybridService: Nessun risultato trovato per '{query}'")
            return {
                "query": query,
                "source": "none",
                "total_results": 0,
                "results": []
            }
            
        except Exception as e:
            logger.error(f"Errore durante la ricerca HybridService: {str(e)}")
            return {
                "query": query,
                "source": "error",
                "total_results": 0,
                "results": []
            }
    
    def _extract_calories(self, food: Dict[str, Any]) -> float:
        """Estrae le calorie da un alimento USDA"""
        try:
            nutrients = food.get("foodNutrients", [])
            for nutrient in nutrients:
                if nutrient.get("nutrientName") == "Energy" and nutrient.get("unitName") == "KCAL":
                    return nutrient.get("value", 0)
            return 0
        except Exception:
            return 0

async def test_hybrid_service():
    """Testa il servizio ibrido USDA-Edamam"""
    print("Testing USDA-Edamam Hybrid Service...")
    
    # Inizializza il servizio ibrido
    hybrid_service = USDAEdamamHybridService(USDA_API_KEY)
    
    results = {}
    
    for food in TEST_FOODS:
        print(f"  Searching for '{food}'...")
        start_time = time.time()
        
        try:
            search_results = await hybrid_service.search_food(food)
            response_time = time.time() - start_time
            
            result_count = len(search_results.get("results", []))
            source = search_results.get("source", "unknown")
            
            print(f"    Found {result_count} results from {source} in {response_time:.2f}s")
            
            results[food] = {
                "success": result_count > 0,
                "result_count": result_count,
                "source": source,
                "response_time": response_time,
                "first_result": search_results.get("results", [])[0] if result_count > 0 else None
            }
        except Exception as e:
            print(f"    Error: {str(e)}")
            results[food] = {
                "success": False,
                "error": str(e),
                "response_time": time.time() - start_time
            }
    
    # Salva i risultati dettagliati
    with open("test_results/hybrid_service/detailed_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\nDetailed results saved to test_results/hybrid_service/detailed_results.json")
    
    # Genera il riepilogo
    generate_summary(results)

def generate_summary(results: Dict[str, Any]):
    """Genera un riepilogo dei risultati del test"""
    summary = {
        "total_foods": len(TEST_FOODS),
        "success_rate": 0,
        "average_response_time": 0,
        "source_distribution": {
            "usda": 0,
            "edamam": 0,
            "none": 0,
            "error": 0
        },
        "foods_by_source": {
            "usda": [],
            "edamam": [],
            "none": [],
            "error": []
        }
    }
    
    success_count = 0
    total_time = 0
    
    for food, result in results.items():
        if result.get("success", False):
            success_count += 1
            total_time += result["response_time"]
            
            source = result.get("source", "unknown")
            summary["source_distribution"][source] = summary["source_distribution"].get(source, 0) + 1
            summary["foods_by_source"][source].append(food)
        else:
            source = "error" if "error" in result else "none"
            summary["source_distribution"][source] = summary["source_distribution"].get(source, 0) + 1
            summary["foods_by_source"][source].append(food)
    
    # Calcola le medie
    summary["success_rate"] = (success_count / len(TEST_FOODS)) * 100
    summary["average_response_time"] = total_time / max(success_count, 1)
    
    # Salva il riepilogo
    with open("test_results/hybrid_service/summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    # Genera il report markdown
    generate_markdown_report(results, summary)
    
    print("Summary saved to test_results/hybrid_service/summary.json")
    print("Report saved to test_results/hybrid_service/report.md")

def generate_markdown_report(results: Dict[str, Any], summary: Dict[str, Any]):
    """Genera un report markdown dai risultati del test"""
    report = "# USDA-Edamam Hybrid Service Test Results\n\n"
    
    # Aggiungi la sezione di riepilogo
    report += "## Summary\n\n"
    report += f"- **Total Foods Tested**: {summary['total_foods']}\n"
    report += f"- **Success Rate**: {summary['success_rate']:.1f}%\n"
    report += f"- **Average Response Time**: {summary['average_response_time']:.2f}s\n\n"
    
    # Aggiungi la distribuzione delle fonti
    report += "## Source Distribution\n\n"
    report += "| Source | Count | Percentage |\n"
    report += "|--------|-------|------------|\n"
    
    for source, count in summary["source_distribution"].items():
        percentage = (count / summary["total_foods"]) * 100
        report += f"| {source.capitalize()} | {count} | {percentage:.1f}% |\n"
    
    # Aggiungi gli alimenti trovati per fonte
    report += "\n## Foods Found by Source\n\n"
    
    for source, foods in summary["foods_by_source"].items():
        if foods:
            report += f"### {source.capitalize()}\n\n"
            report += "- " + "\n- ".join(foods) + "\n\n"
    
    # Aggiungi i risultati dettagliati per ogni alimento
    report += "## Detailed Results by Food\n\n"
    
    for food, result in results.items():
        report += f"### {food.capitalize()}\n\n"
        
        success = "Yes" if result.get("success", False) else "No"
        source = result.get("source", "N/A")
        count = result.get("result_count", 0)
        time = f"{result.get('response_time', 0):.2f}s"
        
        report += f"- **Success**: {success}\n"
        report += f"- **Source**: {source}\n"
        report += f"- **Results**: {count}\n"
        report += f"- **Response Time**: {time}\n"
        
        if "error" in result:
            report += f"- **Error**: {result['error']}\n"
        
        report += "\n"
    
    # Salva il report
    with open("test_results/hybrid_service/report.md", "w", encoding="utf-8") as f:
        f.write(report)

async def main():
    """Esegue il test del servizio ibrido"""
    await test_hybrid_service()

if __name__ == "__main__":
    asyncio.run(main())
