#!/usr/bin/env python
"""
Script per test programmati delle API di ricerca alimenti.

Questo script può essere eseguito periodicamente come processo pianificato (cron)
per verificare che le API USDA e Edamam funzionino correttamente.
"""

import asyncio
import os
import sys
import json
import time
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from pathlib import Path

# Aggiungi la directory principale al path per poter importare i moduli dell'applicazione
sys.path.append(str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from services.usda_food_service import USDAFoodService
from edamam_only_service import EdamamOnlyService
from services.config_validator import config_validator

# Configurazione del logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/api_tests.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("api_test")

# Carica le variabili d'ambiente
load_dotenv()

# Configurazione del test
TEST_QUERIES = ["apple", "banana", "chicken", "bread", "milk"]
TEST_ITALIAN_QUERIES = ["mela", "banana", "pollo", "pane", "latte"]
LOG_DIR = "logs"
REPORT_FILE = "logs/api_test_report.json"
EMAIL_NOTIFICATION = os.getenv("EMAIL_NOTIFICATION", "false").lower() == "true"
EMAIL_FROM = os.getenv("EMAIL_FROM", "test@example.com")
EMAIL_TO = os.getenv("EMAIL_TO", "admin@example.com")
EMAIL_SUBJECT = "HealthyLifeApp API Test Report"

class APITester:
    """Esegue test periodici sulle API di ricerca alimenti."""
    
    def __init__(self):
        """Inizializza il tester delle API."""
        # Assicurati che la directory dei log esista
        os.makedirs(LOG_DIR, exist_ok=True)
        
        # Inizializza i servizi
        self.usda_service = USDAFoodService()
        self.edamam_service = EdamamOnlyService()
        
        # Inizializza lo stato del test
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "usda_api": {"status": "unknown", "details": {}},
            "edamam_api": {"status": "unknown", "details": {}},
            "config_valid": False,
            "warnings": []
        }
    
    async def test_usda_api(self):
        """Testa la connessione all'API USDA FoodData Central."""
        logger.info("Test API USDA FoodData Central")
        
        # Verifica la configurazione
        if not self.usda_service.api_key:
            self.test_results["usda_api"]["status"] = "failed"
            self.test_results["usda_api"]["details"]["error"] = "USDA_API_KEY non configurata"
            logger.error("USDA_API_KEY non configurata nelle variabili d'ambiente")
            return False
        
        logger.info(f"USDA API Key configurata: {self.usda_service.api_key[:5]}...{self.usda_service.api_key[-5:] if len(self.usda_service.api_key) > 10 else '***'}")
        
        # Test con query in inglese
        success_count = 0
        query_results = {}
        
        for query in TEST_QUERIES:
            logger.info(f"Test USDA con query: {query}")
            try:
                start_time = time.time()
                results = await self.usda_service.search_food(query)
                elapsed = time.time() - start_time
                
                # Verifica i risultati
                if "foods" in results and results["foods"]:
                    count = len(results["foods"])
                    first_item = results["foods"][0]["description"] if count > 0 else "N/A"
                    logger.info(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s. Primo risultato: {first_item}")
                    success_count += 1
                    query_results[query] = {
                        "status": "success",
                        "count": count,
                        "time": elapsed,
                        "first_result": first_item
                    }
                else:
                    error = results.get("error", "Nessun errore specifico riportato")
                    logger.error(f"✗ Errore: Nessun risultato trovato. Messaggio: {error}")
                    query_results[query] = {
                        "status": "failed",
                        "error": error,
                        "time": elapsed
                    }
            except Exception as e:
                logger.error(f"✗ Eccezione durante la ricerca USDA: {str(e)}")
                query_results[query] = {
                    "status": "error",
                    "exception": str(e)
                }
        
        # Aggiorna i risultati del test
        success_rate = success_count / len(TEST_QUERIES) if TEST_QUERIES else 0
        self.test_results["usda_api"]["details"]["queries"] = query_results
        self.test_results["usda_api"]["details"]["success_rate"] = success_rate
        
        if success_rate >= 0.8:  # 80% di successo è considerato OK
            self.test_results["usda_api"]["status"] = "success"
            logger.info(f"Test API USDA: SUCCESSO ({success_rate:.0%})")
            return True
        elif success_rate > 0:
            self.test_results["usda_api"]["status"] = "partial"
            logger.warning(f"Test API USDA: PARZIALE ({success_rate:.0%})")
            return True
        else:
            self.test_results["usda_api"]["status"] = "failed"
            logger.error(f"Test API USDA: FALLITO (0%)")
            return False
    
    async def test_edamam_api(self):
        """Testa la connessione all'API Edamam."""
        logger.info("Test API Edamam")
        
        # Verifica le credenziali
        if not self.edamam_service.app_id or not self.edamam_service.app_key:
            self.test_results["edamam_api"]["status"] = "failed"
            self.test_results["edamam_api"]["details"]["error"] = "Credenziali Edamam non configurate"
            logger.error("EDAMAM_APP_ID o EDAMAM_APP_KEY non configurati nelle variabili d'ambiente")
            return False
        
        logger.info(f"Edamam App ID configurato: {self.edamam_service.app_id}")
        logger.info(f"Edamam App Key configurata: {self.edamam_service.app_key[:5]}...{self.edamam_service.app_key[-5:] if len(self.edamam_service.app_key) > 10 else '***'}")
        
        # Test con query in inglese
        success_count = 0
        query_results = {}
        
        for query in TEST_QUERIES:
            logger.info(f"Test Edamam con query: {query}")
            try:
                start_time = time.time()
                results = await self.edamam_service.search_food(query)
                elapsed = time.time() - start_time
                
                # Verifica i risultati
                if "results" in results and results["results"]:
                    count = len(results["results"])
                    first_item = results["results"][0]["name"] if count > 0 else "N/A"
                    logger.info(f"✓ Successo: {count} risultati trovati in {elapsed:.2f}s. Primo risultato: {first_item}")
                    success_count += 1
                    query_results[query] = {
                        "status": "success",
                        "count": count,
                        "time": elapsed,
                        "first_result": first_item
                    }
                else:
                    logger.error(f"✗ Errore: Nessun risultato trovato.")
                    query_results[query] = {
                        "status": "failed",
                        "error": "Nessun risultato trovato",
                        "time": elapsed
                    }
            except Exception as e:
                logger.error(f"✗ Eccezione durante la ricerca Edamam: {str(e)}")
                query_results[query] = {
                    "status": "error",
                    "exception": str(e)
                }
        
        # Aggiorna i risultati del test
        success_rate = success_count / len(TEST_QUERIES) if TEST_QUERIES else 0
        self.test_results["edamam_api"]["details"]["queries"] = query_results
        self.test_results["edamam_api"]["details"]["success_rate"] = success_rate
        
        if success_rate >= 0.8:  # 80% di successo è considerato OK
            self.test_results["edamam_api"]["status"] = "success"
            logger.info(f"Test API Edamam: SUCCESSO ({success_rate:.0%})")
            return True
        elif success_rate > 0:
            self.test_results["edamam_api"]["status"] = "partial"
            logger.warning(f"Test API Edamam: PARZIALE ({success_rate:.0%})")
            return True
        else:
            self.test_results["edamam_api"]["status"] = "failed"
            logger.error(f"Test API Edamam: FALLITO (0%)")
            return False
    
    def validate_configuration(self):
        """Valida la configurazione dell'applicazione."""
        logger.info("Validazione della configurazione")
        is_valid, warnings = config_validator.validate_config()
        
        self.test_results["config_valid"] = is_valid
        self.test_results["warnings"] = warnings
        
        return is_valid
    
    def save_report(self):
        """Salva il report del test su file."""
        try:
            with open(REPORT_FILE, "w", encoding="utf-8") as f:
                json.dump(self.test_results, f, ensure_ascii=False, indent=2)
            logger.info(f"Report salvato in {REPORT_FILE}")
        except Exception as e:
            logger.error(f"Errore durante il salvataggio del report: {str(e)}")
    
    def send_email_notification(self):
        """Invia una notifica email con i risultati del test."""
        if not EMAIL_NOTIFICATION:
            return
        
        try:
            # Crea il messaggio
            msg = MIMEMultipart()
            msg["From"] = EMAIL_FROM
            msg["To"] = EMAIL_TO
            msg["Subject"] = f"{EMAIL_SUBJECT} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            
            # Costruisci il corpo del messaggio
            body = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .success {{ color: green; }}
                    .partial {{ color: orange; }}
                    .failed {{ color: red; }}
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                </style>
            </head>
            <body>
                <h2>HealthyLifeApp API Test Report</h2>
                <p>Data: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                
                <h3>Riepilogo dei Test</h3>
                <table>
                    <tr>
                        <th>API</th>
                        <th>Stato</th>
                        <th>Tasso di successo</th>
                    </tr>
                    <tr>
                        <td>USDA FoodData Central</td>
                        <td class="{self.test_results['usda_api']['status']}">{self.test_results['usda_api']['status'].upper()}</td>
                        <td>{self.test_results['usda_api']['details'].get('success_rate', 0):.0%}</td>
                    </tr>
                    <tr>
                        <td>Edamam</td>
                        <td class="{self.test_results['edamam_api']['status']}">{self.test_results['edamam_api']['status'].upper()}</td>
                        <td>{self.test_results['edamam_api']['details'].get('success_rate', 0):.0%}</td>
                    </tr>
                </table>
                
                <h3>Avvisi sulla Configurazione</h3>
                <p>Configurazione valida: <span class="{'success' if self.test_results['config_valid'] else 'failed'}">{self.test_results['config_valid']}</span></p>
                <ul>
                    {''.join([f'<li>{warning}</li>' for warning in self.test_results['warnings']])}
                </ul>
                
                <p>Per dettagli completi, consultare il file di log: {REPORT_FILE}</p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, "html"))
            
            # Configura il server SMTP (esempio per Gmail)
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_username = os.getenv("SMTP_USERNAME", "")
            smtp_password = os.getenv("SMTP_PASSWORD", "")
            
            if smtp_username and smtp_password:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
                server.quit()
                logger.info(f"Notifica email inviata a {EMAIL_TO}")
            else:
                logger.warning("Credenziali SMTP non configurate, impossibile inviare email")
        except Exception as e:
            logger.error(f"Errore durante l'invio dell'email: {str(e)}")
    
    async def run_tests(self):
        """Esegue tutti i test delle API."""
        logger.info("=== INIZIO TEST API RICERCA ALIMENTI ===")
        
        # Valida la configurazione
        self.validate_configuration()
        
        # Test USDA API
        usda_ok = await self.test_usda_api()
        
        # Test Edamam API
        edamam_ok = await self.test_edamam_api()
        
        # Salva il report
        self.save_report()
        
        # Invia notifica email (se configurata)
        self.send_email_notification()
        
        # Riepilogo
        logger.info("\n=== RIEPILOGO TEST ===")
        logger.info(f"API USDA: {'✓' if usda_ok else '✗'}")
        logger.info(f"API Edamam: {'✓' if edamam_ok else '✗'}")
        logger.info(f"Configurazione valida: {'✓' if self.test_results['config_valid'] else '✗'}")
        
        if self.test_results["warnings"]:
            logger.info("Avvisi sulla configurazione:")
            for warning in self.test_results["warnings"]:
                logger.warning(f"⚠️ {warning}")
        
        logger.info("=== FINE TEST API ===")
        
        # Se entrambe le API falliscono, considera il test fallito
        return usda_ok or edamam_ok

async def main():
    """Funzione principale del test."""
    tester = APITester()
    success = await tester.run_tests()
    
    # Per l'uso con cron o task scheduler, restituisci il codice di uscita appropriato
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    asyncio.run(main())
