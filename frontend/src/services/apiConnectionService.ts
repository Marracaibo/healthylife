/**
 * API Connection Service
 * 
 * Servizio per monitorare e gestire la connessione alle API backend
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/constants';
import { createLogger } from '../utils/logger';

const logger = createLogger('ApiConnectionService');

interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

let connectionStatus: ConnectionStatus = {
  isConnected: true, // Ottimistico di default
  lastChecked: new Date(0), // Mai controllato
};

const CHECK_INTERVAL = 30000; // 30 secondi
let reconnectAttempts = 0;
let connectionMonitorActive = false;

/**
 * Verifica la connessione al backend
 */
export const checkConnection = async (): Promise<ConnectionStatus> => {
  const startTime = Date.now();
  
  try {
    // Utilizziamo l'endpoint /health o /docs come verifica
    const response = await axios.get(`${API_BASE_URL}/docs`, {
      timeout: 5000,
      // Non vogliamo che un errore qui blocchi l'intera app
      validateStatus: () => true
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Consideriamo connesso se otteniamo una risposta valida
    const isConnected = response.status < 500;
    
    connectionStatus = {
      isConnected,
      lastChecked: new Date(),
      statusCode: response.status,
      responseTime
    };
    
    if (isConnected) {
      reconnectAttempts = 0;
      logger.info(`Connessione API verificata: OK (${responseTime}ms)`);
    } else {
      reconnectAttempts++;
      logger.warn(`Connessione API non disponibile. Status: ${response.status}`);
    }
    
    return connectionStatus;
  } catch (error: any) {
    reconnectAttempts++;
    
    connectionStatus = {
      isConnected: false,
      lastChecked: new Date(),
      error: error.message
    };
    
    logger.error(`Errore di connessione API: ${error.message}`);
    return connectionStatus;
  }
};

/**
 * Inizia il monitoraggio della connessione API
 */
export const startConnectionMonitoring = () => {
  if (connectionMonitorActive) return;
  
  connectionMonitorActive = true;
  
  // Controlla immediatamente
  checkConnection();
  
  // Poi controlla periodicamente
  const intervalId = setInterval(async () => {
    await checkConnection();
  }, CHECK_INTERVAL);
  
  // Ritorna una funzione per fermare il monitoraggio
  return () => {
    clearInterval(intervalId);
    connectionMonitorActive = false;
  };
};

/**
 * Aggiunge un interceptor a tutte le richieste Axios
 * per verificare la connessione prima di ogni chiamata
 */
export const setupApiInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(async (config) => {
    // Se l'ultima verifica è stata più di 1 minuto fa, controlla di nuovo
    if (Date.now() - connectionStatus.lastChecked.getTime() > 60000) {
      await checkConnection();
    }
    
    // Se non siamo connessi, possiamo:    
    // 1. Ritardare la richiesta
    // 2. Annullare la richiesta
    // 3. Lasciarla procedere (in questo caso)
    
    return config;
  });
  
  // Response interceptor per gestire errori di connessione
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Se c'è un errore di rete, controlliamo la connessione
      if (error.message.includes('Network Error') || error.code === 'ECONNABORTED') {
        logger.warn('Errore di rete rilevato, verifica connessione...');
        await checkConnection();
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Helper per eseguire una richiesta API con retry automatico
 */
export const fetchWithRetry = async <T>(config: AxiosRequestConfig, retries = 3, delayMs = 1000): Promise<AxiosResponse<T>> => {
  try {
    return await axios(config);
  } catch (error: any) {
    // Se abbiamo ancora tentativi disponibili e l'errore è di rete
    if (
      retries > 0 && 
      (error.message.includes('Network Error') || 
       error.code === 'ECONNABORTED' ||
       (error.response && error.response.status >= 500))
    ) {
      logger.info(`Ritentativo chiamata API in ${delayMs}ms, ${retries} tentativi rimasti`);
      
      // Attesa prima del retry
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      // Retry con backoff esponenziale
      return fetchWithRetry(config, retries - 1, delayMs * 2);
    }
    
    throw error;
  }
};

export default {
  checkConnection,
  startConnectionMonitoring,
  setupApiInterceptors,
  fetchWithRetry,
  getConnectionStatus: () => connectionStatus
};
