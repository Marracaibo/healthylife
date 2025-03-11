/**
 * Servizio per i calcoli nutrizionali
 * 
 * Centralizza tutti i calcoli relativi a calorie e macronutrienti
 * per garantire consistenza in tutta l'applicazione.
 */

// Interfacce di base per i nutrienti
export interface Nutrient {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Calcola i macronutrienti in base alla quantità specificata
 * 
 * @param nutrients I valori nutrizionali originali (per 100g)
 * @param amount La quantità in grammi
 * @returns I macronutrienti calcolati per la quantità specificata
 */
export const calculateMacros = (nutrients: Nutrient, amount: number): Macros => {
  // Assicuriamoci che amount sia un numero valido
  const amountNum = parseFloat(amount.toString()) || 0;
  
  // Calcola i macronutrienti in proporzione alla quantità
  return {
    protein: (nutrients.protein || 0) * (amountNum / 100),
    carbs: (nutrients.carbs || 0) * (amountNum / 100),
    fat: (nutrients.fat || 0) * (amountNum / 100)
  };
};

/**
 * Calcola le calorie in base alla quantità specificata
 * 
 * @param calories Le calorie originali (per 100g)
 * @param amount La quantità in grammi
 * @returns Le calorie calcolate per la quantità specificata
 */
export const calculateCalories = (calories: number, amount: number): number => {
  const amountNum = parseFloat(amount.toString()) || 0;
  return Math.round((calories || 0) * (amountNum / 100));
};

/**
 * Somma i macronutrienti di più alimenti
 * 
 * @param macrosArray Array di oggetti macros da sommare
 * @returns I macronutrienti sommati
 */
export const sumMacros = (macrosArray: Macros[]): Macros => {
  return macrosArray.reduce((total, current) => ({
    protein: total.protein + (current.protein || 0),
    carbs: total.carbs + (current.carbs || 0),
    fat: total.fat + (current.fat || 0)
  }), { protein: 0, carbs: 0, fat: 0 });
};

/**
 * Somma le calorie di più alimenti
 * 
 * @param caloriesArray Array di valori calorici da sommare
 * @returns Il totale delle calorie
 */
export const sumCalories = (caloriesArray: number[]): number => {
  return caloriesArray.reduce((total, current) => total + (current || 0), 0);
};

// Esporta un oggetto singleton per facilitare l'utilizzo
export const nutritionCalculationService = {
  calculateMacros,
  calculateCalories,
  sumMacros,
  sumCalories
};

export default nutritionCalculationService;
