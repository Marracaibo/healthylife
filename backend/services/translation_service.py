"""
Translation Service

This service provides translation capabilities for the food search service,
allowing queries in Italian to be translated to English before being sent to
food APIs that primarily support English.
"""

import os
import logging
import json
from typing import Dict, Optional

# Translation dictionaries
ITALIAN_TO_ENGLISH_FOOD_TERMS = {
    # Alimenti base / Basic foods
    "pane": "bread",
    "pasta": "pasta",
    "riso": "rice",
    "carne": "meat",
    "pesce": "fish",
    "frutta": "fruit",
    "verdura": "vegetable",
    "formaggio": "cheese",
    "latte": "milk",
    "uova": "eggs",
    "zucchero": "sugar",
    "sale": "salt",
    "olio": "oil",
    "acqua": "water",
    
    # Verdure / Vegetables
    "pomodoro": "tomato",
    "pomodori": "tomatoes",
    "patata": "potato",
    "patate": "potatoes",
    "carota": "carrot",
    "carote": "carrots",
    "cipolla": "onion",
    "cipolle": "onions",
    "aglio": "garlic",
    "lattuga": "lettuce",
    "spinaci": "spinach",
    "zucchina": "zucchini",
    "zucchine": "zucchini",
    "melanzana": "eggplant",
    "melanzane": "eggplants",
    "peperone": "bell pepper",
    "peperoni": "bell peppers",
    "broccoli": "broccoli",
    "cavolfiore": "cauliflower",
    "cavolo": "cabbage",
    "funghi": "mushrooms",
    "fungo": "mushroom",
    "asparagi": "asparagus",
    "sedano": "celery",
    "basilico": "basil",
    "prezzemolo": "parsley",
    "rosmarino": "rosemary",
    "salvia": "sage",
    "timo": "thyme",
    "origano": "oregano",

    # Frutta / Fruits
    "mela": "apple",
    "mele": "apples",
    "banana": "banana",
    "banane": "bananas",
    "arancia": "orange",
    "arance": "oranges",
    "limone": "lemon",
    "limoni": "lemons",
    "fragola": "strawberry",
    "fragole": "strawberries",
    "pera": "pear",
    "pere": "pears",
    "pesca": "peach",
    "pesche": "peaches",
    "uva": "grape",
    "ananas": "pineapple",
    "anguria": "watermelon",
    "melone": "melon",
    "ciliegia": "cherry",
    "ciliegie": "cherries",
    "lampone": "raspberry",
    "lamponi": "raspberries",
    "mirtillo": "blueberry",
    "mirtilli": "blueberries",
    "kiwi": "kiwi",
    "fico": "fig",
    "fichi": "figs",
    "dattero": "date",
    "datteri": "dates",
    "avocado": "avocado",
    "melograno": "pomegranate",

    # Carne / Meat
    "carne": "meat",
    "manzo": "beef",
    "vitello": "veal",
    "maiale": "pork",
    "agnello": "lamb",
    "pollo": "chicken",
    "tacchino": "turkey",
    "coniglio": "rabbit",
    "anatra": "duck",
    "oca": "goose",
    "cinghiale": "wild boar",
    "salsiccia": "sausage",
    "salsicce": "sausages",
    "bistecca": "steak",
    "costata": "rib steak",
    "filetto": "fillet",
    "hamburger": "hamburger",
    "polpetta": "meatball",
    "polpette": "meatballs",
    "arrosto": "roast",
    
    # Pesce / Fish & Seafood
    "pesce": "fish",
    "tonno": "tuna",
    "salmone": "salmon",
    "merluzzo": "cod",
    "orata": "sea bream",
    "branzino": "sea bass",
    "spigola": "sea bass",
    "sogliola": "sole",
    "calamaro": "squid",
    "calamari": "squid",
    "gambero": "shrimp",
    "gamberi": "shrimp",
    "granchio": "crab",
    "aragosta": "lobster",
    "cozza": "mussel",
    "cozze": "mussels",
    "vongola": "clam",
    "vongole": "clams",
    "ostrica": "oyster",
    "ostriche": "oysters",
    "seppia": "cuttlefish",
    "seppie": "cuttlefish",
    "polpo": "octopus",
    
    # Latticini / Dairy
    "latte": "milk",
    "formaggio": "cheese",
    "formaggi": "cheeses",
    "mozzarella": "mozzarella",
    "parmigiano": "parmesan",
    "ricotta": "ricotta",
    "mascarpone": "mascarpone",
    "gorgonzola": "gorgonzola",
    "pecorino": "pecorino",
    "scamorza": "scamorza",
    "burro": "butter",
    "yogurt": "yogurt",
    "panna": "cream",
    "uovo": "egg",
    "uova": "eggs",
    
    # Cereali / Grains
    "riso": "rice",
    "pasta": "pasta",
    "grano": "wheat",
    "farina": "flour",
    "mais": "corn",
    "polenta": "polenta",
    "orzo": "barley",
    "avena": "oats",
    "segale": "rye",
    "farro": "spelt",
    "quinoa": "quinoa",
    "couscous": "couscous",
    "bulgur": "bulgur",
    
    # Pane e prodotti da forno / Bread & Bakery
    "pane": "bread",
    "focaccia": "focaccia",
    "grissini": "breadsticks",
    "brioche": "brioche",
    "croissant": "croissant",
    "cornetto": "croissant",
    "pizza": "pizza",
    "ciabatta": "ciabatta",
    "baguette": "baguette",
    "panino": "sandwich",
    "panini": "sandwiches",
    "cracker": "cracker",
    "biscotto": "cookie",
    "biscotti": "cookies",
    "torta": "cake",
    "crostata": "tart",
    "dolce": "dessert",
    "dolci": "desserts",
    
    # Legumi / Legumes
    "fagiolo": "bean",
    "fagioli": "beans",
    "lenticchia": "lentil",
    "lenticchie": "lentils",
    "cece": "chickpea",
    "ceci": "chickpeas",
    "pisello": "pea",
    "piselli": "peas",
    "fava": "broad bean",
    "fave": "broad beans",
    "soia": "soy",
    
    # Bevande / Beverages
    "acqua": "water",
    "vino": "wine",
    "birra": "beer",
    "succo": "juice",
    "caffè": "coffee",
    "tè": "tea",
    "espresso": "espresso",
    "cappuccino": "cappuccino",
    "latte macchiato": "latte macchiato",
    "cioccolata calda": "hot chocolate",
    "aranciata": "orange soda",
    "limonata": "lemonade",
    
    # Condimenti / Condiments & Sauces
    "olio": "oil",
    "olio d'oliva": "olive oil",
    "aceto": "vinegar",
    "aceto balsamico": "balsamic vinegar",
    "sale": "salt",
    "pepe": "pepper",
    "zucchero": "sugar",
    "salsa": "sauce",
    "pesto": "pesto",
    "maionese": "mayonnaise",
    "ketchup": "ketchup",
    "senape": "mustard",
    "ragù": "bolognese sauce",
    
    # Frutta secca / Nuts & Dried Fruits
    "noce": "walnut",
    "noci": "walnuts",
    "mandorla": "almond",
    "mandorle": "almonds",
    "nocciola": "hazelnut",
    "nocciole": "hazelnuts",
    "pistacchio": "pistachio",
    "pistacchi": "pistachios",
    "arachide": "peanut",
    "arachidi": "peanuts",
    "castagna": "chestnut",
    "castagne": "chestnuts",
    "pinolo": "pine nut",
    "pinoli": "pine nuts",
    "uva passa": "raisin",
    
    # Preparazione / Preparation
    "crudo": "raw",
    "cotto": "cooked",
    "bollito": "boiled",
    "fritto": "fried",
    "al forno": "baked",
    "alla griglia": "grilled",
    "grigliato": "grilled",
    "al vapore": "steamed",
    "saltato": "sautéed",
    "affumicato": "smoked",
    "marinato": "marinated",
    
    # Parole comuni per il cibo / Common Food Words
    "colazione": "breakfast",
    "pranzo": "lunch",
    "cena": "dinner",
    "antipasto": "appetizer",
    "antipasti": "appetizers",
    "primo": "first course",
    "secondo": "second course",
    "contorno": "side dish",
    "contorni": "side dishes",
    "dessert": "dessert",
    "spuntino": "snack",
    "merenda": "snack",
    
    # Termini culinari / Culinary Terms
    "cucina": "cuisine",
    "ricetta": "recipe",
    "ricette": "recipes",
    "ingrediente": "ingredient",
    "ingredienti": "ingredients",
    "porzione": "portion",
    "porzioni": "portions",
    "caloria": "calorie",
    "calorie": "calories",
    "nutriente": "nutrient",
    "nutrienti": "nutrients",
    "proteina": "protein",
    "proteine": "proteins",
    "carboidrato": "carbohydrate",
    "carboidrati": "carbohydrates",
    "grasso": "fat",
    "grassi": "fats",
    "fibra": "fiber",
    "fibre": "fibers",
    "vitamina": "vitamin",
    "vitamine": "vitamins",
    "minerale": "mineral",
    "minerali": "minerals",
    
    # Piatti specifici italiani / Specific Italian Dishes
    "pizza margherita": "margherita pizza",
    "lasagna": "lasagna",
    "lasagne": "lasagna",
    "spaghetti": "spaghetti",
    "spaghetti alla carbonara": "spaghetti carbonara",
    "spaghetti aglio e olio": "spaghetti with garlic and oil",
    "pasta al pomodoro": "pasta with tomato sauce",
    "pasta alla bolognese": "pasta bolognese",
    "risotto": "risotto",
    "risotto ai funghi": "mushroom risotto",
    "minestrone": "minestrone",
    "bruschetta": "bruschetta",
    "carpaccio": "carpaccio",
    "tiramisu": "tiramisu",
    "cannoli": "cannoli",
    "gelato": "ice cream",
    "prosciutto": "ham",
    "prosciutto crudo": "prosciutto",
    "prosciutto cotto": "cooked ham",
    "salame": "salami",
    "mortadella": "mortadella",
    "bresaola": "bresaola",
    "minestra": "soup",
    "stufato": "stew",
    "risotto": "risotto",
    "lasagna": "lasagna",
    "lasagne": "lasagna",
    
    # Nuove aggiunte - Salumi e formaggi italiani / New additions - Italian cold cuts and cheeses
    "pancetta": "pancetta",
    "guanciale": "guanciale",
    "speck": "speck",
    "coppa": "coppa",
    "nduja": "nduja",
    "salame piccante": "spicy salami",
    "burrata": "burrata",
    "stracciatella": "stracciatella",
    "fontina": "fontina",
    "taleggio": "taleggio",
    "asiago": "asiago",
    "provolone": "provolone",
    "grana padano": "grana padano",
    
    # Nuove aggiunte - Tipi di pasta / New additions - Pasta types
    "penne": "penne",
    "farfalle": "farfalle",
    "fusilli": "fusilli",
    "maccheroni": "macaroni",
    "tagliatelle": "tagliatelle",
    "fettuccine": "fettuccine",
    "linguine": "linguine",
    "bucatini": "bucatini",
    "conchiglie": "shell pasta",
    "orecchiette": "orecchiette",
    "pappardelle": "pappardelle",
    "gnocchi": "gnocchi",
    "ravioli": "ravioli",
    "tortellini": "tortellini",
    "cannelloni": "cannelloni",
    
    # Nuove aggiunte - Modi di cucinare / New additions - Cooking methods
    "brasato": "braised",
    "stufato": "stewed",
    "ripieno": "stuffed",
    "farcito": "stuffed",
    "gratinato": "au gratin",
    "impanato": "breaded",
    "confit": "confit",
    "carpaccio": "carpaccio",
    "alla cacciatora": "hunter-style",
    "alla parmigiana": "parmesan-style",
    "al sugo": "with sauce",
    "al pesto": "with pesto",
    "alla carbonara": "carbonara-style",
    "all'arrabbiata": "arrabbiata-style",
    "alla norma": "norma-style",
    "all'amatriciana": "amatriciana-style",
    
    # Nuove aggiunte - Preparazioni specifiche / New additions - Specific preparations
    "al dente": "al dente",
    "soffritto": "soffritto",
    "battuto": "battuto",
    "stracotto": "slow-cooked",
    "scottato": "seared",
    "in padella": "pan-fried",
    "in umido": "stewed",
    "alla piastra": "grilled",
    "alla brace": "charcoal-grilled",
    "in brodo": "in broth",
    "in bianco": "plain",
    "alla pizzaiola": "pizzaiola-style",
    "alla milanese": "milanese-style",
    "alla romana": "roman-style",
    "alla siciliana": "sicilian-style",
    "alla napoletana": "neapolitan-style",
    "alla ligure": "ligurian-style",
    "alla toscana": "tuscan-style",
    
    # Nuove aggiunte - Preposizioni e congiunzioni per le ricette / New additions - Prepositions and conjunctions
    "al": "with",
    "alla": "with",
    "con": "with",
    "senza": "without",
    "e": "and",
    "di": "of",
    "a": "to",
    "da": "from",
    "in": "in"
}

