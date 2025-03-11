import { createLogger } from '../utils/logger';

const logger = createLogger('TranslationService');

/**
 * Servizio per la traduzione dei termini alimentari dall'italiano all'inglese
 * per migliorare i risultati delle ricerche nelle API alimentari
 */
class TranslationService {
  private foodDictionary: Record<string, string> = {
    // Frutta
    'mela': 'apple',
    'pera': 'pear',
    'banana': 'banana',
    'arancia': 'orange',
    'limone': 'lemon',
    'fragola': 'strawberry',
    'fragole': 'strawberries',
    'lampone': 'raspberry',
    'lamponi': 'raspberries',
    'mirtillo': 'blueberry',
    'mirtilli': 'blueberries',
    'kiwi': 'kiwi',
    'ananas': 'pineapple',
    'anguria': 'watermelon',
    'melone': 'melon',
    'uva': 'grapes',
    'ciliegia': 'cherry',
    'ciliegie': 'cherries',
    'pesca': 'peach',
    'albicocca': 'apricot',
    'prugna': 'plum',
    'mandarino': 'tangerine',
    'pompelmo': 'grapefruit',
    'fico': 'fig',
    'dattero': 'date',
    'avocado': 'avocado',
    'melograno': 'pomegranate',
    'cachi': 'persimmon',
    'papaya': 'papaya',
    'mango': 'mango',

    // Verdura
    'pomodoro': 'tomato',
    'pomodori': 'tomatoes',
    'patata': 'potato',
    'patate': 'potatoes',
    'carota': 'carrot',
    'carote': 'carrots',
    'cipolla': 'onion',
    'cipolle': 'onions',
    'aglio': 'garlic',
    'zucchina': 'zucchini',
    'zucchine': 'zucchini',
    'melanzana': 'eggplant',
    'melanzane': 'eggplants',
    'peperone': 'bell pepper',
    'peperoni': 'bell peppers',
    'broccolo': 'broccoli',
    'broccoli': 'broccoli',
    'cavolfiore': 'cauliflower',
    'cavolo': 'cabbage',
    'spinaci': 'spinach',
    'lattuga': 'lettuce',
    'insalata': 'salad',
    'rucola': 'arugula',
    'radicchio': 'radicchio',
    'sedano': 'celery',
    'finocchio': 'fennel',
    'asparago': 'asparagus',
    'asparagi': 'asparagus',
    'carciofo': 'artichoke',
    'carciofi': 'artichokes',
    'funghi': 'mushrooms',
    'fungo': 'mushroom',
    'zucca': 'pumpkin',
    'piselli': 'peas',
    'fagioli': 'beans',
    'lenticchie': 'lentils',
    'ceci': 'chickpeas',
    'fave': 'broad beans',
    'barbabietola': 'beetroot',
    'ravanello': 'radish',
    'ravanelli': 'radishes',
    'porro': 'leek',
    'porri': 'leeks',

    // Carne
    'manzo': 'beef',
    'vitello': 'veal',
    'maiale': 'pork',
    'agnello': 'lamb',
    'pollo': 'chicken',
    'tacchino': 'turkey',
    'coniglio': 'rabbit',
    'anatra': 'duck',
    'oca': 'goose',
    'selvaggina': 'game meat',
    'salsiccia': 'sausage',
    'prosciutto': 'ham',
    'pancetta': 'bacon',
    'salame': 'salami',
    'mortadella': 'mortadella',
    'bresaola': 'bresaola',
    'speck': 'speck',
    'cotoletta': 'cutlet',
    'bistecca': 'steak',
    'hamburger': 'hamburger',
    'polpetta': 'meatball',
    'polpette': 'meatballs',
    'arrosto': 'roast',
    'fegato': 'liver',
    'trippa': 'tripe',

    // Pesce
    'pesce': 'fish',
    'salmone': 'salmon',
    'tonno': 'tuna',
    'merluzzo': 'cod',
    'orata': 'sea bream',
    'branzino': 'sea bass',
    'trota': 'trout',
    'sgombro': 'mackerel',
    'sardina': 'sardine',
    'sardine': 'sardines',
    'acciuga': 'anchovy',
    'acciughe': 'anchovies',
    'calamaro': 'squid',
    'calamari': 'squids',
    'polpo': 'octopus',
    'gambero': 'shrimp',
    'gamberi': 'shrimps',
    'aragosta': 'lobster',
    'granchio': 'crab',
    'cozza': 'mussel',
    'cozze': 'mussels',
    'vongola': 'clam',
    'vongole': 'clams',
    'ostrica': 'oyster',
    'ostriche': 'oysters',
    'capesante': 'scallops',

    // Latticini
    'latte': 'milk',
    'formaggio': 'cheese',
    'formaggi': 'cheeses',
    'parmigiano': 'parmesan',
    'mozzarella': 'mozzarella',
    'ricotta': 'ricotta',
    'gorgonzola': 'gorgonzola',
    'pecorino': 'pecorino',
    'mascarpone': 'mascarpone',
    'burro': 'butter',
    'yogurt': 'yogurt',
    'panna': 'cream',
    'gelato': 'ice cream',

    // Cereali e derivati
    'pane': 'bread',
    'pasta': 'pasta',
    'riso': 'rice',
    'farina': 'flour',
    'mais': 'corn',
    'polenta': 'polenta',
    'avena': 'oats',
    'orzo': 'barley',
    'farro': 'spelt',
    'quinoa': 'quinoa',
    'couscous': 'couscous',
    'bulgur': 'bulgur',
    'pizza': 'pizza',
    'focaccia': 'focaccia',
    'grissini': 'breadsticks',
    'cracker': 'crackers',
    'biscotto': 'cookie',
    'biscotti': 'cookies',
    'torta': 'cake',
    'crostata': 'tart',
    'croissant': 'croissant',
    'brioche': 'brioche',
    'panino': 'sandwich',

    // Legumi
    'legumi': 'legumes',
    'soia': 'soy',
    'tofu': 'tofu',
    'tempeh': 'tempeh',
    'seitan': 'seitan',

    // Frutta secca
    'noce': 'walnut',
    'noci': 'walnuts',
    'mandorla': 'almond',
    'mandorle': 'almonds',
    'nocciola': 'hazelnut',
    'nocciole': 'hazelnuts',
    'pistacchio': 'pistachio',
    'pistacchi': 'pistachios',
    'arachide': 'peanut',
    'arachidi': 'peanuts',
    'pinolo': 'pine nut',
    'pinoli': 'pine nuts',
    'anacardo': 'cashew',
    'anacardi': 'cashews',
    'castagna': 'chestnut',
    'castagne': 'chestnuts',

    // Condimenti
    'olio': 'oil',
    'aceto': 'vinegar',
    'sale': 'salt',
    'pepe': 'pepper',
    'zucchero': 'sugar',
    'miele': 'honey',
    'maionese': 'mayonnaise',
    'ketchup': 'ketchup',
    'senape': 'mustard',
    'salsa': 'sauce',

    // Bevande
    'acqua': 'water',
    'vino': 'wine',
    'birra': 'beer',
    'caffè': 'coffee',
    'tè': 'tea',
    'succo': 'juice',
    'limonata': 'lemonade',
    'aranciata': 'orangeade',
    'cola': 'cola',
    'soda': 'soda',

    // Pasti
    'colazione': 'breakfast',
    'pranzo': 'lunch',
    'cena': 'dinner',
    'merenda': 'snack',
    'spuntino': 'snack',

    // Piatti tipici italiani
    'lasagna': 'lasagna',
    'lasagne': 'lasagna',
    'spaghetti': 'spaghetti',
    'penne': 'penne',
    'fusilli': 'fusilli',
    'farfalle': 'farfalle',
    'ravioli': 'ravioli',
    'gnocchi': 'gnocchi',
    'risotto': 'risotto',
    'minestrone': 'minestrone',
    'carbonara': 'carbonara',
    'amatriciana': 'amatriciana',
    'pesto': 'pesto',
    'bolognese': 'bolognese',
    'tiramisu': 'tiramisu',
    'cannoli': 'cannoli',
    'parmigiana': 'parmigiana',
    'bruschetta': 'bruschetta',
    'caprese': 'caprese',
    'carpaccio': 'carpaccio',
    'ossobuco': 'ossobuco',
    'saltimbocca': 'saltimbocca',
    'arancini': 'arancini',
    'calzone': 'calzone',
    'panettone': 'panettone',
    'pandoro': 'pandoro',
  };

