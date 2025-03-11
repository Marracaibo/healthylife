import os
import sys
import time
import asyncio
import json
from tabulate import tabulate

# Aggiungi la directory principale al path per poter importare i moduli
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa i servizi
from services.fatsecret_service import search_foods as fatsecret_search
from services.usda_food_service import USDAFoodService

# Esempi di cibi da testare
TEST_FOODS = [
    "pizza",
    "pasta",
    "apple",
    "chicken",
    "salmon"
]

# Configura l'API key USDA (usa la stessa nel servizio ibrido)
USDA_API_KEY = "kEseTDkwusGGZVedh5FYi9vUvMNxxMHQpue4TYcm"

def format_time(seconds):
    """Formatta il tempo in un formato leggibile."""
    return f"{seconds:.2f}s"

def print_separator():
    """Stampa un separatore per migliorare la leggibilità."""
    print("\n" + "-" * 60 + "\n")

async def test_fatsecret():
    """Testa il servizio FatSecret direttamente usando la versione aggiornata."""
    print("\n===== TEST SERVIZIO FATSECRET =====\n")
    
    results_table = []
    
    for food in TEST_FOODS:
        print(f"Ricerca per: '{food}'")
        start_time = time.time()
        
        try:
            # Usa la funzione di ricerca FatSecret direttamente
            results = fatsecret_search(food, max_results=3)
            elapsed = time.time() - start_time
            
            if results and isinstance(results, list):
                count = len(results)
                status = "u2705 OK" if count > 0 else "u26a0ufe0f Nessun risultato"
                
                if count > 0:
                    # Ottieni info sul primo risultato
                    first_item = results[0]
                    name = first_item.get('food_name', 'N/A')
                    description = first_item.get('food_description', '')[:50] + '...' if len(first_item.get('food_description', '')) > 50 else first_item.get('food_description', '')
                    
                    print(f"  Trovati {count} risultati in {format_time(elapsed)}")
                    print(f"  Primo risultato: {name}")
                    print(f"  Descrizione: {description}")
                else:
                    print(f"  Nessun risultato trovato in {format_time(elapsed)}")
            else:
                status = "u274c Errore"
                count = 0
                print(f"  Errore o formato inatteso in {format_time(elapsed)}")
                
        except Exception as e:
            elapsed = time.time() - start_time
            status = "u274c Errore"
            count = 0
            print(f"  Eccezione: {str(e)} in {format_time(elapsed)}")
        
        # Aggiungi i risultati alla tabella
        results_table.append([food, status, count, format_time(elapsed)])
    
    # Stampa la tabella riassuntiva
    print("\nRiassunto dei risultati FatSecret:")
    print(tabulate(results_table, headers=["Query", "Status", "Conteggio", "Tempo"], tablefmt="grid"))
    
    print_separator()

async def test_usda():
    """Testa il servizio USDA direttamente usando il servizio."""
    print("\n===== TEST SERVIZIO USDA =====\n")
    
    # Inizializza il servizio USDA
    usda_service = USDAFoodService()
    usda_service.api_key = USDA_API_KEY
    
    results_table = []
    
    for food in TEST_FOODS:
        print(f"Ricerca per: '{food}'")
        start_time = time.time()
        
        try:
            # Usa il servizio USDA direttamente
            results = await usda_service.search_food(food, page_size=3)
            elapsed = time.time() - start_time
            
            if results and "foods" in results:
                foods = results["foods"]
                count = len(foods)
                status = "u2705 OK" if count > 0 else "u26a0ufe0f Nessun risultato"
                
                if count > 0:
                    # Ottieni info sul primo risultato
                    first_item = foods[0]
                    name = first_item.get('description', 'N/A')
                    brand = first_item.get('brandName', 'N/A') if first_item.get('brandName') else 'Generic'
                    
                    print(f"  Trovati {count} risultati in {format_time(elapsed)}")
                    print(f"  Primo risultato: {name}")
                    print(f"  Marca: {brand}")
                else:
                    print(f"  Nessun risultato trovato in {format_time(elapsed)}")
            else:
                status = "u274c Errore"
                count = 0
                print(f"  Errore o formato inatteso in {format_time(elapsed)}")
                
        except Exception as e:
            elapsed = time.time() - start_time
            status = "u274c Errore"
            count = 0
            print(f"  Eccezione: {str(e)} in {format_time(elapsed)}")
        
        # Aggiungi i risultati alla tabella
        results_table.append([food, status, count, format_time(elapsed)])
    
    # Stampa la tabella riassuntiva
    print("\nRiassunto dei risultati USDA:")
    print(tabulate(results_table, headers=["Query", "Status", "Conteggio", "Tempo"], tablefmt="grid"))
    
    print_separator()

async def main():
    """Funzione principale per eseguire i test."""
    print("\n===================================================")
    print("   TEST DIRETTO DEI SERVIZI DI RICERCA CIBO")
    print("   (Utilizzando direttamente le funzioni dei servizi)")
    print("===================================================\n")
    
    # Esegui i test
    if len(sys.argv) > 1:
        # Se specificato un servizio come argomento, testa solo quello
        service = sys.argv[1].lower()
        if service == "fatsecret":
            await test_fatsecret()
        elif service == "usda":
            await test_usda()
        else:
            print(f"Servizio '{service}' non riconosciuto. Opzioni: fatsecret, usda")
    else:
        # Testa entrambi i servizi
        await test_fatsecret()
        await test_usda()
    
    print("\nTest completati!")

if __name__ == "__main__":
    # Esegui il loop asyncio
    asyncio.run(main())
