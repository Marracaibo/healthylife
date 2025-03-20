# Questo file serve per il deployment su Render
# Crea un wrapper che espone l'app FastAPI dal modulo backend

import os
import sys

# Aggiungi la directory corrente al path per permettere l'import di moduli relativi
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Aggiungi anche la directory backend al path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

# Importa l'app dal modulo backend.main
from backend.main import app

# Esplicita la porta per Render
port = int(os.environ.get("PORT", 8000))

# L'app verrà eseguita da uvicorn quando il server viene avviato
# Render eseguirà: uvicorn main:app --host 0.0.0.0 --port $PORT
