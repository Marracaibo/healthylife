// Definizione delle interfacce per le skill di calisthenics

export interface SupportExercise {
  id: string;
  name: string;
  icon?: string;
  sets: number;
  reps: string; // Es: "5" o "12" o "Max"
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
  targetReps: string; // Es: "10x Pull Up"
  completed: boolean;
  progress: number; // percentuale di completamento
}

export interface CalisthenicsSkill {
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
}

export interface ProgressionExercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: string;
  restSeconds: number;
  keyPoints: string[];
  videoUrl?: string;
}
