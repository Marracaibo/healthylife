"""
Hybrid Food Service Router

Provides API endpoints for the hybrid food service optimized for Italian foods.
"""

from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional
import time
import logging
from fastapi.responses import HTMLResponse

# Importa il nuovo servizio ibrido ottimizzato per alimenti italiani
from services.hybrid_food_search import HybridFoodSearch

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/hybrid-food", tags=["hybrid-food"])

def get_food_service():
    """Dependency to get the HybridFoodSearch instance."""
    return HybridFoodSearch()

@router.get("/search")
async def search_food(
    query: str = Query(..., description="Query di ricerca"),
    max_results: int = Query(10, description="Numero massimo di risultati"),
    detailed: bool = Query(False, description="Recupera informazioni nutrizionali dettagliate"),
    food_service: HybridFoodSearch = Depends(get_food_service)
):
    """
    Cerca alimenti utilizzando il servizio ibrido ottimizzato per alimenti italiani.
    
    Args:
        query: La query di ricerca
        max_results: Numero massimo di risultati da restituire
        detailed: Se recuperare informazioni nutrizionali dettagliate
        food_service: Istanza del servizio ibrido
        
    Returns:
        Risultati della ricerca
    """
    logger.info(f"API: Ricerca di '{query}' con max_results={max_results}, detailed={detailed}")
    
    try:
        # Esegui la ricerca con il nuovo servizio
        results = await food_service.search(query, max_results=max_results, detailed=detailed)
        
        # Aggiungi informazioni di debug
        results["_debug"] = {
            "timestamp": time.time(),
            "query": query,
            "max_results": max_results,
            "detailed": detailed
        }
        
        return results
    except Exception as e:
        logger.error(f"Errore durante la ricerca: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Errore durante la ricerca: {str(e)}"
        )

@router.get("/barcode/{barcode}")
async def get_food_by_barcode(
    barcode: str,
    max_results: int = Query(10, description="Numero massimo di risultati"),
    food_service: HybridFoodSearch = Depends(get_food_service)
):
    """
    Cerca alimenti utilizzando un codice a barre.
    
    Args:
        barcode: Il codice a barre da cercare
        max_results: Numero massimo di risultati da restituire
        food_service: Istanza del servizio ibrido
        
    Returns:
        Risultati della ricerca con informazioni sull'alimento
    """
    logger.info(f"API: Ricerca per codice a barre '{barcode}' con max_results={max_results}")
    
    try:
        # Esegui la ricerca con il servizio
        results = await food_service.get_food_by_barcode(barcode, max_results=max_results)
        
        # Aggiungi informazioni di debug
        if isinstance(results, dict) and not results.get("foods"):
            results["_debug"] = {
                "timestamp": time.time(),
                "barcode": barcode,
                "max_results": max_results
            }
        
        return results
    except Exception as e:
        logger.error(f"Errore nella ricerca per codice a barre: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Errore nella ricerca: {str(e)}")