logger = logging.getLogger(__name__)

class TranslationService:
    """Service for translating food queries from Italian to English."""
    
    def __init__(self):
        """Initialize the translation service."""
        self.dictionary = ITALIAN_TO_ENGLISH_FOOD_TERMS
        logger.info(f"TranslationService initialized with {len(self.dictionary)} terms")
        self.cache = {}
        
    def translate_query(self, query: str) -> str:
        """
        Translate an Italian food query to English.
        
        Args:
            query: The Italian food query to translate
            
        Returns:
            The translated English query
        """
        # Check cache first
        query_lowercase = query.lower()
        if query_lowercase in self.cache:
            logger.info(f"Translation for '{query}' found in cache: '{self.cache[query_lowercase]}'")
            return self.cache[query_lowercase]
        
        # Direct translation if in the dictionary
        if query_lowercase in self.dictionary:
            translated = self.dictionary[query_lowercase]
            self.cache[query_lowercase] = translated
            logger.info(f"Direct translation for '{query}': '{translated}'")
            return translated
        
        # Try word-by-word translation
        words = query_lowercase.split()
        translated_words = []
        
        for word in words:
            if word in self.dictionary:
                translated_words.append(self.dictionary[word])
            else:
                translated_words.append(word)  # Keep original if not in dictionary
        
        translated = " ".join(translated_words)
        
        # Only cache if actually translated (at least one word changed)
        if translated != query_lowercase:
            self.cache[query_lowercase] = translated
            logger.info(f"Word-by-word translation for '{query}': '{translated}'")
        else:
            logger.info(f"No translation needed for '{query}'")
            
        return translated
        
    def is_italian_query(self, query: str) -> bool:
        """
        Check if a query is likely to be in Italian.
        
        Args:
            query: The query to check
            
        Returns:
            True if the query is likely Italian, False otherwise
        """
        query_lower = query.lower()
        words = query_lower.split()
        
        italian_word_count = 0
        
        for word in words:
            if word in self.dictionary:
                italian_word_count += 1
                
        # If at least 30% of words are recognized as Italian, consider it an Italian query
        return italian_word_count > 0 and (italian_word_count / len(words)) >= 0.3

# Singleton instance
translation_service = TranslationService()
