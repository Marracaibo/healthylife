import asyncio
import logging
import sys
import time
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from fatsecret_service import FatSecretService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

# Crea la directory per i risultati se non esiste
os.makedirs("test_results", exist_ok=True)

# Lista di alimenti italiani da testare
ITALIAN_FOODS = [
    # Primi piatti
    "pasta al pomodoro",
    "pasta alla carbonara",
    "risotto ai funghi",
    "lasagne alla bolognese",
    "gnocchi al pesto",
    
    # Secondi piatti
    "bistecca alla fiorentina",
    "cotoletta alla milanese",
    "ossobuco",
    "saltimbocca alla romana",
    "vitello tonnato",
    
    # Formaggi
    "parmigiano reggiano",
    "mozzarella di bufala",
    "gorgonzola",
    "pecorino romano",
    "taleggio",
    
    # Salumi
    "prosciutto di parma",
    "mortadella",
    "salame milano",
    "bresaola",
    "speck",
    
    # Dolci
    "tiramisu00f9",
    "panna cotta",
    "cannoli siciliani",
    "panettone",
    "gelato"
]

async def test_fatsecret(food):
    """Testa un alimento con FatSecret"""
    fatsecret_service = FatSecretService()
    
    start_time = time.time()
    try:
        results = await fatsecret_service.search_food(food, max_results=3)
        elapsed_time = time.time() - start_time
        
        if results and "foods" in results and results["foods"] and "food" in results["foods"]:
            food_items = results["foods"]["food"]
            if not isinstance(food_items, list):
                food_items = [food_items]  # Converti in lista se u00e8 un singolo elemento
                
            result = food_items[0]  # Prendi il primo risultato
            
            # Estrai le informazioni nutrizionali
            food_name = result.get("food_name", "N/A")
            brand = result.get("brand_name", "")
            food_description = result.get("food_description", "")
            
            # Estrai le calorie e i macronutrienti
            calories = "N/A"
            protein = "N/A"
            carbs = "N/A"
            fat = "N/A"
            
            if "servings" in result and "serving" in result["servings"]:
                serving = result["servings"]["serving"]
                if isinstance(serving, list):
                    serving = serving[0]  # Prendi il primo serving se ce ne sono piu00f9 di uno
                
                calories = serving.get("calories", "N/A")
                protein = serving.get("protein", "N/A")
                carbs = serving.get("carbohydrate", "N/A")
                fat = serving.get("fat", "N/A")
            
            return {
                "service": "FatSecret",
                "food": food,
                "found": True,
                "name": food_name,
                "brand": brand,
                "description": food_description,
                "calories": calories,
                "protein": protein,
                "carbs": carbs,
                "fat": fat,
                "time": elapsed_time,
                "raw_data": result
            }
        else:
            return {
                "service": "FatSecret",
                "food": food,
                "found": False,
                "time": elapsed_time
            }
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore FatSecret per '{food}': {str(e)}")
        return {
            "service": "FatSecret",
            "food": food,
            "found": False,
            "error": str(e),
            "time": elapsed_time
        }

async def main():
    """Funzione principale"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    report_filename = f"test_results/report_alimenti_italiani_{timestamp}.md"
    json_filename = f"test_results/data_alimenti_italiani_{timestamp}.json"
    
    logger.info("Inizializzazione del test di FatSecret con alimenti italiani...")
    
    # Risultati per servizio
    fatsecret_results = []
    
    # Risultati per alimento
    all_results = []
    
    for food in ITALIAN_FOODS:
        logger.info(f"\n--- Testando: {food} ---")
        food_results = {"food": food, "results": {}}
        
        # Test FatSecret
        fatsecret_result = await test_fatsecret(food)
        fatsecret_results.append(fatsecret_result)
        food_results["results"]["fatsecret"] = fatsecret_result
        
        if fatsecret_result["found"]:
            logger.info(f"FatSecret: Trovato '{fatsecret_result['name']}' in {fatsecret_result['time']:.2f} secondi")
            logger.info(f"  Calorie: {fatsecret_result['calories']}")
            logger.info(f"  Proteine: {fatsecret_result['protein']}")
            logger.info(f"  Carboidrati: {fatsecret_result['carbs']}")
            logger.info(f"  Grassi: {fatsecret_result['fat']}")
        else:
            logger.info(f"FatSecret: Nessun risultato in {fatsecret_result['time']:.2f} secondi")
        
        all_results.append(food_results)
    
    # Salva i risultati in formato JSON
    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    # Statistiche finali
    fatsecret_found = sum(1 for r in fatsecret_results if r["found"])
    fatsecret_times = [r["time"] for r in fatsecret_results]
    
    # Crea il report in Markdown
    with open(report_filename, "w", encoding="utf-8") as f:
        f.write(f"# Report FatSecret - Alimenti Italiani\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n")
        
        f.write("## Statistiche Generali\n\n")
        f.write(f"- **Alimenti testati**: {len(ITALIAN_FOODS)}\n")
        f.write(f"- **FatSecret - Alimenti trovati**: {fatsecret_found}/{len(ITALIAN_FOODS)} ({fatsecret_found/len(ITALIAN_FOODS)*100:.1f}%)\n\n")
        
        if fatsecret_times:
            f.write(f"- **FatSecret - Tempo medio di risposta**: {sum(fatsecret_times)/len(fatsecret_times):.2f} secondi\n\n")
        
        f.write("## Risultati Dettagliati\n\n")
        
        for food in ITALIAN_FOODS:
            f.write(f"### {food}\n\n")
            
            fatsecret_item = next((r for r in fatsecret_results if r["food"] == food), None)
            
            f.write("| Trovato | Nome | Brand | Calorie | Proteine | Carboidrati | Grassi | Tempo (s) |\n")
            f.write("|---------|------|-------|---------|----------|-------------|--------|-----------|\n")
            
            # FatSecret
            if fatsecret_item and fatsecret_item["found"]:
                f.write(f"| u2705 | {fatsecret_item['name']} | {fatsecret_item['brand']} | {fatsecret_item['calories']} | ")
                f.write(f"{fatsecret_item['protein']} | {fatsecret_item['carbs']} | {fatsecret_item['fat']} | {fatsecret_item['time']:.2f} |\n")
            else:
                f.write(f"| u274c | - | - | - | - | - | - | {fatsecret_item['time'] if fatsecret_item else 'N/A':.2f} |\n")
            
            f.write("\n")
    
    logger.info(f"\n=== REPORT COMPLETATO ===")
    logger.info(f"Report salvato in: {report_filename}")
    logger.info(f"Dati JSON salvati in: {json_filename}")

if __name__ == "__main__":
    asyncio.run(main())
