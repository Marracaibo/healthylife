from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def configure_cors(app: FastAPI):
    """
    Configura le regole CORS per l'applicazione FastAPI.
    
    Args:
        app: L'istanza dell'applicazione FastAPI
    """
    # Configura CORS per consentire richieste da domini specifici
    # In produzione, sostituire con il dominio effettivo di Firebase
    allowed_origins = [
        "http://localhost:5173",  # Sviluppo locale
        "https://healthylife-app.web.app",  # Dominio Firebase principale
        "https://healthylife-app.firebaseapp.com"  # Dominio Firebase alternativo
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    )
    
    # Aggiungi header CORS a tutte le risposte
    @app.middleware("http")
    async def add_cors_headers(request, call_next):
        response = await call_next(request)
        # Verifica l'origine della richiesta
        origin = request.headers.get('Origin')
        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            # Per richieste da origini non consentite, usa il dominio principale
            response.headers["Access-Control-Allow-Origin"] = allowed_origins[0]
            
        response.headers["Access-Control-Allow-Headers"] = 'Content-Type,Authorization,X-Requested-With'
        response.headers["Access-Control-Allow-Methods"] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers["Access-Control-Allow-Credentials"] = 'true'
        return response
    
    return app
