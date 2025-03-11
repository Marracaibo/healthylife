// Definizione delle interfacce per le skill di mobilità

export interface SupportExercise {
  id: string;
  name: string;
  icon?: string;
  sets: number;
  duration: string; // Es: "30 sec" o "2 min"
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
  targetMobility: string; // Es: "Toccare le dita dei piedi"
  completed: boolean;
  progress: number; // percentuale di completamento
}

export interface MobilitySkill {
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
  areaFocus: string; // Area di focus (es: "Spalle", "Anche", "Caviglie")
}
