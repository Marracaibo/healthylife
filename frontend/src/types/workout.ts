// Interfaces per il programma di allenamento Body Transformation

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps: string;
  rest?: string;
  tempo?: string;
  notes?: string;
  imageUrl?: string;
  gifUrl?: string; // URL dell'animazione GIF dell'esercizio
  videoUrl?: string; // URL del video dimostrativo dell'esercizio
  videoDuration?: string; // Durata del video (es. "2:30")
  category?: string; // Categoria dell'esercizio (es. "Upper Body", "Lower Body", "Core")
  targetMuscles?: string[]; // Muscoli target dell'esercizio
  difficulty?: number;
  benefits?: string;
  steps?: string[];
  instructions?: string;
  type?: 'strength' | 'cardio' | 'mobility';
  rm?: number; // Ripetizioni massime
  repSpeed?: string; // Velocità di esecuzione (es. "202", "X01")
  duration?: number; // Durata in minuti per esercizi cardio
  distance?: number; // Distanza in km per esercizi cardio
}

export interface WorkoutDay {
  id: string;
  code: string; // Per esempio: "Capi C", "Circ D", "5A", ecc.
  name: string;
  dayNumber: number;
  date?: string; // Data in cui eseguire l'allenamento
  type: 'workout' | 'rest' | 'test';
  exercises: Exercise[];
  isCompleted?: boolean;
  notes?: string;
  dayOfWeek?: string; // Giorno della settimana (es. "Lunedì", "Mercoledì", "Venerdì")
}

export interface WorkoutWeek {
  id: string;
  phaseId: string;
  weekNumber: number;
  name: string;
  isTestWeek: boolean;
  days: WorkoutDay[];
  isAvailable: boolean;
  availableInDays?: number; // Giorni mancanti alla disponibilità
}

export interface WorkoutPhase {
  id: string;
  number: number;
  name: string;
  description?: string;
  weeks: WorkoutWeek[];
  explanations?: {
    title: string;
    videoUrl?: string;
    videoDuration?: string;
  }[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  phases: WorkoutPhase[];
  duration: number; // Durata in settimane
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  targetAreas: string[];
  goals?: string; // Obiettivi del programma
  startDate?: string; // Data di inizio del programma
  isAvailable: boolean;
  isCustom?: boolean; // Indica se il programma è personalizzato creato dall'utente
  type?: string; // Tipo di programma (ipertrofia, skill progression, ecc.)
}

// Interfaccia per la visualizzazione a calendario
export interface WorkoutCalendarDay {
  date: string;
  hasWorkout: boolean;
  workoutType?: 'workout' | 'rest' | 'test';
  workoutCode?: string;
}

// Interfaccia per il progresso dell'utente
export interface WorkoutProgress {
  userId: string;
  programId: string;
  currentPhase: number;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: string[]; // Array di ID di workout completati
  startDate: string; // Data di inizio del programma
  lastWorkoutDate?: string; // Data dell'ultimo allenamento
  achievements: {
    id: string;
    name: string;
    date: string;
    description: string;
  }[];
}

// Interfaccia per la card dei programmi di allenamento
export interface WorkoutProgramCard {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  category: string;
  image: string;
  progress: number;
  fav: number;
  isAvailable: boolean;
}
