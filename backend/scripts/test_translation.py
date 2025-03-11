#!/usr/bin/env python
"""
Script di test per il servizio di traduzione di termini alimentari.
Questo script può essere utilizzato per testare manualmente il funzionamento 
del servizio di traduzione con diversi termini alimentari italiani.
"""

import sys
import os
import json
from pathlib import Path

# Aggiungiamo la directory principale al path di Python
script_dir = Path(__file__).resolve().parent
backend_dir = script_dir.parent
sys.path.append(str(backend_dir))

try:
    from services.translation_service import translate_food_query, is_italian, ITALIAN_TO_ENGLISH_FOOD_TERMS
except ImportError:
    print("Errore: Impossibile importare il servizio di traduzione.")
    print(f"Assicurati che il percorso sia corretto: {backend_dir}")
    sys.exit(1)

def test_translation(query):
    """Testa la traduzione di una query alimentare."""
    is_it = is_italian(query)
    translated = translate_food_query(query)
    
    print(f"\nQuery originale: '{query}'")
    print(f"Rilevato come italiano: {'Sì' if is_it else 'No'}")
    print(f"Traduzione: '{translated}'")
    
    if query == translated and is_it:
        print("NOTA: La query non è stata tradotta pur essendo in italiano.")
        print("Questo potrebbe indicare che alcuni termini non sono presenti nel dizionario.")

def test_multiple_queries():
    """Testa la traduzione su più query predefinite."""
    test_queries = [
        # Termini base
        "pomodoro",
        "mela",
        "carne",
        
        # Frasi semplici
        "pasta al pomodoro",
        "insalata fresca",
        "petto di pollo",
        
        # Frasi complesse
        "risotto ai funghi porcini",
        "insalata caprese con pomodori e mozzarella",
        "parmigiana di melanzane",
        
        # Termini regionali o specifici
        "arancini",
        "cannoli siciliani",
        "guanciale",
        
        # Termini che potrebbero non essere nel dizionario
        "cassoeula",
        "scamorza",
        "caciucco",
        
        # Frasi miste italiano/inglese
        "chicken alla cacciatora",
        "frozen pizza margherita"
    ]
    
    for query in test_queries:
        test_translation(query)
        print("-" * 50)

def interactive_test():
    """Modalità interattiva per testare la traduzione."""
    print("\n=== Test Interattivo del Servizio di Traduzione ===")
    print("Inserisci termini alimentari in italiano per vedere la traduzione.")
    print("Scrivi 'exit', 'quit' o 'q' per uscire.")
    
    while True:
        query = input("\nInserisci un termine alimentare: ").strip()
        
        if query.lower() in ["exit", "quit", "q"]:
            break
            
        if not query:
            continue
            
        test_translation(query)

def display_dictionary_stats():
    """Mostra statistiche sul dizionario di traduzione."""
    categories = {}
    total_terms = 0
    
    # Contiamo i termini per categoria
    for key, value in ITALIAN_TO_ENGLISH_FOOD_TERMS.items():
        category = "Generale"
        
        # Categorizziamo in base a commenti nel codice
        if "verdur" in key or "carota" in key or "pomodor" in key:
            category = "Verdure e ortaggi"
        elif "frutta" in key or "mela" in key or "pera" in key or "banana" in key:
            category = "Frutta"
        elif "carne" in key or "pollo" in key or "manzo" in key:
            category = "Carni e proteine"
        elif "pasta" in key or "riso" in key or "pane" in key:
            category = "Cereali e farinacei"
        elif "latte" in key or "formaggio" in key or "yogurt" in key:
            category = "Latticini"
        elif "spezia" in key or "erba" in key or "basilico" in key:
            category = "Erbe e spezie"
        elif "cottura" in key or "bollito" in key or "fritto" in key:
            category = "Metodi di cottura"
        elif "lasagne" in key or "pizza" in key or "risotto" in key:
            category = "Piatti tipici"
            
        if category not in categories:
            categories[category] = 0
        
        categories[category] += 1
        total_terms += 1
    
    # Stampiamo le statistiche
    print("\n=== Statistiche del Dizionario di Traduzione ===")
    print(f"Totale termini nel dizionario: {total_terms}")
    print("\nDistribuzione per categoria:")
    
    for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / total_terms) * 100
        print(f"- {category}: {count} termini ({percentage:.1f}%)")

def main():
    """Funzione principale che gestisce le opzioni di test."""
    if len(sys.argv) > 1:
        # Se ci sono argomenti, li usiamo come query da testare
        for query in sys.argv[1:]:
            test_translation(query)
    else:
        # Altrimenti mostriamo un menu
        print("\n=== Test del Servizio di Traduzione Alimentare ===")
        print("1. Test con esempi predefiniti")
        print("2. Test interattivo (inserisci i tuoi termini)")
        print("3. Mostra statistiche del dizionario")
        print("4. Esci")
        
        choice = input("\nScegli un'opzione (1-4): ").strip()
        
        if choice == "1":
            test_multiple_queries()
        elif choice == "2":
            interactive_test()
        elif choice == "3":
            display_dictionary_stats()
        elif choice == "4":
            print("Arrivederci!")
        else:
            print("Opzione non valida.")

if __name__ == "__main__":
    main()
