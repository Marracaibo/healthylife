"""
Test completo per il servizio ibrido di ricerca alimenti
"""
import requests
import json
import time

# URL base del servizio
base_url = "http://localhost:8000/api/hybrid-food"

# Test con termini in italiano e inglese
test_queries = [
    {"query": "bread", "description": "Termine inglese semplice (pane)"},
    {"query": "pane", "description": "Termine italiano semplice (pane)"},
    {"query": "mela", "description": "Termine italiano semplice (mela)"},
    {"query": "pasta", "description": "Termine italiano semplice (pasta)"},
    {"query": "formaggio", "description": "Termine italiano semplice (formaggio)"},
    {"query": "pomodoro", "description": "Termine italiano semplice (pomodoro)"},
    {"query": "carne", "description": "Termine italiano semplice (carne)"},
    {"query": "pane integrale", "description": "Termine italiano composto (pane integrale)"},
    {"query": "pasta al pomodoro", "description": "Frase italiana (pasta al pomodoro)"}
]

# Funzione per eseguire il test e formattare il risultato
def test_query(query_data):
    query = query_data["query"]
    description = query_data["description"]
    
    print(f"\n=== Test: {description} ===")
    print(f"Query: '{query}'")
    
    start_time = time.time()
    response = requests.get(f"{base_url}/search?query={query}")
    end_time = time.time()
    
    execution_time = round((end_time - start_time) * 1000, 2)
    
    if response.status_code == 200:
        data = response.json()
        results = data.get("results", [])
        metadata = data.get("metadata", {})
        
        # Controlla se la query è stata tradotta
        original_query = metadata.get("original_query", "")
        translated_query = metadata.get("translated_query", "")
        was_translated = metadata.get("was_translated", False)
        
        print(f"Stato: OK (codice {response.status_code})")
        print(f"Tempo di esecuzione: {execution_time} ms")
        print(f"Numero di risultati: {len(results)}")
        
        if was_translated:
            print(f"Query originale: '{original_query}'")
            print(f"Query tradotta: '{translated_query}'")
        
        # Conta i risultati per fonte
        usda_count = sum(1 for r in results if r.get("source") == "usda")
        edamam_count = sum(1 for r in results if r.get("source") == "edamam")
        
        print(f"Risultati USDA: {usda_count}")
        print(f"Risultati Edamam: {edamam_count}")
        
        if results:
            print("\nPrimi 3 risultati:")
            for i, result in enumerate(results[:3]):
                print(f"{i+1}. {result.get('name', 'N/A')} ({result.get('source', 'N/A')})")
        else:
            print("Nessun risultato trovato")
    else:
        print(f"Errore: {response.status_code}")
        print(response.text)

# Esegui tutti i test
print("=== TEST COMPLETO DEL SERVIZIO IBRIDO DI RICERCA ALIMENTI ===")
for query_data in test_queries:
    test_query(query_data)
    # Attendi un po' per evitare troppe richieste
    time.sleep(0.5)

print("\n=== TEST COMPLETATO ===")
