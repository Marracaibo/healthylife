from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import logging
import traceback
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
import time
import os
import json
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

from database import get_db, engine, Base, SessionLocal
from models.meal_plan import MealPlan
from crud import meal_plan as meal_plan_crud
from routers import meal_plan_templates
from routers import fatsecret
from routers import hybrid_food_service  # Router ottimizzato per alimenti italiani
from routers import fatsecret_test  # Router per test FatSecret
from routers import fatsecret_direct_test  # Router per test diretto FatSecret
from routers import fatsecret_oauth2_test  # Router per test OAuth2 FatSecret
from routers import test_nlp_service  # Router per test dell'API NLP di FatSecret
from routers.food_search_v2 import router as food_search_v2_router  # Importa il nuovo router di ricerca alimenti v2
from routers.nlp_service import router as nlp_service_router  # Importa il router per l'API NLP
from routers.image_recognition_service import router as image_recognition_router  # Importa il router per l'API Image Recognition
from ai_service import AIService
from test_nlp_mock import router as test_nlp_mock_router
from cors_config import configure_cors  # Importa la configurazione CORS

# Configurazione del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crea le tabelle del database
Base.metadata.create_all(bind=engine)

# Crea un piano pasti di esempio se non ce ne sono
def create_example_meal_plan():
    db = SessionLocal()
    try:
        # Verifica se ci sono già piani pasti
        existing_plan = meal_plan_crud.get_latest_meal_plan(db)
        if not existing_plan:
            example_plan = {
                "name": "Piano Settimanale di Esempio",
                "goal": "Mantenimento del peso",
                "calories_target": 2000,
                "macros": {
                    "proteine": 30,
                    "carboidrati": 40,
                    "grassi": 30
                },
                "dietary_restrictions": ["vegetariano"],
                "start_date": datetime.now().isoformat(),
                "days": [
                    {
                        "date": (datetime.now()).isoformat(),
                        "meals": [
                            {
                                "name": "Colazione",
                                "type": "breakfast",
                                "time": "08:00",
                                "foods": ["Yogurt greco", "Muesli", "Banana"],
                                "calories": 400
                            }
                        ],
                        "totalCalories": 400
                    }
                ]
            }
            meal_plan_crud.create_meal_plan(db, example_plan)
    finally:
        db.close()

def create_default_templates():
    db = SessionLocal()
    try:
        # Verifica se ci sono già dei template
        existing_templates = db.query(MealPlan).filter(MealPlan.template_name.isnot(None)).all()
        if not existing_templates:
            templates = [
                {
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
                    "template_name": "mediterranea",
                    "days": [
                        {
                            "meals": [
                                {
                                    "name": "Colazione",
                                    "foods": ["Yogurt greco", "Miele", "Frutta secca"],
                                    "time": "08:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Mandorle", "Mela"],
                                    "time": "10:30"
                                },
                                {
                                    "name": "Pranzo",
                                    "foods": ["Quinoa", "Ceci", "Pomodorini", "Feta", "Olio EVO"],
                                    "time": "13:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Pane integrale", "Hummus"],
                                    "time": "16:30"
                                },
                                {
                                    "name": "Cena",
                                    "foods": ["Pesce azzurro", "Verdure grigliate", "Patate dolci"],
                                    "time": "20:00"
                                }
                            ]
                        }
                    ]
                },
                {
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
                    "template_name": "arnold",
                    "days": [
                        {
                            "meals": [
                                {
                                    "name": "Colazione",
                                    "foods": ["Uova strapazzate", "Pane integrale", "Avocado"],
                                    "time": "07:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Frullato proteico", "Banana"],
                                    "time": "10:00"
                                },
                                {
                                    "name": "Pranzo",
                                    "foods": ["Pollo alla griglia", "Riso", "Broccoli"],
                                    "time": "13:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Fiocchi di latte", "Miele"],
                                    "time": "16:00"
                                },
                                {
                                    "name": "Cena",
                                    "foods": ["Salmone", "Patate dolci", "Asparagi"],
                                    "time": "19:00"
                                }
                            ]
                        }
                    ]
                },
                {
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
                    "template_name": "ipocalorica",
                    "days": [
                        {
                            "meals": [
                                {
                                    "name": "Colazione",
                                    "foods": ["Porridge di avena", "Frutti di bosco"],
                                    "time": "08:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Yogurt greco", "Frutta fresca"],
                                    "time": "10:30"
                                },
                                {
                                    "name": "Pranzo",
                                    "foods": ["Tonno", "Insalata mista", "Ceci"],
                                    "time": "13:00"
                                },
                                {
                                    "name": "Spuntino",
                                    "foods": ["Noci"],
                                    "time": "16:30"
                                },
                                {
                                    "name": "Cena",
                                    "foods": ["Petto di pollo", "Zucchine", "Quinoa"],
                                    "time": "19:30"
                                }
                            ]
                        }
                    ]
                }
            ]
            
            for template_data in templates:
                # Convertiamo i campi JSON in stringhe prima di passarli al modello
                if isinstance(template_data.get("macros"), dict):
                    template_data["macros"] = json.dumps(template_data["macros"])
                
                if isinstance(template_data.get("dietary_restrictions"), list):
                    template_data["dietary_restrictions"] = json.dumps(template_data["dietary_restrictions"])
                
                if isinstance(template_data.get("days"), list):
                    template_data["days"] = json.dumps(template_data["days"])
                
                template = MealPlan(**template_data)
                db.add(template)
            
            db.commit()
            logger.info("Template predefiniti creati con successo")
    except Exception as e:
        logger.error(f"Errore durante la creazione dei template predefiniti: {str(e)}")
        db.rollback()
    finally:
        db.close()

