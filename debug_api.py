import os
import subprocess
import sys
import time

# Funzione per verificare se una porta è occupata
def is_port_in_use(port):
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

# Funzione per stampare messaggio con colori
def print_color(message, color="normal"):
    colors = {
        "red": "\033[91m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "normal": "\033[0m"
    }
    color_code = colors.get(color, colors["normal"])
    end_color = colors["normal"]
    print(f"{color_code}{message}{end_color}")

# Verifica presenza di Python
def check_python():
    print_color("\nVERIFICA INSTALLAZIONE PYTHON:", "blue")
    try:
        # Verifica Python
        version_output = subprocess.check_output(["python", "--version"]).decode("utf-8").strip()
        print_color(f"✅ Python installato: {version_output}", "green")
        return True
    except Exception as e:
        print_color(f"❌ Python non trovato. Errore: {str(e)}", "red")
        print_color("Installa Python dal Microsoft Store o dal sito ufficiale: https://www.python.org/downloads/", "yellow")
        return False

# Verifica se il server è in esecuzione
def check_server_running():
    print_color("\nVERIFICA SERVER BACKEND:", "blue")
    if is_port_in_use(8000):
        print_color("✅ Il server è in esecuzione sulla porta 8000", "green")
        return True
    else:
        print_color("❌ Il server non è in esecuzione sulla porta 8000", "red")
        return False

# Test delle API (utilizziamo subprocess per essere compatibile con qualsiasi setup)
def test_api_endpoints():
    print_color("\nTEST ENDPOINTS API:", "blue")
    
    # Test endpoint diagnostico
    print_color("\nTEST ENDPOINT DIAGNOSTICO:", "yellow")
    try:
        import urllib.request
        import json
        
        with urllib.request.urlopen("http://localhost:8000/api/hybrid-food/diagnostic") as response:
            data = json.loads(response.read().decode())
            print_color("✅ Endpoint diagnostico risponde!", "green")
            print_color("Dettagli:", "normal")
            print(json.dumps(data, indent=2))
            return True
    except Exception as e:
        print_color(f"❌ Errore nell'accesso all'endpoint diagnostico: {str(e)}", "red")
        return False

# Test della ricerca
def test_search():
    print_color("\nTEST RICERCA ALIMENTI:", "blue")
    try:
        import urllib.request
        import json
        import urllib.parse
        
        query = "bread"
        url = f"http://localhost:8000/api/hybrid-food/search?query={urllib.parse.quote(query)}"
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            
            if "results" in data and len(data["results"]) > 0:
                print_color(f"✅ Trovati {len(data['results'])} risultati per '{query}'", "green")
                print_color("Primi 3 risultati:", "normal")
                for i, result in enumerate(data["results"][:3]):
                    print(f"{i+1}. {result.get('name', 'N/A')} ({result.get('source', 'N/A')})")
            else:
                print_color(f"⚠️ Nessun risultato trovato per '{query}'", "yellow")
                print_color("Risposta API:", "normal")
                print(json.dumps(data, indent=2))
            return True
    except Exception as e:
        print_color(f"❌ Errore nell'accesso all'endpoint di ricerca: {str(e)}", "red")
        return False

# Esegui tutti i controlli
def run_diagnostics():
    print_color("=== DIAGNOSTICA HYBRID FOOD SERVICE ===", "blue")
    
    # Check Python
    python_ok = check_python()
    if not python_ok:
        print_color("\n⛔ Python non è installato correttamente. Installa Python prima di continuare.", "red")
        return
    
    # Check Server
    server_ok = check_server_running()
    if not server_ok:
        print_color("\n⚠️ Il server non è in esecuzione. Vuoi avviarlo? (s/n)", "yellow")
        choice = input().lower()
        if choice == 's' or choice == 'si' or choice == 'y' or choice == 'yes':
            try:
                print_color("Avvio del server in corso...", "yellow")
                backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
                # Avvia il server in background (Windows)
                subprocess.Popen(["python", "-m", "uvicorn", "main:app", "--reload"], 
                                cwd=backend_path, 
                                creationflags=subprocess.CREATE_NEW_CONSOLE)
                print_color("Server avviato in una nuova finestra del terminale", "green")
                time.sleep(5)  # Attendi che il server si avvii
            except Exception as e:
                print_color(f"❌ Errore nell'avvio del server: {str(e)}", "red")
                return
        else:
            print_color("Test interrotto. Avvia il server prima di continuare.", "yellow")
            return
    
    # Test API endpoints
    api_ok = test_api_endpoints()
    if not api_ok:
        print_color("\n⛔ Gli endpoint API non rispondono correttamente.", "red")
        return
    
    # Test search
    search_ok = test_search()
    
    # Riepilogo finale
    print_color("\n=== RIEPILOGO DIAGNOSTICA ====", "blue")
    print_color(f"Python: {'✅' if python_ok else '❌'}", "green" if python_ok else "red")
    print_color(f"Server: {'✅' if server_ok else '❌'}", "green" if server_ok else "red")
    print_color(f"API: {'✅' if api_ok else '❌'}", "green" if api_ok else "red")
    print_color(f"Ricerca: {'✅' if search_ok else '⚠️'}", "green" if search_ok else "yellow")
    
    if all([python_ok, server_ok, api_ok, search_ok]):
        print_color("\n✅ Tutto funziona correttamente!", "green")
    else:
        print_color("\n⚠️ Ci sono problemi da risolvere.", "yellow")

if __name__ == "__main__":
    run_diagnostics()
    print("\nPremi invio per terminare...")
    input()
