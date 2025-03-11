import asyncio
import json
import time
import logging
from typing import List, Dict, Any
import os
import sys
import aiohttp
from tabulate import tabulate

# Configura il logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("italian_foods_test.log"),
                        logging.StreamHandler(sys.stdout)
                    ])
logger = logging.getLogger(__name__)

# Lista di alimenti italiani comuni nei supermercati come Lidl, Tosano, ecc.
ITALIAN_FOODS = [
    # Pasta e riso
    "pasta barilla", "pasta de cecco", "pasta la molisana", "pasta rummo", 
    "pasta garofalo", "pasta divella", "pasta voiello", "pasta agnesi",
    "pasta integrale", "pasta di farro", "pasta di kamut", "pasta di grano saraceno",
    "riso arborio", "riso carnaroli", "riso vialone nano", "riso basmati",
    
    # Prodotti da forno
    "pane casereccio", "pane di altamura", "pane di matera", "focaccia genovese",
    "grissini torinesi", "taralli pugliesi", "friselle", "piadina romagnola",
    "crackers gran pavesi", "crackers ritz", "fette biscottate mulino bianco",
    
    # Formaggi
    "parmigiano reggiano", "grana padano", "pecorino romano", "pecorino toscano",
    "mozzarella di bufala", "burrata", "stracchino", "gorgonzola",
    "taleggio", "asiago", "fontina", "provolone", "scamorza",
    
    # Salumi
    "prosciutto di parma", "prosciutto san daniele", "prosciutto cotto", "mortadella",
    "salame milano", "salame napoli", "salame toscano", "bresaola",
    "pancetta", "guanciale", "speck", "coppa", "culatello",
    
    # Prodotti Lidl
    "yogurt lidl", "latte lidl", "formaggio lidl", "prosciutto lidl",
    "pasta lidl", "biscotti lidl", "cereali lidl", "pane lidl",
    
    # Prodotti Tosano
    "yogurt tosano", "latte tosano", "formaggio tosano", "prosciutto tosano",
    "pasta tosano", "biscotti tosano", "cereali tosano", "pane tosano",
    
    # Prodotti Eurospin
    "yogurt eurospin", "latte eurospin", "formaggio eurospin", "prosciutto eurospin",
    "pasta eurospin", "biscotti eurospin", "cereali eurospin", "pane eurospin",
    
    # Prodotti Conad
    "yogurt conad", "latte conad", "formaggio conad", "prosciutto conad",
    "pasta conad", "biscotti conad", "cereali conad", "pane conad",
    
    # Prodotti Coop
    "yogurt coop", "latte coop", "formaggio coop", "prosciutto coop",
    "pasta coop", "biscotti coop", "cereali coop", "pane coop",
    
    # Prodotti Esselunga
    "yogurt esselunga", "latte esselunga", "formaggio esselunga", "prosciutto esselunga",
    "pasta esselunga", "biscotti esselunga", "cereali esselunga", "pane esselunga",
    
    # Dolci e snack
    "nutella", "pan di stelle", "abbracci mulino bianco", "gocciole pavesi",
    "baiocchi barilla", "kinder bueno", "kinder cereali", "ferrero rocher",
    "patatine san carlo", "patatine pringles", "arachidi", "taralli",
    
    # Bevande
    "acqua san pellegrino", "acqua levissima", "acqua panna", "acqua sant'anna",
    "coca cola", "fanta", "sprite", "estathe", "succo di frutta yoga",
    "vino chianti", "vino barolo", "vino prosecco", "birra peroni", "birra moretti"
]

