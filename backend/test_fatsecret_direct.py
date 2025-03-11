import os
import sys
import json
import logging

# Configura logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Importa il servizio da testare
from services.fatsecret_real_service import search_foods_api, get_food_details_api

def main():
    # Esegui test di ricerca
    query = "yogurt"
    max_results = 5
    
    print(f"\nRicerca di '{query}' con max_results={max_results}...\n")
    
    try:
        results = search_foods_api(query, max_results)
        
        print(f"Trovati {len(results)} risultati.\n")
        
        # Mostra risultati
        for i, food in enumerate(results, 1):
            print(f"Risultato {i}:")
            print(f"  ID: {food.get('food_id')}")
            print(f"  Nome: {food.get('food_name')}")
            print(f"  Brand: {food.get('brand_name')}")
            print(f"  Descrizione: {food.get('food_description')}")
            print(f"  Nutrizione: {food.get('nutrition', {})}")
            print()
            
            # Se abbiamo almeno un risultato, testiamo anche i dettagli
            if i == 1:
                food_id = food.get('food_id')
                if food_id:
                    print(f"\nOttengo dettagli per l'alimento con ID {food_id}...")
                    details = get_food_details_api(food_id)
                    
                    if details:
                        print(f"  Nome: {details.get('food_name')}")
                        print(f"  Brand/Tipo: {details.get('brand_name') or details.get('food_type', 'Generico')}")
                        
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
