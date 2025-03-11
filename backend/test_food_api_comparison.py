import asyncio
import logging
import sys
import time
import json
import os
from datetime import datetime
from dotenv import load_dotenv

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
    "tiramisù",
    "panna cotta",
    "cannoli siciliani",
    "panettone",
    "gelato"
]

async def test_fatsecret(food):
    """Testa un alimento con FatSecret"""
    # Import qui per evitare problemi di dipendenze circolari
    from fatsecret_service import FatSecretService
    
    fatsecret_service = FatSecretService()
    
    start_time = time.time()
    try:
        results = await fatsecret_service.search_food(food, max_results=3)
        elapsed_time = time.time() - start_time
        
        if results and "foods" in results and results["foods"] and "food" in results["foods"]:
            food_items = results["foods"]["food"]
            if not isinstance(food_items, list):
                food_items = [food_items]  # Converti in lista se è un singolo elemento
                
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
                    serving = serving[0]  # Prendi il primo serving se ce ne sono più di uno
                
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

async def test_usda(food):
    """Testa un alimento con USDA FoodData Central"""
    # Import qui per evitare problemi di dipendenze circolari
    from usda_food_service import USDAFoodService
    
    usda_service = USDAFoodService()
    
    start_time = time.time()
    try:
        search_results = await usda_service.search_food(food, max_results=3)
        elapsed_time = time.time() - start_time
        
        if "foods" in search_results and search_results["foods"]:
            formatted_results = await usda_service.format_search_results(search_results)
            
            if formatted_results:
                result = formatted_results[0]  # Prendi il primo risultato
                
                return {
                    "service": "USDA",
                    "food": food,
                    "found": True,
                    "name": result.get("food_name", "N/A"),
                    "brand": result.get("brand_name", ""),
                    "description": result.get("description", ""),
                    "calories": result.get("nutrients", {}).get("Energy", "N/A"),
                    "protein": result.get("nutrients", {}).get("Protein", "N/A"),
                    "carbs": result.get("nutrients", {}).get("Carbohydrate, by difference", "N/A"),
                    "fat": result.get("nutrients", {}).get("Total lipid (fat)", "N/A"),
                    "time": elapsed_time,
                    "raw_data": result
                }
            
        return {
            "service": "USDA",
            "food": food,
            "found": False,
            "time": elapsed_time
        }
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore USDA per '{food}': {str(e)}")
        return {
            "service": "USDA",
            "food": food,
            "found": False,
            "error": str(e),
            "time": elapsed_time
        }

