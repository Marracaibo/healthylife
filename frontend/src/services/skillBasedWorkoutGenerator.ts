import { WorkoutProgram, WorkoutDay } from '../types/workout';
import { skillProgressions } from '../data/skillProgressions';

// Mappa che associa le skill ai gruppi muscolari coinvolti
const MUSCLE_GROUP_MAPPING: Record<string, string[]> = {
  'muscle-up': ['chest', 'shoulders', 'triceps', 'back', 'core'],
  'front-split': ['hip_flexors', 'adductors', 'hamstrings'],
  'v-sit': ['core', 'hip_flexors', 'quads', 'shoulders'],
  'handstand': ['shoulders', 'core', 'wrists'],
  'planche': ['shoulders', 'chest', 'triceps', 'core'],
  'back-lever': ['back', 'biceps', 'core'],
  'front-lever': ['back', 'core', 'arms'],
  'pistol-squat': ['quads', 'glutes', 'calves', 'core'],
  'bridge': ['spine', 'shoulders', 'glutes', 'hamstrings'],
  'human-flag': ['shoulders', 'back', 'core', 'obliques'],
  'aerobox': ['cardio', 'shoulders', 'core'],
  'run-10km': ['cardio', 'legs', 'core'],
  'half-marathon': ['cardio', 'legs', 'core'],
  'full-marathon': ['cardio', 'legs', 'core'],
  'ultra-marathon': ['cardio', 'legs', 'core'],
  'ironman-triathlon': ['cardio', 'legs', 'core', 'shoulders', 'back'],
  'marathon-des-sables': ['cardio', 'legs', 'core', 'mental'],
  'antarctic-ice-marathon': ['cardio', 'legs', 'core', 'mental'],
  'spartan-race': ['cardio', 'legs', 'core', 'arms', 'shoulders', 'mental'],
  'seven-marathons': ['cardio', 'legs', 'core', 'mental', 'recovery'],
  'handstand-push-up': ['shoulders', 'triceps', 'core']
};

// Interfaccia per rappresentare un esercizio estratto
interface ExtractedExercise {
  name: string;
  description: string;
  muscleGroups: string[];
  isPrimary: boolean;
  skillId: string;
  skillName: string;
  stepName: string;
  difficulty: number;
}

/**
 * Genera un programma di allenamento basato sulle skill selezionate
 * @param selectedSkills Array delle skill selezionate con il livello iniziale
 * @param daysPerWeek Numero di giorni di allenamento a settimana
 * @returns Un programma di allenamento completo
 */
export function generateWorkoutFromSkills(
  selectedSkills: Array<{id: string, startLevel: number}>,
  daysPerWeek: number
): WorkoutProgram | null {
  // Verifica dei parametri
  if (!selectedSkills.length || daysPerWeek < 2 || daysPerWeek > 6) {
    console.error('Invalid parameters for workout generation');
    return null;
  }

  try {
    // 1. Estrai gli esercizi dalle skill selezionate
    const allExercises: ExtractedExercise[] = [];
    
    selectedSkills.forEach(skill => {
      const exercises = extractExercisesFromSkill(skill.id, skill.startLevel);
      allExercises.push(...exercises);
    });

    // 2. Distribuisci gli esercisi sui giorni disponibili in modo intelligente
    const exerciseDistribution = distributeExercisesIntelligently(allExercises, daysPerWeek);

    // 3. Converti la distribuzione in un programma di allenamento strutturato
    return convertToWorkoutProgram(exerciseDistribution, selectedSkills);
  } catch (error) {
    console.error('Error generating workout from skills:', error);
    return null;
  }
}

/**
 * Estrae gli esercizi dal livello specificato di una skill
 */
function extractExercisesFromSkill(
  skillId: string, 
  level: number
): ExtractedExercise[] {
  const skill = skillProgressions.find(s => s.id === skillId);
  if (!skill || !skill.steps || level > skill.steps.length) return [];
  
  const step = skill.steps[level - 1];
  const muscleGroups = MUSCLE_GROUP_MAPPING[skillId] || [];
  
  // Creiamo esercizi basati sulle istruzioni del passo di progressione
  return step.instructions.map((instruction, i) => ({
    name: `${skill.name}: ${instruction.split(' ').slice(0, 4).join(' ')}...`,
    description: instruction,
    muscleGroups,
    isPrimary: i < 3, // I primi 3 esercizi sono considerati principali
    skillId,
    skillName: skill.name,
    stepName: step.name,
    difficulty: step.difficulty
  }));
}

