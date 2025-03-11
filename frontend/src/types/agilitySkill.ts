// Definizione delle interfacce per le skill di agilità

export interface SupportExercise {
  id: string;
  name: string;
  icon?: string;
  sets: number;
  duration: string; // Es: "10 ripetizioni" o "30 sec"
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
  targetAgility: string; // Es: "Eseguire una ruota con buona tecnica"
  completed: boolean;
  progress: number; // percentuale di completamento
}

export interface AgilitySkill {
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
  areaFocus: string; // Area di focus (es: "Coordinazione", "Equilibrio", "Potenza")
}
