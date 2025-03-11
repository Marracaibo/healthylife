// Definizione delle interfacce per le skill di weightlifting

export interface SupportExercise {
  id: string;
  name: string;
  icon?: string;
  sets: number;
  reps: string; // Es: "5" o "12" o "Max"
  description?: string;
  video?: string;
  weight?: string; // Il peso utilizzato (es: "60kg")
}

export interface SkillProgression {
  id: string;
  level: number;
  name: string;
  icon?: string;
  description: string;
  supportExercises: SupportExercise[];
  targetWeight: string; // Es: "Squat 100kg"
  completed: boolean;
  progress: number; // percentuale di completamento
}

export interface WeightliftingSkill {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  progressions: SkillProgression[];
  achieved: boolean;
  progress: number; // percentuale di completamento
  firstLevelName: string; // Nome del primo livello per essere mostrato nella card
  currentWeight?: string; // Il peso attuale per questo esercizio
  personalRecord?: string; // PR dell'utente
}
