"""
Script per verificare le impostazioni di ambiente per il servizio ibrido di ricerca alimenti
"""
import os
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

# Ottieni le impostazioni
use_edamam_only = os.getenv("USE_EDAMAM_ONLY", "false").lower() == "true"
use_edamam_aggregated = os.getenv("USE_EDAMAM_AGGREGATED", "false").lower() == "true"
use_enhanced_edamam = os.getenv("USE_ENHANCED_EDAMAM", "false").lower() == "true"

# Credenziali API
usda_api_key = os.getenv("USDA_API_KEY")
edamam_app_id = os.getenv("EDAMAM_APP_ID")
edamam_app_key = os.getenv("EDAMAM_APP_KEY")

# Stampa le impostazioni
print("=== Impostazioni del servizio ibrido di ricerca alimenti ===")
print(f"USE_EDAMAM_ONLY: {use_edamam_only}")
print(f"USE_EDAMAM_AGGREGATED: {use_edamam_aggregated}")
print(f"USE_ENHANCED_EDAMAM: {use_enhanced_edamam}")
print("\n=== Credenziali API ===")
print(f"USDA API Key: {usda_api_key}")
print(f"Edamam App ID: {edamam_app_id}")
print(f"Edamam App Key: {edamam_app_key}")

# Verifica se le configurazioni sono corrette
print("\n=== Verifica configurazione ===")
if use_edamam_only:
    print("ATTENZIONE: Il servizio è configurato per utilizzare SOLO Edamam!")
    print("Modifica USE_EDAMAM_ONLY=false nel file .env per utilizzare USDA come fonte primaria.")
else:
    print("OK: Il servizio è configurato per utilizzare USDA come fonte primaria.")
    
if not use_edamam_aggregated and not use_edamam_only:
    print("ATTENZIONE: Edamam non verrà utilizzato come fallback!")
    print("Modifica USE_EDAMAM_AGGREGATED=true nel file .env per utilizzare Edamam come fallback.")
else:
    print("OK: Il servizio è configurato per utilizzare Edamam come fallback o fonte principale.")
    
if not usda_api_key:
    print("ERRORE: Chiave API USDA mancante!")
else:
    print("OK: Chiave API USDA presente.")
    
if not edamam_app_id or not edamam_app_key:
    print("ERRORE: Credenziali Edamam mancanti!")
else:
    print("OK: Credenziali Edamam presenti.")
