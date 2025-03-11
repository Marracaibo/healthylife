from fastapi import APIRouter, Request, Form, HTTPException, UploadFile, File, Body
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import os
import logging
import base64
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from services.fatsecret_image_service import fatsecret_image_service

# Configurazione del logger
logger = logging.getLogger(__name__)

# Setup del template engine
templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
templates = Jinja2Templates(directory=templates_dir)

# Definizione del router senza prefisso - il prefisso verrà aggiunto in main.py
router = APIRouter()

# Modello per le richieste di riconoscimento immagini
class ImageRecognitionRequest(BaseModel):
    image_base64: str
    region: Optional[str] = "Italy"
    language: Optional[str] = "it"
    eaten_foods: Optional[List[Dict[str, Any]]] = None

@router.post("/process")
async def process_image(request: ImageRecognitionRequest):
    """
    Elabora un'immagine tramite il servizio FatSecret Image Recognition
    
    Params:
    - image_base64: Immagine codificata in base64
    - region: Regione per la localizzazione (default: Italy)
    - language: Lingua dell'input (default: it)
    - eaten_foods: Lista opzionale di alimenti già consumati
    
    Returns:
    - JSON con i risultati dell'elaborazione
    """
    logger.info(f"Richiesta riconoscimento immagine (regione: {request.region}, lingua: {request.language})")
    
    try:
        # Elabora l'immagine tramite il servizio di riconoscimento
        results = fatsecret_image_service.process_image(
            image_base64=request.image_base64,
            region=request.region,
            language=request.language,
            eaten_foods=request.eaten_foods
        )
        
        # Aggiungi info sulla fonte (API reale o mock)
        if "status" not in results:
            results["status"] = "fatsecret_api"
        
        return JSONResponse(content=results)
    
    except Exception as e:
        logger.error(f"Errore durante l'elaborazione dell'immagine: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), region: str = Form("Italy"), language: str = Form("it")):
    """
    Carica un'immagine e la elabora tramite il servizio FatSecret Image Recognition
    
    Params:
    - file: File dell'immagine da caricare
    - region: Regione per la localizzazione (default: Italy)
    - language: Lingua dell'input (default: it)
    
    Returns:
    - JSON con i risultati dell'elaborazione
    """
    logger.info(f"Upload immagine: {file.filename} (regione: {region}, lingua: {language})")
    
    try:
        # Leggi il contenuto del file
        contents = await file.read()
        
        # Converti in base64
        image_base64 = base64.b64encode(contents).decode('utf-8')
        
        # Elabora l'immagine tramite il servizio di riconoscimento
        results = fatsecret_image_service.process_image(
            image_base64=image_base64,
            region=region,
            language=language
        )
        
        # Aggiungi info sulla fonte (API reale o mock)
        if "status" not in results:
            results["status"] = "fatsecret_api"
        
        return JSONResponse(content=results)
    
    except Exception as e:
        logger.error(f"Errore durante l'upload e l'elaborazione dell'immagine: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test", response_class=HTMLResponse)
async def get_image_recognition_test_page(request: Request):
    """
    Pagina di test per il servizio di riconoscimento immagini
    """
    return templates.TemplateResponse(
        "image_recognition_test.html",
        {"request": request}
    )
