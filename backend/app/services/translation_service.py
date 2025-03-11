"""
Translation service for food queries.
This module integrates with the main translation service from backend/services/translation_service.py.
"""

import logging
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path to be able to import from backend.services
backend_dir = Path(__file__).parents[2]
if str(backend_dir) not in sys.path:
    sys.path.append(str(backend_dir))

# Import the translation service
try:
    from services.translation_service import translation_service
except ImportError as e:
    logging.error(f"Could not import translation_service: {e}")
    
logger = logging.getLogger(__name__)

def translate_food_query(query: str) -> str:
    """
    Translate a food query from Italian to English.
    
    Args:
        query: The Italian food query
        
    Returns:
        The English translation
    """
    try:
        return translation_service.translate_query(query)
    except Exception as e:
        logger.error(f"Error translating query '{query}': {str(e)}")
        return query  # Return original query if translation fails

def is_italian(query: str) -> bool:
    """
    Check if a query is likely in Italian.
    
    Args:
        query: The query to check
        
    Returns:
        True if the query is likely Italian, False otherwise
    """
    try:
        return translation_service.is_italian_query(query)
    except Exception as e:
        logger.error(f"Error checking if query '{query}' is Italian: {str(e)}")
        return False  # Default to False if check fails
