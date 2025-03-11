"""
Test script per verificare la connettività con le API USDA e Edamam.
Questo script testa entrambe le API con query in inglese per escludere problemi di traduzione.
"""

import asyncio
import os
import json
import time
from dotenv import load_dotenv
from services.usda_food_service import USDAFoodService
from edamam_only_service import EdamamOnlyService

# Carica le variabili d'ambiente
load_dotenv()

# Log function
def log_message(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

async def test_usda_api():
    """Testa la connessione all'API USDA FoodData Central."""
    log_message("Test API USDA FoodData Central")
    
    # Inizializza il servizio
    service = USDAFoodService()
    
    # Assicurati che la chiave API sia configurata
    if not service.api_key:
        log_message("ERRORE: USDA_API_KEY non configurata nelle variabili d'ambiente")
        log_message(f"Variabili presenti: {os.environ.keys()}")
        return False
    
    log_message(f"USDA API Key configurata: {service.api_key[:5]}...{service.api_key[-5:]}")
    
    # Test con query in inglese semplici
    test_queries = ["apple", "banana", "chicken"]
    for query in test_queries:
        log_message(f"Test USDA con query: {query}")
        try:
            start_time = time.time()
            results = await service.search_food(query)
            elapsed = time.time() - start_time
            
            # Verifica i risultati
            if "foods" in results and results["foods"]:
                count = len(results["foods"])
                first_item = results["foods"][0]["description"] if count > 0 else "N/A"
                log_message(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s. Primo risultato: {first_item}")
            else:
                error = results.get("error", "Nessun errore specifico riportato")
                log_message(f"✗ Errore: Nessun risultato trovato. Messaggio: {error}")
                if "error" in results:
                    return False
        except Exception as e:
            log_message(f"✗ Eccezione durante la ricerca USDA: {str(e)}")
            return False
    
    return True

async def test_edamam_api():
    """Testa la connessione all'API Edamam."""
    log_message("Test API Edamam")
    
    # Inizializza il servizio
    service = EdamamOnlyService()
    
    # Verifica le credenziali
    if not service.app_id or not service.app_key:
        log_message("ERRORE: EDAMAM_APP_ID o EDAMAM_APP_KEY non configurati nelle variabili d'ambiente")
        log_message(f"Variabili presenti: {os.environ.keys()}")
        return False
    
    log_message(f"Edamam App ID configurato: {service.app_id}")
    log_message(f"Edamam App Key configurata: {service.app_key[:5]}...{service.app_key[-5:]}")
    
    # Test con query in inglese semplici
    test_queries = ["apple", "banana", "chicken"]
    for query in test_queries:
        log_message(f"Test Edamam con query: {query}")
        try:
            start_time = time.time()
            results = await service.search_food(query)
            elapsed = time.time() - start_time
            
            # Verifica i risultati
            if "results" in results and results["results"]:
                count = len(results["results"])
                first_item = results["results"][0]["name"] if count > 0 else "N/A"
                log_message(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s. Primo risultato: {first_item}")
            else:
                log_message(f"✗ Errore: Nessun risultato trovato.")
                return False
        except Exception as e:
            log_message(f"✗ Eccezione durante la ricerca Edamam: {str(e)}")
            return False
    
    return True

async def test_hybrid_with_english_query():
    """Testa il servizio ibrido con una query in inglese."""
    from services.hybrid_food_service import HybridFoodService
    
    log_message("Test del servizio ibrido con query in inglese")
    
    service = HybridFoodService()
    query = "apple"
    
    log_message(f"Test servizio ibrido con query: {query}")
    try:
        start_time = time.time()
        results = await service.search_food(query)
        elapsed = time.time() - start_time
        
        # Verifica i risultati
        if results["total_results"] > 0:
            count = results["total_results"]
            source = results["source"]
            first_item = results["results"][0]["name"] if count > 0 else "N/A"
            log_message(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s da {source}. Primo risultato: {first_item}")
        else:
            log_message(f"✗ Errore: Nessun risultato trovato.")
            return False
        
        return True
    except Exception as e:
        log_message(f"✗ Eccezione durante la ricerca ibrida: {str(e)}")
        return False

async def test_hybrid_with_italian_query():
    """Testa il servizio ibrido con una query in italiano."""
    from services.hybrid_food_service import HybridFoodService
    
    log_message("Test del servizio ibrido con query in italiano")
    
    service = HybridFoodService()
    query = "mela"  # apple in italiano
    
    log_message(f"Test servizio ibrido con query: {query}")
    try:
        start_time = time.time()
        results = await service.search_food(query)
        elapsed = time.time() - start_time
        
        # Verifica i risultati
        if results["total_results"] > 0:
            count = results["total_results"]
            source = results["source"]
            first_item = results["results"][0]["name"] if count > 0 else "N/A"
            log_message(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s da {source}. Primo risultato: {first_item}")
        else:
            log_message(f"✗ Errore: Nessun risultato trovato per query in italiano.")
            return False
        
        return True
    except Exception as e:
        log_message(f"✗ Eccezione durante la ricerca ibrida con query in italiano: {str(e)}")
        return False

async def main():
    """Funzione principale che esegue tutti i test."""
    log_message("=== INIZIO TEST API RICERCA ALIMENTI ===")
    
    # Test USDA API
    usda_ok = await test_usda_api()
    log_message(f"Test API USDA: {'SUCCESSO' if usda_ok else 'FALLITO'}")
    
    # Test Edamam API
    edamam_ok = await test_edamam_api()
    log_message(f"Test API Edamam: {'SUCCESSO' if edamam_ok else 'FALLITO'}")
    
    # Test servizio ibrido con query in inglese
    hybrid_en_ok = await test_hybrid_with_english_query()
    log_message(f"Test servizio ibrido (EN): {'SUCCESSO' if hybrid_en_ok else 'FALLITO'}")
    
    # Test servizio ibrido con query in italiano
    hybrid_it_ok = await test_hybrid_with_italian_query()
    log_message(f"Test servizio ibrido (IT): {'SUCCESSO' if hybrid_it_ok else 'FALLITO'}")
    
    # Riepilogo
    log_message("\n=== RIEPILOGO TEST ===")
    log_message(f"API USDA: {'✓' if usda_ok else '✗'}")
    log_message(f"API Edamam: {'✓' if edamam_ok else '✗'}")
    log_message(f"Servizio ibrido (EN): {'✓' if hybrid_en_ok else '✗'}")
    log_message(f"Servizio ibrido (IT): {'✓' if hybrid_it_ok else '✗'}")
    
    # Verifica delle chiavi API
    log_message("\n=== VERIFICA CONFIGURAZIONE ===")
    log_message(f"USDA_API_KEY configurata: {'✓' if os.getenv('USDA_API_KEY') else '✗'}")
    log_message(f"EDAMAM_APP_ID configurato: {'✓' if os.getenv('EDAMAM_APP_ID') else '✗'}")
    log_message(f"EDAMAM_APP_KEY configurato: {'✓' if os.getenv('EDAMAM_APP_KEY') else '✗'}")
    
    log_message("=== FINE TEST API ===")

if __name__ == "__main__":
    asyncio.run(main())
