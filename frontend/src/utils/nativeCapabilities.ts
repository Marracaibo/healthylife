/**
 * Utility per l'integrazione delle funzionalità native del dispositivo con la PWA
 */

import { v4 as uuidv4 } from 'uuid';
import { addToSyncQueue } from './offlineDatabase';

// Tipo per i risultati della scansione del codice a barre
export type BarcodeResult = {
  format: string;  // Formato del codice (es. EAN-13, QR, ecc.)
  value: string;   // Valore decodificato
  timestamp: number; // Timestamp della scansione
};

/**
 * Verifica se il browser supporta l'API Shape Detection per il riconoscimento dei codici a barre
 */
export const isBarcodeDetectionSupported = (): boolean => {
  return 'BarcodeDetector' in window;
};

/**
 * Verifica se il dispositivo ha una fotocamera accessibile
 */
export const hasCameraAccess = async (): Promise<boolean> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Rilascia immediatamente lo stream
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Errore nell\'accesso alla fotocamera:', error);
    return false;
  }
};

/**
 * Inizializza la scansione dei codici a barre utilizzando l'API Shape Detection
 * @param videoElement - Elemento video HTML da utilizzare come fonte
 * @param onDetected - Callback chiamata quando viene rilevato un codice
 * @returns Una funzione per interrompere la scansione
 */
export const startBarcodeScanning = async (
  videoElement: HTMLVideoElement,
  onDetected: (result: BarcodeResult) => void
): Promise<() => void> => {
  if (!isBarcodeDetectionSupported()) {
    throw new Error('La scansione dei codici a barre non è supportata in questo browser');
  }
  
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' } // Usa la fotocamera posteriore
  });
  
  videoElement.srcObject = stream;
  await videoElement.play();
  
  // @ts-ignore - BarcodeDetector potrebbe non essere riconosciuto da TypeScript
  const barcodeDetector = new window.BarcodeDetector({
    formats: [
      'code_39',
      'code_128',
      'ean_13',
      'ean_8',
      'upc_a',
      'upc_e',
      'itf',
      'qr_code'
    ]
  });
  
  let isRunning = true;
  
  const detectFrame = async () => {
    if (!isRunning) return;
    
    try {
      // @ts-ignore
      const barcodes = await barcodeDetector.detect(videoElement);
      
      if (barcodes.length > 0) {
        for (const barcode of barcodes) {
          const result: BarcodeResult = {
            format: barcode.format,
            value: barcode.rawValue,
            timestamp: Date.now()
          };
          
          onDetected(result);
        }
      }
    } catch (error) {
      console.error('Errore durante la scansione del codice a barre:', error);
    }
    
    requestAnimationFrame(detectFrame);
  };
  
  detectFrame();
  
  // Restituisce una funzione per interrompere la scansione
  return () => {
    isRunning = false;
    if (videoElement.srcObject) {
      (videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  };
};

/**
 * Cerca informazioni su un prodotto utilizzando il codice a barre
 * @param barcode - Codice a barre da cercare
 * @returns Promise con i dati del prodotto
 */
export const searchProductByBarcode = async (barcode: string) => {
  const endpoint = `/api/hybrid-food/barcode/${barcode}`;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Errore nella ricerca: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Errore nella ricerca per codice a barre:', error);
    
    // Se la rete non è disponibile, aggiungi alla coda di sincronizzazione
    if (!navigator.onLine) {
      await addToSyncQueue({
        endpoint,
        method: 'GET',
        data: { barcode }
      });
      
      return {
        offline: true,
        message: 'La richiesta verrà eseguita quando la connessione sarà disponibile',
        pendingBarcode: barcode
      };
    }
    
    throw error;
  }
};

/**
 * Salva un prodotto scansionato nel database locale e lo aggiunge alla coda di sincronizzazione
 * @param productData - Dati del prodotto da salvare
 */
export const saveScannedProduct = async (productData: any) => {
  // Genera un ID temporaneo per il prodotto
  const tempId = uuidv4();
  
  // Aggiungi alla coda di sincronizzazione
  await addToSyncQueue({
    endpoint: '/api/hybrid-food/products',
    method: 'POST',
    data: {
      ...productData,
      id: tempId,
      scannedAt: Date.now(),
      syncOrigin: 'barcode-scan'
    }
  });
  
  return {
    ...productData,
    id: tempId,
    pendingSync: true
  };
};

/**
 * Verifica se le notifiche push sono supportate e autorizzate
 */
export const arePushNotificationsSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Richiede il permesso per inviare notifiche push
 */
export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (!arePushNotificationsSupported()) {
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Errore nella richiesta del permesso per le notifiche:', error);
    return false;
  }
};

/**
 * Verifica se la condivisione è supportata
 */
export const isSharingSupported = (): boolean => {
  return 'share' in navigator;
};

/**
 * Condivide il contenuto utilizzando l'API Web Share
 */
export const shareContent = async (shareData: { title?: string; text?: string; url?: string }) => {
  if (!isSharingSupported()) {
    throw new Error('La condivisione non è supportata in questo browser');
  }
  
  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error('Errore nella condivisione del contenuto:', error);
    return false;
  }
};
