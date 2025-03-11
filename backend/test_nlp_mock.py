import json
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Form, Body
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

# Carica le variabili d'ambiente
load_dotenv()

# Crea un router separato con prefix diverso per evitare conflitti
router = APIRouter()

# Configura il template per l'interfaccia di test
templates = Jinja2Templates(directory="static")

@router.get("/api/nlp-mock", response_class=HTMLResponse)
async def get_test_page(request: Request):
    """Serve la pagina HTML per testare l'API NLP simulata"""
    return templates.TemplateResponse("test_nlp_mock.html", {"request": request})

@router.post("/api/nlp-mock/process")
async def nlp_mock_process(user_input: str = Form(...)):
    """Elabora l'input dell'utente e restituisce una risposta simulata"""
    try:
        # Genera risposta simulata
        response = get_mock_response(user_input)
        
        # Aggiungi informazioni di diagnostica
        response["_debug"] = {
            "input_received": user_input,
            "input_length": len(user_input),
            "service": "mock_nlp"
        }
        
        return JSONResponse(response)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

# Definisci i dati di esempio per simulare la risposta dell'API NLP
MOCK_NLP_RESPONSES = {
    "pizza": {
        "foods": [
            {
                "id": "12345",
                "name": "Pizza Margherita",
                "brand": "Pizzeria Napoletana",
                "description": "Pizza tradizionale con pomodoro, mozzarella e basilico",
                "serving_description": "1 fetta (150g)",
                "nutrition": {
                    "calories": 285,
                    "protein": 12.3,
                    "carbohydrate": 35.6,
                    "fat": 9.8
                }
            }
        ]
    },
    "coca cola": {
        "foods": [
            {
                "id": "67890",
                "name": "Coca Cola",
                "brand": "Coca-Cola Company",
                "description": "Bevanda gassata",
                "serving_description": "1 lattina (330ml)",
                "nutrition": {
                    "calories": 139,
                    "protein": 0,
                    "carbohydrate": 35.0,
                    "fat": 0
                }
            }
        ]
    },
    "default": {
        "foods": [
            {
                "id": "11111",
                "name": "Alimento generico",
                "brand": "Generico",
                "description": "Descrizione di esempio",
                "serving_description": "100g",
                "nutrition": {
                    "calories": 100,
                    "protein": 5,
                    "carbohydrate": 10,
                    "fat": 5
                }
            }
        ]
    }
}

def get_mock_response(user_input):
    """Genera una risposta simulata basata sull'input dell'utente"""
    # Analizza l'input in modo semplicistico
    foods_found = []
    lower_input = user_input.lower()
    
    # Cerca alimenti comuni nell'input
    for keyword in MOCK_NLP_RESPONSES.keys():
        if keyword in lower_input and keyword != "default":
            foods_found.extend(MOCK_NLP_RESPONSES[keyword]["foods"])
    
    # Se non trova nulla, usa la risposta default
    if not foods_found:
        foods_found = MOCK_NLP_RESPONSES["default"]["foods"]
    
    return {"foods": foods_found}
