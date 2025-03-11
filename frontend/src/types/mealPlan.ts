export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_health';

export interface MacroDistribution {
    proteins: number;
    carbs: number;
    fats: number;
}

export interface Food {
    nome: string;
    quantita: number;
    unita: string;
}

export interface Macros {
    proteine: number;
    carboidrati: number;
    grassi: number;
}

export interface Meal {
    pasto: string;
    calorie: number;
    macronutrienti: Macros;
    alimenti: Food[];
    note: string;
}

export interface DailyPlan {
    colazione: Meal;
    spuntino_mattina: Meal;
    pranzo: Meal;
    spuntino_pomeriggio: Meal;
    cena: Meal;
}

export interface DailyTotals {
    calorie: number;
    proteine: number;
    carboidrati: number;
    grassi: number;
}

export interface MealPlan {
    piano_giornaliero: DailyPlan;
    note_generali: string[];
    totali_giornalieri: DailyTotals;
}

export interface MealPlanRequest {
    goal: FitnessGoal;
    custom_macros?: MacroDistribution;
    calories_target?: number;
    dietary_restrictions?: string[];
}
