import { WorkoutProgram, WorkoutPhase, WorkoutWeek, WorkoutDay, Exercise } from '../types/workout';

// Interfaccia per i parametri del programma personalizzato
export interface CustomProgramParams {
  goalType: 'strength' | 'hypertrophy' | 'endurance' | 'weight-loss' | 'general';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  programDuration: number;
  focusAreas: string[];
  limitations: string[];
  equipment: string[];
}

/**
 * Genera un programma di workout personalizzato in base ai parametri forniti
 */
export const generateCustomProgram = (params: CustomProgramParams): WorkoutProgram => {
  // Genera il nome del programma in base all'obiettivo
  const programName = `Programma ${getGoalName(params.goalType)} Personalizzato`;
  
  // Crea le fasi del programma
  const phases = createProgramPhases(params);
  
  // Crea e restituisci il programma completo
  return {
    id: `custom-${Date.now()}`,
    name: programName,
    description: `Programma personalizzato per ${getGoalDescription(params.goalType)}.`,
    phases: phases,
    duration: params.programDuration,
    difficulty: params.fitnessLevel,
    category: getGoalName(params.goalType),
    targetAreas: params.focusAreas,
    isAvailable: true
  };
};

/**
 * Crea le fasi del programma in base ai parametri
 */
const createProgramPhases = (params: CustomProgramParams): WorkoutPhase[] => {
  const phases: WorkoutPhase[] = [];
  
  // Per ora, creiamo solo una fase di base
  const weeks = createProgramWeeks(params);
  
  phases.push({
    id: 'phase-1',
    number: 1,
    name: 'Fase Principale',
    description: 'Fase principale del tuo programma personalizzato.',
    weeks: weeks
  });
  
  return phases;
};

/**
 * Crea le settimane del programma in base ai parametri
 */
const createProgramWeeks = (params: CustomProgramParams): WorkoutWeek[] => {
  const weeks: WorkoutWeek[] = [];
  
  // Crea una settimana per ogni settimana di durata del programma
  for (let i = 1; i <= params.programDuration; i++) {
    weeks.push({
      id: `week-${i}`,
      phaseId: 'phase-1',
      weekNumber: i,
      name: `Settimana ${i}`,
      isTestWeek: i % 4 === 0, // Ogni 4 settimane è una settimana di test
      days: createWeekDays(params, i),
      isAvailable: true
    });
  }
  
  return weeks;
};

/**
 * Crea i giorni della settimana in base ai parametri
 */
const createWeekDays = (params: CustomProgramParams, weekNumber: number): WorkoutDay[] => {
  const days: WorkoutDay[] = [];
  
  // Crea un giorno per ogni giorno della settimana
  for (let i = 1; i <= 7; i++) {
    if (i <= params.daysPerWeek) {
      // Giorno di allenamento
      days.push({
        id: `week-${weekNumber}-day-${i}`,
        code: `W${weekNumber}D${i}`,
        name: `Allenamento ${i}`,
        dayNumber: i,
        type: 'workout',
        exercises: createDayExercises(params, weekNumber, i),
        dayOfWeek: getDayOfWeek(i)
      });
    } else {
      // Giorno di riposo
      days.push({
        id: `week-${weekNumber}-day-${i}`,
        code: `W${weekNumber}D${i}`,
        name: 'Riposo',
        dayNumber: i,
        type: 'rest',
        exercises: [],
        dayOfWeek: getDayOfWeek(i)
      });
    }
  }
  
  return days;
};

/**
 * Crea gli esercizi per un giorno in base ai parametri
 */
const createDayExercises = (params: CustomProgramParams, weekNumber: number, dayNumber: number): Exercise[] => {
  const exercises: Exercise[] = [];
  
  // Esempi di esercizi in base all'obiettivo e al livello
  if (params.goalType === 'strength') {
    // Programma di forza
    exercises.push({
      id: `squat-${weekNumber}-${dayNumber}`,
      name: 'Squat',
      sets: params.fitnessLevel === 'beginner' ? 3 : 4,
      reps: '5-8',
      rest: '2-3 min',
      type: 'strength'
    });
    
    exercises.push({
      id: `bench-${weekNumber}-${dayNumber}`,
      name: 'Bench Press',
      sets: params.fitnessLevel === 'beginner' ? 3 : 4,
      reps: '5-8',
      rest: '2-3 min',
      type: 'strength'
    });
  } else if (params.goalType === 'hypertrophy') {
    // Programma di ipertrofia
    exercises.push({
      id: `squat-${weekNumber}-${dayNumber}`,
      name: 'Squat',
      sets: 4,
      reps: '8-12',
      rest: '60-90 sec',
      type: 'strength'
    });
    
    exercises.push({
      id: `bench-${weekNumber}-${dayNumber}`,
      name: 'Bench Press',
      sets: 4,
      reps: '8-12',
      rest: '60-90 sec',
      type: 'strength'
    });
  } else {
    // Programma di resistenza o dimagrimento
    exercises.push({
      id: `circuit-${weekNumber}-${dayNumber}`,
      name: 'Circuito Full Body',
      sets: 3,
      reps: '45 sec di lavoro, 15 sec di riposo',
      type: 'cardio'
    });
  }
  
  return exercises;
};

/**
 * Ottiene il nome del giorno della settimana in base al numero
 */
const getDayOfWeek = (dayNumber: number): string => {
  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  return days[dayNumber - 1];
};

/**
 * Ottiene il nome dell'obiettivo in base al tipo
 */
const getGoalName = (goalType: string): string => {
  switch (goalType) {
    case 'strength':
      return 'Forza';
    case 'hypertrophy':
      return 'Ipertrofia';
    case 'endurance':
      return 'Resistenza';
    case 'weight-loss':
      return 'Dimagrimento';
    default:
      return 'Fitness Generale';
  }
};

/**
 * Ottiene la descrizione dell'obiettivo in base al tipo
 */
const getGoalDescription = (goalType: string): string => {
  switch (goalType) {
    case 'strength':
      return 'aumentare la forza';
    case 'hypertrophy':
      return 'sviluppare la massa muscolare';
    case 'endurance':
      return 'migliorare la resistenza';
    case 'weight-loss':
      return 'perdere peso';
    default:
      return 'migliorare la forma fisica generale';
  }
};

export default {
  generateCustomProgram
};
