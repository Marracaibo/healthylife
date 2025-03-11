/**
 * Logger utility per l'applicazione
 * Fornisce un'interfaccia consistente per il logging con supporto per diversi livelli
 * e prefissi per identificare facilmente la sorgente dei log
 */

// Livelli di log supportati
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Configurazione globale del logger
const loggerConfig = {
  // Livello minimo di log da visualizzare (tutto ciò che è inferiore viene ignorato)
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  
  // Se true, aggiunge un timestamp a ogni log
  showTimestamp: true,
  
  // Se true, mostra il livello di log
  showLevel: true,
  
  // Se true, abilita i log colorati nella console (solo per sviluppo)
  enableColors: process.env.NODE_ENV !== 'production'
};

/**
 * Crea un logger con un prefisso specifico
 * @param prefix Prefisso da aggiungere ai messaggi di log (es. nome del componente)
 * @returns Oggetto logger con metodi per ogni livello di log
 */
export const createLogger = (prefix: string) => {
  const formatMessage = (level: LogLevel, message: string, ...args: any[]): [string, ...any[]] => {
    let formattedMessage = '';
    
    // Aggiungi timestamp se configurato
    if (loggerConfig.showTimestamp) {
      const now = new Date();
      formattedMessage += `[${now.toISOString()}] `;
    }
    
    // Aggiungi livello se configurato
    if (loggerConfig.showLevel) {
      formattedMessage += `[${level.toUpperCase()}] `;
    }
    
    // Aggiungi prefisso
    formattedMessage += `[${prefix}] ${message}`;
    
    return [formattedMessage, ...args];
  };
  
  // Determina se un livello di log dovrebbe essere visualizzato
  const shouldLog = (level: LogLevel): boolean => {
    const levels = Object.values(LogLevel);
    const minLevelIndex = levels.indexOf(loggerConfig.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= minLevelIndex;
  };
  
  return {
    debug: (message: string, ...args: any[]) => {
      if (shouldLog(LogLevel.DEBUG)) {
        console.debug(...formatMessage(LogLevel.DEBUG, message, ...args));
      }
    },
    
    info: (message: string, ...args: any[]) => {
      if (shouldLog(LogLevel.INFO)) {
        console.info(...formatMessage(LogLevel.INFO, message, ...args));
      }
    },
    
    warn: (message: string, ...args: any[]) => {
      if (shouldLog(LogLevel.WARN)) {
        console.warn(...formatMessage(LogLevel.WARN, message, ...args));
      }
    },
    
    error: (message: string, ...args: any[]) => {
      if (shouldLog(LogLevel.ERROR)) {
        console.error(...formatMessage(LogLevel.ERROR, message, ...args));
      }
    },
    
    // Metodo per log con livello personalizzato
    log: (level: LogLevel, message: string, ...args: any[]) => {
      if (shouldLog(level)) {
        switch (level) {
          case LogLevel.DEBUG:
            console.debug(...formatMessage(level, message, ...args));
            break;
          case LogLevel.INFO:
            console.info(...formatMessage(level, message, ...args));
            break;
          case LogLevel.WARN:
            console.warn(...formatMessage(level, message, ...args));
            break;
          case LogLevel.ERROR:
            console.error(...formatMessage(level, message, ...args));
            break;
        }
      }
    }
  };
};

// Logger globale dell'applicazione
export const appLogger = createLogger('App');

export default appLogger;