create_example_meal_plan()
create_default_templates()

app = FastAPI(
    title="HealthyLifeApp API",
    description="API per l'applicazione HealthyLifeApp",
    version="0.1.0"
)

# Configurazione CORS con il nostro modulo personalizzato
# Questo permetterà richieste dal frontend deployato su Firebase
allow_origins = [
    "http://localhost:5173",  # Sviluppo locale
    "http://localhost:5174",  # Sviluppo locale (porta alternativa)
    "http://localhost:5175",  # Sviluppo locale (porta alternativa)
    "http://localhost:5176",  # Sviluppo locale (porta alternativa)
    "https://healthylife-app.web.app",  # Dominio Firebase principale
    "https://healthylife-app.firebaseapp.com",  # Dominio Firebase alternativo
    "https://healthylife-backend.onrender.com",  # Backend su Render
    "https://healthylife-b86d3.web.app"  # Nuovo dominio Firebase
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# Crea la directory cache se non esiste
os.makedirs("cache", exist_ok=True)

# Includi i router
app.include_router(meal_plan_templates.router)
app.include_router(fatsecret.router)
# app.include_router(hybrid_food_service.router)  # Router ottimizzato per alimenti italiani - DISABILITATO PER CONFLITTO DI ROUTING
app.include_router(fatsecret_test.router)
app.include_router(fatsecret_direct_test.router)
app.include_router(fatsecret_oauth2_test.router)
app.include_router(test_nlp_service.router)  # Router per test dell'API NLP di FatSecret
app.include_router(food_search_v2_router)  # Include il router nella app
app.include_router(test_nlp_mock_router)
app.include_router(nlp_service_router, prefix="/api/nlp")  # Include il router per l'API NLP
app.include_router(image_recognition_router, prefix="/api/image-recognition")  # Include il router per l'API Image Recognition

# Istanzia il servizio AI
ai_service = AIService()

class MealPlanRequest(BaseModel):
    goal: str
    calories_target: int
    macros: dict
    dietary_restrictions: List[str] = []
    start_date: datetime

# Crea un router per i piani alimentari
router = APIRouter(prefix="/api")

# Salva un piano alimentare (sia generato che manuale)
@router.post("/meal-plans")
async def save_meal_plan(meal_plan: dict, db: Session = Depends(get_db)):
    """Salva un piano alimentare nel database"""
    try:
        logger.info(f"Salvataggio piano alimentare: {meal_plan.get('name', 'Senza nome')}")
        db_meal_plan = meal_plan_crud.create_meal_plan(db, meal_plan)
        return db_meal_plan.to_dict()
    except Exception as e:
        logger.error(f"Errore nel salvataggio del piano: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# Genera un piano alimentare con AI
@router.post("/meal-plans/generate")
async def generate_meal_plan(request: MealPlanRequest):
    """Genera un piano alimentare con AI (senza salvarlo)"""
    try:
        logger.info("Generazione piano con AI")
        meal_plan = await ai_service.generate_weekly_meal_plan(
            goal=request.goal,
            calories_target=request.calories_target,
            macros=request.macros,
            dietary_restrictions=request.dietary_restrictions,
            start_date=request.start_date
        )
        return meal_plan
    except Exception as e:
        logger.error(f"Errore nella generazione del piano: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# Recupera tutti i piani alimentari
@router.get("/meal-plans")
async def get_meal_plans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Recupera tutti i piani alimentari salvati"""
    try:
        plans = meal_plan_crud.get_meal_plans(db, skip=skip, limit=limit)
        return [plan.to_dict() for plan in plans]
    except Exception as e:
        logger.error(f"Errore nel recupero dei piani: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Recupera un piano alimentare specifico
@router.get("/meal-plans/{meal_plan_id}")
async def get_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    """Recupera un piano alimentare specifico"""
    try:
        plan = meal_plan_crud.get_meal_plan(db, meal_plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Piano non trovato")
        return plan.to_dict()
    except Exception as e:
        logger.error(f"Errore nel recupero del piano {meal_plan_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Recupera il piano settimanale corrente
@router.get("/meal-plans/weekly")
async def get_weekly_plan(db: Session = Depends(get_db)):
    """Recupera il piano settimanale più recente"""
    try:
        plan = meal_plan_crud.get_latest_meal_plan(db)
        if not plan:
            raise HTTPException(status_code=404, detail="Nessun piano settimanale trovato")
        return plan.to_dict()
    except Exception as e:
        logger.error(f"Errore nel recupero del piano settimanale: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Aggiorna un piano alimentare
@router.put("/meal-plans/{meal_plan_id}")
async def update_meal_plan(meal_plan_id: int, meal_plan_data: dict, db: Session = Depends(get_db)):
    """Aggiorna un piano alimentare"""
    updated_plan = meal_plan_crud.update_meal_plan(db, meal_plan_id, meal_plan_data)
    if not updated_plan:
        raise HTTPException(status_code=404, detail="Piano non trovato")
    return updated_plan.to_dict()

# Elimina un piano alimentare
@router.delete("/meal-plans/{meal_plan_id}")
async def delete_meal_plan(meal_plan_id: int, db: Session = Depends(get_db)):
    """Elimina un piano alimentare"""
    success = meal_plan_crud.delete_meal_plan(db, meal_plan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Piano non trovato")
    return {"message": "Piano eliminato con successo"}

# Includi il router nell'app
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "HealthyLifeApp API"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "version": "0.1.0"
    }

# Endpoint per ottenere i template
@app.get("/meal-plan-templates")
def get_templates(db: Session = Depends(get_db)):
    try:
        templates = db.query(MealPlan).filter(MealPlan.template_name.isnot(None)).all()
        return templates
    except Exception as e:
        logger.error(f"Errore durante il recupero dei template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Aggiungiamo un endpoint di fallback per FatSecret
@app.get("/fatsecret-test")
async def fatsecret_test_fallback():
    """
    Endpoint di fallback per il test di FatSecret
    """
    from datetime import datetime
    import os
    
    # Verifica se stiamo usando il mock o l'API reale
    is_mock = os.getenv("USE_MOCK_FATSECRET", "false").lower() in ["true", "1", "yes"]
    
    # Raccoglie informazioni di diagnostica
    env_vars = {
        "USE_MOCK_FATSECRET": os.getenv("USE_MOCK_FATSECRET", "non impostato"),
        "FATSECRET_CONSUMER_KEY": "***" if os.getenv("FATSECRET_CONSUMER_KEY") else "non impostato",
        "FATSECRET_CONSUMER_SECRET": "***" if os.getenv("FATSECRET_CONSUMER_SECRET") else "non impostato",
    }
    
    return {
        "status": "success",
        "using_mock": is_mock,
        "environment": env_vars,
        "search_test": "non eseguito (fallback)",
        "note": "Questo è un endpoint di fallback. L'endpoint di test principale non è disponibile.",
        "test_time": datetime.now().isoformat()
    }

# Aggiungi endpoint per servire file statici
@app.get("/test-fatsecret")
async def test_fatsecret_page():
    """Serve la pagina HTML di test per FatSecret API"""
    return FileResponse("static/test_fatsecret.html")

@app.get("/test-hybrid-food")
async def test_hybrid_food_page():
    """Serve la pagina HTML di test per il servizio ibrido di ricerca alimenti"""
    return FileResponse("static/test_hybrid_food.html")

@app.get("/test-direct-oauth2")
async def test_direct_oauth2_page():
    """Serve la pagina HTML di test diretto per FatSecret OAuth 2.0"""
    return FileResponse("static/test_direct_oauth2.html")

@app.get("/test-food-search-v2", response_class=FileResponse)
async def test_food_search_v2_page():
    """Serve la pagina HTML di test per il nuovo servizio di ricerca alimenti v2"""
    return FileResponse("templates/test_food_search_v2.html")

# Serve la pagina HTML di test per l'API NLP
@app.get("/nlp-test", response_class=HTMLResponse)
def nlp_test_page():
    """Serve la pagina HTML di test per la nuova API NLP di FatSecret"""
    return FileResponse("static/nlp_test.html")

# Serve la pagina HTML di test per l'API Image Recognition
@app.get("/test-image-recognition", response_class=HTMLResponse)
def image_recognition_test_page():
    """Serve la pagina HTML di test per l'API Image Recognition di FatSecret"""
    return FileResponse("static/image_recognition_test.html")

# Monta i file statici
import os

# Verifica se le directory statiche esistono, altrimenti le crea
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
    print(f"Creata directory statica: {static_dir}")

templates_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")
if not os.path.exists(templates_dir):
    os.makedirs(templates_dir)
    print(f"Creata directory templates: {templates_dir}")

# Monta i file statici
app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.mount("/templates", StaticFiles(directory=templates_dir), name="templates")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
