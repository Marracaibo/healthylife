import json
import os
import sys
from datetime import datetime

# Specifica il file di risultati da analizzare
RESULTS_FILE = 'test_results/alimenti_italiani_20250307_173221.json'

# Categorie di alimenti per l'analisi
CATEGORIES = {
    "formaggi": ["parmigiano reggiano", "mozzarella di bufala", "grana padano", "gorgonzola", "pecorino romano", "burrata"],
    "salumi": ["prosciutto crudo", "prosciutto cotto", "mortadella", "bresaola"],
    "prodotti_marca": ["nutella ferrero", "barilla spaghetti", "mulino bianco biscotti", "lavazza caffu00e8", "san benedetto acqua"],
    "primi_piatti": ["lasagne alla bolognese", "risotto ai funghi", "carbonara", "ravioli ricotta e spinaci"],
    "secondi_piatti": ["parmigiana di melanzane", "ossobuco alla milanese"],
    "altri_piatti": ["tiramisu00f9", "caprese", "pizza margherita", "cannoli siciliani"]
}

def load_results():
    """Carica i risultati dal file JSON"""
    try:
        with open(RESULTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Errore nel caricamento del file: {e}")
        sys.exit(1)

def print_header(text, char='='):
    """Stampa un'intestazione formattata"""
    print(f"\n{text}")
    print(char * len(text))

def analyze_by_category(results, categories):
    """Analizza i risultati per categoria"""
    category_stats = {}
    food_results = results.get('results', {})
    
    # Inizializza le statistiche per categoria
    for category_name in categories.keys():
        category_stats[category_name] = {
            "fatsecret": {"success": 0, "no_results": 0, "error": 0},
            "usda": {"success": 0, "no_results": 0, "error": 0}
        }
    
    # Calcola statistiche per categoria
    for category_name, foods in categories.items():
        for food in foods:
            if food in food_results:
                for service in ["fatsecret", "usda"]:
                    if service in food_results[food]:
                        status = food_results[food][service]["status"]
                        category_stats[category_name][service][status] += 1
    
    # Stampa i risultati per categoria
    print_header("ANALISI PER CATEGORIA DI ALIMENTI")
    
    for category, stats in category_stats.items():
        category_display = category.replace('_', ' ').title()
        total_foods = len(categories[category])
        
        print(f"\n{category_display} ({total_foods} alimenti)")
        print("-" * 40)
        
        for service, service_stats in stats.items():
            success_rate = service_stats["success"] / total_foods * 100
            print(f"  {service.upper()}: {service_stats['success']}/{total_foods} ({success_rate:.1f}%)")
    
    return category_stats

def analyze_best_matches(results):
    """Analizza i migliori risultati per ogni alimento"""
    food_results = results.get('results', {})
    foods_tested = results.get('foods_tested', [])
    
    print_header("MIGLIORI CORRISPONDENZE PER ALIMENTO")
    
    better_service_count = {"fatsecret": 0, "usda": 0, "equal": 0}
    
    for food in foods_tested:
        if food not in food_results:
            continue
            
        fs_results = food_results[food].get("fatsecret", {})
        usda_results = food_results[food].get("usda", {})
        
        # Ottieni conteggio risultati e stato
        fs_count = fs_results.get("count", 0) if fs_results.get("status") == "success" else 0
        usda_count = usda_results.get("count", 0) if usda_results.get("status") == "success" else 0
        
        # Determina il servizio migliore
        better_service = "equal"
        if fs_count > usda_count:
            better_service = "fatsecret"
        elif usda_count > fs_count:
            better_service = "usda"
        
        better_service_count[better_service] += 1
        
        # Stampa dettagli solo per alcuni alimenti interessanti
        if (better_service != "equal" and 
            (("prosciutto" in food) or ("mozzarella" in food) or 
             ("lasagne" in food) or ("pizza" in food) or
             ("risotto" in food))):
            
            print(f"\n{food.upper()}:")
            print(f"  FatSecret: {fs_count} risultati")
            if fs_count > 0 and "foods" in fs_results and len(fs_results["foods"]) > 0:
                first = fs_results["foods"][0]
                print(f"    Primo risultato: {first.get('food_name', 'N/A')} - {first.get('food_type', 'N/A')}")
                if "food_description" in first:
                    print(f"    {first.get('food_description', 'N/A')[:100]}...")
                
            print(f"  USDA: {usda_count} risultati")
            if usda_count > 0 and "foods" in usda_results and len(usda_results["foods"]) > 0:
                first = usda_results["foods"][0]
                print(f"    Primo risultato: {first.get('description', 'N/A')} - {first.get('brandOwner', 'Generic')}")
                if "ingredients" in first:
                    ingredients = first.get('ingredients', 'N/A')
                    print(f"    Ingredienti: {ingredients[:100]}...")
    
    print("\nRiepilogo corrispondenze migliori:")
    print(f"  FatSecret migliore: {better_service_count['fatsecret']} alimenti")
    print(f"  USDA migliore: {better_service_count['usda']} alimenti")
    print(f"  Equivalenti: {better_service_count['equal']} alimenti")

def analyze_overall_stats(results):
    """Analizza le statistiche complessive"""
    stats = results.get('statistics', {})
    foods_tested = results.get('foods_tested', [])
    total_foods = len(foods_tested)
    
    print_header("STATISTICHE COMPLESSIVE")
    
    print(f"{'SERVIZIO':<12} | {'SUCCESSI':<16} | {'VUOTI':<8} | {'ERRORI':<8} | {'TEMPO TOTALE':<12} | {'TEMPO MEDIO':<10}")
    print("-" * 80)
    
    for service, data in stats.items():
        success_rate = data["success"] / total_foods * 100 if total_foods > 0 else 0
        avg_time = data["total_time"] / total_foods if data["total_time"] > 0 else 0
        
        print(f"{service:<12} | {data['success']}/{total_foods} ({success_rate:5.1f}%) | {data['no_results']:<8} | {data['error']:<8} | {data['total_time']:8.2f}s | {avg_time:6.2f}s")
    
    # Determina il servizio migliore complessivamente
    best_service = max(["fatsecret", "usda"], 
                     key=lambda s: stats[s]["success"] / total_foods if total_foods > 0 else 0)
    
    fastest_service = min(["fatsecret", "usda"],
                        key=lambda s: stats[s]["total_time"] / max(stats[s]["success"], 1))
    
    print("\nCONCLUSIONI:")
    print(f"- Servizio piu00f9 affidabile per alimenti italiani: {best_service.upper()} ")
    print(f"  con {stats[best_service]['success']}/{total_foods} ({stats[best_service]['success']/total_foods*100:.1f}%) ricerche riuscite")
    print(f"- Servizio piu00f9 veloce: {fastest_service.upper()} ")
    print(f"  con tempo medio di {stats[fastest_service]['total_time']/max(stats[fastest_service]['success'], 1):.2f}s per ricerca")

def generate_report():
    """Genera un report completo dei risultati"""
    results = load_results()
    timestamp = datetime.fromisoformat(results.get('timestamp', datetime.now().isoformat()))
    
    print("\n" + "=" * 80)
    print(f"   ANALISI DETTAGLIATA TEST ALIMENTI ITALIANI - {timestamp.strftime('%d/%m/%Y %H:%M')}")
    print("=" * 80)
    
    # Analisi per categoria
    category_stats = analyze_by_category(results, CATEGORIES)
    
    # Analisi migliori corrispondenze
    analyze_best_matches(results)
    
    # Statistiche complessive
    analyze_overall_stats(results)
    
    # Salva il report in formato markdown
    report_file = f"test_results/report_alimenti_italiani_{timestamp.strftime('%Y%m%d_%H%M')}.md"
    
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(f"# Report Test Alimenti Italiani\n\n")
        f.write(f"Data test: {timestamp.strftime('%d/%m/%Y %H:%M')}\n\n")
        
        f.write("## Alimenti testati\n\n")
        for category, foods in CATEGORIES.items():
            category_display = category.replace('_', ' ').title()
            f.write(f"### {category_display}\n")
            for food in foods:
                f.write(f"- {food}\n")
            f.write("\n")
        
        f.write("## Statistiche per categoria\n\n")
        for category, stats in category_stats.items():
            category_display = category.replace('_', ' ').title()
            total_foods = len(CATEGORIES[category])
            
            f.write(f"### {category_display} ({total_foods} alimenti)\n")
            for service, service_stats in stats.items():
                success_rate = service_stats["success"] / total_foods * 100
                f.write(f"- **{service.upper()}**: {service_stats['success']}/{total_foods} ({success_rate:.1f}%)\n")
            f.write("\n")
        
        f.write("## Statistiche complessive\n\n")
        f.write("| Servizio | Successi | Vuoti | Errori | Tempo totale | Tempo medio |\n")
        f.write("|----------|----------|-------|--------|--------------|------------|\n")
        
        stats = results.get('statistics', {})
        total_foods = len(results.get('foods_tested', []))
        
        for service, data in stats.items():
            success_rate = data["success"] / total_foods * 100 if total_foods > 0 else 0
            avg_time = data["total_time"] / total_foods if data["total_time"] > 0 else 0
            
            f.write(f"| {service} | {data['success']}/{total_foods} ({success_rate:.1f}%) | {data['no_results']} | {data['error']} | {data['total_time']:.2f}s | {avg_time:.2f}s |\n")
        
        f.write("\n## Conclusioni\n\n")
        best_service = max(["fatsecret", "usda"], 
                         key=lambda s: stats[s]["success"] / total_foods if total_foods > 0 else 0)
        
        f.write(f"- Per alimenti e piatti italiani, il servizio più affidabile è: **{best_service.upper()}**\n")
        f.write(f"  con {stats[best_service]['success']}/{total_foods} ({stats[best_service]['success']/total_foods*100:.1f}%) ricerche riuscite\n")
    
    print(f"\nReport dettagliato salvato in: {report_file}")
    return report_file

if __name__ == "__main__":
    report_file = generate_report()
