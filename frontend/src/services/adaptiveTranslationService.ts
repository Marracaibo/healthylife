/**
 * Servizio di traduzione adattivo
 * 
 * Questo servizio estende il TranslationService standard incorporando:
 * 1. Memorizzazione delle traduzioni frequenti
 * 2. Apprendimento da traduzioni manuali dell'utente
 * 3. Integrazione con API di traduzione esterne quando necessario
 */

import { translationService as baseTranslationService } from './translationService';
import { createLogger } from '../utils/logger';

const logger = createLogger('AdaptiveTranslationService');

export class AdaptiveTranslationService {
  private baseService = baseTranslationService;
  
  // Cache delle traduzioni per termini che non sono nel dizionario base
  private translationCache: Map<string, string> = new Map();
  
  // Contatori per tracciare l'uso dei termini
  private termUsageCount: Map<string, number> = new Map();
  
  constructor() {
    // Carica traduzioni salvate dal localStorage all'avvio
    this.loadSavedTranslations();
  }
  
  /**
   * Determina se una query è in italiano
   */
  public isItalianQuery(query: string): boolean {
    return this.baseService.isItalianQuery(query);
  }
  
  /**
   * Traduce una query alimentare dall'italiano all'inglese
   * utilizzando sia il dizionario base che la cache adattiva
   */
  public translateFoodQuery(query: string): string {
    // Prima prova con il servizio base
    const baseTranslation = this.baseService.translateFoodQuery(query);
    
    // Se la traduzione base non ha cambiato nulla o ha tradotto solo parzialmente
    if (baseTranslation === query || this.containsItalianTerms(baseTranslation)) {
      return this.applyAdaptiveTranslation(query, baseTranslation);
    }
    
    // Incrementa i contatori d'uso
    this.updateTermUsage(query);
    
    return baseTranslation;
  }
  
  /**
   * Registra una traduzione personalizzata fornita dall'utente
   */
  public registerCustomTranslation(italianTerm: string, englishTranslation: string): void {
    const normalizedItalian = italianTerm.toLowerCase().trim();
    const normalizedEnglish = englishTranslation.toLowerCase().trim();
    
    if (normalizedItalian !== normalizedEnglish) {
      this.translationCache.set(normalizedItalian, normalizedEnglish);
      this.saveTranslations();
      logger.info(`Registrata nuova traduzione personalizzata: "${normalizedItalian}" -> "${normalizedEnglish}"`);
    }
  }
  
  /**
   * Suggerisce possibili traduzioni per termini non tradotti
   */
  public suggestTranslations(italianTerm: string): string[] {
    // Implementazione futura: utilizzo di algoritmi di similarità per suggerire traduzioni
    return [];
  }
  
  /**
   * Verifica se ci sono ancora termini italiani in una stringa parzialmente tradotta
   */
  private containsItalianTerms(text: string): boolean {
    if (!text || text.trim() === '') return false;
    
    const tokens = text.toLowerCase().split(/\s+/);
    for (const token of tokens) {
      // Usa il metodo appropriato ora che è stato aggiunto al servizio base
      if (this.baseService.isItalianTerm(token) && !this.isCommonWord(token)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Filtra parole comuni che non necessitano traduzione
   */
  private isCommonWord(word: string): boolean {
    const commonWords = ['e', 'con', 'di', 'a', 'da', 'in', 'su', 'per', 'il', 'lo', 'la', 'i', 'gli', 'le'];
    return commonWords.includes(word.toLowerCase());
  }
  
  /**
   * Applica traduzioni adattive quando il dizionario base non è sufficiente
   */
  private applyAdaptiveTranslation(original: string, partialTranslation: string): string {
    const tokens = partialTranslation.split(/\s+/);
    
    // Sostituisci i termini usando la cache adattiva
    const translatedTokens = tokens.map(token => {
      const lowerToken = token.toLowerCase();
      if (this.translationCache.has(lowerToken)) {
        // Mantieni la capitalizzazione originale
        const englishTerm = this.translationCache.get(lowerToken)!;
        return this.preserveCapitalization(token, englishTerm);
      }
      return token;
    });
    
    const result = translatedTokens.join(' ');
    
    // Se abbiamo migliorato la traduzione, registralo
    if (result !== partialTranslation) {
      logger.info(`Traduzione adattiva applicata: "${original}" -> "${result}"`);
    }
    
    // Aggiorna i contatori d'uso
    this.updateTermUsage(original);
    
    return result;
  }
  
  /**
   * Mantiene la capitalizzazione originale quando si sostituisce un termine
   */
  private preserveCapitalization(originalTerm: string, translatedTerm: string): string {
    if (originalTerm.length === 0 || translatedTerm.length === 0) {
      return translatedTerm;
    }
    
    if (originalTerm[0] === originalTerm[0].toUpperCase()) {
      return translatedTerm.charAt(0).toUpperCase() + translatedTerm.slice(1);
    }
    
    return translatedTerm;
  }
  
  /**
   * Aggiorna i contatori d'uso per le statistiche e il miglioramento continuo
   */
  private updateTermUsage(query: string): void {
    const tokens = query.toLowerCase().split(/\s+/);
    for (const token of tokens) {
      if (token.length > 2) { // Ignora token troppo brevi
        this.termUsageCount.set(token, (this.termUsageCount.get(token) || 0) + 1);
      }
    }
    
    // Salva periodicamente le statistiche d'uso (ogni 10 query)
    if (Math.random() < 0.1) {
      this.saveUsageStatistics();
    }
  }
  
  /**
   * Carica le traduzioni personalizzate dal localStorage
   */
  private loadSavedTranslations(): void {
    try {
      const saved = localStorage.getItem('adaptiveTranslations');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.translationCache = new Map(Object.entries(parsed));
        logger.info(`Caricate ${this.translationCache.size} traduzioni personalizzate`);
      }
    } catch (error) {
      logger.error('Errore nel caricamento delle traduzioni salvate:', error);
    }
  }
  
  /**
   * Salva le traduzioni personalizzate nel localStorage
   */
  private saveTranslations(): void {
    try {
      const data = Object.fromEntries(this.translationCache);
      localStorage.setItem('adaptiveTranslations', JSON.stringify(data));
    } catch (error) {
      logger.error('Errore nel salvataggio delle traduzioni:', error);
    }
  }
  
  /**
   * Salva le statistiche d'uso per analisi future
   */
  private saveUsageStatistics(): void {
    try {
      // Salva solo i termini più usati per risparmiare spazio
      const topTerms = [...this.termUsageCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 100);
      
      const data = Object.fromEntries(topTerms);
      localStorage.setItem('translationUsageStats', JSON.stringify(data));
    } catch (error) {
      logger.error('Errore nel salvataggio delle statistiche d\'uso:', error);
    }
  }
  
  /**
   * Restituisce le statistiche sui termini più cercati
   */
  public getTopSearchedTerms(limit: number = 20): Array<{term: string, count: number}> {
    return [...this.termUsageCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term, count]) => ({ term, count }));
  }
  
  /**
   * Genera un report sulle performance della traduzione
   */
  public getTranslationPerformanceReport(): {
    totalTranslations: number;
    baseTranslations: number;
    adaptiveTranslations: number;
    untranslatedRate: number;
    topUntranslatedTerms: string[];
  } {
    // Implementazione futura
    return {
      totalTranslations: 0,
      baseTranslations: 0,
      adaptiveTranslations: 0,
      untranslatedRate: 0,
      topUntranslatedTerms: []
    };
  }
}

export const adaptiveTranslationService = new AdaptiveTranslationService();
export default adaptiveTranslationService;
