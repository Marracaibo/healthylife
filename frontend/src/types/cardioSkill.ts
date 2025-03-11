// Definizione delle interfacce per le skill di cardio

export interface SupportExercise {
  id: string;
  name: string;
  icon?: string;
  duration: string; // Es: "30 min" o "1 ora"
  intensity: string; // Es: "Leggera" o "Media" o "Alta"
  description?: string;
  video?: string;
}

export interface SkillProgression {
  id: string;
  level: number;
  name: string;
  icon?: string;
  description: string;
  supportExercises: SupportExercise[];
  targetTime: string; // Es: "5km in 25 min"
  completed: boolean;
  progress: number; // percentuale di completamento
}

export interface CardioSkill {
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
  currentRecord?: string; // Record attuale (es: "5km in 28 minuti")
  personalBest?: string; // Miglior prestazione dell'utente
}
