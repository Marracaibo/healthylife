import requests
import json
import time
from tabulate import tabulate
import os

# Configurazione
BASE_URL = "http://localhost:8000"
COMPARE_ENDPOINT = f"{BASE_URL}/api/food-test/compare"

# Definisci un timeout per le richieste
REQUEST_TIMEOUT = 10  # secondi

# Lista di cibi da testare
FOOD_QUERIES = [
    # Cibi italiani
    "pasta",
    "pizza margherita",
    "risotto",
    "lasagna",
    "tiramisu",
    "prosciutto crudo",
    "parmigiano reggiano",
    "mozzarella di bufala",
    "gelato",
    "polenta",
    
    # Cibi internazionali
    "sushi",
    "hamburger",
    "curry",
    "taco",
    "croissant",
    "paella",
    "dim sum",
    "kimchi",
    "hummus",
    "baklava",
    
    # Ingredienti base
    "apple",
    "chicken breast",
    "rice",
    "beans",
    "salmon",
]

# Esegui i test e salva i risultati
def run_comparison_tests():
    print("\n🔍 Iniziando i test di confronto tra FatSecret e il servizio ibrido...\n")
    
    results = []
    
    # Crea la directory per i risultati se non esiste
    os.makedirs("test_results", exist_ok=True)
    
    for query in FOOD_QUERIES:
        print(f"Testando la ricerca per: '{query}'...")
        try:
            # Invia la richiesta al nostro endpoint di confronto
            response = requests.get(f"{COMPARE_ENDPOINT}?query={query}&max_results=10", timeout=REQUEST_TIMEOUT)
            
            if response.status_code != 200:
                print(f"⚠️ Errore nella richiesta per '{query}': {response.status_code}")
                continue
            
            # Analizza i risultati
            comparison = response.json()
            
            # Salva i risultati completi in un file JSON
            with open(f"test_results/{query.replace(' ', '_')}_results.json", 'w') as f:
                json.dump(comparison, f, indent=2)
            
            # Estrai le metriche di confronto
            hybrid_count = comparison["result_counts"]["hybrid"]
            fatsecret_count = comparison["result_counts"]["fatsecret"]
            
            # Estrai le statistiche sulla qualità dei dati
            hybrid_quality = comparison["data_quality"]["hybrid"]
            fatsecret_quality = comparison["data_quality"]["fatsecret"]
            
            # Confronto di completezza
            hybrid_completeness = hybrid_quality.get("completeness", 0)
            fatsecret_completeness = fatsecret_quality.get("completeness", 0)
            winner_completeness = "Hybrid" if hybrid_completeness > fatsecret_completeness else "FatSecret" if fatsecret_completeness > hybrid_completeness else "Pareggio"
            
            # Confronto di nutrienti
            hybrid_nutrients = hybrid_quality.get("has_nutrients", 0)
            fatsecret_nutrients = fatsecret_quality.get("has_nutrients", 0)
            winner_nutrients = "Hybrid" if hybrid_nutrients > fatsecret_nutrients else "FatSecret" if fatsecret_nutrients > hybrid_nutrients else "Pareggio"
            
            # Confronto di informazioni sulle porzioni
            hybrid_serving = hybrid_quality.get("has_serving_info", 0)
            fatsecret_serving = fatsecret_quality.get("has_serving_info", 0)
            winner_serving = "Hybrid" if hybrid_serving > fatsecret_serving else "FatSecret" if fatsecret_serving > hybrid_serving else "Pareggio"
            
            # Confronto di disponibilità immagini
            hybrid_images = hybrid_quality.get("has_images", 0)
            fatsecret_images = fatsecret_quality.get("has_images", 0)
            winner_images = "Hybrid" if hybrid_images > fatsecret_images else "FatSecret" if fatsecret_images > hybrid_images else "Pareggio"
            
            # Calcola un punteggio complessivo (media semplice di tutti i parametri)
            hybrid_overall = (hybrid_completeness + hybrid_nutrients + hybrid_serving + hybrid_images) / 4
            fatsecret_overall = (fatsecret_completeness + fatsecret_nutrients + fatsecret_serving + fatsecret_images) / 4
            winner_overall = "Hybrid" if hybrid_overall > fatsecret_overall else "FatSecret" if fatsecret_overall > hybrid_overall else "Pareggio"
            
            # Aggiungi i risultati alla lista
            results.append({
                "query": query,
                "hybrid_count": hybrid_count,
                "fatsecret_count": fatsecret_count,
                "hybrid_completeness": hybrid_completeness,
                "fatsecret_completeness": fatsecret_completeness,
                "winner_completeness": winner_completeness,
                "hybrid_nutrients": hybrid_nutrients,
                "fatsecret_nutrients": fatsecret_nutrients,
                "winner_nutrients": winner_nutrients,
                "hybrid_serving": hybrid_serving,
                "fatsecret_serving": fatsecret_serving,
                "winner_serving": winner_serving,
                "hybrid_images": hybrid_images,
                "fatsecret_images": fatsecret_images,
                "winner_images": winner_images,
                "hybrid_overall": hybrid_overall,
                "fatsecret_overall": fatsecret_overall,
                "winner_overall": winner_overall
            })
            
            # Breve attesa per non sovraccaricare il server
            time.sleep(0.5)
            
        except Exception as e:
            print(f"⚠️ Errore durante il test per '{query}': {str(e)}")
    
    return results

