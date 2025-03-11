"""
Script di verifica delle API per il servizio ibrido di ricerca alimenti

Questo script verifica:
1. Il caricamento delle variabili d'ambiente
2. Il test di entrambe le API (USDA e Edamam)
3. Test di traduzione italiano-inglese
4. Test della ricerca di cibi in italiano che vengono tradotti
"""

import os
import sys
import asyncio
import logging
from pathlib import Path

# Configura logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Aggiungi il percorso principale alla variabile d'ambiente per permettere l'importazione
backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

# Importa i servizi
from dotenv import load_dotenv
from app.services.food_api_service import search_usda_foods, search_edamam_foods
from app.services.translation_service import translate_food_query, is_italian

# Carica le variabili d'ambiente
load_dotenv()

async def test_apis():
    """Test delle API di ricerca cibo e traduzione"""
    
    # Caricamento variabili d'ambiente
    usda_api_key = os.getenv("USDA_API_KEY")
    edamam_app_id = os.getenv("EDAMAM_APP_ID")
    edamam_app_key = os.getenv("EDAMAM_APP_KEY")
    
    # Verifica delle variabili
    print("\n=== CONFIGURAZIONE VARIABILI D'AMBIENTE ===")
    print(f"USDA_API_KEY: {'PRESENTE' if usda_api_key else 'MANCANTE'}")
    print(f"EDAMAM_APP_ID: {'PRESENTE' if edamam_app_id else 'MANCANTE'}")
    print(f"EDAMAM_APP_KEY: {'PRESENTE' if edamam_app_key else 'MANCANTE'}")
    
    # Test flag di configurazione
    print("\n=== FLAG DI CONFIGURAZIONE ===")
    use_edamam_only = os.getenv("USE_EDAMAM_ONLY", "false").lower() == "true"
    use_edamam_aggregated = os.getenv("USE_EDAMAM_AGGREGATED", "true").lower() == "true" 
    use_enhanced_edamam = os.getenv("USE_ENHANCED_EDAMAM", "true").lower() == "true"
    print(f"USE_EDAMAM_ONLY = {use_edamam_only}")
    print(f"USE_EDAMAM_AGGREGATED = {use_edamam_aggregated}")
    print(f"USE_ENHANCED_EDAMAM = {use_enhanced_edamam}")
    
    # Test di traduzione
    print("\n=== TEST SERVIZIO DI TRADUZIONE ===")
    test_terms = [
        "pane", 
        "pasta al pomodoro", 
        "caffè", 
        "pizza margherita", 
        "zucchine ripiene"
    ]
    
    for term in test_terms:
        translated = translate_food_query(term)
        is_ita = is_italian(term)
        print(f"'{term}' -> '{translated}' (Italiano: {is_ita})")
    
    # Test di ricerca in italiano e inglese
    print("\n=== TEST DI RICERCA USDA ===")
    if usda_api_key:
        # Test in inglese
        print("\nRicerca in inglese: 'bread'")
        results_en = await search_usda_foods("bread", 3, usda_api_key)
        print(f"Risultati trovati: {len(results_en)}")
        for i, result in enumerate(results_en):
            print(f"{i+1}. {result['name']} ({result['source']})")
        
        # Test in italiano
        print("\nRicerca in italiano: 'pane'")
        # Prima traduciamo
        translated_query = translate_food_query("pane")
        print(f"Tradotto: 'pane' -> '{translated_query}'")
        results_it = await search_usda_foods(translated_query, 3, usda_api_key)
        print(f"Risultati trovati: {len(results_it)}")
        for i, result in enumerate(results_it):
            print(f"{i+1}. {result['name']} ({result['source']})")
    else:
        print("Impossibile testare USDA API: chiave API mancante")
    
    # Test Edamam
    print("\n=== TEST DI RICERCA EDAMAM ===")
    if edamam_app_id and edamam_app_key:
        # Test in inglese
        print("\nRicerca in inglese: 'pasta'")
        results_en = await search_edamam_foods("pasta", 3, edamam_app_id, edamam_app_key)
        print(f"Risultati trovati: {len(results_en)}")
        for i, result in enumerate(results_en):
            print(f"{i+1}. {result['name']} ({result['source']})")
        
        # Test in italiano
        print("\nRicerca in italiano: 'pasta al pomodoro'")
        # Prima traduciamo
        translated_query = translate_food_query("pasta al pomodoro")
        print(f"Tradotto: 'pasta al pomodoro' -> '{translated_query}'")
        results_it = await search_edamam_foods(translated_query, 3, edamam_app_id, edamam_app_key)
        print(f"Risultati trovati: {len(results_it)}")
        for i, result in enumerate(results_it):
            print(f"{i+1}. {result['name']} ({result['source']})")
    else:
        print("Impossibile testare Edamam API: credenziali mancanti")
    
    print("\n=== TEST COMPLETATO ===")

if __name__ == "__main__":
    asyncio.run(test_apis())
