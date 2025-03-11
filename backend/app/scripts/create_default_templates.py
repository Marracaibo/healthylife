from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, SQLALCHEMY_DATABASE_URL
from app.models.meal_plan_template import MealPlanTemplate
from datetime import datetime, timedelta

# Use the same database URL as in database.py
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_default_templates():
    db = SessionLocal()
    
    # Template Dieta Mediterranea
    mediterranean = {
        "name": "Dieta Mediterranea",
        "description": "Dieta equilibrata, ricca di grassi sani e antiossidanti",
        "goal": "mantenimento",
        "calories_target": 2000,
        "macros": {
            "protein": 20,
            "carbs": 50,
            "fat": 30
        },
        "dietary_restrictions": [],
        "days": [
            {
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "meals": [
                    {
                        "name": "Colazione",
                        "foods": [
                            {"name": "Pane integrale", "amount": "60g", "calories": 150},
                            {"name": "Olio d'oliva", "amount": "10g", "calories": 90},
                            {"name": "Pomodori", "amount": "100g", "calories": 20}
                        ]
                    },
                    {
                        "name": "Pranzo",
                        "foods": [
                            {"name": "Pasta integrale", "amount": "80g", "calories": 280},
                            {"name": "Legumi", "amount": "150g", "calories": 180},
                            {"name": "Verdure miste", "amount": "200g", "calories": 50}
                        ]
                    },
                    {
                        "name": "Cena",
                        "foods": [
                            {"name": "Pesce", "amount": "150g", "calories": 200},
                            {"name": "Insalata mista", "amount": "150g", "calories": 30},
                            {"name": "Frutta", "amount": "150g", "calories": 60}
                        ]
                    }
                ]
            } for i in range(7)
        ]
    }

    # Template Dieta Iperproteica
    high_protein = {
        "name": "Dieta Iperproteica (Stile Arnold)",
        "description": "Alta in proteine e calorie per la massa muscolare",
        "goal": "massa muscolare",
        "calories_target": 3000,
        "macros": {
            "protein": 40,
            "carbs": 40,
            "fat": 20
        },
        "dietary_restrictions": [],
        "days": [
            {
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "meals": [
                    {
                        "name": "Colazione",
                        "foods": [
                            {"name": "Uova", "amount": "200g", "calories": 300},
                            {"name": "Avena", "amount": "100g", "calories": 350},
                            {"name": "Proteine in polvere", "amount": "30g", "calories": 120}
                        ]
                    },
                    {
                        "name": "Pranzo",
                        "foods": [
                            {"name": "Petto di pollo", "amount": "200g", "calories": 330},
                            {"name": "Riso", "amount": "150g", "calories": 180},
                            {"name": "Broccoli", "amount": "200g", "calories": 70}
                        ]
                    },
                    {
                        "name": "Cena",
                        "foods": [
                            {"name": "Salmone", "amount": "200g", "calories": 400},
                            {"name": "Patate dolci", "amount": "200g", "calories": 180},
                            {"name": "Spinaci", "amount": "150g", "calories": 35}
                        ]
                    }
                ]
            } for i in range(7)
        ]
    }

    # Template Dieta Ipocalorica
    low_calorie = {
        "name": "Dieta Ipocalorica",
        "description": "Per la definizione e il dimagrimento",
        "goal": "dimagrimento",
        "calories_target": 1500,
        "macros": {
            "protein": 40,
            "carbs": 40,
            "fat": 20
        },
        "dietary_restrictions": [],
        "days": [
            {
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "meals": [
                    {
                        "name": "Colazione",
                        "foods": [
                            {"name": "Yogurt greco", "amount": "150g", "calories": 130},
                            {"name": "Frutti di bosco", "amount": "100g", "calories": 50},
                            {"name": "Fiocchi d'avena", "amount": "30g", "calories": 120}
                        ]
                    },
                    {
                        "name": "Pranzo",
                        "foods": [
                            {"name": "Petto di tacchino", "amount": "120g", "calories": 180},
                            {"name": "Quinoa", "amount": "60g", "calories": 120},
                            {"name": "Verdure grigliate", "amount": "200g", "calories": 60}
                        ]
                    },
                    {
                        "name": "Cena",
                        "foods": [
                            {"name": "Merluzzo", "amount": "150g", "calories": 140},
                            {"name": "Zucchine", "amount": "200g", "calories": 40},
                            {"name": "Insalata mista", "amount": "100g", "calories": 20}
                        ]
                    }
                ]
            } for i in range(7)
        ]
    }

    # Crea i template nel database
    templates = [mediterranean, high_protein, low_calorie]
    for template_data in templates:
        template = MealPlanTemplate(**template_data)
        db.add(template)
    
    db.commit()
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    create_default_templates()
