// Definizione delle interfacce per le skill progressions

export interface ProgressionStep {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  gifUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = principiante, 5 = esperto
  requirements?: string[];
  instructions: string[];
  tips?: string[];
  estimatedTimeToMaster?: string; // es. "2-4 settimane"
  nextStepId?: string; // ID del prossimo passo nella progressione
}

export interface SkillProgression {
  id: string;
  name: string;
  category: 'calisthenics' | 'powerlifting' | 'cardio' | 'mobility';
  description: string;
  coverImage?: string;
  iconUrl?: string; // URL dell'icona per la skill
  finalVideo?: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5; // 1 = principiante, 5 = esperto
  estimatedTimeToAchieve?: string; // es. "3-6 mesi"
  prerequisites?: string[];
  steps: ProgressionStep[];
}
