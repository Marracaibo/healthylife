"""
Prototipo di servizio di traduzione automatica per il servizio di ricerca alimenti.
Questo file contiene un'implementazione di esempio per un'eventuale integrazione
con servizi di traduzione automatica come Google Translate, DeepL o Azure Translator.

NOTA: Questo è solo un prototipo e non è attualmente utilizzato nella produzione.
Implementarlo richiederebbe chiavi API per il servizio di traduzione scelto e
modifiche al translation_service.py per integrare questa funzionalità.
"""

import os
import logging
import requests
from typing import Optional, Dict, List, Tuple
import json
import time

# Configurazione del logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("machine_translation")

# Costanti di configurazione
CACHE_EXPIRATION = 86400  # 24 ore in secondi
MAX_CACHE_ITEMS = 1000
TRANSLATION_TIMEOUT = 5  # secondi

class TranslationCache:
    """Cache per le traduzioni automatiche per evitare chiamate API ripetute."""
    
    def __init__(self):
        self.cache: Dict[str, Tuple[str, float]] = {}  # {source_text: (translated_text, timestamp)}
    
    def get(self, text: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Recupera una traduzione dalla cache se presente e non scaduta."""
        cache_key = f"{source_lang}:{target_lang}:{text.lower()}"
        
        if cache_key in self.cache:
            translated_text, timestamp = self.cache[cache_key]
            if time.time() - timestamp < CACHE_EXPIRATION:
                logger.debug(f"Cache hit for: {text}")
                return translated_text
            
            # Rimuoviamo le voci scadute
            logger.debug(f"Cache expired for: {text}")
            del self.cache[cache_key]
        
        return None
    
    def set(self, text: str, translated_text: str, source_lang: str, target_lang: str) -> None:
        """Salva una traduzione nella cache."""
        cache_key = f"{source_lang}:{target_lang}:{text.lower()}"
        
        # Implementazione semplice: se la cache è piena, rimuoviamo una voce a caso
        if len(self.cache) >= MAX_CACHE_ITEMS:
            # In una implementazione reale, rimuoveremmo la voce meno recentemente usata
            self.cache.pop(next(iter(self.cache)))
            
        self.cache[cache_key] = (translated_text, time.time())
        logger.debug(f"Added to cache: {text} -> {translated_text}")

# Istanza globale della cache
translation_cache = TranslationCache()

class GoogleTranslateConnector:
    """Connector per Google Cloud Translation API."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GOOGLE_TRANSLATE_API_KEY")
        if not self.api_key:
            logger.warning("Google Translate API key non configurata")
        
        self.base_url = "https://translation.googleapis.com/language/translate/v2"
    
    def translate(self, text: str, source_lang: str = "it", target_lang: str = "en") -> Optional[str]:
        """Traduce un testo utilizzando Google Translate API."""
        if not self.api_key:
            logger.error("Impossibile tradurre: API key mancante")
            return None
            
        # Controllo della cache
        cached = translation_cache.get(text, source_lang, target_lang)
        if cached:
            return cached
        
        try:
            params = {
                "q": text,
                "source": source_lang,
                "target": target_lang,
                "key": self.api_key,
                "format": "text"  # Altre opzioni: html
            }
            
            response = requests.post(
                self.base_url,
                params=params,
                timeout=TRANSLATION_TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                if "data" in result and "translations" in result["data"]:
                    translated_text = result["data"]["translations"][0]["translatedText"]
                    
                    # Salviamo in cache
                    translation_cache.set(text, translated_text, source_lang, target_lang)
                    
                    return translated_text
                    
            logger.error(f"Errore nella traduzione: {response.status_code} - {response.text}")
            return None
            
        except Exception as e:
            logger.error(f"Eccezione durante la traduzione: {str(e)}")
            return None

class DeepLConnector:
    """Connector per DeepL API."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("DEEPL_API_KEY")
        if not self.api_key:
            logger.warning("DeepL API key non configurata")
        
        self.base_url = "https://api.deepl.com/v2/translate"
    
    def translate(self, text: str, source_lang: str = "IT", target_lang: str = "EN") -> Optional[str]:
        """Traduce un testo utilizzando DeepL API."""
        if not self.api_key:
            logger.error("Impossibile tradurre: API key mancante")
            return None
            
        # Controllo della cache
        cached = translation_cache.get(text, source_lang, target_lang)
        if cached:
            return cached
        
        try:
            headers = {
                "Authorization": f"DeepL-Auth-Key {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "text": [text],
                "source_lang": source_lang,
                "target_lang": target_lang
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                data=json.dumps(data),
                timeout=TRANSLATION_TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                if "translations" in result and result["translations"]:
                    translated_text = result["translations"][0]["text"]
                    
                    # Salviamo in cache
                    translation_cache.set(text, translated_text, source_lang, target_lang)
                    
                    return translated_text
                    
            logger.error(f"Errore nella traduzione: {response.status_code} - {response.text}")
            return None
            
        except Exception as e:
            logger.error(f"Eccezione durante la traduzione: {str(e)}")
            return None

class AzureTranslatorConnector:
    """Connector per Azure Translator API."""
    
    def __init__(self, api_key: Optional[str] = None, region: Optional[str] = None):
        self.api_key = api_key or os.environ.get("AZURE_TRANSLATOR_API_KEY")
        self.region = region or os.environ.get("AZURE_TRANSLATOR_REGION", "westeurope")
        
        if not self.api_key:
            logger.warning("Azure Translator API key non configurata")
        
        self.base_url = "https://api.cognitive.microsofttranslator.com/translate"
    
    def translate(self, text: str, source_lang: str = "it", target_lang: str = "en") -> Optional[str]:
        """Traduce un testo utilizzando Azure Translator API."""
        if not self.api_key:
            logger.error("Impossibile tradurre: API key mancante")
            return None
            
        # Controllo della cache
        cached = translation_cache.get(text, source_lang, target_lang)
        if cached:
            return cached
        
        try:
            headers = {
                "Ocp-Apim-Subscription-Key": self.api_key,
                "Ocp-Apim-Subscription-Region": self.region,
                "Content-type": "application/json"
            }
            
            params = {
                "api-version": "3.0",
                "from": source_lang,
                "to": target_lang
            }
            
            data = [{"text": text}]
            
            response = requests.post(
                self.base_url,
                headers=headers,
                params=params,
                data=json.dumps(data),
                timeout=TRANSLATION_TIMEOUT
            )
            
            if response.status_code == 200:
                result = response.json()
                if result and result[0]["translations"]:
                    translated_text = result[0]["translations"][0]["text"]
                    
                    # Salviamo in cache
                    translation_cache.set(text, translated_text, source_lang, target_lang)
                    
                    return translated_text
                    
            logger.error(f"Errore nella traduzione: {response.status_code} - {response.text}")
            return None
            
        except Exception as e:
            logger.error(f"Eccezione durante la traduzione: {str(e)}")
            return None

class MachineTranslationService:
    """Servizio di traduzione automatica che può utilizzare diversi provider."""
    
    PROVIDERS = {
        "google": GoogleTranslateConnector,
        "deepl": DeepLConnector,
        "azure": AzureTranslatorConnector
    }
    
    def __init__(self, provider: str = "google", api_key: Optional[str] = None, **kwargs):
        """
        Inizializza il servizio di traduzione.
        
        Args:
            provider: Il provider da utilizzare ("google", "deepl" o "azure")
            api_key: Chiave API per il provider (altrimenti usa variabili d'ambiente)
            **kwargs: Parametri aggiuntivi specifici per il provider
        """
        if provider not in self.PROVIDERS:
            logger.error(f"Provider non supportato: {provider}")
            provider = "google"  # Fallback al provider predefinito
            
        self.provider_name = provider
        self.connector = self.PROVIDERS[provider](api_key=api_key, **kwargs)
        logger.info(f"Inizializzato servizio di traduzione con provider: {provider}")
    
    def translate(self, text: str, source_lang: str = "it", target_lang: str = "en") -> str:
        """
        Traduce un testo dalla lingua sorgente alla lingua target.
        
        Args:
            text: Testo da tradurre
            source_lang: Codice lingua sorgente (es. "it")
            target_lang: Codice lingua target (es. "en")
            
        Returns:
            Testo tradotto o testo originale in caso di errore
        """
        if not text.strip():
            return text
            
        # Per traduzione italiano-inglese, adattiamo i codici lingua al provider
        if self.provider_name == "deepl":
            source_lang = source_lang.upper() if len(source_lang) == 2 else source_lang
            target_lang = target_lang.upper() if len(target_lang) == 2 else target_lang
            
        translated = self.connector.translate(text, source_lang, target_lang)
        
        if translated:
            logger.info(f"Traduzione riuscita [{self.provider_name}]: '{text}' -> '{translated}'")
            return translated
        else:
            logger.warning(f"Traduzione fallita [{self.provider_name}]: '{text}'")
            return text  # Restituiamo il testo originale in caso di errore
            
    def translate_food_query(self, query: str) -> str:
        """
        Versione specializzata per traduzioni di query alimentari.
        Questa funzione potrebbe essere integrata con translation_service.py
        
        Args:
            query: Query alimentare in italiano
            
        Returns:
            Query tradotta in inglese
        """
        # Per le query alimentari, utilizziamo sempre italiano -> inglese
        translated = self.translate(query, "it", "en")
        
        # Potremmo fare post-processing specifico per termini alimentari qui
        # Ad esempio, normalizzare alcune traduzioni comuni
        
        return translated


# Esempio di utilizzo
if __name__ == "__main__":
    # Esempio di come utilizzare il servizio
    # In una implementazione reale, queste chiavi verrebbero da variabili d'ambiente
    
    print("Questo è un prototipo di servizio di traduzione automatica.")
    print("Per utilizzarlo, è necessario configurare le chiavi API.")
    
    example_queries = [
        "pomodoro fresco",
        "pasta al ragù",
        "insalata mista con rucola e pomodorini",
        "parmigiana di melanzane",
        "gelato alla fragola"
    ]
    
    # Esempio con mock (senza API keys reali)
    try:
        translator = MachineTranslationService("google", api_key="MOCK_KEY")
        
        print("\nEsempio di traduzioni (mock):")
        for query in example_queries:
            # Simuliamo una traduzione per scopi dimostrativi
            mock_translation = query.replace("pomodoro", "tomato")\
                                  .replace("pasta", "pasta")\
                                  .replace("ragù", "bolognese sauce")\
                                  .replace("insalata", "salad")\
                                  .replace("mista", "mixed")\
                                  .replace("rucola", "arugula")\
                                  .replace("pomodorini", "cherry tomatoes")\
                                  .replace("parmigiana", "parmesan")\
                                  .replace("melanzane", "eggplant")\
                                  .replace("gelato", "ice cream")\
                                  .replace("fragola", "strawberry")\
                                  .replace("alla", "with")\
                                  .replace("al", "with")\
                                  .replace("con", "with")\
                                  .replace("di", "of")
                                  
            print(f"  '{query}' -> '{mock_translation}'")
            
        print("\nNOTA: Per utilizzare realmente questo servizio:")
        print("1. Ottieni una chiave API da uno dei provider supportati")
        print("2. Configura la chiave nelle variabili d'ambiente")
        print("3. Integra questo servizio con translation_service.py")
            
    except Exception as e:
        print(f"Errore durante l'esempio: {str(e)}")
