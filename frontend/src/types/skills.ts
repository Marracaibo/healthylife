// Definizione delle interfacce per le skill e gli esercizi

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  weight?: string;
  intensity?: string;
}

export interface SkillProgression {
  id: string;
  level: number;
  name: string;
  description: string;
  videoUrl?: string;
  supportExercises: Exercise[];
}

// Interfacce specifiche per ciascun tipo di skill

export interface CalisthenicsSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  imageUrl: string;
  progressions: SkillProgression[];
}

export interface MobilitySkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  imageUrl: string;
  progressions: SkillProgression[];
}

export interface AgilitySkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  imageUrl: string;
  progressions: SkillProgression[];
}

export interface WeightliftingSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  imageUrl: string;
  progressions: SkillProgression[];
}

export interface CardioSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  imageUrl: string;
  progressions: SkillProgression[];
}