/**
 * Distribuisce gli esercizi sui giorni disponibili in modo intelligente,
 * considerando i tempi di recupero dei gruppi muscolari
 */
function distributeExercisesIntelligently(
  exercises: ExtractedExercise[],
  daysPerWeek: number
): Record<number, ExtractedExercise[]> {
  const distribution: Record<number, ExtractedExercise[]> = {};
  
  // Inizializza i giorni
  for (let i = 1; i <= daysPerWeek; i++) {
    distribution[i] = [];
  }

  // Raggruppa gli esercizi per skill
  const exercisesBySkill: Record<string, ExtractedExercise[]> = {};
  exercises.forEach(ex => {
    if (!exercisesBySkill[ex.skillId]) {
      exercisesBySkill[ex.skillId] = [];
    }
    exercisesBySkill[ex.skillId].push(ex);
  });

  // Determina quali gruppi muscolari sono associati a ciascun giorno
  const dayMuscleGroups: Record<number, Set<string>> = {};
  for (let i = 1; i <= daysPerWeek; i++) {
    dayMuscleGroups[i] = new Set<string>();
  }

  // 1. Prima distribuisci gli esercizi primari di ogni skill
  const primaryExercises = exercises.filter(ex => ex.isPrimary);
  
  // Ordina le skill per difficoltà per assicurarsi che quelle più impegnative
  // siano distribuite in modo più equilibrato
  primaryExercises.sort((a, b) => b.difficulty - a.difficulty);
  
  // Assegna ogni esercizio primario al giorno che ha meno conflitti muscolari
  primaryExercises.forEach(exercise => {
    // Trova il giorno migliore per questo esercizio
    let bestDay = 1;
    let minConflicts = Infinity;
    
    for (let day = 1; day <= daysPerWeek; day++) {
      // Calcola quanti gruppi muscolari in questo esercizio sono già impegnati in questo giorno
      const conflicts = exercise.muscleGroups.filter(group => 
        dayMuscleGroups[day].has(group)
      ).length;
      
      // Considera anche il carico di esercizi nel giorno
      const dayLoad = distribution[day].length;
      
      // Calcolo pesato di conflitti (priorità ai conflitti muscolari, ma considera anche il bilanciamento)
      const totalConflicts = conflicts * 3 + dayLoad;
      
      if (totalConflicts < minConflicts) {
        minConflicts = totalConflicts;
        bestDay = day;
      }
    }
    
    // Aggiungi l'esercizio al giorno selezionato
    distribution[bestDay].push(exercise);
    
    // Aggiorna i gruppi muscolari impegnati in quel giorno
    exercise.muscleGroups.forEach(group => dayMuscleGroups[bestDay].add(group));
  });
  
  // 2. Distribuisci gli esercizi secondari, considerando i gruppi muscolari già impegnati
  const secondaryExercises = exercises.filter(ex => !ex.isPrimary);
  
  secondaryExercises.forEach(exercise => {
    // Considerazioni simili agli esercizi primari, ma con più peso sulla compatibilità muscolare
    let bestDay = 1;
    let bestScore = -Infinity;
    
    for (let day = 1; day <= daysPerWeek; day++) {
      // Verificiamo la compatibilità con gli altri esercizi del giorno
      const sameSkillBonus = distribution[day].some(ex => ex.skillId === exercise.skillId) ? 2 : 0;
      
      // Calcola quanti gruppi muscolari in questo esercizio sono già impegnati in questo giorno
      const muscularConflicts = exercise.muscleGroups.filter(group => 
        dayMuscleGroups[day].has(group)
      ).length;
      
      // Bilanciamento del carico
      const dayLoadPenalty = distribution[day].length / 2;
      
      // Score complessivo (maggiore è meglio)
      const score = sameSkillBonus - muscularConflicts - dayLoadPenalty;
      
      if (score > bestScore) {
        bestScore = score;
        bestDay = day;
      }
    }
    
    // Aggiungi l'esercizio al giorno selezionato
    distribution[bestDay].push(exercise);
    
    // Aggiorna i gruppi muscolari impegnati in quel giorno
    exercise.muscleGroups.forEach(group => dayMuscleGroups[bestDay].add(group));
  });
  
  return distribution;
}

