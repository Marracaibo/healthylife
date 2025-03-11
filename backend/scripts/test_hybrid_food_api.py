#!/usr/bin/env python3
"""
Script per testare l'API di ricerca alimentare ibrida con supporto multilingue.
Questo script permette di testare rapidamente l'endpoint hybrid-food
e verificare la traduzione automatica delle query in italiano.
"""

import httpx
import asyncio
import sys
import os
from pathlib import Path
import json

# Aggiungi il percorso principale alla variabile d'ambiente
backend_dir = Path(__file__).parent.parent
if str(backend_dir) not in sys.path:
    sys.path.append(str(backend_dir))

from services.translation_service import translation_service

# Configurazione
API_BASE_URL = "http://localhost:8000/api/hybrid-food"
TEST_QUERIES = [
    "pane",
    "mela",
    "pasta integrale",
    "pollo arrosto",
    "pizza margherita",
    "risotto ai funghi",
    "acqua",
    "formaggio",
    "vino rosso",
    "olio d'oliva"
]

async def test_api_query(query: str) -> dict:
    """Testa l'API con una query specifica."""
    url = f"{API_BASE_URL}/search"
    params = {
        "query": query,
        "max_results": 5,
        "use_cache": True
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        return {"error": str(e)}

async def verify_translation(query: str) -> dict:
    """Verifica la traduzione locale per confrontarla con l'API."""
    translated = translation_service.translate_query(query)
    is_italian = translation_service.is_italian_query(query)
    
    return {
        "query": query,
        "translated": translated,
        "detected_as_italian": is_italian,
        "changed": translated.lower() != query.lower()
    }

async def main():
    """Funzione principale per testare l'API."""
    print("\n=== TEST DELL'API DI RICERCA ALIMENTARE IBRIDA ===\n")
    
    results = []
    
    for query in TEST_QUERIES:
        print(f"Testing query: '{query}'")
        
        # Verifica la traduzione locale
        translation_result = await verify_translation(query)
        
        # Esegui la query all'API
        try:
            api_result = await test_api_query(query)
            
            # Estrai informazioni rilevanti
            metadata = api_result.get("metadata", {})
            foods_count = len(api_result.get("results", []))
            
            # Confronta i risultati
            result = {
                "query": query,
                "local_translation": translation_result["translated"],
                "api_translation": metadata.get("translated_query"),
                "detected_as_italian": {
                    "local": translation_result["detected_as_italian"],
                    "api": metadata.get("was_translated", False)
                },
                "foods_found": foods_count,
                "api_response": "success" if "results" in api_result else "error"
            }
            
            results.append(result)
            
            # Stampa risultato
            print(f"  → Traduzione locale: '{translation_result['translated']}'")
            print(f"  → Traduzione API: '{metadata.get('translated_query')}'")
            print(f"  → Rilevato come italiano: Locale={translation_result['detected_as_italian']}, API={metadata.get('was_translated', False)}")
            print(f"  → Alimenti trovati: {foods_count}")
            print("  → Risultato: " + ("✓ Successo" if "results" in api_result else "✗ Errore"))
            print()
            
        except Exception as e:
            print(f"  → Errore durante il test: {str(e)}")
            results.append({
                "query": query,
                "error": str(e)
            })
    
    # Salva risultati in un file JSON
    output_file = backend_dir / "logs" / "hybrid_food_api_test.json"
    os.makedirs(output_file.parent, exist_ok=True)
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\nTest completati! Risultati salvati in: {output_file}")

if __name__ == "__main__":
    asyncio.run(main())
