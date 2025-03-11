#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import asyncio
import logging
import sys
import json
import argparse
from dotenv import load_dotenv
from enhanced_edamam_service import EnhancedEdamamService

# Carica le variabili d'ambiente dal file .env
load_dotenv()

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Disattiva i log di livello inferiore da altre librerie
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

async def run_enhanced_edamam_test(query: str, max_results: int = 5, detail_mode: bool = False):
    """
    Esegue un test del servizio Edamam migliorato con una query specifica.
    
    Args:
        query: Query di ricerca
        max_results: Numero massimo di risultati da visualizzare
        detail_mode: Se True, mostra dettagli completi incluso formato JSON
    """
    logger.info(f"TEST - Inizializzazione servizio EnhancedEdamamService...")
    service = EnhancedEdamamService()
    
    logger.info(f"TEST - Ricerca di '{query}' con max_results={max_results}")
    
    try:
        # Esegui la ricerca
        results = await service.search_food(query, max_results=max_results)
        
        if results is None:
            logger.error("TEST - La ricerca ha restituito None. Verifica le credenziali API.")
            return
        
        # Verifica formato e struttura dei risultati
        if "results" not in results:
            logger.error("TEST - Errore: I risultati non contengono il campo 'results'.")
            logger.info(f"TEST - Struttura restituita: {json.dumps(results, indent=2)}")
            return
            
        # Stampa i risultati
        result_count = len(results.get("results", []))
        logger.info(f"TEST - Trovati {result_count} risultati per '{query}'")
        
        if detail_mode:
            logger.info(f"TEST - Formato completo risposta: {json.dumps(results, indent=2)}")
        
        # Visualizza i singoli risultati
        for i, item in enumerate(results.get("results", [])):
            logger.info(f"\nRisultato #{i+1}:")
            logger.info(f"Nome: {item.get('name', 'N/A')}")
            logger.info(f"ID: {item.get('id', 'N/A')}")
            logger.info(f"Descrizione: {item.get('description', 'N/A')}")
            logger.info(f"Calorie: {item.get('calories', 'N/A')}")
            
            # Verifica la presenza dei campi principali
            missing_fields = []
            for field in ['id', 'name', 'macros', 'calories', 'servings']:
                if field not in item or item[field] is None:
                    missing_fields.append(field)
            
            if missing_fields:
                logger.warning(f"Campi mancanti: {', '.join(missing_fields)}")
            
            # Verifica macronutrienti
            macros = item.get('macros', {})
            if macros:
                logger.info(f"Proteine: {macros.get('protein', 'N/A')} g")
                logger.info(f"Grassi: {macros.get('fat', 'N/A')} g")
                logger.info(f"Carboidrati: {macros.get('carbs', 'N/A')} g")
            
            # Verifica formato per compatibilità con il frontend
            logger.info("Controllo formato compatibilità frontend:")
            # Adatta il formato per la compatibilità con la struttura FatSecret attesa
            frontend_format = {
                "food_id": item.get("id", ""),
                "food_name": item.get("name", ""),
                "food_description": item.get("description", ""),
                "brand_name": "Edamam",
                "calories": item.get("calories", 0)
            }
            logger.info(f"Formato compatibile: {json.dumps(frontend_format, indent=2)}")
        
        # Prova a recuperare i dettagli del primo risultato
        if result_count > 0:
            first_item = results["results"][0]
            food_id = first_item.get("id")
            
            if food_id:
                logger.info(f"\nRecupero dettagli per {first_item.get('name')} (ID: {food_id})...")
                details = await service.get_food(food_id)
                
                if details:
                    logger.info(f"Dettagli recuperati con successo!")
                    
                    # Mostra gli ingredienti
                    ingredients = details.get('ingredients', [])
                    if ingredients:
                        logger.info("Ingredienti:")
                        for i, ing in enumerate(ingredients[:5]):
                            logger.info(f"  {i+1}. {ing}")
                        if len(ingredients) > 5:
                            logger.info(f"  ... e altri {len(ingredients) - 5} ingredienti")
                    
                    if detail_mode:
                        logger.info(f"Dettagli completi: {json.dumps(details, indent=2)}")
                else:
                    logger.error("Impossibile recuperare i dettagli.")
    
    except Exception as e:
        logger.error(f"Errore durante l'esecuzione del test: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())

def main():
    """Funzione principale per l'esecuzione del test da riga di comando"""
    parser = argparse.ArgumentParser(description="Test del servizio Edamam migliorato")
    parser.add_argument("query", help="Termine di ricerca")
    parser.add_argument("-n", "--num-results", type=int, default=5, 
                        help="Numero di risultati da visualizzare (default: 5)")
    parser.add_argument("-d", "--detail", action="store_true", 
                        help="Visualizza dettagli completi incluso JSON")
    
    args = parser.parse_args()
    
    asyncio.run(run_enhanced_edamam_test(
        args.query, 
        max_results=args.num_results,
        detail_mode=args.detail
    ))

if __name__ == "__main__":
    main()