@router.get("/barcode-test/")
@router.get("/barcode-test/{barcode}")
async def test_barcode_search(barcode: str = ""):
    """Endpoint di test per la ricerca di alimenti tramite codice a barre"""
    logger.info(f"Test ricerca alimento con codice a barre: {barcode}")
    
    # Utilizza il servizio ibrido per cercare l'alimento
    hybrid_food_search = HybridFoodSearch()
    results = None
    if barcode:
        results = await hybrid_food_search.get_food_by_barcode(barcode)
    
    # Crea una risposta HTML per visualizzare i risultati
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Barcode Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1 {{ color: #2c3e50; }}
            .result {{ border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }}
            .success {{ background-color: #d4edda; }}
            .error {{ background-color: #f8d7da; }}
            .info {{ background-color: #d1ecf1; }}
            .label {{ font-weight: bold; }}
            img {{ max-width: 100px; height: auto; margin-top: 10px; }}
            .form-container {{ margin-bottom: 20px; }}
            input, button {{ padding: 8px; margin-right: 5px; }}
            button {{ background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }}
            .clear-btn {{ background-color: #f44336; }}
            .examples {{ margin-top: 20px; }}
            .examples a {{ display: inline-block; margin: 5px; padding: 8px; background-color: #e9ecef; text-decoration: none; color: #333; border-radius: 4px; }}
            .examples a:hover {{ background-color: #dee2e6; }}
        </style>
    </head>
    <body>
        <h1>Test Ricerca Codice a Barre</h1>
        
        <div class="form-container">
            <form action="" method="get" onsubmit="window.location.href='/api/hybrid-food/barcode-test/' + document.getElementById('barcode').value; return false;">
                <input type="text" id="barcode" placeholder="Inserisci codice a barre" value="{barcode}">
                <button type="submit">Cerca</button>
                <a href="/api/hybrid-food/barcode-test/" class="clear-btn" style="display: inline-block; padding: 8px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px;">Cancella</a>
            </form>
        </div>
        
        <div class="info result">
            <p><strong>Istruzioni:</strong></p>
            <ol>
                <li>Inserisci un codice a barre nel campo sopra</li>
                <li>Premi "Cerca" per vedere i risultati</li>
                <li>Premi "Cancella" per svuotare il campo</li>
            </ol>
            <p>Puoi anche utilizzare i codici di esempio qui sotto:</p>
        </div>
        
        <div class="examples">
            <a href="/api/hybrid-food/barcode-test/8001505005707">8001505005707 - Nocciolata</a>
            <a href="/api/hybrid-food/barcode-test/8076809513692">8076809513692 - Barilla</a>
            <a href="/api/hybrid-food/barcode-test/5449000000996">5449000000996 - Coca-Cola</a>
            <a href="/api/hybrid-food/barcode-test/8000500310427">8000500310427 - Kinder</a>
        </div>
    """
    
    if barcode:
        html_content += f'<h2>Risultati per: {barcode}</h2>'
        
        if results and results.get("success"):
            html_content += f"""
            <div class="result success">
                <p><span class="label">Fonte:</span> {results.get('source', 'N/A')}</p>
                <p><span class="label">Nome:</span> {results.get('foods', [])[0].get('food_name', 'N/A') if results.get('foods') else 'N/A'}</p>
                <p><span class="label">Brand:</span> {results.get('foods', [])[0].get('brand', 'N/A') if results.get('foods') else 'N/A'}</p>
                <p><span class="label">Calorie:</span> {results.get('foods', [])[0].get('calories', 'N/A') if results.get('foods') else 'N/A'} kcal</p>
                <p><span class="label">Proteine:</span> {results.get('foods', [])[0].get('protein', 'N/A') if results.get('foods') else 'N/A'} g</p>
                <p><span class="label">Carboidrati:</span> {results.get('foods', [])[0].get('carbohydrate', 'N/A') if results.get('foods') else 'N/A'} g</p>
                <p><span class="label">Grassi:</span> {results.get('foods', [])[0].get('fat', 'N/A') if results.get('foods') else 'N/A'} g</p>
                <p><span class="label">ID Alimento:</span> {results.get('foods', [])[0].get('food_id', 'N/A') if results.get('foods') else 'N/A'}</p>
                {f'<img src="{results.get("foods", [])[0].get("food_image", "")}">' if results.get('foods') and results.get('foods')[0].get('food_image') else ''}
            </div>
            """
        else:
            html_content += f"""
            <div class="result error">
                <p>Nessun risultato trovato per il codice a barre {barcode}</p>
                <p>Dettagli: {results.get('message', 'Errore sconosciuto') if results else 'Nessuna risposta dal servizio'}</p>
            </div>
            """
    
    html_content += """
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)

@router.get("/test-italian-foods")
async def test_italian_foods(
    food_service: HybridFoodSearch = Depends(get_food_service)
):
    """
    Endpoint di test per verificare la ricerca di alimenti italiani comuni.
    """
    italian_foods = [
        "parmigiano reggiano",
        "mozzarella di bufala",
        "prosciutto crudo",
        "lasagne alla bolognese",
        "pizza margherita",
        "tiramisu"
    ]
    
    results = {}
    
    for food in italian_foods:
        try:
            result = await food_service.search(food, max_results=2, detailed=True)
            results[food] = {
                "success": len(result["results"]) > 0,
                "items": [item["food_name"] for item in result["results"]],
                "sources": list(set(item["source"] for item in result["results"]))
            }
        except Exception as e:
            results[food] = {"error": str(e)}
    
    return {
        "message": "Test di ricerca alimenti italiani",
        "timestamp": time.time(),
        "results": results
    }

@router.get("/diagnostic")
async def diagnostic(
    food_service: HybridFoodSearch = Depends(get_food_service)
):
    """
    Endpoint di diagnostica per verificare lo stato del servizio e delle API.
    """
    try:
        # Verifica le directory di cache
        import os
        cache_dir = "cache"
        os.makedirs(cache_dir, exist_ok=True)
        cache_files = [f for f in os.listdir(cache_dir) if f.endswith(".json")]
        
        # Verifica le API key
        has_usda_key = hasattr(food_service, "usda_service") and food_service.usda_service.api_key is not None
        
        # Test veloce di funzionamento
        test_result = await food_service.search("mozzarella", max_results=1)
        
        return {
            "status": "online",
            "search_test": "success" if len(test_result["results"]) > 0 else "failed",
            "api_keys": {
                "usda": "Configured" if has_usda_key else "Not configured"
            },
            "cache": {
                "enabled": True,
                "files": len(cache_files),
                "cache_dir": cache_dir
            },
            "server_time": time.time()
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
