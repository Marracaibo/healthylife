from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import os
from dotenv import load_dotenv
import json
import requests
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from services.fatsecret_oauth2_service import FatSecretOAuth2Service

# Carica le variabili d'ambiente
load_dotenv()

# Configura il router
router = APIRouter(
    prefix="/api/nlp-test",  # Cambiato il prefix per evitare conflitti
    tags=["nlp-test"]
)

# Configura i templates
templates = Jinja2Templates(directory="static")

# Modello per la richiesta NLP
class NlpRequest(BaseModel):
    user_input: str
    region: str = "Italy"
    language: str = "it"
    include_food_data: bool = True
    eaten_foods: Optional[List[Dict[str, Any]]] = None

# Servizio FatSecret
fatsecret_service = FatSecretOAuth2Service()

@router.get("/", response_class=HTMLResponse)
async def test_page(request: Request):
    """Pagina di test per la ricerca NLP"""
    return templates.TemplateResponse(
        "test_nlp.html",
        {"request": request}
    )

@router.post("/search", response_class=JSONResponse)
async def nlp_search(nlp_request: NlpRequest):
    """API per la ricerca di alimenti con Natural Language Processing"""
    try:
        # Ottieni un token OAuth2 con scope nlp
        token = fatsecret_service.get_oauth2_token(scope="nlp")
        
        # Prepara la richiesta per l'API NLP
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        # Converte il modello Pydantic in dict per la richiesta
        payload = nlp_request.model_dump()
        
        # Effettua la richiesta all'API NLP di FatSecret
        response = requests.post(
            "https://platform.fatsecret.com/rest/natural-language-processing/v1",
            headers=headers,
            json=payload
        )
        
        # Verifica la risposta
        if response.status_code != 200:
            print(f"Errore API FatSecret: {response.status_code}")
            print(f"Risposta: {response.text}")
            return JSONResponse(
                status_code=response.status_code,
                content={"error": "Errore nella richiesta all'API FatSecret", "details": response.text}
            )
        
        # Restituisci i risultati
        return response.json()
    
    except Exception as e:
        print(f"Errore: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Errore nel servizio NLP: {str(e)}")