# Genera il report dei risultati
def generate_report(results):
    # Conta il numero totale di vittorie per servizio
    hybrid_wins = sum(1 for r in results if r["winner_overall"] == "Hybrid")
    fatsecret_wins = sum(1 for r in results if r["winner_overall"] == "FatSecret")
    ties = sum(1 for r in results if r["winner_overall"] == "Pareggio")
    
    hybrid_wins_completeness = sum(1 for r in results if r["winner_completeness"] == "Hybrid")
    fatsecret_wins_completeness = sum(1 for r in results if r["winner_completeness"] == "FatSecret")
    hybrid_wins_nutrients = sum(1 for r in results if r["winner_nutrients"] == "Hybrid")
    fatsecret_wins_nutrients = sum(1 for r in results if r["winner_nutrients"] == "FatSecret")
    hybrid_wins_serving = sum(1 for r in results if r["winner_serving"] == "Hybrid")
    fatsecret_wins_serving = sum(1 for r in results if r["winner_serving"] == "FatSecret")
    hybrid_wins_images = sum(1 for r in results if r["winner_images"] == "Hybrid")
    fatsecret_wins_images = sum(1 for r in results if r["winner_images"] == "FatSecret")
    
    # Calcola i punteggi medi per ogni metrica
    avg_hybrid_completeness = sum(r["hybrid_completeness"] for r in results) / len(results)
    avg_fatsecret_completeness = sum(r["fatsecret_completeness"] for r in results) / len(results)
    avg_hybrid_nutrients = sum(r["hybrid_nutrients"] for r in results) / len(results)
    avg_fatsecret_nutrients = sum(r["fatsecret_nutrients"] for r in results) / len(results)
    avg_hybrid_serving = sum(r["hybrid_serving"] for r in results) / len(results)
    avg_fatsecret_serving = sum(r["fatsecret_serving"] for r in results) / len(results)
    avg_hybrid_images = sum(r["hybrid_images"] for r in results) / len(results)
    avg_fatsecret_images = sum(r["fatsecret_images"] for r in results) / len(results)
    avg_hybrid_overall = sum(r["hybrid_overall"] for r in results) / len(results)
    avg_fatsecret_overall = sum(r["fatsecret_overall"] for r in results) / len(results)
    
    # Crea il report riassuntivo
    print("\n==============================================================")
    print("📊 RAPPORTO DI CONFRONTO TRA SERVIZI ALIMENTARI")
    print("==============================================================\n")
    
    print(f"Totale ricerche testate: {len(results)}")
    print(f"Vincitore complessivo: {'Hybrid Service' if hybrid_wins > fatsecret_wins else 'FatSecret' if fatsecret_wins > hybrid_wins else 'Pareggio'}")
    print(f"  - Hybrid Service ha vinto in {hybrid_wins} ricerche ({hybrid_wins/len(results)*100:.1f}%)")
    print(f"  - FatSecret ha vinto in {fatsecret_wins} ricerche ({fatsecret_wins/len(results)*100:.1f}%)")
    print(f"  - Pareggio in {ties} ricerche ({ties/len(results)*100:.1f}%)")
    print("\n")
    
    # Tabella di riepilogo per le varie metriche
    summary_table = [
        ["Metrica", "Hybrid Avg (%)", "FatSecret Avg (%)", "Vincitore", "Hybrid Wins", "FatSecret Wins"],
        ["Completezza nutrienti", f"{avg_hybrid_completeness:.1f}", f"{avg_fatsecret_completeness:.1f}", 
         "Hybrid" if avg_hybrid_completeness > avg_fatsecret_completeness else "FatSecret", 
         hybrid_wins_completeness, fatsecret_wins_completeness],
        ["Disponibilità nutrienti", f"{avg_hybrid_nutrients:.1f}", f"{avg_fatsecret_nutrients:.1f}", 
         "Hybrid" if avg_hybrid_nutrients > avg_fatsecret_nutrients else "FatSecret", 
         hybrid_wins_nutrients, fatsecret_wins_nutrients],
        ["Info porzioni", f"{avg_hybrid_serving:.1f}", f"{avg_fatsecret_serving:.1f}", 
         "Hybrid" if avg_hybrid_serving > avg_fatsecret_serving else "FatSecret", 
         hybrid_wins_serving, fatsecret_wins_serving],
        ["Disponibilità immagini", f"{avg_hybrid_images:.1f}", f"{avg_fatsecret_images:.1f}", 
         "Hybrid" if avg_hybrid_images > avg_fatsecret_images else "FatSecret", 
         hybrid_wins_images, fatsecret_wins_images],
        ["Media complessiva", f"{avg_hybrid_overall:.1f}", f"{avg_fatsecret_overall:.1f}", 
         "Hybrid" if avg_hybrid_overall > avg_fatsecret_overall else "FatSecret", 
         hybrid_wins, fatsecret_wins]
    ]
    
    print(tabulate(summary_table[1:], headers=summary_table[0], tablefmt="grid"))
    print("\n")
    
    # Tabella con i risultati dettagliati
    detailed_results = [["Query", "Hybrid Risultati", "FatSecret Risultati", "Vincitore"]]
    for r in results:
        detailed_results.append([
            r["query"], 
            r["hybrid_count"],
            r["fatsecret_count"],
            r["winner_overall"]
        ])
    
    print("Risultati dettagliati per query:")
    print(tabulate(detailed_results[1:], headers=detailed_results[0], tablefmt="grid"))
    print("\n")
    
    # Scrivi il report completo in un file
    with open("test_results/report_comparison.txt", "w") as file:
        file.write("==============================================================\n")
        file.write("📊 RAPPORTO DI CONFRONTO TRA SERVIZI ALIMENTARI\n")
        file.write("==============================================================\n\n")
        
        file.write(f"Totale ricerche testate: {len(results)}\n")
        file.write(f"Vincitore complessivo: {'Hybrid Service' if hybrid_wins > fatsecret_wins else 'FatSecret' if fatsecret_wins > hybrid_wins else 'Pareggio'}\n")
        file.write(f"  - Hybrid Service ha vinto in {hybrid_wins} ricerche ({hybrid_wins/len(results)*100:.1f}%)\n")
        file.write(f"  - FatSecret ha vinto in {fatsecret_wins} ricerche ({fatsecret_wins/len(results)*100:.1f}%)\n")
        file.write(f"  - Pareggio in {ties} ricerche ({ties/len(results)*100:.1f}%)\n\n")
        
        file.write(tabulate(summary_table[1:], headers=summary_table[0], tablefmt="grid"))
        file.write("\n\n")
        
        file.write("Risultati dettagliati per query:\n")
        file.write(tabulate(detailed_results[1:], headers=detailed_results[0], tablefmt="grid"))
    
    print(f"Report completo salvato in: test_results/report_comparison.txt")

# Esegui i test e genera il report
if __name__ == "__main__":
    results = run_comparison_tests()
    generate_report(results)
