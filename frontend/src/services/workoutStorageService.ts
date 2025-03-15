import { WorkoutProgram } from '../types/workout';

// Chiavi per localStorage
const WORKOUT_PROGRAMS_KEY = 'healthylife_workout_programs';
const WORKOUT_CALENDAR_KEY = 'healthylife_workout_calendar';
const WORKOUT_PROGRESS_KEY = 'healthylife_workout_progress';

// Interfacce per i dati di progresso
export interface WorkoutProgress {
  date: string; // formato ISO
  programId: string;
  dayId: string;
  completed: boolean;
  exercises: {
    id: string;
    name: string;
    actualSets?: number;
    actualReps?: string;
    actualWeight?: number;
    actualDuration?: number;
    actualDistance?: number;
    notes?: string;
  }[];
}

export interface WorkoutCalendarEntry {
  date: string; // formato ISO
  programId: string;
  dayId: string;
}

// Funzioni per salvare e recuperare i programmi
export const saveWorkoutProgram = (program: WorkoutProgram): string => {
  // Assicuriamoci che il programma abbia un ID
  if (!program.id) {
    program.id = `program-${Date.now()}`;
  }

  // Recupera i programmi esistenti
  const existingPrograms = getWorkoutPrograms();
  
  // Aggiorna o aggiungi il nuovo programma
  const updatedPrograms = existingPrograms.filter(p => p.id !== program.id);
  updatedPrograms.push(program);
  
  // Salva i programmi aggiornati
  localStorage.setItem(WORKOUT_PROGRAMS_KEY, JSON.stringify(updatedPrograms));
  
  return program.id;
};

export const getWorkoutPrograms = (): WorkoutProgram[] => {
  try {
    const programsJson = localStorage.getItem(WORKOUT_PROGRAMS_KEY);
    if (programsJson) {
      console.log('Programmi trovati in localStorage:', programsJson);
      const programs = JSON.parse(programsJson);
      return Array.isArray(programs) ? programs : [];
    }
  } catch (error) {
    console.error('Errore nel recupero dei programmi di allenamento:', error);
  }
  return [];
};

export const getWorkoutProgramById = (id: string): WorkoutProgram | undefined => {
  const programs = getWorkoutPrograms();
  return programs.find(p => p.id === id);
};

export const deleteWorkoutProgram = (id: string): boolean => {
  const programs = getWorkoutPrograms();
  const updatedPrograms = programs.filter(p => p.id !== id);
  
  if (programs.length === updatedPrograms.length) {
    return false; // Nessun programma trovato con questo ID
  }
  
  localStorage.setItem(WORKOUT_PROGRAMS_KEY, JSON.stringify(updatedPrograms));
  return true;
};

// Funzioni per il calendario di allenamento
export const saveWorkoutCalendar = (entries: WorkoutCalendarEntry[]): void => {
  localStorage.setItem(WORKOUT_CALENDAR_KEY, JSON.stringify(entries));
};

export const getWorkoutCalendar = (): WorkoutCalendarEntry[] => {
  const calendarJson = localStorage.getItem(WORKOUT_CALENDAR_KEY);
  return calendarJson ? JSON.parse(calendarJson) : [];
};

export const addWorkoutCalendarEntry = (entry: WorkoutCalendarEntry): void => {
  const calendar = getWorkoutCalendar();
  
  // Rimuovi eventuali entry esistenti per la stessa data
  const updatedCalendar = calendar.filter(e => e.date !== entry.date);
  updatedCalendar.push(entry);
  
  saveWorkoutCalendar(updatedCalendar);
};

export const removeWorkoutCalendarEntry = (date: string): void => {
  const calendar = getWorkoutCalendar();
  const updatedCalendar = calendar.filter(e => e.date !== date);
  saveWorkoutCalendar(updatedCalendar);
};

// Funzioni per il tracciamento dei progressi
export const saveWorkoutProgress = (progress: WorkoutProgress): void => {
  const existingProgress = getWorkoutProgress();
  
  // Sostituisci il progresso per la stessa data e programma se esiste
  const updatedProgress = existingProgress.filter(
    p => !(p.date === progress.date && p.programId === progress.programId && p.dayId === progress.dayId)
  );
  updatedProgress.push(progress);
  
  localStorage.setItem(WORKOUT_PROGRESS_KEY, JSON.stringify(updatedProgress));
};

export const getWorkoutProgress = (): WorkoutProgress[] => {
  const progressJson = localStorage.getItem(WORKOUT_PROGRESS_KEY);
  return progressJson ? JSON.parse(progressJson) : [];
};

export const getWorkoutProgressByProgram = (programId: string): WorkoutProgress[] => {
  const allProgress = getWorkoutProgress();
  return allProgress.filter(p => p.programId === programId);
};

export const getWorkoutProgressForDate = (date: string): WorkoutProgress | undefined => {
  const allProgress = getWorkoutProgress();
  return allProgress.find(p => p.date === date);
};

// Statistiche e analisi
export const getProgramCompletionRate = (programId: string): number => {
  const progress = getWorkoutProgressByProgram(programId);
  const completedWorkouts = progress.filter(p => p.completed).length;
  
  if (progress.length === 0) return 0;
  return (completedWorkouts / progress.length) * 100;
};

export const getRecentWorkouts = (limit: number = 5): WorkoutProgress[] => {
  const allProgress = getWorkoutProgress();
  
  // Ordina per data (più recente prima)
  return [...allProgress]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getTotalWorkoutsCompleted = (): number => {
  const allProgress = getWorkoutProgress();
  return allProgress.filter(p => p.completed).length;
};

export const getConsecutiveWorkoutDays = (): number => {
  const allProgress = getWorkoutProgress();
  if (allProgress.length === 0) return 0;
  
  // Ordina per data (più recente prima)
  const sortedProgress = [...allProgress]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(p => p.completed);
  
  if (sortedProgress.length === 0) return 0;
  
  // Verifica la sequenza di giorni consecutivi
  let consecutiveDays = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let lastDate = new Date(sortedProgress[0].date);
  lastDate.setHours(0, 0, 0, 0);
  
  // Se l'ultimo workout non è oggi o ieri, la sequenza è interrotta
  const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0;
  
  // Verifica i giorni precedenti
  for (let i = 1; i < sortedProgress.length; i++) {
    const currentDate = new Date(sortedProgress[i].date);
    currentDate.setHours(0, 0, 0, 0);
    
    const prevDate = new Date(sortedProgress[i-1].date);
    prevDate.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      consecutiveDays++;
    } else {
      break;
    }
  }
  
  return consecutiveDays;
};