  /**
   * Traduce un termine alimentare dall'italiano all'inglese
   * @param term Termine da tradurre
   * @returns Termine tradotto o il termine originale se non trovato nel dizionario
   */
  translateFoodTerm(term: string): string {
    const lowerTerm = term.toLowerCase().trim();
    return this.foodDictionary[lowerTerm] || term;
  }

  /**
   * Traduce una query di ricerca alimentare dall'italiano all'inglese
   * Gestisce termini multipli e frasi complesse
   * @param query Query di ricerca in italiano
   * @returns Query tradotta in inglese
   */
  translateFoodQuery(query: string): string {
    if (!query || query.trim() === '') return query;
    
    // Normalizza la query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Verifica se la query completa è nel dizionario
    if (this.foodDictionary[normalizedQuery]) {
      logger.debug(`Traduzione diretta: "${normalizedQuery}" -> "${this.foodDictionary[normalizedQuery]}"`);
      return this.foodDictionary[normalizedQuery];
    }
    
    // Dividi la query in parole e traduci ciascuna parola
    const words = normalizedQuery.split(/\s+/);
    
    // Se è una singola parola che non è nel dizionario, restituisci la parola originale
    if (words.length === 1 && !this.foodDictionary[words[0]]) {
      return query;
    }
    
    // Traduci ogni parola se possibile
    const translatedWords = words.map(word => this.foodDictionary[word] || word);
    const translatedQuery = translatedWords.join(' ');
    
    logger.debug(`Traduzione per parole: "${normalizedQuery}" -> "${translatedQuery}"`);
    return translatedQuery;
  }

  /**
   * Verifica se una query è in italiano
   * @param query Query da verificare
   * @returns true se la query contiene parole italiane riconosciute
   */
  isItalianQuery(query: string): boolean {
    if (!query || query.trim() === '') return false;
    
    const words = query.toLowerCase().trim().split(/\s+/);
    
    // Controlla se almeno una parola è nel dizionario italiano-inglese
    return words.some(word => this.foodDictionary[word] !== undefined);
  }

  /**
   * Verifica se un singolo termine è italiano (presente nel dizionario)
   * @param term Termine da verificare
   * @returns true se il termine è presente nel dizionario italiano
   */
  isItalianTerm(term: string): boolean {
    if (!term || term.trim() === '') return false;
    const normalizedTerm = term.toLowerCase().trim();
    return this.foodDictionary[normalizedTerm] !== undefined;
  }
}

export const translationService = new TranslationService();
export default translationService;
