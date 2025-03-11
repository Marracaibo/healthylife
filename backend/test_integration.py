#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import aiohttp
import asyncio
import json
import argparse
import logging
import sys

# Configurazione del logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s',
                    handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

API_BASE_URL = "http://localhost:8000/api/fatsecret"

async def test_search_endpoint(query: str, max_results: int = 5):
    """Testa l'endpoint di ricerca standard con il servizio configurato nell'ambiente"""
    url = f"{API_BASE_URL}/search"
    params = {
        "query": query,
        "max_results": max_results
    }
    
    logger.info(f"Testando endpoint di ricerca standard con query '{query}'...")
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"Risposta OK (200): Trovati {len(data['results'])} risultati")
                    
                    # Mostra i risultati trovati
                    for i, item in enumerate(data["results"]):
                        logger.info(f"\nRisultato #{i+1}:")
                        logger.info(f"ID: {item.get('id', 'N/A')}")
                        logger.info(f"Nome: {item.get('name', 'N/A')}")
                        logger.info(f"Descrizione: {item.get('description', 'N/A')}")
                        logger.info(f"Calorie: {item.get('calories', 'N/A')}")
                else:
                    error_text = await response.text()
                    logger.error(f"Errore ({response.status}): {error_text}")
                    
        except Exception as e:
            logger.error(f"Errore durante la richiesta: {str(e)}")

async def test_enhanced_edamam(query: str, max_results: int = 5):
    """Testa l'endpoint specifico per il servizio Edamam migliorato"""
    url = f"{API_BASE_URL}/test-enhanced-edamam"
    params = {
        "query": query,
        "max_results": max_results
    }
    
    logger.info(f"Testando endpoint Edamam migliorato con query '{query}'...")
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Verifica il formato della risposta
                    if "foods" in data and "food" in data["foods"]:
                        foods = data["foods"]["food"]
                        logger.info(f"Risposta OK (200): Trovati {len(foods)} risultati")
                        
                        # Mostra i risultati trovati
                        for i, item in enumerate(foods):
                            logger.info(f"\nRisultato #{i+1}:")
                            logger.info(f"ID: {item.get('food_id', 'N/A')}")
                            logger.info(f"Nome: {item.get('food_name', 'N/A')}")
                            logger.info(f"Descrizione: {item.get('food_description', 'N/A')}")
                    else:
                        logger.warning("Formato risposta non standard")
                        logger.info(f"Struttura risposta: {json.dumps(data, indent=2)}")
                else:
                    error_text = await response.text()
                    logger.error(f"Errore ({response.status}): {error_text}")
                    
        except Exception as e:
            logger.error(f"Errore durante la richiesta: {str(e)}")

async def main():
    """Funzione principale per l'esecuzione dei test"""
    parser = argparse.ArgumentParser(description="Test di integrazione per gli endpoint dell'API")
    parser.add_argument("query", help="Termine di ricerca")
    parser.add_argument("-n", "--num-results", type=int, default=5, 
                        help="Numero di risultati da visualizzare (default: 5)")
    parser.add_argument("-s", "--standard", action="store_true", 
                        help="Testa l'endpoint di ricerca standard")
    parser.add_argument("-e", "--enhanced", action="store_true", 
                        help="Testa l'endpoint Edamam migliorato")
    
    args = parser.parse_args()
    
    # Se non è specificato nessun test, esegui entrambi
    if not args.standard and not args.enhanced:
        args.standard = True
        args.enhanced = True
    
    # Esegui i test selezionati
    if args.standard:
        await test_search_endpoint(args.query, args.num_results)
    
    if args.enhanced:
        await test_enhanced_edamam(args.query, args.num_results)

if __name__ == "__main__":
    asyncio.run(main())
