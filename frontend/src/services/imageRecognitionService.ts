import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export interface FoodItem {
  food_id?: number;
  food_entry_name: string;
  eaten?: {
    total_nutritional_content?: {
      calories?: string;
      protein?: string;
      carbohydrate?: string;
      fat?: string;
      saturated_fat?: string;
      fiber?: string;
      sodium?: string;
    };
    metric_description?: string;
    total_metric_amount?: number;
  };
  suggested_serving?: {
    serving_id?: number;
    serving_description?: string;
    metric_serving_description?: string;
    metric_measure_amount?: number;
    number_of_units?: string;
  };
}

export interface ImageRecognitionResult {
  food_response: FoodItem[];
  status: string;
}

/**
 * Carica un'immagine e la elabora per riconoscere gli alimenti presenti
 * @param imageFile Il file dell'immagine da analizzare
 * @param region Regione per la localizzazione (default: Italy)
 * @param language Lingua dell'output (default: it)
 * @returns Promise con i risultati dell'elaborazione
 */
export const uploadImage = async (
  imageFile: File,
  region: string = 'Italy',
  language: string = 'it'
): Promise<ImageRecognitionResult> => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('region', region);
    formData.append('language', language);

    const response = await axios.post(
      `${API_BASE_URL}/api/image-recognition/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Errore nell\'elaborazione dell\'immagine:', error);
    throw error;
  }
};

/**
 * Elabora un'immagine in base64 per riconoscere gli alimenti presenti
 * @param imageBase64 L'immagine codificata in base64
 * @param region Regione per la localizzazione (default: Italy)
 * @param language Lingua dell'output (default: it)
 * @returns Promise con i risultati dell'elaborazione
 */
export const processImageBase64 = async (
  imageBase64: string,
  region: string = 'Italy',
  language: string = 'it'
): Promise<ImageRecognitionResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/image-recognition/process`, {
      image_base64: imageBase64,
      region,
      language
    });
    
    return response.data;
  } catch (error) {
    console.error('Errore nell\'elaborazione dell\'immagine:', error);
    throw error;
  }
};

export default {
  uploadImage,
  processImageBase64
};
