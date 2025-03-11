import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export interface NLPResult {
  foods: {
    id: string;
    name: string;
    brand: string;
    description?: string;
    serving_description?: string;
    nutrition?: {
      calories?: number;
      protein?: number;
      carbohydrate?: number;
      fat?: number;
    };
  }[];
  status: string;
}

/**
 * Elabora una frase in linguaggio naturale per estrarre riferimenti ad alimenti
 * @param userInput Il testo da analizzare (es. "Ho mangiato una pizza margherita")
 * @param region Regione per la localizzazione (default: Italy)
 * @param language Lingua dell'input (default: it)
 * @returns Promise con i risultati dell'elaborazione
 */
export const processText = async (userInput: string, region: string = 'Italy', language: string = 'it'): Promise<NLPResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/nlp/process`, {
      user_input: userInput,
      region,
      language
    });
    
    return response.data;
  } catch (error) {
    console.error('Errore nell\'elaborazione del testo:', error);
    throw error;
  }
};

export default {
  processText
};
