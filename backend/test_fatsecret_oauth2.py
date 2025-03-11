import os
import sys
import json
import logging

# Configura logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Importa il servizio da testare
from services.fatsecret_oauth2_service import search_foods, get_food_details

def main():
    # Stampa le credenziali (oscurate) per debug
    client_id = os.environ.get("FATSECRET_CLIENT_ID", "non impostato")
    client_secret = os.environ.get("FATSECRET_CLIENT_SECRET", "non impostato")
    
    print(f"FATSECRET_CLIENT_ID: {'*' * (len(client_id) - 4) + client_id[-4:] if client_id != 'non impostato' else 'non impostato'}")
    print(f"FATSECRET_CLIENT_SECRET: {'*' * (len(client_secret) - 4) + client_secret[-4:] if client_secret != 'non impostato' else 'non impostato'}")
    
    # Esegui test di ricerca
    query = "pasta barilla"
    max_results = 5
    
    print(f"\nRicerca di '{query}' con max_results={max_results}...\n")
    
    try:
        results = search_foods(query, max_results)
        
        print(f"Trovati {len(results)} risultati.\n")
        
        # Mostra risultati
        for i, food in enumerate(results, 1):
            print(f"Risultato {i}:")
            print(f"  ID: {food.get('food_id')}")
            print(f"  Nome: {food.get('food_name')}")
            print(f"  Brand: {food.get('brand')}")
            print(f"  Descrizione: {food.get('description', '')}")
            print(f"  Nutrizione: {food.get('nutrition', {})}")
            print()
            
            # Se abbiamo almeno un risultato, testiamo anche i dettagli
            if i == 1:
                food_id = food.get('food_id')
                if food_id:
                    print(f"\nOttengo dettagli per l'alimento con ID {food_id}...")
                    details = get_food_details(food_id)
                    
                    if details:
                        print(f"  Nome: {details.get('food_name')}")
                        print(f"  Brand/Tipo: {details.get('brand') or details.get('food_type', 'Generico')}")
                        
                        # Mostra informazioni nutrizionali
                        nutrition = details.get('nutrition', {})
                        if nutrition:
                            print("  Informazioni nutrizionali (per 100g o porzione standard):")
                            print(f"    Calorie: {nutrition.get('calories')}")
                            print(f"    Grassi: {nutrition.get('fat')}")
                            print(f"    Carboidrati: {nutrition.get('carbs')}")
                            print(f"    Proteine: {nutrition.get('protein')}")
                    else:
                        print("  Nessun dettaglio trovato")
    
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
