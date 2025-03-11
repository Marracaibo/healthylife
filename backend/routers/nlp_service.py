from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import os
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel
from services.fatsecret_nlp_service import fatsecret_nlp_service

# Configurazione del logger
logger = logging.getLogger(__name__)

# Setup del template engine
templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
templates = Jinja2Templates(directory=templates_dir)

# Definizione del router senza prefisso - il prefisso verru00e0 aggiunto in main.py
router = APIRouter()

# Modello per le richieste NLP
class NLPRequest(BaseModel):
    user_input: str
    region: Optional[str] = "Italy"
    language: Optional[str] = "it"

@router.post("/process")
async def process_natural_language(request: NLPRequest):
    """
    Elabora l'input in linguaggio naturale tramite il servizio FatSecret NLP
    
    Params:
    - user_input: Testo dell'utente da elaborare
    - region: Regione per la localizzazione (default: Italy)
    - language: Lingua dell'input (default: it)
    
    Returns:
    - JSON con i risultati dell'elaborazione
    """
    logger.info(f"Richiesta NLP: '{request.user_input}'")
    
    try:
        # Elabora l'input tramite il servizio NLP
        results = fatsecret_nlp_service.process_user_input(
            user_input=request.user_input,
            region=request.region,
            language=request.language
        )
        
        # Aggiungi info sulla fonte (API reale o mock)
        if "status" not in results:
            results["status"] = "fatsecret_api"
        
        return JSONResponse(content=results)
    
    except Exception as e:
        logger.error(f"Errore durante l'elaborazione NLP: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test", response_class=HTMLResponse)
async def get_nlp_test_page(request: Request):
    """
    Pagina di test per il servizio NLP
    """
    return templates.TemplateResponse(
        "nlp_test.html",
        {"request": request}
    )

@router.post("/test", response_class=HTMLResponse)
async def test_nlp_service(request: Request, user_input: str = Form(...)):
    """
    Elabora l'input del form e mostra i risultati nella pagina di test
    """
    try:
        # Elabora l'input tramite il servizio NLP
        results = fatsecret_nlp_service.process_user_input(user_input=user_input)
        
        # Renderizza la pagina con i risultati
        return templates.TemplateResponse(
            "nlp_test.html",
            {
                "request": request,
                "user_input": user_input,
                "results": results,
                "is_mock": results.get("status") == "mock_response"
            }
        )
    
    except Exception as e:
        logger.error(f"Errore durante il test NLP: {str(e)}")
        return templates.TemplateResponse(
            "nlp_test.html",
            {
                "request": request,
                "user_input": user_input,
                "error": str(e)
            }
        )
