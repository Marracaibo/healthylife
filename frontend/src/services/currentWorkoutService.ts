// Servizio per gestire il workout corrente in costruzione
import { SupportExercise } from '../types/calisthenicsSkill';

interface WorkoutExercise {
  id: string;
  name: string;
  type: string;
  sets: number;
  reps: string;
  duration: number;
  distance: number;
  rest: number;
  notes: string;
}

let currentWorkoutExercises: WorkoutExercise[] = [];

/**
 * Aggiunge gli esercizi di supporto alla sessione di workout corrente
 */
export const addSupportExercisesToWorkout = (exercises: SupportExercise[], skillName: string): WorkoutExercise[] => {
  // Converti gli esercizi dal formato skill al formato workout
  const workoutExercises: WorkoutExercise[] = exercises.map(exercise => {
    // Determina il tipo di esercizio in base al contesto o al nome
    let exerciseType = 'bodyweight';
    
    if (exercise.name.toLowerCase().includes('cardio') || 
        exercise.name.toLowerCase().includes('run') || 
        exercise.name.toLowerCase().includes('sprint')) {
      exerciseType = 'cardio';
    } else if (exercise.name.toLowerCase().includes('stretch') || 
              exercise.name.toLowerCase().includes('mobility')) {
      exerciseType = 'stretching';
    }
    
    return {
      id: `exercise-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: exercise.name,
      type: exerciseType,
      sets: exercise.sets || 3,
      reps: exercise.reps || '8-12',
      duration: 0,
      distance: 0,
      rest: 60,
      notes: `Esercizio di supporto per ${skillName}`
    };
  });

  // Aggiorna la lista corrente
  currentWorkoutExercises = [...currentWorkoutExercises, ...workoutExercises];
  
  // Salva nello storage locale
  localStorage.setItem('currentWorkoutExercises', JSON.stringify(currentWorkoutExercises));
  
  return currentWorkoutExercises;
};

/**
 * Recupera gli esercizi del workout corrente
 */
export const getCurrentWorkoutExercises = (): WorkoutExercise[] => {
  // Se abbiamo già esercizi in memoria, restituiscili
  if (currentWorkoutExercises.length > 0) {
    return currentWorkoutExercises;
  }
  
  // Altrimenti prova a caricarli dallo storage locale
  const storedExercises = localStorage.getItem('currentWorkoutExercises');
  if (storedExercises) {
    currentWorkoutExercises = JSON.parse(storedExercises);
    return currentWorkoutExercises;
  }
  
  return [];
};

/**
 * Resetta gli esercizi del workout corrente
 */
export const resetCurrentWorkout = (): void => {
  currentWorkoutExercises = [];
  localStorage.removeItem('currentWorkoutExercises');
};