class APITester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.search_endpoint = f"{base_url}/api/fatsecret/search"
        self.food_endpoint = f"{base_url}/api/fatsecret/food"
        self.results = {
            "openfoodfacts": 0,
            "edamam": 0,
            "fatsecret": 0,
            "not_found": 0,
            "total": 0
        }
        self.detailed_results = []
        
    async def test_search(self, query: str, max_results: int = 5) -> Dict[str, Any]:
        """Testa la ricerca di un alimento"""
        try:
            async with aiohttp.ClientSession() as session:
                params = {"query": query, "max_results": max_results}
                async with session.get(self.search_endpoint, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        logger.error(f"Errore nella ricerca di '{query}': {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Eccezione durante la ricerca di '{query}': {str(e)}")
            return None
            
    async def test_food_details(self, food_id: str) -> Dict[str, Any]:
        """Testa il recupero dei dettagli di un alimento"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.food_endpoint}/{food_id}"
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        logger.error(f"Errore nel recupero dei dettagli per '{food_id}': {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Eccezione durante il recupero dei dettagli per '{food_id}': {str(e)}")
            return None
            
    def identify_api_source(self, food_id: str) -> str:
        """Identifica la fonte dell'API in base all'ID dell'alimento"""
        if food_id.startswith("off-"):
            return "openfoodfacts"
        elif food_id.startswith("edamam-"):
            return "edamam"
        else:
            return "fatsecret"
            
    async def run_tests(self, foods: List[str] = None) -> Dict[str, Any]:
        """Esegue i test su tutti gli alimenti"""
        if foods is None:
            foods = ITALIAN_FOODS
            
        self.results = {
            "openfoodfacts": 0,
            "edamam": 0,
            "fatsecret": 0,
            "not_found": 0,
            "total": len(foods)
        }
        self.detailed_results = []
        
        for i, food in enumerate(foods):
            logger.info(f"[{i+1}/{len(foods)}] Testando: {food}")
            
            # Aggiungi un piccolo ritardo per evitare di sovraccaricare l'API
            if i > 0:
                await asyncio.sleep(0.5)
                
            search_result = await self.test_search(food)
            
            if not search_result or "results" not in search_result or not search_result["results"]:
                logger.warning(f"Nessun risultato trovato per '{food}'")
                self.results["not_found"] += 1
                self.detailed_results.append({
                    "query": food,
                    "found": False,
                    "source": "none",
                    "first_result": None,
                    "total_results": 0
                })
                continue
                
            # Prendi il primo risultato
            first_result = search_result["results"][0]
            food_id = first_result["id"]
            source = self.identify_api_source(food_id)
            
            # Incrementa il contatore per la fonte
            self.results[source] += 1
            
            # Ottieni i dettagli del primo risultato
            food_details = await self.test_food_details(food_id)
            has_details = food_details is not None
            
            self.detailed_results.append({
                "query": food,
                "found": True,
                "source": source,
                "first_result": first_result["name"],
                "total_results": len(search_result["results"]),
                "has_details": has_details
            })
            
            logger.info(f"Risultato per '{food}': Trovato in {source}, Nome: {first_result['name']}")
            
        return self.results
        
    def print_summary(self) -> None:
        """Stampa un riepilogo dei risultati dei test"""
        total = self.results["total"]
        found = total - self.results["not_found"]
        
        logger.info("\n" + "="*50)
        logger.info("RIEPILOGO DEI TEST")
        logger.info("="*50)
        
        logger.info(f"Totale alimenti testati: {total}")
        logger.info(f"Alimenti trovati: {found} ({found/total*100:.1f}%)")
        logger.info(f"Alimenti non trovati: {self.results['not_found']} ({self.results['not_found']/total*100:.1f}%)")
        
        logger.info("\nDistribuzione per API:")
        logger.info(f"- OpenFoodFacts: {self.results['openfoodfacts']} ({self.results['openfoodfacts']/total*100:.1f}%)")
        logger.info(f"- Edamam: {self.results['edamam']} ({self.results['edamam']/total*100:.1f}%)")
        logger.info(f"- FatSecret: {self.results['fatsecret']} ({self.results['fatsecret']/total*100:.1f}%)")
        
        # Crea una tabella con i risultati dettagliati
        table_data = []
        for result in self.detailed_results:
            source = result["source"] if result["found"] else "non trovato"
            name = result["first_result"] if result["found"] else "-"
            total = result["total_results"] if result["found"] else 0
            has_details = "Sì" if result.get("has_details", False) else "No"
            
            table_data.append([
                result["query"],
                source,
                name,
                total,
                has_details
            ])
            
        headers = ["Query", "Fonte", "Primo Risultato", "Totale Risultati", "Dettagli"]
        table = tabulate(table_data, headers=headers, tablefmt="grid")
        
        logger.info("\nRisultati Dettagliati:")
        logger.info("\n" + table)
        
        # Salva i risultati in un file JSON
        with open("italian_foods_test_results.json", "w", encoding="utf-8") as f:
            json.dump({
                "summary": self.results,
                "detailed_results": self.detailed_results
            }, f, ensure_ascii=False, indent=2)
            
        logger.info("\nI risultati dettagliati sono stati salvati in 'italian_foods_test_results.json'")

async def main():
    tester = APITester()
    logger.info("Avvio dei test su alimenti italiani...")
    await tester.run_tests()
    tester.print_summary()

if __name__ == "__main__":
    asyncio.run(main())
