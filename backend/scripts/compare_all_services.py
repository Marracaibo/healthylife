import os
import sys
import time
import asyncio
import json
from datetime import datetime
from tabulate import tabulate
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel
from collections import defaultdict

# Aggiungi la directory principale al path per poter importare i moduli
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa i servizi
from services.fatsecret_service import search_foods as fatsecret_search
from services.usda_food_service import USDAFoodService

# Configura console per output colorato
console = Console()

# Esempi di cibi da testare (aumentati per un test più completo)
TEST_FOODS = [
    "pizza",
    "pasta",
    "apple",
    "chicken",
    "salmon",
    "rice",
    "banana",
    "eggs",
    "beef",
    "chocolate"
]

class ServiceComparer:
    """Classe per confrontare i servizi di ricerca cibo."""
    
    def __init__(self):
        # Inizializza i servizi
        self.usda_service = USDAFoodService()
        self.usda_service.api_key = os.getenv("USDA_API_KEY", "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm")
        
        # Configurazioni
        self.max_results = 3
        self.results = {}
        
        # Crea directory per i risultati
        os.makedirs("test_results", exist_ok=True)
        
    async def test_fatsecret(self, food):
        """Testa il servizio FatSecret."""
        try:
            start_time = time.time()
            results = fatsecret_search(food, max_results=self.max_results)
            elapsed = time.time() - start_time
            
            formatted_results = []
            for item in results[:self.max_results] if results else []:
                formatted_results.append({
                    "food_name": item.get("food_name", "N/A"),
                    "description": item.get("food_description", "N/A"),
                    "source": "fatsecret"
                })
            
            return {
                "results": formatted_results,
                "count": len(formatted_results),
                "elapsed": elapsed,
                "status": "success" if formatted_results else "no_results"
            }
        except Exception as e:
            return {
                "results": [],
                "count": 0,
                "elapsed": 0,
                "status": "error",
                "error": str(e)
            }
    
    async def test_usda(self, food):
        """Testa il servizio USDA."""
        try:
            start_time = time.time()
            response = await self.usda_service.search_food(food, page_size=self.max_results)
            elapsed = time.time() - start_time
            
            formatted_results = []
            for item in response.get("foods", [])[:self.max_results]:
                formatted_results.append({
                    "food_name": item.get("description", "N/A"),
                    "description": item.get("ingredients", "N/A") or f"Brand: {item.get('brandName', 'Generic')}",
                    "source": "usda"
                })
            
            return {
                "results": formatted_results,
                "count": len(formatted_results),
                "elapsed": elapsed,
                "status": "success" if formatted_results else "no_results"
            }
        except Exception as e:
            return {
                "results": [],
                "count": 0,
                "elapsed": 0,
                "status": "error",
                "error": str(e)
            }
    
    async def test_all_foods(self):
        """Testa tutti i cibi su tutti i servizi."""
        console.print(Panel.fit("\n[bold yellow]TEST COMPARATIVO SERVIZI DI RICERCA CIBO[/bold yellow]\n", 
                               title="HealthyLifeApp", subtitle=f"Test eseguito il {datetime.now().strftime('%d/%m/%Y %H:%M')}"))
        
        # Statistiche globali
        stats = {
            "fatsecret": {"success": 0, "no_results": 0, "error": 0, "total_time": 0},
            "usda": {"success": 0, "no_results": 0, "error": 0, "total_time": 0}
        }
        
        # Test ogni cibo
        for food in TEST_FOODS:
            console.print(f"\n[bold green]Testando: '{food}'[/bold green]")
            
            with Progress(
                SpinnerColumn(),
                TextColumn("[bold blue]{task.description}"),
                transient=True
            ) as progress:
                # Crea task per ogni servizio
                progress.add_task("Esecuzione test sui servizi...", total=None)
                
                # Testa tutti i servizi in parallelo
                tasks = [
                    self.test_fatsecret(food),
                    self.test_usda(food)
                ]
                results = await asyncio.gather(*tasks)
                
                # Salva e aggiorna statistiche
                self.results[food] = {
                    "fatsecret": results[0],
                    "usda": results[1]
                }
                
                # Aggiorna stats per ogni servizio
                for i, service_name in enumerate(["fatsecret", "usda"]):
                    service_result = results[i]
                    stats[service_name][service_result["status"]] += 1
                    stats[service_name]["total_time"] += service_result["elapsed"]
            
            # Mostra risultati per questo cibo
            table = Table(title=f"Risultati per '{food}'")
            table.add_column("Servizio", style="cyan")
            table.add_column("Status", style="yellow")
            table.add_column("Tempo", style="green")
            table.add_column("Risultati", style="magenta")
            table.add_column("Primo risultato", style="blue")
            
            for service_name in ["fatsecret", "usda"]:
                result = self.results[food][service_name]
                status = result["status"]
                time_str = f"{result['elapsed']:.2f}s" if result["elapsed"] > 0 else "N/A"
                count = result["count"]
                
                # Formatta il primo risultato
                first_result = "N/A"
                if result["results"] and len(result["results"]) > 0:
                    item = result["results"][0]
                    first_result = f"{item['food_name']} - {item['description'][:40]}..."
                
                # Aggiungi riga alla tabella
                status_emoji = "" if status == "success" else "" if status == "no_results" else ""
                table.add_row(
                    service_name, 
                    f"{status_emoji} {status}", 
                    time_str, 
                    str(count), 
                    first_result
                )
            
            console.print(table)
        
        # Mostra statistiche generali
        console.print("\n[bold]STATISTICHE GENERALI[/bold]")
        stats_table = Table(title="Comparazione servizi")
        stats_table.add_column("Servizio", style="cyan")
        stats_table.add_column("Successi", style="green")
        stats_table.add_column("Vuoti", style="yellow")
        stats_table.add_column("Errori", style="red")
        stats_table.add_column("Tempo totale", style="blue")
        stats_table.add_column("Tempo medio", style="blue")
        
        for service_name, service_stats in stats.items():
            avg_time = service_stats["total_time"] / len(TEST_FOODS)
            stats_table.add_row(
                service_name,
                str(service_stats["success"]),
                str(service_stats["no_results"]),
                str(service_stats["error"]),
                f"{service_stats['total_time']:.2f}s",
                f"{avg_time:.2f}s"
            )
        
        console.print(stats_table)
        
        # Salva i risultati in formato JSON
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        result_file = f"test_results/service_comparison_{timestamp}.json"
        
        with open(result_file, "w", encoding="utf-8") as f:
            json.dump({
                "test_date": datetime.now().isoformat(),
                "foods_tested": TEST_FOODS,
                "results": self.results,
                "statistics": stats
            }, f, indent=2, ensure_ascii=False)
        
        console.print(f"\n[bold green]Test completato! Risultati salvati in:[/bold green] {result_file}")
        
        # Analisi comparativa
        self._analyze_results()
    
    def _analyze_results(self):
        """Analizza i risultati e fornisce informazioni comparative."""
        console.print("\n[bold]ANALISI COMPARATIVA[/bold]")
        
        # Contatori per l'analisi
        service_won_count = defaultdict(int)
        service_fastest = defaultdict(int)
        overlap_count = 0
        total_tests = len(TEST_FOODS)
        
        # Analisi per ogni cibo testato
        for food in TEST_FOODS:
            food_results = self.results[food]
            
            # Trova il servizio con più risultati
            max_results = 0
            winner = None
            
            for service, result in food_results.items():
                if result["status"] == "success" and result["count"] > max_results:
                    max_results = result["count"]
                    winner = service
            
            if winner:
                service_won_count[winner] += 1
            
            # Trova il servizio più veloce
            min_time = float('inf')
            fastest = None
            
            for service, result in food_results.items():
                if result["status"] == "success" and result["elapsed"] > 0 and result["elapsed"] < min_time:
                    min_time = result["elapsed"]
                    fastest = service
            
            if fastest:
                service_fastest[fastest] += 1
            
            # Verifica sovrapposizione nei risultati
            success_services = [s for s, r in food_results.items() if r["status"] == "success"]
            if len(success_services) > 1:
                overlap_count += 1
        
        # Mostra i risultati dell'analisi
        analysis_table = Table(title="Analisi delle performance")
        analysis_table.add_column("Metrica", style="cyan")
        for service in ["fatsecret", "usda"]:
            analysis_table.add_column(service, style="green")
        
        # Aggiungi righe per ogni metrica
        analysis_table.add_row(
            "Miglior servizio (più risultati)",
            f"{service_won_count['fatsecret']} ({service_won_count['fatsecret']/total_tests*100:.1f}%)",
            f"{service_won_count['usda']} ({service_won_count['usda']/total_tests*100:.1f}%)"
        )
        
        analysis_table.add_row(
            "Servizio più veloce",
            f"{service_fastest['fatsecret']} ({service_fastest['fatsecret']/total_tests*100:.1f}%)",
            f"{service_fastest['usda']} ({service_fastest['usda']/total_tests*100:.1f}%)"
        )
        
        console.print(analysis_table)
        
        # Stampa consigli finali
        console.print(f"\n[bold]Sovrapposizione:[/bold] {overlap_count} cibi ({overlap_count/total_tests*100:.1f}%) "  
                     f"hanno dato risultati in più di un servizio.")
        
        # Identifica il servizio più affidabile
        most_reliable = max(["fatsecret", "usda"], 
                          key=lambda s: self.results_stats()[s]["success_rate"])
        
        console.print(f"\n[bold green]CONCLUSIONI:[/bold green]")
        console.print(f"In base ai test eseguiti, il servizio più affidabile è: [bold]{most_reliable}[/bold]")
        
        # Suggerimenti per il servizio ibrido
        console.print("\n[bold]Suggerimenti per il servizio ibrido:[/bold]")
        
        # Determina l'ordine consigliato
        services_by_reliability = sorted(["fatsecret", "usda"], 
                                      key=lambda s: self.results_stats()[s]["success_rate"],
                                      reverse=True)
        
        console.print(f"Ordine consigliato per la cascata di servizi: [bold]{' -> '.join(services_by_reliability)}[/bold]")
    
    def results_stats(self):
        """Calcola statistiche dai risultati."""
        stats = {}
        
        for service in ["fatsecret", "usda"]:
            success = sum(1 for food in TEST_FOODS if self.results[food][service]["status"] == "success")
            total = len(TEST_FOODS)
            
            stats[service] = {
                "success": success,
                "total": total,
                "success_rate": success / total
            }
        
        return stats

async def main():
    comparer = ServiceComparer()
    await comparer.test_all_foods()

if __name__ == "__main__":
    # Installa dipendenze mancanti (senza errori se già installate)
    try:
        import rich
    except ImportError:
        print("Installiamo la libreria 'rich' per una visualizzazione migliore...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "rich"])
        print("Libreria 'rich' installata con successo!\n")
        from rich.console import Console
        from rich.table import Table
        from rich.progress import Progress, SpinnerColumn, TextColumn
        from rich.panel import Panel
    
    # Esegui il test
    asyncio.run(main())
