"""
Configuration Validator

Questo modulo verifica che la configurazione dell'applicazione sia corretta,
in particolare che le chiavi API necessarie siano impostate.
"""

import os
import logging
from dotenv import load_dotenv
from typing import Dict, List, Tuple

# Configurazione del logging
logger = logging.getLogger(__name__)

class ConfigValidator:
    """
    Classe per validare la configurazione dell'applicazione.
    Verifica che le chiavi API e altre impostazioni siano configurate correttamente.
    """
    
    def __init__(self):
        """Inizializza il validatore di configurazione."""
        # Carica le variabili d'ambiente se non sono già state caricate
        load_dotenv()
        
        # Definisce i parametri required e opzionali
        self.required_keys = [
            "USDA_API_KEY"  # La chiave USDA è necessaria per il funzionamento ottimale
        ]
        
        self.optional_keys = [
            "EDAMAM_APP_ID",
            "EDAMAM_APP_KEY",
            "USE_EDAMAM_ONLY",
            "USE_EDAMAM_AGGREGATED",
            "USE_ENHANCED_EDAMAM"
        ]
        
        # Verifica i warning
        self.warnings = []
        
    def validate_config(self) -> Tuple[bool, List[str]]:
        """
        Verifica che la configurazione dell'applicazione sia valida.
        
        Returns:
            Tuple[bool, List[str]]: (valido, lista di warning)
        """
        missing_keys = []
        self.warnings = []
        
        # Verifica le chiavi richieste
        for key in self.required_keys:
            if not os.getenv(key) or os.getenv(key) == "":
                missing_keys.append(key)
        
        # Verifica le chiavi opzionali
        for key in self.optional_keys:
            if not os.getenv(key):
                self.warnings.append(f"La chiave opzionale '{key}' non è configurata")
        
        # Verifica specifica per USDA_API_KEY
        if os.getenv("USDA_API_KEY") == "DEMO_KEY":
            self.warnings.append("Stai usando DEMO_KEY per USDA API, che ha limiti di utilizzo. Per un ambiente di produzione, usa una chiave reale.")
        
        # Verifica specifica per Edamam
        if not os.getenv("EDAMAM_APP_ID") or not os.getenv("EDAMAM_APP_KEY"):
            self.warnings.append("Le credenziali Edamam non sono configurate. Il servizio di backup non sarà disponibile.")
        
        # Valido se non mancano chiavi richieste
        is_valid = len(missing_keys) == 0
        
        if not is_valid:
            error_message = f"Configurazione non valida. Mancano le seguenti chiavi richieste: {', '.join(missing_keys)}"
            logger.error(error_message)
        
        return is_valid, self.warnings
    
    def print_validation_results(self):
        """Stampa i risultati della validazione della configurazione."""
        is_valid, warnings = self.validate_config()
        
        if is_valid:
            logger.info("✅ Configurazione valida")
        else:
            logger.error("❌ Configurazione non valida")
        
        for warning in warnings:
            logger.warning(f"⚠️ {warning}")
        
        # Stampa le chiavi configurate
        logger.info("Chiavi configurate:")
        for key in self.required_keys + self.optional_keys:
            value = os.getenv(key)
            if value:
                # Nascondi parzialmente i valori sensibili
                if key.endswith(("_KEY", "_SECRET", "_PASSWORD")):
                    # Mostra solo i primi e gli ultimi 4 caratteri se la lunghezza è sufficiente
                    if len(value) > 8:
                        masked_value = f"{value[:4]}...{value[-4:]}"
                    else:
                        masked_value = "****"
                    logger.info(f"  {key}: {masked_value}")
                else:
                    logger.info(f"  {key}: {value}")
            else:
                logger.warning(f"  {key}: Non configurato")
        
        return is_valid

# Funzione di utility per verificare la configurazione all'avvio dell'app
def validate_on_startup() -> bool:
    """
    Verifica la configurazione all'avvio dell'applicazione.
    
    Returns:
        bool: True se la configurazione è valida, False altrimenti
    """
    validator = ConfigValidator()
    return validator.print_validation_results()

# Singleton instance
config_validator = ConfigValidator()
