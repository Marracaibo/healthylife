import requests
import os
import json
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

def test_food_database_api():
    """
    Script per testare l'API Food Database di Edamam.
    
    Per utilizzare questo script, è necessario registrare un'applicazione su Edamam
    specificamente per la Food Database API e aggiungere le credenziali al file .env:
    
    EDAMAM_FOOD_APP_ID=your_food_app_id
    EDAMAM_FOOD_APP_KEY=your_food_app_key
    """
    
    # Ottieni le credenziali dal file .env
    app_id = os.getenv("EDAMAM_FOOD_APP_ID")
    app_key = os.getenv("EDAMAM_FOOD_APP_KEY")
    
    if not app_id or not app_key:
        print("Credenziali mancanti. Aggiungi EDAMAM_FOOD_APP_ID e EDAMAM_FOOD_APP_KEY al file .env")
        print("Puoi ottenere queste credenziali registrando un'applicazione su https://developer.edamam.com/food-database-api")
        return
    
    # Endpoint per la Food Database API
    url = "https://api.edamam.com/api/food-database/v2/parser"
    
    # Alimenti da testare
    foods = ["banana", "mela", "pane", "pasta", "riso", "pollo", "uova", "latte"]
    
    for food in foods:
        print(f"\n=== Testando: {food.upper()} ===")
        
        # Parametri della richiesta
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "ingr": food
        }
        
        # Effettua la richiesta
        response = requests.get(url, params=params)
        
        # Verifica lo stato della risposta
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Salva i risultati in un file JSON
            os.makedirs("food_test_results", exist_ok=True)
            with open(f"food_test_results/{food}_results.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Mostra i risultati
            if "hints" in data and len(data["hints"]) > 0:
                print(f"Trovati {len(data['hints'])} risultati")
                
                # Mostra i primi 3 risultati
                for i, hint in enumerate(data["hints"][:3]):
                    food_item = hint.get("food", {})
                    print(f"  {i+1}. {food_item.get('label', 'N/A')} - {food_item.get('category', 'N/A')}")
                    
                    # Mostra i nutrienti principali
                    nutrients = food_item.get("nutrients", {})
                    if nutrients:
                        print(f"     Calorie: {nutrients.get('ENERC_KCAL', 0):.1f} kcal")
                        print(f"     Proteine: {nutrients.get('PROCNT', 0):.1f} g")
                        print(f"     Grassi: {nutrients.get('FAT', 0):.1f} g")
                        print(f"     Carboidrati: {nutrients.get('CHOCDF', 0):.1f} g")
            else:
                print("Nessun risultato trovato")
        else:
            print(f"Errore: {response.text}")

if __name__ == "__main__":
    test_food_database_api()
