import { WorkoutProgram, WorkoutPhase, WorkoutWeek, WorkoutDay, Exercise } from '../types/workout';

// Base path per le risorse pubbliche
const getPublicPath = (path: string) => {
  // In Vite, i file nella cartella public sono serviti alla root
  return path.startsWith('/') ? path : `/${path}`;
};

// Esercizi basilari comuni a più fasi
const commonExercises: Record<string, Exercise> = {
  squatVariations: {
    id: 'squat-variations',
    name: 'Variazioni di Squat',
    videoUrl: '/videos/squat-variations.mp4',
    videoDuration: '8:08',
    category: 'Lower Body',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Hamstring'],
    gifUrl: getPublicPath('/gif/squat-variations.gif.jfif'),
    sets: 3,
    reps: '8-12',
    rm: 15,
    repSpeed: '201'
  },
  horizontalPull: {
    id: 'horizontal-pull',
    name: 'Pull Orizzontale',
    videoUrl: '/videos/horizontal-pull.mp4',
    videoDuration: '4:19',
    category: 'Upper Body',
    targetMuscles: ['Dorsali', 'Romboidi', 'Trapezio inferiore'],
    gifUrl: getPublicPath('/gif/horizontal-pull.gif.jfif'),
    sets: 3,
    reps: '8-10',
    rm: 12,
    repSpeed: '301'
  },
  horizontalPush: {
    id: 'horizontal-push',
    name: 'Push Orizzontale',
    videoUrl: '/videos/horizontal-push.mp4',
    videoDuration: '6:48',
    category: 'Upper Body',
    targetMuscles: ['Pettorali', 'Deltoidi anteriori', 'Tricipiti'],
    gifUrl: getPublicPath('/gif/horizontal-push.gif.jfif'),
    sets: 3,
    reps: '8-12',
    rm: 15,
    repSpeed: '201'
  },
  lungeVariations: {
    id: 'lunge-variations',
    name: 'Variazioni di Lunge',
    videoUrl: '/videos/lunge-variations.mp4',
    videoDuration: '2:41',
    category: 'Lower Body',
    targetMuscles: ['Quadricipiti', 'Glutei', 'Hamstring'],
    gifUrl: getPublicPath('/gif/lunge-variations.gif.jfif'),
    sets: 3,
    reps: '10-12 (per gamba)',
    rm: 16,
    repSpeed: '201'
  },
  plankVariations: {
    id: 'plank-variations',
    name: 'Variazioni di Plank',
    videoUrl: '/videos/plank-variations.mp4',
    videoDuration: '2:04',
    category: 'Core',
    targetMuscles: ['Addominali', 'Obliqui', 'Trasverso dell\'addome'],
    gifUrl: getPublicPath('/gif/plank-variations.gif.jfif'),
    sets: 3,
    reps: '30-45 sec',
    rm: 90, // Secondi
    repSpeed: 'Isometrico'
  },
  hollowBodyCrunch: {
    id: 'hollow-body-crunch',
    name: 'Hollow Body Crunch',
    videoUrl: '/videos/hollow-body-crunch.mp4',
    videoDuration: '0:49',
    category: 'Core',
    targetMuscles: ['Addominali inferiori', 'Addominali superiori'],
    gifUrl: getPublicPath('/gif/hollow-body-crunch.gif.jfif'),
    sets: 3,
    reps: '10-15',
    rm: 15,
    repSpeed: '202'
  },
  verticalPush: {
    id: 'vertical-push',
    name: 'Push Verticale',
    videoUrl: '/videos/vertical-push.mp4',
    videoDuration: '4:28',
    category: 'Upper Body',
    targetMuscles: ['Deltoidi', 'Tricipiti'],
    gifUrl: getPublicPath('/gif/vertical-push.gif.jfif'),
    sets: 3,
    reps: '8-12',
    rm: 12,
    repSpeed: '201'
  },
  verticalPull: {
    id: 'vertical-pull',
    name: 'Pull Verticale',
    videoUrl: '/videos/vertical-pull.mp4',
    videoDuration: '8:10',
    category: 'Upper Body',
    targetMuscles: ['Dorsali', 'Bicipiti', 'Avambracci'],
    gifUrl: getPublicPath('/gif/vertical-pull.gif.jfif'),
    sets: 3,
    reps: '8-12',
    rm: 10,
    repSpeed: '301'
  },
  rollouts: {
    id: 'rollouts',
    name: 'Rollouts',
    videoUrl: '/videos/rollouts.mp4',
    videoDuration: '1:09',
    category: 'Core',
    targetMuscles: ['Addominali', 'Obliqui'],
    gifUrl: getPublicPath('/gif/rollouts.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 15,
    repSpeed: '303'
  },
  legRaiseVariations: {
    id: 'leg-raise-variations',
    name: 'Variazioni di Leg Raise',
    videoUrl: '/videos/leg-raise-variations.mp4',
    videoDuration: '2:51',
    category: 'Core',
    targetMuscles: ['Addominali inferiori'],
    gifUrl: getPublicPath('/gif/leg-raise-variations.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 15,
    repSpeed: '202'
  },
  calfRaises: {
    id: 'calf-raises',
    name: 'Calf Raises',
    videoUrl: '/videos/calf-raises.mp4',
    videoDuration: '0:41',
    category: 'Lower Body',
    targetMuscles: ['Polpacci'],
    gifUrl: getPublicPath('/gif/calf-raises.gif.jfif'),
    sets: 3,
    reps: '12-15',
    rm: 20,
    repSpeed: '102'
  },
  overheadPush: {
    id: 'overhead-push',
    name: 'Overhead Push',
    videoUrl: '/videos/overhead-push.mp4',
    videoDuration: '3:06',
    category: 'Upper Body',
    targetMuscles: ['Deltoidi', 'Trapezio', 'Tricipiti'],
    gifUrl: getPublicPath('/gif/overhead-push.gif.jfif'),
    sets: 3,
    reps: '8-12',
    rm: 15,
    repSpeed: '201'
  },
  bicepsAndTriceps: {
    id: 'biceps-triceps-isolation',
    name: 'Isolamento Bicipiti & Tricipiti',
    videoUrl: '/videos/biceps-triceps-isolation.mp4',
    videoDuration: '1:50',
    category: 'Upper Body',
    targetMuscles: ['Bicipiti', 'Tricipiti'],
    gifUrl: getPublicPath('/gif/biceps-triceps-isolation.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '201'
  },
  proneArmCircles: {
    id: 'prone-arm-circles',
    name: 'Prone Arm Circles & Swimmer',
    videoUrl: '/videos/prone-arm-circles.mp4',
    videoDuration: '2:09',
    category: 'Back',
    targetMuscles: ['Dorsali', 'Deltoidi posteriori', 'Romboidi'],
    gifUrl: getPublicPath('/gif/prone-arm-circles.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '201'
  },
  rearDeltFlys: {
    id: 'rear-delt-flys',
    name: 'Rear Delt Flys',
    videoUrl: '/videos/rear-delt-flys.mp4',
    videoDuration: '0:41',
    category: 'Upper Body',
    targetMuscles: ['Deltoidi posteriori'],
    gifUrl: getPublicPath('/gif/rear-delt-flys.gif.jfif'),
    sets: 3,
    reps: '12-15',
    rm: 15,
    repSpeed: '201'
  },
  candleRaise: {
    id: 'candle-raise',
    name: 'Candle Raise',
    videoUrl: '/videos/candle-raise.mp4',
    videoDuration: '1:04',
    category: 'Core',
    targetMuscles: ['Addominali inferiori'],
    gifUrl: getPublicPath('/gif/candle-raise.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '202'
  },
  gluteHamRaise: {
    id: 'glute-ham-raise',
    name: 'Glute Ham Raise',
    videoUrl: '/videos/glute-ham-raise.mp4',
    videoDuration: '0:48',
    category: 'Lower Body',
    targetMuscles: ['Glutei', 'Hamstring'],
    gifUrl: getPublicPath('/gif/glute-ham-raise.gif.jfif'),
    sets: 3,
    reps: '8-10',
    rm: 10,
    repSpeed: '201'
  },
  pikeWalk: {
    id: 'pike-walk',
    name: 'Pike Walk',
    videoUrl: '/videos/pike-walk.mp4',
    videoDuration: '1:15',
    category: 'Full Body',
    targetMuscles: ['Spalle', 'Core', 'Hamstring'],
    gifUrl: getPublicPath('/gif/pike-walk.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '202'
  },
  easyBridgeRaise: {
    id: 'easy-bridge-raise',
    name: 'Easy Bridge Raise',
    videoUrl: '/videos/easy-bridge-raise.mp4',
    videoDuration: '1:07',
    category: 'Posterior Chain',
    targetMuscles: ['Glutei', 'Lombari', 'Hamstring'],
    gifUrl: getPublicPath('/gif/easy-bridge-raise.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '202'
  },
  standingSideLegRaise: {
    id: 'standing-side-leg-raise',
    name: 'Standing Side Leg Raise',
    videoUrl: '/videos/standing-side-leg-raise.mp4',
    videoDuration: '1:06',
    category: 'Lower Body',
    targetMuscles: ['Abduttori dell\'anca', 'Glutei'],
    gifUrl: getPublicPath('/gif/standing-side-leg-raise.gif.jfif'),
    sets: 3,
    reps: '10-12',
    rm: 12,
    repSpeed: '202'
  }
};

// Funzione per creare una settimana di test
const createTestWeek = (phaseId: string, weekNumber: number, testCodes: string[]): WorkoutWeek => {
  return {
    id: `${phaseId}-week-${weekNumber}`,
    phaseId,
    weekNumber,
    name: `Settimana di Test ${weekNumber}`,
    isTestWeek: true,
    isAvailable: true,
    days: testCodes.map((code, index) => ({
      id: `${phaseId}-w${weekNumber}-d${index+1}`,
      code,
      name: `Test ${code.split('-')[1]}`,
      dayNumber: index + 1,
      type: 'test',
      exercises: [
        // Esercizi di test generici
        {...commonExercises.squatVariations},
        {...commonExercises.horizontalPull},
        {...commonExercises.horizontalPush}
      ]
    }))
  };
};

// Funzione per creare una settimana normale di allenamento
const createWorkoutWeek = (
  phaseId: string, 
  weekNumber: number, 
  workoutCodes: string[], 
  isAvailable: boolean = true,
  availableInDays?: number
): WorkoutWeek => {
  return {
    id: `${phaseId}-week-${weekNumber}`,
    phaseId,
    weekNumber,
    name: `Settimana ${weekNumber}`,
    isTestWeek: false,
    isAvailable,
    availableInDays,
    days: workoutCodes.map((code, index) => ({
      id: `${phaseId}-w${weekNumber}-d${index+1}`,
      code,
      name: `Allenamento ${code}`,
      dayNumber: index + 1,
      type: code.toLowerCase().includes('rest') ? 'rest' : 'workout',
      exercises: code.toLowerCase().includes('rest') ? [] : [
        // Esercizi generici per ogni giorno di allenamento
        {...commonExercises.squatVariations},
        {...commonExercises.horizontalPull},
        {...commonExercises.horizontalPush},
        {...commonExercises.plankVariations}
      ]
    }))
  };
};

// Crea la fase di preparazione (Prep Phase)
function createPrepPhase(): WorkoutPhase {
  const phaseId = 'prep-phase';
  
  return {
    id: phaseId,
    name: 'Prep Phase',
    number: 0, // Fase preparatoria (fase 0)
    description: 'Fase iniziale per preparare il corpo agli allenamenti più intensi che seguiranno.',
    weeks: [
      // Test Week 1
      createTestWeek(phaseId, 1, ['PP-1', 'PP-2', 'PP-3']),
      // Week 2
      createWorkoutWeek(phaseId, 2, ['Capi A', 'Capi B'], true),
      // Week 3
      createWorkoutWeek(phaseId, 3, ['Capi A', 'Capi B', 'Capi A'], true),
      // Week 4
      createWorkoutWeek(phaseId, 4, ['Circ A', 'Circ B', 'Circ A'], true),
      // Week 5
      createWorkoutWeek(phaseId, 5, ['Circ A', 'Capi A', 'Circ B', 'Capi B'], true)
    ]
  };
}

// Crea la Phase 1
function createPhase1(): WorkoutPhase {
  const phaseId = 'phase-1';
  
  return {
    id: phaseId,
    name: 'Phase 1',
    number: 1, // Fase 1 (prima fase vera e propria)
    description: 'Prima fase di allenamento focalizzata sui movimenti fondamentali.',
    weeks: [
      // Test Week 6
      createTestWeek(phaseId, 6, ['1-1', '1-2']),
      // Week 7
      createWorkoutWeek(phaseId, 7, ['1A', '1B', '1A'], true),
      // Week 8 
      createWorkoutWeek(phaseId, 8, ['1A', '1B', '1A'], true),
      // Week 9
      createWorkoutWeek(phaseId, 9, ['1A', '1B', '1A'], true),
      // Week 10
      createWorkoutWeek(phaseId, 10, ['1A', '1B', '1A'], true)
    ]
  };
}

// Crea la Phase 2
function createPhase2(): WorkoutPhase {
  const phaseId = 'phase-2';
  
  return {
    id: phaseId,
    name: 'Phase 2',
    number: 2, // Fase 2 (seconda fase)
    description: 'Seconda fase con esercizi più avanzati e maggiore intensità.',
    weeks: [
      // Test Week 11
      createTestWeek(phaseId, 11, ['2-1', '2-2']),
      // Week 12
      createWorkoutWeek(phaseId, 12, ['2A', '2B', '2A'], true),
      // Week 13
      createWorkoutWeek(phaseId, 13, ['2B', '2A', '2B'], true),
      // Week 14
      createWorkoutWeek(phaseId, 14, ['2A', '2B', '2A'], true),
      // Week 15
      createWorkoutWeek(phaseId, 15, ['2B', '2A', '2B'], true),
      // Week 16
      createWorkoutWeek(phaseId, 16, ['2A', '2B', '2A'], true),
      // Week 17
      createWorkoutWeek(phaseId, 17, ['2B', '2A', '2B'], true)
    ]
  };
}

// Crea la Phase 3
function createPhase3(): WorkoutPhase {
  const phaseId = 'phase-3';
  
  return {
    id: phaseId,
    name: 'Phase 3',
    number: 3, // Fase 3 (terza fase)
    description: 'Terza fase con split di allenamento a 3 giorni per una maggiore specializzazione.',
    weeks: [
      // Test Week 18
      createTestWeek(phaseId, 18, ['3-1', '3-2', '3-3']),
      // Week 19
      createWorkoutWeek(phaseId, 19, ['3A', '3B', '3C'], true),
      // Week 20
      createWorkoutWeek(phaseId, 20, ['3A', '3B', '3C'], true),
      // Week 21
      createWorkoutWeek(phaseId, 21, ['3A', '3B', '3C'], true),
      // Week 22
      createWorkoutWeek(phaseId, 22, ['3A', '3B', '3C'], true)
    ]
  };
}

// Crea la Phase 4
function createPhase4(): WorkoutPhase {
  const phaseId = 'phase-4';
  
  return {
    id: phaseId,
    name: 'Phase 4',
    number: 4, // Fase 4 (quarta fase)
    description: 'Fase finale con frequenza di allenamento variabile e massima intensità.',
    weeks: [
      // Test Week 23
      createTestWeek(phaseId, 23, ['4-1', '4-2']),
      // Week 24 (4 allenamenti)
      createWorkoutWeek(phaseId, 24, ['4A', '4B', '4A', '4B'], true),
      // Week 25 (3 allenamenti)
      createWorkoutWeek(phaseId, 25, ['4A', '4B', '4A'], true),
      // Week 26 (4 allenamenti)
      createWorkoutWeek(phaseId, 26, ['4B', '4A', '4B', '4A'], true),
      // Week 27 (3 allenamenti)
      createWorkoutWeek(phaseId, 27, ['4B', '4A', '4B'], true),
      // Week 28 (4 allenamenti)
      createWorkoutWeek(phaseId, 28, ['4A', '4B', '4A', '4B'], true),
      // Week 29 (3 allenamenti)
      createWorkoutWeek(phaseId, 29, ['4A', '4B', '4A'], true)
    ]
  };
}

// Crea tutte le altre fasi similmente - qui mostro solo le prime 3 per brevità
const phaseTemplates: WorkoutPhase[] = [
  createPrepPhase(),
  createPhase1(),
  createPhase2(),
  createPhase3(),
  createPhase4()
];

// Programma completo "Body Transformation"
export const bodyTransformationProgram: WorkoutProgram = {
  id: 'body-transformation',
  name: 'Body Transformation',
  description: 'Un programma completo di 29 settimane che combina allenamenti di forza, resistenza e definizione muscolare. Il programma è diviso in 5 fasi: Prep Phase, Phase 1, Phase 2, Phase 3 e Phase 4.',
  phases: phaseTemplates,
  duration: 29, // 29 settimane
  difficulty: 'intermediate',
  category: 'Strength & Hypertrophy',
  targetAreas: ['Full Body', 'Strength', 'Hypertrophy', 'Definition'],
  goals: 'Migliorare la composizione corporea, aumentare la forza e la massa muscolare, e migliorare la resistenza generale.',
  startDate: '2025-02-27' // Data di inizio del programma (oggi)
};

// Esporta tutti i programmi
export const workoutPrograms: WorkoutProgram[] = [
  bodyTransformationProgram
];
