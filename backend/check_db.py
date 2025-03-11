from database import SessionLocal
from models.meal_plan import MealPlan

def check_database():
    db = SessionLocal()
    try:
        # Get all meal plans
        meal_plans = db.query(MealPlan).all()
        print(f"\nFound {len(meal_plans)} meal plans:")
        for plan in meal_plans:
            print(f"\nPlan ID: {plan.id}")
            print(f"Name: {plan.name}")
            print(f"Goal: {plan.goal}")
            print(f"Calories: {plan.calories_target}")
            print(f"Template Name: {plan.template_name}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()
