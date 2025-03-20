import json
import subprocess
import os
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
import sys
import time
import re
import platform

# Configura il logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('ai_service.log')
    ]
)
logger = logging.getLogger(__name__)

class OllamaError(Exception):
    """Errore specifico per problemi con Ollama"""
    pass

class AIService:
    def __init__(self, model: str = "mistral"):
        self.model = model
        # Imposta il percorso di Ollama in base al sistema operativo
        if platform.system() == "Windows":
            self.ollama_path = r"C:\Users\39351\AppData\Local\Programs\Ollama\ollama.exe"
        else:
            # Su Linux (come Render) impostiamo un percorso fittizio
            # e disabilitiamo l'uso di Ollama
            self.ollama_path = "/usr/local/bin/ollama"
            self.is_render = True
        
        logger.info(f"AIService inizializzato con modello: {model}")
        
        # Aggiungiamo un flag per verificare se siamo su Render
        self.is_render = "RENDER" in os.environ
        
        # Solo se non siamo su Render, verifichiamo Ollama
        if not self.is_render:
            self._check_ollama_status()
        else:
            logger.info("Esecuzione su Render: Ollama disabilitato")

    def _check_ollama_status(self):
        """Verifica lo stato di Ollama"""
        try:
            logger.info("Verifica dello stato di Ollama...")
            if not os.path.exists(self.ollama_path):
                raise OllamaError(f"Ollama non trovato in: {self.ollama_path}")

            # Verifica se Ollama è in esecuzione
            try:
                subprocess.run([self.ollama_path, "list"], capture_output=True, check=True)
                logger.info("Ollama è già in esecuzione")
            except subprocess.CalledProcessError:
                logger.info("Avvio del servizio Ollama...")
                subprocess.Popen([self.ollama_path, "serve"], 
                               creationflags=subprocess.CREATE_NO_WINDOW)
                time.sleep(2)  # Attendi che il servizio si avvii

            # Verifica che il modello sia disponibile
            result = subprocess.run([self.ollama_path, "list"], capture_output=True, text=True)
            if self.model not in result.stdout:
                logger.info(f"Download del modello {self.model}...")
                subprocess.run([self.ollama_path, "pull", self.model], check=True)
                logger.info(f"Modello {self.model} scaricato con successo")

        except Exception as e:
            logger.error(f"Errore nell'inizializzazione di Ollama: {str(e)}")
            raise OllamaError(str(e))

    def _generate_response(self, prompt: str) -> str:
        """Genera una risposta utilizzando Ollama"""
        # Se siamo su Render, restituisci una risposta predefinita
        if hasattr(self, 'is_render') and self.is_render:
            logger.info("Esecuzione su Render: utilizzo risposta simulata")
            return "{\
  \"message\": \"Funzionalità AI non disponibile nell'ambiente di deployment\",\
  \"status\": \"unavailable\"\
}"
            
        try:
            logger.info("Invio richiesta a Ollama...")
            
            result = subprocess.run(
                [self.ollama_path, "run", self.model, prompt],
                capture_output=True,
                text=True,
                check=True
            )
            
            response = result.stdout.strip()
            logger.info("Risposta ricevuta da Ollama")
            logger.info("=" * 50)
            logger.info(response)
            logger.info("=" * 50)
            
            return response
                
        except subprocess.CalledProcessError as e:
            logger.error(f"Errore nell'esecuzione di Ollama: {e.stderr}")
            raise OllamaError(f"Errore nell'esecuzione di Ollama: {e.stderr}")
        except Exception as e:
            logger.error(f"Errore nella generazione della risposta: {str(e)}")
            raise OllamaError(f"Errore nella generazione della risposta: {str(e)}")

    def _parse_meal_response(self, response: str) -> Dict[str, Any]:
        """Converte la risposta dell'AI in un dizionario strutturato"""
        try:
            # Cerca di trovare il JSON nella risposta
            start = response.find('{')
            end = response.rfind('}') + 1
            if start == -1 or end == 0:
                raise ValueError("Nessun JSON trovato nella risposta")
            
            json_str = response[start:end]
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"Errore nel parsing della risposta JSON: {str(e)}")
            raise ValueError(f"Risposta non valida: {str(e)}")

    async def generate_weekly_meal_plan(
        self,
        goal: str,
        calories_target: int,
        macros: Dict[str, int],
        dietary_restrictions: List[str],
        start_date: datetime
    ) -> Dict[str, Any]:
        """Genera un piano alimentare settimanale"""
        # Se siamo su Render, restituisci un piano alimentare predefinito
        if hasattr(self, 'is_render') and self.is_render:
            logger.info("Esecuzione su Render: utilizzo piano alimentare predefinito")
            return {
                "message": "Funzionalità AI non disponibile nell'ambiente di deployment",
                "status": "unavailable",
                "plan": [
                    {
                        "day": 1,
                        "date": start_date.strftime("%Y-%m-%d"),
                        "meals": [
                            {
                                "name": "Colazione",
                                "time": "08:00",
                                "foods": [
                                    {"name": "Esempio cibo", "amount": "100g", "calories": 300}
                                ]
                            }
                        ]
                    }
                ]
            }
            
        try:
            logger.info(f"Inizio generazione piano alimentare per obiettivo: {goal}")
            
            prompt = f"""Create a meal plan with {calories_target} calories per day.

Format each meal exactly like this (no variations):
Day 1:
- Breakfast (8:00):
  * Oatmeal, 100g, 300 cal
  * Banana, 1 unit, 100 cal
- Lunch (13:00):
  * Chicken breast, 150g, 250 cal
  * Brown rice, 100g, 130 cal
- Dinner (20:00):
  * Salmon fillet, 200g, 400 cal
  * Sweet potato, 150g, 150 cal

Create 7 days of meals. Each meal must have exactly this format:
1. Start with "Day X:"
2. Each meal line starts with "- " followed by meal name and time in parentheses
3. Each food item starts with "* " followed by name, amount, and calories
4. Calories must always be written as a number followed by " cal"

Total daily calories should be around {calories_target}."""

            logger.info("Invio prompt a Ollama...")
            response = self._generate_response(prompt)
            
            logger.info("Parsing della risposta...")
            # Convertiamo la risposta in JSON
            days = []
            current_day = None
            current_meals = []
            current_meal = None
            
            logger.info("Inizio parsing della risposta")
            for line in response.split('\n'):
                line = line.strip()
                if not line:
                    continue
                    
                logger.info(f"Linea: {line}")
                    
                if line.startswith('Day '):
                    logger.info(f"Trovato nuovo giorno: {line}")
                    if current_day is not None and current_meals:  
                        days.append({
                            'date': (start_date + timedelta(days=len(days))).strftime('%Y-%m-%d'),
                            'meals': current_meals.copy()  
                        })
                    current_meals = []
                    current_day = line
                    current_meal = None
                    
                elif line.startswith('- '):
                    # Nuovo pasto
                    logger.info(f"Trovato nuovo pasto: {line}")
                    meal_info = line.strip('- ')
                    
                    # Estrai il tipo di pasto e l'orario
                    if '(' in meal_info and ')' in meal_info:
                        meal_type = meal_info[:meal_info.find('(')].strip()
                        time = meal_info[meal_info.find('(')+1:meal_info.find(')')].strip()
                    else:
                        meal_type = meal_info.strip()
                        time = {
                            'breakfast': '08:00',
                            'morning snack': '10:30',
                            'lunch': '13:00',
                            'afternoon snack': '16:30',
                            'dinner': '20:00'
                        }.get(meal_type.lower(), '12:00')
                    
                    current_meal = {
                        'type': meal_type.lower().replace(' ', '_'),
                        'time': time,
                        'foods': [],
                        'total_calories': 0,
                        'macros': {
                            'protein': 0,
                            'carbs': 0,
                            'fat': 0
                        }
                    }
                    current_meals.append(current_meal)
                    
                elif line.startswith('*') and current_meal is not None:
                    # Nuovo cibo
                    logger.info(f"Trovato nuovo cibo: {line}")
                    food_info = line.strip('* ')
                    
                    # Estrai le calorie (l'ultimo numero seguito da "cal")
                    calories_match = re.search(r'(\d+)\s*cal\b', food_info)
                    calories = int(calories_match.group(1)) if calories_match else 0
                    
                    # Estrai nome e quantità (tutto prima delle calorie)
                    food_name_qty = food_info[:food_info.rfind(',')].strip() if ',' in food_info else food_info
                    
                    # Stima dei macronutrienti basata sulle calorie
                    # Distribuzione standard: 25% proteine, 50% carboidrati, 25% grassi
                    protein_cals = calories * 0.25
                    carbs_cals = calories * 0.5
                    fat_cals = calories * 0.25
                    
                    # Converti calorie in grammi (4 cal/g per proteine e carboidrati, 9 cal/g per grassi)
                    protein_g = round(protein_cals / 4, 1)
                    carbs_g = round(carbs_cals / 4, 1)
                    fat_g = round(fat_cals / 9, 1)
                    
                    food_item = {
                        'name': food_name_qty,
                        'calories': calories,
                        'protein': protein_g,
                        'carbs': carbs_g,
                        'fat': fat_g
                    }
                    
                    current_meal['foods'].append(food_item)
                    current_meal['total_calories'] += calories
                    current_meal['macros']['protein'] += protein_g
                    current_meal['macros']['carbs'] += carbs_g
                    current_meal['macros']['fat'] += fat_g
            
            # Aggiungi l'ultimo giorno se ci sono pasti
            if current_meals:
                days.append({
                    'date': (start_date + timedelta(days=len(days))).strftime('%Y-%m-%d'),
                    'meals': current_meals.copy()
                })
            
            logger.info(f"Piano generato con {len(days)} giorni")
            logger.info(f"Giorni: {json.dumps(days, indent=2)}")
            
            return {
                "days": days
            }
            
        except Exception as e:
            logger.error(f"Errore nella generazione del piano: {str(e)}")
            logger.error("Traceback:", exc_info=True)
            raise OllamaError(f"Errore nella generazione del piano: {str(e)}")

    async def generate_meal_plan_by_goal(
        self,
        goal: str,
        calories_target: int,
        dietary_restrictions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Genera un piano alimentare giornaliero basato sull'obiettivo"""
        # Determina la distribuzione dei macronutrienti in base all'obiettivo
        macros = {
            "weight_loss": {"proteine": 30, "carboidrati": 40, "grassi": 30},
            "muscle_gain": {"proteine": 35, "carboidrati": 45, "grassi": 20},
            "maintenance": {"proteine": 25, "carboidrati": 50, "grassi": 25},
            "general_health": {"proteine": 20, "carboidrati": 55, "grassi": 25}
        }.get(goal, {"proteine": 25, "carboidrati": 50, "grassi": 25})

        # Genera il piano settimanale
        return await self.generate_weekly_meal_plan(
            goal=goal,
            calories_target=calories_target,
            macros=macros,
            dietary_restrictions=dietary_restrictions or [],
            start_date=datetime.now()
        )

ai_service = AIService()
