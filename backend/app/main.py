from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Carica esplicitamente le variabili d'ambiente all'avvio dell'app
load_dotenv()

# Aggiungi il percorso principale alla variabile d'ambiente per permettere l'importazione dalla directory services
backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from .routers import meal_plan_templates, measurements, achievements, hybrid_food, meal_plans
from .database import engine, Base
from services.config_validator import validate_on_startup

# Configurazione del logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

app = FastAPI(title="HealthyLifeApp API", description="Backend API for the HealthyLifeApp", version="0.1.0")

# Configurazione CORS per permettere le richieste dal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Valida la configurazione all'avvio
@app.on_event("startup")
async def startup_event():
    logger.info("Verifica della configurazione in corso...")
    config_valid = validate_on_startup()
    if not config_valid:
        logger.warning("L'applicazione è in esecuzione con una configurazione incompleta. Alcune funzionalità potrebbero non funzionare correttamente.")

# Registra i router
app.include_router(meal_plan_templates.router, prefix="/api/meal-plan-templates", tags=["templates"])
app.include_router(measurements.router, prefix="/api/measurements", tags=["measurements"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
app.include_router(hybrid_food.router, prefix="/api/hybrid-food", tags=["hybrid-food"])
app.include_router(meal_plans.router, prefix="/api/meal-plans", tags=["meal-plans"])

# Print out all registered routes for debugging
for route in app.routes:
    logger.info(f"Route: {route.path}, Methods: {route.methods}")

@app.get("/")
async def root():
    return {"message": "Benvenuto all'API di HealthyLifeApp"}
