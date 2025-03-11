"""
Test di ricerca con termini italiani per verificare il funzionamento della traduzione.

Questo script testa sia query in inglese che in italiano per confrontare i risultati.
"""

import asyncio
import os
import json
import time
from dotenv import load_dotenv
from services.hybrid_food_service import HybridFoodService
from services.translation_service import translation_service

# Carica le variabili d'ambiente
load_dotenv()

# Log function
def log_message(message):
    print(f"[{time.strftime('%H:%M:%S')}] {message}")

async def test_translation_service():
    """Test del servizio di traduzione su diverse query in italiano."""
    log_message("=== TEST DEL SERVIZIO DI TRADUZIONE ===")
    
    test_queries = [
        "mela", 
        "pasta al pomodoro", 
        "pollo arrosto", 
        "formaggio fresco",
        "caffè espresso",
        "prosciutto crudo",
        "pizza margherita",
        "pane integrale"
    ]
    
    for query in test_queries:
        is_italian = translation_service.is_italian_query(query)
        translated = translation_service.translate_query(query)
        
        log_message(f"Query: '{query}'")
        log_message(f"È italiano? {is_italian}")
        log_message(f"Traduzione: '{translated}'")
        log_message("-" * 50)

async def compare_search_results(hybrid_service, italian_query, expected_english_query):
    """Confronta i risultati di ricerca tra una query in italiano e il suo equivalente in inglese."""
    log_message(f"=== CONFRONTO RICERCA: '{italian_query}' vs '{expected_english_query}' ===")
    
    # Ricerca con termine italiano
    start_time = time.time()
    italian_results = await hybrid_service.search_food(italian_query)
    italian_time = time.time() - start_time
    
    # Ricerca con termine inglese
    start_time = time.time()
    english_results = await hybrid_service.search_food(expected_english_query)
    english_time = time.time() - start_time
    
    # Analisi dei risultati
    it_count = italian_results["total_results"]
    en_count = english_results["total_results"]
    it_source = italian_results["source"]
    en_source = english_results["source"]
    
    log_message(f"Risultati per '{italian_query}': {it_count} da {it_source} in {italian_time:.2f}s")
    log_message(f"Risultati per '{expected_english_query}': {en_count} da {en_source} in {english_time:.2f}s")
    
    # Verifica corrispondenza
    match_ratio = 0
    if it_count > 0 and en_count > 0:
        # Conta quanti risultati del termine italiano sono presenti anche nei risultati inglesi
        it_ids = set([item["id"] for item in italian_results["results"][:10]])  # Primi 10 risultati
        en_ids = set([item["id"] for item in english_results["results"][:10]])
        
        common_ids = it_ids.intersection(en_ids)
        match_ratio = len(common_ids) / min(len(it_ids), len(en_ids))
        
        log_message(f"Corrispondenza risultati: {len(common_ids)}/{min(len(it_ids), len(en_ids))} ({match_ratio:.2%})")
    else:
        log_message("Impossibile confrontare i risultati: almeno una ricerca non ha prodotto risultati")
    
    # Mostra primi risultati
    if it_count > 0:
        log_message(f"Primo risultato in italiano: {italian_results['results'][0]['name']}")
    if en_count > 0:
        log_message(f"Primo risultato in inglese: {english_results['results'][0]['name']}")
    
    log_message("-" * 70)
    
    return {
        "italian_query": italian_query,
        "english_query": expected_english_query,
        "italian_results": it_count,
        "english_results": en_count,
        "match_ratio": match_ratio
    }

async def main():
    """Funzione principale che esegue tutti i test."""
    log_message("=== INIZIO TEST RICERCA IN ITALIANO ===")
    
    # Test del servizio di traduzione
    await test_translation_service()
    
    # Test di confronto tra ricerche in italiano e inglese
    hybrid_service = HybridFoodService()
    
    test_pairs = [
        ("mela", "apple"),
        ("pasta", "pasta"),
        ("pollo", "chicken"),
        ("formaggio", "cheese"),
        ("pane", "bread"),
        ("latte", "milk"),
        ("vino", "wine"),
        ("pizza", "pizza")
    ]
    
    comparison_results = []
    
    for italian, english in test_pairs:
        result = await compare_search_results(hybrid_service, italian, english)
        comparison_results.append(result)
    
    # Riepilogo dei risultati
    log_message("\n=== RIEPILOGO CONFRONTO RICERCHE ===")
    log_message(f"{'Termine IT':<15} {'Termine EN':<15} {'Risultati IT':<15} {'Risultati EN':<15} {'Corrispondenza':<15}")
    log_message("-" * 75)
    
    for result in comparison_results:
        log_message(f"{result['italian_query']:<15} {result['english_query']:<15} {result['italian_results']:<15} {result['english_results']:<15} {result['match_ratio']:.2%}")
    
    log_message("=== FINE TEST RICERCA IN ITALIANO ===")

if __name__ == "__main__":
    asyncio.run(main())
