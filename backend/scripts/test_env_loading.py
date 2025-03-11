"""
Test di caricamento delle variabili d'ambiente e delle API alimentari
"""
import asyncio
import os
import sys
from pathlib import Path

# Aggiungi la directory principale al path per le importazioni
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from app.services.food_api_service import search_usda_foods, search_edamam_foods

async def test_api_calls():
    print("=== TEST VARIABILI D'AMBIENTE E API ALIMENTARI ===")
    
    # Leggi e mostra lo stato delle variabili d'ambiente
    use_edamam_only = os.getenv("USE_EDAMAM_ONLY", "false").lower() == "true"
    use_edamam_aggregated = os.getenv("USE_EDAMAM_AGGREGATED", "true").lower() == "true" 
    use_enhanced_edamam = os.getenv("USE_ENHANCED_EDAMAM", "true").lower() == "true"
    
    usda_api_key = os.getenv("USDA_API_KEY")
    edamam_app_id = os.getenv("EDAMAM_APP_ID")
    edamam_app_key = os.getenv("EDAMAM_APP_KEY")
    
    print("\n=== CONFIGURAZIONE ===")
    print(f"USE_EDAMAM_ONLY = {use_edamam_only}")
    print(f"USE_EDAMAM_AGGREGATED = {use_edamam_aggregated}")
    print(f"USE_ENHANCED_EDAMAM = {use_enhanced_edamam}")
    print(f"USDA_API_KEY = {'PRESENTE' if usda_api_key else 'NON PRESENTE'}")
    print(f"EDAMAM_APP_ID = {'PRESENTE' if edamam_app_id else 'NON PRESENTE'}")
    print(f"EDAMAM_APP_KEY = {'PRESENTE' if edamam_app_key else 'NON PRESENTE'}")
    
    # Test con query semplice
    query = "banana"
    print(f"\n=== TEST DI RICERCA PER '{query}' ===")
    
    # Test USDA API
    if usda_api_key:
        print("\nRicerca con USDA API...")
        try:
            usda_results = await search_usda_foods(query, 5, usda_api_key)
            print(f"Risultati USDA: {len(usda_results)}")
            if usda_results:
                print("Primi 3 risultati USDA:")
                for i, result in enumerate(usda_results[:3]):
                    print(f"{i+1}. {result.get('name')} ({result.get('source')})")
            else:
                print("Nessun risultato da USDA")
        except Exception as e:
            print(f"Errore nella ricerca USDA: {str(e)}")
    
    # Test Edamam API
    if edamam_app_id and edamam_app_key:
        print("\nRicerca con Edamam API...")
        try:
            edamam_results = await search_edamam_foods(query, 5, edamam_app_id, edamam_app_key)
            print(f"Risultati Edamam: {len(edamam_results)}")
            if edamam_results:
                print("Primi 3 risultati Edamam:")
                for i, result in enumerate(edamam_results[:3]):
                    print(f"{i+1}. {result.get('name')} ({result.get('source')})")
            else:
                print("Nessun risultato da Edamam")
        except Exception as e:
            print(f"Errore nella ricerca Edamam: {str(e)}")
    
    print("\n=== TEST COMPLETATO ===")

if __name__ == "__main__":
    asyncio.run(test_api_calls())
