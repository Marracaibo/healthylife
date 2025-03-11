import os
from database import engine, Base
from models.meal_plan import MealPlan

def recreate_database():
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("Database ricreato con successo!")

if __name__ == "__main__":
    # Check if database file exists
    db_path = "healthylife.db"
    if os.path.exists(db_path):
        print(f"File database esistente trovato: {db_path}")
    
    # Recreate database
    recreate_database()