async def test_edamam(food):
    """Testa un alimento con Edamam"""
    # Import qui per evitare problemi di dipendenze circolari
    from edamam_service import EdamamService
    
    edamam_service = EdamamService()
    
    start_time = time.time()
    try:
        results = await edamam_service.search_food(food, max_results=3)
        elapsed_time = time.time() - start_time
        
        if results and "results" in results and results["results"]:
            result = results["results"][0]  # Prendi il primo risultato
            
            return {
                "service": "Edamam",
                "food": food,
                "found": True,
                "name": result.get("name", "N/A"),
                "brand": result.get("brand", ""),
                "description": "",  # Edamam non fornisce una descrizione
                "calories": result.get("calories", "N/A"),
                "protein": result.get("protein", "N/A"),
                "carbs": result.get("carbs", "N/A"),
                "fat": result.get("fat", "N/A"),
                "time": elapsed_time,
                "raw_data": result
            }
        else:
            return {
                "service": "Edamam",
                "food": food,
                "found": False,
                "time": elapsed_time
            }
    
    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Errore Edamam per '{food}': {str(e)}")
        return {
            "service": "Edamam",
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
    
    logger.info("Inizializzazione del test di confronto tra FatSecret, USDA e Edamam...")
    
    # Risultati per servizio
    fatsecret_results = []
    usda_results = []
    edamam_results = []
    
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
        else:
            logger.info(f"FatSecret: Nessun risultato in {fatsecret_result['time']:.2f} secondi")
        
        # Test USDA
        usda_result = await test_usda(food)
        usda_results.append(usda_result)
        food_results["results"]["usda"] = usda_result
        
        if usda_result["found"]:
            logger.info(f"USDA: Trovato '{usda_result['name']}' in {usda_result['time']:.2f} secondi")
            logger.info(f"  Calorie: {usda_result['calories']}")
        else:
            logger.info(f"USDA: Nessun risultato in {usda_result['time']:.2f} secondi")
        
        # Test Edamam
        edamam_result = await test_edamam(food)
        edamam_results.append(edamam_result)
        food_results["results"]["edamam"] = edamam_result
        
        if edamam_result["found"]:
            logger.info(f"Edamam: Trovato '{edamam_result['name']}' in {edamam_result['time']:.2f} secondi")
            logger.info(f"  Calorie: {edamam_result['calories']}")
        else:
            logger.info(f"Edamam: Nessun risultato in {edamam_result['time']:.2f} secondi")
        
        all_results.append(food_results)
    
    # Salva i risultati in formato JSON
    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    # Statistiche finali
    fatsecret_found = sum(1 for r in fatsecret_results if r["found"])
    usda_found = sum(1 for r in usda_results if r["found"])
    edamam_found = sum(1 for r in edamam_results if r["found"])
    
    fatsecret_times = [r["time"] for r in fatsecret_results]
    usda_times = [r["time"] for r in usda_results]
    edamam_times = [r["time"] for r in edamam_results]
    
    # Crea il report in Markdown
    with open(report_filename, "w", encoding="utf-8") as f:
        f.write(f"# Report Confronto API Alimentari - Alimenti Italiani\n\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n")
        
        f.write("## Statistiche Generali\n\n")
        f.write(f"- **Alimenti testati**: {len(ITALIAN_FOODS)}\n")
        f.write(f"- **FatSecret - Alimenti trovati**: {fatsecret_found}/{len(ITALIAN_FOODS)} ({fatsecret_found/len(ITALIAN_FOODS)*100:.1f}%)\n")
        f.write(f"- **USDA - Alimenti trovati**: {usda_found}/{len(ITALIAN_FOODS)} ({usda_found/len(ITALIAN_FOODS)*100:.1f}%)\n")
        f.write(f"- **Edamam - Alimenti trovati**: {edamam_found}/{len(ITALIAN_FOODS)} ({edamam_found/len(ITALIAN_FOODS)*100:.1f}%)\n\n")
        
        if fatsecret_times:
            f.write(f"- **FatSecret - Tempo medio di risposta**: {sum(fatsecret_times)/len(fatsecret_times):.2f} secondi\n")
        
        if usda_times:
            f.write(f"- **USDA - Tempo medio di risposta**: {sum(usda_times)/len(usda_times):.2f} secondi\n")
        
        if edamam_times:
            f.write(f"- **Edamam - Tempo medio di risposta**: {sum(edamam_times)/len(edamam_times):.2f} secondi\n\n")
        
        f.write("## Risultati Dettagliati\n\n")
        
        for food in ITALIAN_FOODS:
            f.write(f"### {food}\n\n")
            
            fatsecret_item = next((r for r in fatsecret_results if r["food"] == food), None)
            usda_item = next((r for r in usda_results if r["food"] == food), None)
            edamam_item = next((r for r in edamam_results if r["food"] == food), None)
            
            f.write("| API | Trovato | Nome | Brand | Calorie | Proteine | Carboidrati | Grassi | Tempo (s) |\n")
            f.write("|-----|---------|------|-------|---------|----------|-------------|--------|-----------|\n")
            
            # FatSecret
            if fatsecret_item and fatsecret_item["found"]:
                f.write(f"| FatSecret | ✅ | {fatsecret_item['name']} | {fatsecret_item['brand']} | {fatsecret_item['calories']} | ")
                f.write(f"{fatsecret_item['protein']} | {fatsecret_item['carbs']} | {fatsecret_item['fat']} | {fatsecret_item['time']:.2f} |\n")
            else:
                f.write(f"| FatSecret | ❌ | - | - | - | - | - | - | {fatsecret_item['time'] if fatsecret_item else 'N/A':.2f} |\n")
            
            # USDA
            if usda_item and usda_item["found"]:
                f.write(f"| USDA | ✅ | {usda_item['name']} | {usda_item['brand']} | {usda_item['calories']} | ")
                f.write(f"{usda_item['protein']} | {usda_item['carbs']} | {usda_item['fat']} | {usda_item['time']:.2f} |\n")
            else:
                f.write(f"| USDA | ❌ | - | - | - | - | - | - | {usda_item['time'] if usda_item else 'N/A':.2f} |\n")
            
            # Edamam
            if edamam_item and edamam_item["found"]:
                f.write(f"| Edamam | ✅ | {edamam_item['name']} | {edamam_item['brand']} | {edamam_item['calories']} | ")
                f.write(f"{edamam_item['protein']} | {edamam_item['carbs']} | {edamam_item['fat']} | {edamam_item['time']:.2f} |\n")
            else:
                f.write(f"| Edamam | ❌ | - | - | - | - | - | - | {edamam_item['time'] if edamam_item else 'N/A':.2f} |\n")
            
            f.write("\n")
    
    logger.info(f"\n=== REPORT COMPLETATO ===")
    logger.info(f"Report salvato in: {report_filename}")
    logger.info(f"Dati JSON salvati in: {json_filename}")

if __name__ == "__main__":
    asyncio.run(main())