/**
 * Converte la distribuzione degli esercizi in un programma di allenamento completo
 */
function convertToWorkoutProgram(
  exerciseDistribution: Record<number, ExtractedExercise[]>,
  selectedSkills: Array<{id: string, startLevel: number}>
): WorkoutProgram {
  // Ottieni i nomi delle skill selezionate per usarli nel nome del programma
  const skillNames = selectedSkills.map(skill => {
    const skillData = skillProgressions.find(s => s.id === skill.id);
    return skillData ? skillData.name : skill.id;
  }).filter(Boolean);
  
  // Calcola la difficoltà complessiva
  let totalDifficulty = 0;
  selectedSkills.forEach(skill => {
    const skillData = skillProgressions.find(s => s.id === skill.id);
    if (skillData) {
      totalDifficulty += skillData.difficultyLevel;
    }
  });
  
  // Normalizza la difficoltà su una scala da 1 a 5
  const difficultyLevel = Math.max(1, Math.min(5, Math.ceil(totalDifficulty / selectedSkills.length)));
  
  // Converti il livello numerico in stringa per il tipo
  const difficultyString: 'beginner' | 'intermediate' | 'advanced' = 
    difficultyLevel <= 2 ? 'beginner' : 
    difficultyLevel >= 4 ? 'advanced' : 'intermediate';
  
  // Conta il numero di giorni di allenamento nella settimana
  const workoutDaysCount = Object.keys(exerciseDistribution).length;
  
  // Crea un array di giorni di allenamento per ogni settimana
  const workoutDays: WorkoutDay[] = Object.entries(exerciseDistribution).map(([dayNum, exercises]) => {
    // Raggruppa gli esercizi per skill per una migliore organizzazione
    const exercisesBySkill: Record<string, ExtractedExercise[]> = {};
    exercises.forEach(ex => {
      if (!exercisesBySkill[ex.skillId]) {
        exercisesBySkill[ex.skillId] = [];
      }
      exercisesBySkill[ex.skillId].push(ex);
    });
    
    console.log(`Creando giorno di allenamento ${dayNum} con tipo 'workout'`);
    
    // Organizza gli esercizi: prima raggruppa per skill, poi per primari/secondari
    const organizedExercises: ExtractedExercise[] = [];
    
    Object.values(exercisesBySkill).forEach(skillExs => {
      // Prima i primari
      const primaryExs = skillExs.filter(ex => ex.isPrimary);
      const secondaryExs = skillExs.filter(ex => !ex.isPrimary);
      
      organizedExercises.push(...primaryExs, ...secondaryExs);
    });
    
    return {
      id: `day-${dayNum}`,
      code: `Giorno ${dayNum}`,
      name: `Giorno ${dayNum}`,
      dayNumber: parseInt(dayNum),
      type: 'workout', // IMPORTANTE: tipo esplicitamente 'workout'
      exercises: organizedExercises.map(ex => {
        // Imposta i set e le ripetizioni in base alla difficoltà e alla priorità
        let sets = ex.isPrimary ? 4 : 3;
        let reps = ex.isPrimary ? '6-8' : '8-12';
        
        // Modifica in base al tipo di esercizio
        const isCardio = ex.muscleGroups.includes('cardio');
        
        return {
          id: `ex-${Math.random().toString(36).substr(2, 9)}`,
          name: ex.name,
          sets: isCardio ? 1 : sets,
          reps: isCardio ? '10-20 min' : reps,
          rest: isCardio ? '1-2 min' : '90s',
          notes: `${ex.skillName} - ${ex.stepName}: ${ex.description}`,
          type: isCardio ? 'cardio' : 'strength',
          duration: isCardio ? 15 : 0,
          distance: 0
        };
      })
    };
  });
  
  // Adatta la distribuzione in base al numero di giorni di allenamento
  let actualWorkoutDays: number[] = [];
  if (workoutDaysCount === 1) {
    actualWorkoutDays = [3]; // Solo mercoledì
  } else if (workoutDaysCount === 2) {
    actualWorkoutDays = [1, 4]; // Lunedì e giovedì
  } else if (workoutDaysCount >= 3) {
    // Usa i primi N giorni dalla distribuzione standard
    actualWorkoutDays = [1, 3, 5].slice(0, Math.min(workoutDaysCount, 3));
    
    // Se ci sono più di 3 giorni di allenamento, aggiungi martedì e giovedì
    if (workoutDaysCount > 3) {
      actualWorkoutDays.push(2); // Martedì
    }
    if (workoutDaysCount > 4) {
      actualWorkoutDays.push(4); // Giovedì
    }
    
    // Ordina i giorni
    actualWorkoutDays.sort((a, b) => a - b);
  }
  
  console.log(`Distribuzione giorni di allenamento: ${actualWorkoutDays.join(', ')}`);
  
  // Aggiungi tutti i giorni della settimana (1-7)
  const fullWeekDays: WorkoutDay[] = [];
  
  for (let i = 1; i <= 7; i++) {
    if (actualWorkoutDays.includes(i) && workoutDays.length > 0) {
      // Giorno di allenamento
      const workoutIndex = actualWorkoutDays.indexOf(i) % workoutDays.length;
      const workoutDay = workoutDays[workoutIndex];
      
      // Assicurati che il dayNumber sia corretto (1-7 per i giorni della settimana)
      const dayWithCorrectNumber = {
        ...workoutDay,
        dayNumber: i,
        type: 'workout' as const // Forza il tipo a 'workout' con type assertion
      };
      
      fullWeekDays.push(dayWithCorrectNumber);
      console.log(`Aggiunto giorno di allenamento per giorno ${i}`);
    } else if (i === 6 && workoutDays.length >= 3) {
      // Il sabato è giorno di test per programmi con almeno 3 giorni di allenamento
      fullWeekDays.push({
        id: `test-day-${i}`,
        code: `Test`,
        name: `Giorno di Test`,
        dayNumber: i,
        type: 'test' as const,
        exercises: []
      });
      console.log(`Aggiunto giorno di test per giorno ${i}`);
    } else {
      // Giorno di riposo
      fullWeekDays.push({
        id: `rest-day-${i}`,
        code: `Riposo`,
        name: `Giorno di Riposo`,
        dayNumber: i,
        type: 'rest' as const,
        exercises: []
      });
      console.log(`Aggiunto giorno di riposo per giorno ${i}`);
    }
  }
  
  // Crea il programma di allenamento
  const workoutProgram: WorkoutProgram = {
    id: `skill-program-${Date.now()}`,
    name: `Progressione ${skillNames.join(' & ')}`,
    description: `Scheda personalizzata per lo sviluppo delle seguenti skill: ${skillNames.join(', ')}`,
    type: 'skill-based',
    duration: 4, // 4 settimane per fase
    startDate: new Date().toISOString().split('T')[0], // Data di oggi come data di inizio
    difficulty: difficultyString,
    category: 'Progressione Skill',
    targetAreas: getUniqueTargetAreas(selectedSkills),
    isAvailable: true,
    phases: [{
      id: 'phase-1',
      number: 1, // Aggiungiamo il numero della fase richiesto dal tipo WorkoutPhase
      name: 'Fase 1',
      description: 'Fase iniziale di progressione',
      weeks: [{
        id: 'week-1',
        phaseId: 'phase-1',
        weekNumber: 1,
        name: 'Settimana 1',
        isTestWeek: false,
        isAvailable: true,
        days: fullWeekDays
      }]
    }]
  };
  
  return workoutProgram;
}

/**
 * Ottiene le aree target uniche dalle skill selezionate
 */
function getUniqueTargetAreas(selectedSkills: Array<{id: string, startLevel: number}>): string[] {
  const areas = new Set<string>();
  
  selectedSkills.forEach(skill => {
    const muscleGroups = MUSCLE_GROUP_MAPPING[skill.id] || [];
    muscleGroups.forEach(group => areas.add(group));
  });
  
  return Array.from(areas);
}
