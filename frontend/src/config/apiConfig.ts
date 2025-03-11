/**
 * Configurazione API per l'applicazione HealthyLife
 */

// URL base dell'API
export const API_BASE_URL = 'http://localhost:8000';

// Timeout per le richieste API in millisecondi
export const API_TIMEOUT = 10000;

// Configurazione per i tentativi di ripetizione delle richieste fallite
export const API_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504]
};
