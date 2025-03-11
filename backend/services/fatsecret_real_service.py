import os
import json
import time
import logging
import hmac
import hashlib
import base64
import urllib.parse
import requests
import random
import string
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Configurazione API FatSecret
FATSECRET_KEY = os.environ.get("FATSECRET_CLIENT_ID", "ec9eca046ec44dd281a8c3c409211f7d")
FATSECRET_SECRET = os.environ.get("FATSECRET_CLIENT_SECRET", "4fa804f604ab42dc81c5996da43a4b7b")


def search_foods_api(query: str, max_results: int = 5) -> List[Dict]:
    """
    Cerca alimenti utilizzando l'API REST di FatSecret.
    Implementazione semplice ma funzionale.
    """
    logger.info(f"FatSecret API: Ricerca di '{query}' con max_results={max_results}")
    
    # Parametri per OAuth 2.0 (client credentials flow)
    token_url = "https://oauth.fatsecret.com/connect/token"
    
    # Prepara l'autenticazione
    auth_data = {
        "grant_type": "client_credentials",
        "scope": "basic"
    }
    
    try:
        # Ottieni token
        response = requests.post(
            token_url,
            auth=(FATSECRET_KEY, FATSECRET_SECRET),
            data=auth_data
        )
        
        if response.status_code != 200:
            logger.error(f"Errore nell'ottenere il token: {response.status_code} - {response.text}")
            return []
        
        token_data = response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            logger.error("Token non trovato nella risposta")
            return []
        
        # Cerca alimenti con il token
        search_url = "https://platform.fatsecret.com/rest/server.api"
        
        # Parametri di ricerca
        search_params = {
            "method": "foods.search",
            "search_expression": query,
            "max_results": max_results,
            "format": "json"
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        search_response = requests.get(search_url, params=search_params, headers=headers)
        
        if search_response.status_code != 200:
            logger.error(f"Errore nella ricerca: {search_response.status_code} - {search_response.text}")
            return []
        
        results = search_response.json()
        
        # Stampa i risultati per debug
        print(f"Risultati grezzi: {json.dumps(results, indent=2)}")
        
        # Estrai e normalizza i risultati
        foods = []
        
        if 'foods' in results and 'food' in results['foods']:
            food_results = results['foods']['food']
            
            # Verifica se è un singolo elemento o una lista
            if not isinstance(food_results, list):
                food_results = [food_results]
            
            for food in food_results:
                food_id = food.get("food_id", "")
                food_name = food.get("food_name", "")
                
                # Determina il brand
                brand = food.get("brand_name", "Generic")
                if not brand or brand == "":
                    food_type = food.get("food_type", "")
                    brand = food_type if food_type and food_type != "Generic" else "Generic"
                
                # Estrai la descrizione
                description = food.get("food_description", "")
                
                # Estrai informazioni nutrizionali dalla descrizione
                nutrition = {}
                if description:
                    parts = description.split("|")
                    for part in parts:
                        part = part.strip()
                        if "Calories:" in part:
                            calories = part.replace("Calories:", "").strip()
                            nutrition["calories"] = calories
                        elif "Fat:" in part:
                            fat = part.replace("Fat:", "").strip()
                            nutrition["fat"] = fat
                        elif "Carbs:" in part:
                            carbs = part.replace("Carbs:", "").strip()
                            nutrition["carbs"] = carbs
                        elif "Protein:" in part:
                            protein = part.replace("Protein:", "").strip()
                            nutrition["protein"] = protein
                
                foods.append({
                    "food_id": food_id,
                    "food_name": food_name,
                    "brand_name": brand,
                    "food_description": description,
                    "nutrition": nutrition
                })
        
        return foods
        
    except Exception as e:
        logger.error(f"Errore durante la ricerca FatSecret: {e}")
        return []


def get_food_details_api(food_id: str) -> Dict[str, Any]:
    """
    Ottiene i dettagli di un alimento specifico tramite l'API FatSecret.
    """
    logger.info(f"FatSecret API: Ottengo dettagli per food_id={food_id}")
    
    # Parametri per OAuth 2.0 (client credentials flow)
    token_url = "https://oauth.fatsecret.com/connect/token"
    
    # Prepara l'autenticazione
    auth_data = {
        "grant_type": "client_credentials",
        "scope": "basic"
    }
    
    try:
        # Ottieni token
        response = requests.post(
            token_url,
            auth=(FATSECRET_KEY, FATSECRET_SECRET),
            data=auth_data
        )
        
        if response.status_code != 200:
            logger.error(f"Errore nell'ottenere il token: {response.status_code} - {response.text}")
            return {}
        
        token_data = response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            logger.error("Token non trovato nella risposta")
            return {}
        
        # Ottieni dettagli con il token
        details_url = "https://platform.fatsecret.com/rest/server.api"
        
        # Parametri per i dettagli
        details_params = {
            "method": "food.get.v2",
            "food_id": food_id,
            "format": "json"
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        details_response = requests.get(details_url, params=details_params, headers=headers)
        
        if details_response.status_code != 200:
            logger.error(f"Errore nell'ottenere i dettagli: {details_response.status_code} - {details_response.text}")
            return {}
        
        food_data = details_response.json()
        
        # Stampa i risultati per debug
        print(f"Dettagli grezzi: {json.dumps(food_data, indent=2)}")
        
        # Estrai e normalizza i dettagli
        if "food" in food_data:
            food = food_data["food"]
            food_name = food.get("food_name", "")
            food_type = food.get("food_type", "")
            brand = food.get("brand_name", "Generic")
            
            # Informazioni nutrizionali dettagliate
            nutrition = {}
            servings = []
            
            if "servings" in food and "serving" in food["servings"]:
                servings_data = food["servings"]["serving"]
                if not isinstance(servings_data, list):
                    servings_data = [servings_data]
                
                servings = servings_data
                
                # Usa la porzione per 100g se disponibile
                std_serving = None
                for s in servings_data:
                    if s.get("serving_description", "").lower() == "100g" or \
                       (s.get("metric_serving_amount", "") == "100" and s.get("metric_serving_unit", "") == "g"):
                        std_serving = s
                        break
                
                # Altrimenti usa la prima porzione
                if not std_serving and servings_data:
                    std_serving = servings_data[0]
                
                if std_serving:
                    nutrition = {
                        "calories": std_serving.get("calories", "0"),
                        "fat": std_serving.get("fat", "0"),
                        "saturated_fat": std_serving.get("saturated_fat", "0"),
                        "polyunsaturated_fat": std_serving.get("polyunsaturated_fat", "0"),
                        "monounsaturated_fat": std_serving.get("monounsaturated_fat", "0"),
                        "carbs": std_serving.get("carbohydrate", "0"),
                        "sugar": std_serving.get("sugar", "0"),
                        "fiber": std_serving.get("fiber", "0"),
                        "protein": std_serving.get("protein", "0"),
                        "sodium": std_serving.get("sodium", "0"),
                        "potassium": std_serving.get("potassium", "0"),
                        "cholesterol": std_serving.get("cholesterol", "0"),
                        "serving_size": std_serving.get("metric_serving_amount", "100"),
                        "serving_unit": std_serving.get("metric_serving_unit", "g"),
                        "serving_description": std_serving.get("serving_description", "100g")
                    }
            
            return {
                "food_id": food_id,
                "food_name": food_name,
                "food_type": food_type,
                "brand_name": brand,
                "servings": servings,
                "nutrition": nutrition,
                "source": "fatsecret"
            }
        
        return {}
        
    except Exception as e:
        logger.error(f"Errore durante il recupero dettagli FatSecret: {e}")
        return {}
