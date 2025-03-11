from typing import Dict

def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    """
    Calcola il Metabolismo Basale usando la formula di Harris-Benedict
    """
    if gender.lower() == "m":
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

def calculate_tdee(bmr: float, activity_level: str) -> float:
    """
    Calcola il Fabbisogno Energetico Totale Giornaliero
    """
    activity_multipliers = {
        "sedentary": 1.2,      # Poco o nessun esercizio
        "light": 1.375,        # Esercizio leggero 1-3 volte/settimana
        "moderate": 1.55,      # Esercizio moderato 3-5 volte/settimana
        "very_active": 1.725,  # Esercizio intenso 6-7 volte/settimana
        "extra_active": 1.9    # Esercizio molto intenso e lavoro fisico
    }
    return bmr * activity_multipliers.get(activity_level, 1.2)

def calculate_daily_calories(tdee: float, goal: str) -> int:
    """
    Calcola le calorie giornaliere in base all'obiettivo
    """
    adjustments = {
        "weight_loss": -500,    # Deficit calorico per perdita peso
        "maintenance": 0,       # Mantenimento
        "muscle_gain": 300      # Surplus calorico per aumento massa
    }
    return int(tdee + adjustments.get(goal, 0))

def calculate_macros(daily_calories: int, goal: str) -> Dict[str, int]:
    """
    Calcola la distribuzione dei macronutrienti in base all'obiettivo
    """
    if goal == "weight_loss":
        protein_pct = 0.40  # 40% proteine
        fat_pct = 0.30     # 30% grassi
        carb_pct = 0.30    # 30% carboidrati
    elif goal == "muscle_gain":
        protein_pct = 0.30  # 30% proteine
        fat_pct = 0.25     # 25% grassi
        carb_pct = 0.45    # 45% carboidrati
    else:  # maintenance
        protein_pct = 0.30  # 30% proteine
        fat_pct = 0.30     # 30% grassi
        carb_pct = 0.40    # 40% carboidrati
    
    protein_cals = daily_calories * protein_pct
    fat_cals = daily_calories * fat_pct
    carb_cals = daily_calories * carb_pct
    
    return {
        "protein": int(protein_cals / 4),  # 4 cal/g per le proteine
        "fat": int(fat_cals / 9),         # 9 cal/g per i grassi
        "carbs": int(carb_cals / 4)       # 4 cal/g per i carboidrati
    }

def generate_meal_plan(daily_calories: int, macros: Dict[str, int], restrictions: list) -> Dict:
    """
    Genera un piano alimentare giornaliero base
    """
    # Distribuzione delle calorie per pasto
    meal_distribution = {
        "breakfast": 0.25,    # 25% delle calorie totali
        "lunch": 0.35,       # 35% delle calorie totali
        "dinner": 0.30,      # 30% delle calorie totali
        "snacks": 0.10       # 10% delle calorie totali
    }
    
    meal_plan = {}
    for meal, percentage in meal_distribution.items():
        meal_calories = int(daily_calories * percentage)
        meal_plan[meal] = {
            "calories": meal_calories,
            "protein": int(macros["protein"] * percentage),
            "fat": int(macros["fat"] * percentage),
            "carbs": int(macros["carbs"] * percentage)
        }
    
    return meal_plan
