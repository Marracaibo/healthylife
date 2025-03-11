import sys
import json
from datetime import datetime

# Prende il file JSON più recente nella directory test_results
def get_most_recent_results_file():
    import os
    import glob
    files = glob.glob("test_results/services_comparison_*.json")
    if not files:
        print("Nessun file di risultati trovato!")
        return None
    latest = max(files, key=os.path.getctime)
    return latest

def print_header(text):
    print(f"\n{text}")
    print("-" * len(text))

def print_service_stats(stats, test_foods):
    print(f"\nStatistiche per {len(test_foods)} cibi testati:")
    
    print(f"{'SERVIZIO':<12} | {'SUCCESSI':<16} | {'VUOTI':<8} | {'ERRORI':<8} | {'TEMPO TOTALE':<12} | {'TEMPO MEDIO':<10}")
    print("-" * 80)
    
    for service, data in stats.items():
        success_rate = data["success"] / len(test_foods) * 100
        avg_time = data["total_time"] / len(test_foods) if data["total_time"] > 0 else 0
        
        print(f"{service:<12} | {data['success']}/{len(test_foods)} ({success_rate:5.1f}%) | {data['no_results']:<8} | {data['error']:<8} | {data['total_time']:8.2f}s | {avg_time:6.2f}s")

def analyze_food_results(results, test_foods):
    print_header("DETTAGLI PER CIBO")
    
    for food in test_foods:
        print(f"\n{food.upper()}:")
        food_results = results.get(food, {})
        
        for service, result in food_results.items():
            status = result["status"]
            time = result.get("time", 0)
            count = result.get("count", 0) if status == "success" else 0
            
            status_symbol = "✓" if status == "success" else "✗"
            print(f"  {service:<12}: {status_symbol} {status:<8} - {count} risultati in {time:.2f}s")
            
            if status == "success" and count > 0:
                if service == "fatsecret" and "foods" in result and len(result["foods"]) > 0:
                    item = result["foods"][0]
                    print(f"    Primo risultato: {item.get('food_name', 'N/A')}")
                    print(f"    Descrizione: {item.get('food_description', 'N/A')[:80]}...")
                elif service == "usda" and "foods" in result and len(result["foods"]) > 0:
                    item = result["foods"][0]
                    print(f"    Primo risultato: {item.get('description', 'N/A')}")
                    if "brandOwner" in item:
                        print(f"    Marca: {item.get('brandOwner', 'Generic')}")

def determine_best_service(stats, test_foods):
    print_header("CONCLUSIONI")
    
    # Determina servizio più affidabile
    best_service = max(["fatsecret", "usda"], 
                     key=lambda s: stats[s]["success"] / len(test_foods))
    
    # Determina servizio più veloce 
    fastest_service = min(["fatsecret", "usda"],
                        key=lambda s: stats[s]["total_time"] / max(stats[s]["success"], 1))
    
    print(f"- Servizio più affidabile: {best_service.upper()} con {stats[best_service]['success']}/{len(test_foods)} ricerche riuscite")
    print(f"- Servizio più veloce: {fastest_service.upper()} con tempo medio di {stats[fastest_service]['total_time']/max(stats[fastest_service]['success'], 1):.2f}s per ricerca")
    
    print("\nSUGGERIMENTI PER IL SERVIZIO IBRIDO:")
    services_by_reliability = sorted(["fatsecret", "usda"], 
                                   key=lambda s: (stats[s]["success"] / len(test_foods), -stats[s]["total_time"]),
                                   reverse=True)
    
    print(f"- Ordine consigliato: {' -> '.join(services_by_reliability)}")

def main():
    # Ottieni il file di risultati più recente
    results_file = get_most_recent_results_file()
    if not results_file:
        return
    
    print(f"Analisi dei risultati dal file: {results_file}")
    
    # Carica i dati JSON
    with open(results_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    timestamp = datetime.fromisoformat(data["timestamp"])
    test_foods = data["foods_tested"]
    results = data["results"]
    stats = data["statistics"]
    
    # Intestazione
    print("\n" + "=" * 70)
    print(f"    CONFRONTO SERVIZI ALIMENTARI - {timestamp.strftime('%d/%m/%Y %H:%M')}")
    print("=" * 70)
    
    # Statistiche principali
    print_service_stats(stats, test_foods)
    
    # Dettagli per cibo
    analyze_food_results(results, test_foods)
    
    # Conclusioni
    determine_best_service(stats, test_foods)

if __name__ == "__main__":
    main()
