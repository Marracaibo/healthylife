import { CalisthenicsSkill } from '../types/calisthenicsSkill';

// Dati di esempio per le skill di calisthenics
export const calisthenicsSkills: CalisthenicsSkill[] = [
  {
    id: 'muscle-up',
    name: 'Muscle Up',
    description: 'Padroneggia il muscle up, un movimento avanzato che combina pull-up e dip in un unico fluido esercizio.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Pull Up',
    icon: '/icons/muscleup.png',
    progressions: [
      {
        id: 'pull-up',
        level: 1,
        name: 'Pull Up',
        description: 'Padroneggia il pull up base per costruire la forza necessaria per il muscle up',
        targetReps: '10x Pull Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pull-up-ex',
            name: 'Pull Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'body-row',
            name: 'Body Row',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'dip',
            name: 'Dip',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'push-up',
            name: 'Push Up',
            sets: 3,
            reps: '12x'
          }
        ]
      },
      {
        id: 'high-pull-up',
        level: 2,
        name: 'High Pull Up',
        description: 'Esegui pull up tirando il petto verso la sbarra per aumentare l\'ampiezza del movimento',
        targetReps: '8x High Pull Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'high-pull-up-ex',
            name: 'High Pull Up',
            sets: 3,
            reps: '4x'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '7x'
          },
          {
            id: 'straight-bar-dip',
            name: 'Straight Bar Dip',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'push-up',
            name: 'Push Up',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'jumping-muscle-up',
        level: 3,
        name: 'Jumping Muscle Up',
        description: 'Utilizza un piccolo salto per aiutarti ad eseguire il muscle up e abituarti al movimento',
        targetReps: '6x Jumping Muscle Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'jumping-muscle-up-ex',
            name: 'Jumping Muscle Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'high-pull-up',
            name: 'High Pull Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'straight-bar-dip',
            name: 'Straight Bar Dip',
            sets: 3,
            reps: '7x'
          }
        ]
      },
      {
        id: 'kipping-muscle-up',
        level: 4,
        name: 'Kipping Muscle Up',
        description: 'Utilizza lo slancio del corpo per facilitare la transizione e completare il movimento',
        targetReps: '5x Kipping Muscle Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'kipping-muscle-up-ex',
            name: 'Kipping Muscle Up',
            sets: 3,
            reps: '2x'
          },
          {
            id: 'high-pull-up',
            name: 'High Pull Up',
            sets: 3,
            reps: '7x'
          },
          {
            id: 'negative-muscle-up',
            name: 'Negative Muscle Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'straight-bar-dip',
            name: 'Straight Bar Dip',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'strict-muscle-up',
        level: 5,
        name: 'Muscle Up',
        description: 'Esegui il muscle up completo con tecnica perfetta e controllo totale',
        targetReps: '3x Strict Muscle Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'strict-muscle-up-ex',
            name: 'Muscle Up',
            sets: 3,
            reps: '1x'
          },
          {
            id: 'kipping-muscle-up',
            name: 'Kipping Muscle Up',
            sets: 3,
            reps: '4x'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'straight-bar-dip',
            name: 'Straight Bar Dip',
            sets: 3,
            reps: '10x'
          }
        ]
      }
    ]
  },
  {
    id: 'planche',
    name: 'Planche',
    description: 'Padroneggia la planche, una posizione di equilibrio avanzata che richiede forza eccezionale nella parte superiore del corpo.',
    difficulty: 'elite',
    achieved: false,
    progress: 0,
    firstLevelName: 'Pseudo Push Ups',
    icon: '/icons/plank.png',
    progressions: [
      {
        id: 'pseudo-push-ups',
        level: 1,
        name: 'Pseudo Push Ups',
        description: 'Inizia con i push up con le mani posizionate accanto ai fianchi',
        targetReps: '10x Pseudo Push Ups',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pseudo-push-ups-ex',
            name: 'Pseudo Push Ups',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pseudo-planche-lean',
            name: 'Pseudo Planche Lean',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'leg-raise',
            name: 'Leg Raise',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'superman',
            name: 'Superman',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'frog-stand',
        level: 2,
        name: 'Frog Stand',
        description: 'Progredisci verso la posizione di equilibrio sulle mani con le ginocchia appoggiate sui gomiti',
        targetReps: '30s Frog Stand Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'frog-stand-ex',
            name: 'Frog Stand',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'pseudo-push-ups',
            name: 'Pseudo Push Ups',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pseudo-planche-lean',
            name: 'Pseudo Planche Lean',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'superman',
            name: 'Superman',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'tuck-planche',
        level: 3,
        name: 'Tuck Planche',
        description: 'Avanza verso la posizione di planche con le ginocchia raccolte al petto',
        targetReps: '20s Tuck Planche Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tuck-planche-ex',
            name: 'Tuck Planche',
            sets: 3,
            reps: '6s'
          },
          {
            id: 'frog-stand',
            name: 'Frog Stand',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'pseudo-push-ups',
            name: 'Pseudo Push Ups',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'superman',
            name: 'Superman',
            sets: 3,
            reps: '12x'
          }
        ]
      },
      {
        id: 'adv-tuck-planche',
        level: 4,
        name: 'Advanced Tuck Planche',
        description: 'Progredisci verso la posizione di planche con le gambe leggermente estese',
        targetReps: '15s Adv. Tuck Planche Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'adv-tuck-planche-ex',
            name: 'Advanced Tuck Planche',
            sets: 3,
            reps: '6s'
          },
          {
            id: 'tuck-planche-swing',
            name: 'Tuck Planche Swing',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pseudo-push-ups',
            name: 'Pseudo Push Ups',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'superman',
            name: 'Superman',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'straddle-planche',
        level: 5,
        name: 'Straddle Planche',
        description: 'Progredisci verso la posizione di planche con le gambe divaricate',
        targetReps: '10s Straddle Planche Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'straddle-planche-ex',
            name: 'Straddle Planche',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'handstand-lean',
            name: 'Handstand Lean',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'tuck-planche-swing',
            name: 'Tuck Planche Swing',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'superman',
            name: 'Superman',
            sets: 3,
            reps: '20x'
          }
        ]
      },
      {
        id: 'full-planche',
        level: 6,
        name: 'Full Planche',
        description: 'Padroneggia la planche completa con le gambe tese',
        targetReps: '10s Full Planche Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-planche-ex',
            name: 'Planche',
            sets: 3,
            reps: '2s'
          },
          {
            id: 'straddle-planche',
            name: 'Straddle Planche',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'handstand-lean',
            name: 'Handstand Lean',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'adv-tuck-planche',
            name: 'Advanced Tuck Planche',
            sets: 3,
            reps: '10s'
          }
        ]
      }
    ]
  },
  {
    id: 'front-lever',
    name: 'Front Lever',
    description: 'Padroneggia il front lever, una posizione di forza e stabilità a testa in giù.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Tuck Front Lever',
    progressions: [
      {
        id: 'tuck-front-lever',
        level: 1,
        name: 'Tuck Front Lever',
        description: 'Inizia con la posizione raccolta per sviluppare la forza di base',
        targetReps: '20s Tuck Front Lever Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tuck-front-lever-ex',
            name: 'Tuck Front Lever',
            sets: 3,
            reps: '6s'
          },
          {
            id: 'tuck-front-lever-raise',
            name: 'Tuck Front Lever Raise',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '6x'
          },
          {
            id: 'leg-raise',
            name: 'Leg Raise',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'adv-tuck-front-lever',
        level: 2,
        name: 'Advanced Tuck Front Lever',
        description: 'Avanza verso la posizione con le gambe leggermente estese',
        targetReps: '20s Advanced Tuck Front Lever',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'adv-tuck-front-lever-ex',
            name: 'Advanced Tuck Front Lever',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'tuck-front-lever',
            name: 'Tuck Front Lever',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'tuck-front-lever-raise',
            name: 'Tuck Front Lever Raise',
            sets: 3,
            reps: '6x'
          },
          {
            id: 'toes-to-bar',
            name: 'Toes to Bar',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'one-leg-front-lever',
        level: 3,
        name: 'One Leg Front Lever',
        description: 'Avanza verso la posizione con una gamba estesa',
        targetReps: '15s One Leg Front Lever',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'one-leg-front-lever-ex',
            name: 'One Leg Front Lever',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'adv-tuck-front-lever',
            name: 'Advanced Tuck Front Lever',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'adv-tuck-front-lever-raise',
            name: 'Advanced Tuck Front Lever Raise',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'toes-to-bar',
            name: 'Toes to Bar',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'half-front-lever',
        level: 4,
        name: 'Half Front Lever',
        description: 'Progredisci verso una posizione di front lever con entrambe le gambe parzialmente estese',
        targetReps: '15s Half Front Lever',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'half-front-lever-ex',
            name: 'Half Front Lever',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'adv-tuck-front-lever',
            name: 'Advanced Tuck Front Lever',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'ice-cream-makers',
            name: 'Ice Cream Makers',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'toes-to-bar',
            name: 'Toes to Bar',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'straddle-front-lever',
        level: 5,
        name: 'Straddle Front Lever',
        description: 'Progredisci verso la posizione con le gambe divaricate',
        targetReps: '15s Straddle Front Lever',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'straddle-front-lever-ex',
            name: 'Straddle Front Lever',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'one-leg-front-lever',
            name: 'One Leg Front Lever',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'ice-cream-makers',
            name: 'Ice Cream Makers',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'dragon-flag',
            name: 'Dragon Flag',
            sets: 1,
            reps: '6x'
          }
        ]
      },
      {
        id: 'full-front-lever',
        level: 6,
        name: 'Full Front Lever',
        description: 'Padroneggia il front lever completo con il corpo completamente teso',
        targetReps: '12s Full Front Lever',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-front-lever-ex',
            name: 'Front Lever',
            sets: 3,
            reps: '3s'
          },
          {
            id: 'straddle-front-lever',
            name: 'Straddle Front Lever',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'ice-cream-makers',
            name: 'Ice Cream Makers',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'dragon-flag',
            name: 'Dragon Flag',
            sets: 1,
            reps: '8x'
          }
        ]
      }
    ]
  },
  {
    id: 'back-lever',
    name: 'Back Lever',
    description: 'Padroneggia il back lever, una posizione di forza e stabilità a testa in giù.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Skin the Cat',
    icon: '/icons/backlever.png',
    progressions: [
      {
        id: 'skin-the-cat',
        level: 1,
        name: 'Skin the Cat',
        description: 'Inizia con questo movimento fondamentale per sviluppare la mobilità delle spalle',
        targetReps: '5x Skin the Cat',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'skin-the-cat-ex',
            name: 'Skin the Cat',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'german-hang',
            name: 'German Hang',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'straight-arm-hang',
            name: 'Straight Arm Hang',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'tuck-back-lever',
        level: 2,
        name: 'Tuck Back Lever',
        description: 'Progredisci verso la posizione di back lever con le ginocchia raccolte al petto',
        targetReps: '30s Tuck Back Lever Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tuck-back-lever-ex',
            name: 'Tuck Back Lever',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'skin-the-cat',
            name: 'Skin the Cat',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'german-hang-pull-out',
            name: 'German Hang Pull Out',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'inverted-hang',
            name: 'Inverted Hang',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'adv-tuck-back-lever',
        level: 3,
        name: 'Advanced Tuck Back Lever',
        description: 'Avanza verso la posizione con le gambe leggermente estese',
        targetReps: '20s Adv. Tuck Back Lever Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'adv-tuck-back-lever-ex',
            name: 'Advanced Tuck Back Lever',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'tuck-back-lever',
            name: 'Tuck Back Lever',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'pull-to-inverted',
            name: 'Pull to Inverted',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'back-lever-pulls',
            name: 'Back Lever Pulls',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'straddle-back-lever',
        level: 4,
        name: 'Straddle Back Lever',
        description: 'Progredisci verso la posizione con le gambe divaricate',
        targetReps: '15s Straddle Back Lever Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'straddle-back-lever-ex',
            name: 'Straddle Back Lever',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'adv-tuck-back-lever',
            name: 'Advanced Tuck Back Lever',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'straddle-back-lever-pulls',
            name: 'Straddle Back Lever Pulls',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'weighted-pull-ups',
            name: 'Weighted Pull Ups',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'full-back-lever',
        level: 5,
        name: 'Full Back Lever',
        description: 'Padroneggia il back lever completo con il corpo completamente teso',
        targetReps: '10s Full Back Lever Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-back-lever-ex',
            name: 'Full Back Lever',
            sets: 3,
            reps: '3s'
          },
          {
            id: 'straddle-back-lever',
            name: 'Straddle Back Lever',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'back-lever-raises',
            name: 'Back Lever Raises',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'weighted-inverted-hang',
            name: 'Weighted Inverted Hang',
            sets: 3,
            reps: '20s'
          }
        ]
      }
    ]
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat',
    description: 'Padroneggia lo squat su una gamba, un esercizio avanzato di forza per le gambe.',
    difficulty: 'intermediate',
    achieved: false,
    progress: 0,
    firstLevelName: 'Deep Squat',
    icon: '/icons/pistol squat.png',
    progressions: [
      {
        id: 'deep-squat',
        level: 1,
        name: 'Deep Squat',
        description: 'Inizia con lo squat profondo per sviluppare mobilità e forza di base',
        targetReps: '15x Deep Squat',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'deep-squat-ex',
            name: 'Deep Squat',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'bodyweight-squat',
            name: 'Bodyweight Squat',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'squat-hold',
            name: 'Squat Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'calf-raises',
            name: 'Calf Raises',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'bulgarian-squat',
        level: 2,
        name: 'Bulgarian Squat',
        description: 'Progredisci verso lo squat bulgaro per sviluppare forza unilaterale',
        targetReps: '10x Bulgarian Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'bulgarian-squat-ex',
            name: 'Bulgarian Squat',
            sets: 3,
            reps: '6x per gamba'
          },
          {
            id: 'deep-squat',
            name: 'Deep Squat',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'lunges',
            name: 'Lunges',
            sets: 3,
            reps: '10x per gamba'
          },
          {
            id: 'glute-bridge',
            name: 'Glute Bridge',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'archer-squat',
        level: 3,
        name: 'Archer Squat',
        description: 'Avanza verso lo squat arciere per aumentare il carico su una gamba',
        targetReps: '8x Archer Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'archer-squat-ex',
            name: 'Archer Squat',
            sets: 3,
            reps: '5x per gamba'
          },
          {
            id: 'bulgarian-squat',
            name: 'Bulgarian Squat',
            sets: 3,
            reps: '10x per gamba'
          },
          {
            id: 'side-lunges',
            name: 'Side Lunges',
            sets: 3,
            reps: '8x per gamba'
          },
          {
            id: 'single-leg-glute-bridge',
            name: 'Single Leg Glute Bridge',
            sets: 3,
            reps: '10x per gamba'
          }
        ]
      },
      {
        id: 'bench-pistol-squat',
        level: 4,
        name: 'Bench Pistol Squat',
        description: 'Progredisci verso il pistol squat su una panca per controllare la discesa',
        targetReps: '6x Bench Pistol Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'bench-pistol-squat-ex',
            name: 'Bench Pistol Squat',
            sets: 3,
            reps: '4x per gamba'
          },
          {
            id: 'archer-squat',
            name: 'Archer Squat',
            sets: 3,
            reps: '8x per gamba'
          },
          {
            id: 'single-leg-box-squat',
            name: 'Single Leg Box Squat',
            sets: 3,
            reps: '6x per gamba'
          },
          {
            id: 'single-leg-calf-raises',
            name: 'Single Leg Calf Raises',
            sets: 3,
            reps: '10x per gamba'
          }
        ]
      },
      {
        id: 'assisted-pistol-squat',
        level: 5,
        name: 'Assisted Pistol Squat',
        description: 'Avanza verso il pistol squat assistito tenendoti a un supporto',
        targetReps: '5x Assisted Pistol Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'assisted-pistol-squat-ex',
            name: 'Assisted Pistol Squat',
            sets: 3,
            reps: '3x per gamba'
          },
          {
            id: 'bench-pistol-squat',
            name: 'Bench Pistol Squat',
            sets: 3,
            reps: '6x per gamba'
          },
          {
            id: 'negative-pistol-squat',
            name: 'Negative Pistol Squat',
            sets: 3,
            reps: '4x per gamba'
          },
          {
            id: 'single-leg-squat-hold',
            name: 'Single Leg Squat Hold',
            sets: 3,
            reps: '15s per gamba'
          }
        ]
      },
      {
        id: 'rolling-pistol-squat',
        level: 6,
        name: 'Rolling Pistol Squat',
        description: 'Progredisci verso il pistol squat con aiuto del movimento di slancio',
        targetReps: '5x Rolling Pistol Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'rolling-pistol-squat-ex',
            name: 'Rolling Pistol Squat',
            sets: 3,
            reps: '3x per gamba'
          },
          {
            id: 'assisted-pistol-squat',
            name: 'Assisted Pistol Squat',
            sets: 3,
            reps: '5x per gamba'
          },
          {
            id: 'negative-pistol-squat',
            name: 'Negative Pistol Squat',
            sets: 3,
            reps: '5x per gamba'
          },
          {
            id: 'shrimp-squat',
            name: 'Shrimp Squat',
            sets: 3,
            reps: '5x per gamba'
          }
        ]
      },
      {
        id: 'elevated-pistol-squat',
        level: 7,
        name: 'Elevated Pistol Squat',
        description: 'Avanza verso il pistol squat con il piede elevato per facilitare l\'equilibrio',
        targetReps: '4x Elevated Pistol Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'elevated-pistol-squat-ex',
            name: 'Elevated Pistol Squat',
            sets: 3,
            reps: '2x per gamba'
          },
          {
            id: 'rolling-pistol-squat',
            name: 'Rolling Pistol Squat',
            sets: 3,
            reps: '5x per gamba'
          },
          {
            id: 'partial-pistol-squat',
            name: 'Partial Pistol Squat',
            sets: 3,
            reps: '4x per gamba'
          },
          {
            id: 'single-leg-balance',
            name: 'Single Leg Balance',
            sets: 3,
            reps: '30s per gamba'
          }
        ]
      },
      {
        id: 'full-pistol-squat',
        level: 8,
        name: 'Pistol Squat',
        description: 'Padroneggia il pistol squat completo senza supporto',
        targetReps: '3x Pistol Squat (per gamba)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-pistol-squat-ex',
            name: 'Pistol Squat',
            sets: 3,
            reps: '1x per gamba'
          },
          {
            id: 'elevated-pistol-squat',
            name: 'Elevated Pistol Squat',
            sets: 3,
            reps: '4x per gamba'
          },
          {
            id: 'weighted-squat',
            name: 'Weighted Squat',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'pistol-squat-pulses',
            name: 'Pistol Squat Pulses',
            sets: 3,
            reps: '5x per gamba'
          }
        ]
      }
    ]
  },
  {
    id: 'handstand-push-up',
    name: 'Handstand Push Up',
    description: 'Padroneggia il push up in verticale, un esercizio avanzato per spalle e tricipiti.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Pike Push Up',
    progressions: [
      {
        id: 'pike-push-up',
        level: 1,
        name: 'Pike Push Up',
        description: 'Inizia con il pike push up per sviluppare la forza di base necessaria per sbloccare il livello successivo',
        targetReps: '10x Pike Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pike-push-up-ex',
            name: 'Pike Push Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'push-up',
            name: 'Push Up',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'shoulder-press',
            name: 'Shoulder Press',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'plank-shoulder-taps',
            name: 'Plank Shoulder Taps',
            sets: 3,
            reps: '12x'
          }
        ]
      },
      {
        id: 'elevated-pike-push-up',
        level: 2,
        name: 'Elevated Pike Push Up',
        description: 'Progredisci verso un pike push up con i piedi elevati per aumentare l\'angolo',
        targetReps: '8x Elevated Pike Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'elevated-pike-push-up-ex',
            name: 'Elevated Pike Push Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pike-push-up',
            name: 'Pike Push Up',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'decline-push-up',
            name: 'Decline Push Up',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'wall-plank',
            name: 'Wall Plank',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'wall-handstand',
        level: 3,
        name: 'Wall Handstand',
        description: 'Avanza verso la posizione di verticale contro il muro per abituarti all\'inversione',
        targetReps: '60s Wall Handstand Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-handstand-ex',
            name: 'Wall Handstand',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'elevated-pike-push-up',
            name: 'Elevated Pike Push Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'wall-walks',
            name: 'Wall Walks',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'wall-headstand-push-up',
        level: 4,
        name: 'Wall Headstand Push Up',
        description: 'Progredisci verso il push up in posizione di headstand contro il muro',
        targetReps: '5x Wall Headstand Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-headstand-push-up-ex',
            name: 'Wall Headstand Push Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'wall-handstand',
            name: 'Wall Handstand',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'headstand-hold',
            name: 'Headstand Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'pike-shoulder-press',
            name: 'Pike Shoulder Press',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'wall-handstand-push-up',
        level: 5,
        name: 'Wall Handstand Push Up',
        description: 'Avanza verso il push up completo in verticale contro il muro',
        targetReps: '3x Wall Handstand Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-handstand-push-up-ex',
            name: 'Wall Handstand Push Up',
            sets: 3,
            reps: '1-2x'
          },
          {
            id: 'wall-headstand-push-up',
            name: 'Wall Headstand Push Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'negative-handstand-push-up',
            name: 'Negative Handstand Push Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'pike-push-up-deep',
            name: 'Deep Pike Push Up',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'handstand-push-up',
        level: 6,
        name: 'Handstand Push Up',
        description: 'Padroneggia il handstand push up completo con tecnica perfetta',
        targetReps: '3x Handstand Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'handstand-push-up-ex',
            name: 'Handstand Push Up',
            sets: 3,
            reps: '1x'
          },
          {
            id: 'wall-handstand-push-up',
            name: 'Wall Handstand Push Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'freestanding-handstand',
            name: 'Freestanding Handstand',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'weighted-pike-push-up',
            name: 'Weighted Pike Push Up',
            sets: 3,
            reps: '5x'
          }
        ]
      }
    ]
  },
  {
    id: 'v-sit',
    name: 'V-Sit',
    description: 'Padroneggia il V-Sit, una posizione avanzata di controllo del core che richiede forza addominale e flessibilità.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Seated Leg Lifts',
    icon: '/icons/v sit.png',
    progressions: [
      {
        id: 'seated-leg-lifts',
        level: 1,
        name: 'Seated Leg Lifts',
        description: 'Inizia con i sollevamenti delle gambe da seduto per sviluppare la forza di base necessaria',
        targetReps: '15x Seated Leg Lifts',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'seated-leg-lifts-ex',
            name: 'Seated Leg Lifts',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'leg-raises',
            name: 'Leg Raises',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'seated-pikes',
            name: 'Seated Pikes',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'tucked-l-sit',
        level: 2,
        name: 'Tucked L-Sit',
        description: 'Progredisci verso l\'L-sit con le ginocchia piegate per ridurre la leva',
        targetReps: '20s Tucked L-Sit Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tucked-l-sit-ex',
            name: 'Tucked L-Sit',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'seated-leg-lifts',
            name: 'Seated Leg Lifts',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'support-hold',
            name: 'Support Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'hanging-knee-raises',
            name: 'Hanging Knee Raises',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'l-sit',
        level: 3,
        name: 'L-Sit',
        description: 'Avanza verso l\'L-sit con le gambe tese, una posizione fondamentale nel percorso verso il V-sit',
        targetReps: '20s L-Sit Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'l-sit-ex',
            name: 'L-Sit',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'tucked-l-sit',
            name: 'Tucked L-Sit',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'hanging-leg-raises',
            name: 'Hanging Leg Raises',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'compression-work',
            name: 'Compression Work',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'advanced-l-sit',
        level: 4,
        name: 'Advanced L-Sit',
        description: 'Migliora la tua L-sit allungando il tempo di tenuta e preparando i flessori dell\'anca per il V-sit',
        targetReps: '30s L-Sit Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'advanced-l-sit-ex',
            name: 'Advanced L-Sit',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'l-sit',
            name: 'L-Sit',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'straight-arm-press',
            name: 'Straight Arm Press',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pike-compression',
            name: 'Pike Compression',
            sets: 3,
            reps: '15s'
          }
        ]
      },
      {
        id: 'tucked-v-sit',
        level: 5,
        name: 'Tucked V-Sit',
        description: 'Progredisci verso il V-sit con le ginocchia piegate per iniziare a sviluppare l\'angolazione corretta',
        targetReps: '10s Tucked V-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tucked-v-sit-ex',
            name: 'Tucked V-Sit',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'advanced-l-sit',
            name: 'Advanced L-Sit',
            sets: 3,
            reps: '25s'
          },
          {
            id: 'compression-pulses',
            name: 'Compression Pulses',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'straddle-ups',
            name: 'Straddle Ups',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'full-v-sit',
        level: 6,
        name: 'Full V-Sit',
        description: 'Padroneggia il V-sit completo con le gambe tese e il corpo in posizione a V',
        targetReps: '5s Full V-Sit Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-v-sit-ex',
            name: 'Full V-Sit',
            sets: 3,
            reps: '3s'
          },
          {
            id: 'tucked-v-sit',
            name: 'Tucked V-Sit',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'press-to-handstand',
            name: 'Press to Handstand Progression',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'manna-progression',
            name: 'Manna Progression',
            sets: 3,
            reps: '5s'
          }
        ]
      }
    ]
  },
  {
    id: 'one-arm-pull-up',
    name: 'One Arm Pull Up',
    description: 'Padroneggia la trazioni a un braccio, una delle abilità di forza più impegnative nel calisthenics.',
    difficulty: 'elite',
    achieved: false,
    progress: 0,
    firstLevelName: 'Pull Up',
    progressions: [
      {
        id: 'pull-up-progression',
        level: 1,
        name: 'Pull Up',
        description: 'Padroneggia le trazioni base con un elevato numero di ripetizioni prima di passare alle varianti più avanzate',
        targetReps: '15x Pull Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pull-up-ex',
            name: 'Pull Up',
            sets: 4,
            reps: '8-10x'
          },
          {
            id: 'scapular-pull',
            name: 'Scapular Pull',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'dead-hang',
            name: 'Dead Hang',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'australian-pull-up',
            name: 'Australian Pull Up',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'weighted-pull-up',
        level: 2,
        name: 'Weighted Pull Up',
        description: 'Aumenta progressivamente la resistenza aggiungendo peso alle tue trazioni',
        targetReps: '5x Pull Up con +30% del peso corporeo',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'weighted-pull-up-ex',
            name: 'Weighted Pull Up',
            sets: 4,
            reps: '5x'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'commando-pull-up',
            name: 'Commando Pull Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'typewriter-pull-up',
            name: 'Typewriter Pull Up',
            sets: 3,
            reps: '3x per lato'
          }
        ]
      },
      {
        id: 'archer-pull-up',
        level: 3,
        name: 'Archer Pull Up',
        description: 'Inizia a spostare il carico maggiormente su un braccio alla volta',
        targetReps: '5x Archer Pull Up per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'archer-pull-up-ex',
            name: 'Archer Pull Up',
            sets: 3,
            reps: '3x per lato'
          },
          {
            id: 'weighted-pull-up',
            name: 'Weighted Pull Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'typewriter-pull-up',
            name: 'Typewriter Pull Up',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'l-sit-pull-up',
            name: 'L-Sit Pull Up',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'assisted-one-arm-pull-up',
        level: 4,
        name: 'Assisted One Arm Pull Up',
        description: 'Utilizza l\'altro braccio o una fascia elastica come supporto parziale',
        targetReps: '3x Assisted One Arm Pull Up per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'assisted-one-arm-pull-up-ex',
            name: 'Assisted One Arm Pull Up',
            sets: 3,
            reps: '2x per braccio'
          },
          {
            id: 'archer-pull-up',
            name: 'Archer Pull Up',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'one-arm-negative',
            name: 'One Arm Negative',
            sets: 3,
            reps: '2x per braccio'
          },
          {
            id: 'one-arm-scapular-pull',
            name: 'One Arm Scapular Pull',
            sets: 3,
            reps: '5x per braccio'
          }
        ]
      },
      {
        id: 'one-arm-negative',
        level: 5,
        name: 'One Arm Negative',
        description: 'Padroneggia la fase negativa (discesa controllata) della trazione a un braccio',
        targetReps: '3x One Arm Negative lente per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'one-arm-negative-ex',
            name: 'One Arm Negative',
            sets: 3,
            reps: '2x per braccio'
          },
          {
            id: 'assisted-one-arm-pull-up',
            name: 'Assisted One Arm Pull Up',
            sets: 3,
            reps: '2-3x per braccio'
          },
          {
            id: 'one-arm-active-hang',
            name: 'One Arm Active Hang',
            sets: 3,
            reps: '20s per braccio'
          },
          {
            id: 'weighted-pull-up',
            name: 'Weighted Pull Up',
            sets: 3,
            reps: '3-5x (peso elevato)'
          }
        ]
      },
      {
        id: 'one-arm-pull-up',
        level: 6,
        name: 'One Arm Pull Up',
        description: 'Padroneggia la trazione completa con un solo braccio',
        targetReps: '2x One Arm Pull Up per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'one-arm-pull-up-ex',
            name: 'One Arm Pull Up',
            sets: 3,
            reps: '1x per braccio'
          },
          {
            id: 'one-arm-negative',
            name: 'One Arm Negative',
            sets: 3,
            reps: '3x per braccio'
          },
          {
            id: 'minimal-assist-oapu',
            name: 'Minimal Assist One Arm Pull Up',
            sets: 3,
            reps: '2x per braccio'
          },
          {
            id: 'weighted-chin-up',
            name: 'Weighted Chin Up',
            sets: 3,
            reps: '3x (peso massimo)'
          }
        ]
      }
    ]
  },
  {
    id: 'human-flag',
    name: 'Human Flag',
    description: 'Padroneggia lo human flag, una posizione di forza laterale che richiede eccezionale forza del core e delle spalle.',
    difficulty: 'elite',
    achieved: false,
    progress: 0,
    firstLevelName: 'Side Plank',
    progressions: [
      {
        id: 'side-plank',
        level: 1,
        name: 'Side Plank',
        description: 'Inizia con il side plank per sviluppare la forza laterale di base necessaria per lo human flag',
        targetReps: '60s Side Plank per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'side-plank-ex',
            name: 'Side Plank',
            sets: 3,
            reps: '30s per lato'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'pull-up',
            name: 'Pull Up',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'push-up',
            name: 'Push Up',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'flag-pole-horizontal-rows',
        level: 2,
        name: 'Flag Pole Horizontal Rows',
        description: 'Sviluppa la forza necessaria per tenere il corpo orizzontale tramite trazioni orizzontali',
        targetReps: '10x Flag Pole Horizontal Rows per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'flag-pole-rows-ex',
            name: 'Flag Pole Horizontal Rows',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'side-plank-with-rotation',
            name: 'Side Plank with Rotation',
            sets: 3,
            reps: '8x per lato'
          },
          {
            id: 'straight-arm-pull-down',
            name: 'Straight Arm Pull Down',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'single-arm-push-up-progression',
            name: 'Single Arm Push Up Progression',
            sets: 3,
            reps: '5x per lato'
          }
        ]
      },
      {
        id: 'tucked-flag',
        level: 3,
        name: 'Tucked Flag',
        description: 'Inizia la progressione verso lo human flag con le ginocchia piegate al petto per ridurre la leva',
        targetReps: '15s Tucked Flag Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tucked-flag-ex',
            name: 'Tucked Flag',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'flag-pole-rows',
            name: 'Flag Pole Horizontal Rows',
            sets: 3,
            reps: '8x per lato'
          },
          {
            id: 'side-lever-pulls',
            name: 'Side Lever Pulls',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'dragon-flag',
            name: 'Dragon Flag',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'advanced-tucked-flag',
        level: 4,
        name: 'Advanced Tucked Flag',
        description: 'Progredisci estendendo parzialmente le gambe dalla posizione tucked',
        targetReps: '12s Advanced Tucked Flag Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'advanced-tucked-flag-ex',
            name: 'Advanced Tucked Flag',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'tucked-flag',
            name: 'Tucked Flag',
            sets: 3,
            reps: '12s'
          },
          {
            id: 'l-sit-pull-up',
            name: 'L-Sit Pull Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'one-arm-push-up-progression',
            name: 'One Arm Push Up Progression',
            sets: 3,
            reps: '3x per lato'
          }
        ]
      },
      {
        id: 'straddle-flag',
        level: 5,
        name: 'Straddle Flag',
        description: 'Avanza verso lo human flag con le gambe divaricate per ridurre la difficoltà',
        targetReps: '8s Straddle Flag Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'straddle-flag-ex',
            name: 'Straddle Flag',
            sets: 3,
            reps: '3-5s'
          },
          {
            id: 'advanced-tucked-flag',
            name: 'Advanced Tucked Flag',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'side-lever-raises',
            name: 'Side Lever Raises',
            sets: 3,
            reps: '3x per lato'
          },
          {
            id: 'weighted-pull-up',
            name: 'Weighted Pull Up',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'full-human-flag',
        level: 6,
        name: 'Full Human Flag',
        description: 'Padroneggia lo human flag completo con le gambe tese',
        targetReps: '5s Full Human Flag Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-human-flag-ex',
            name: 'Full Human Flag',
            sets: 3,
            reps: '3s'
          },
          {
            id: 'straddle-flag',
            name: 'Straddle Flag',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'one-arm-push-up',
            name: 'One Arm Push Up Progression',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'iron-cross-progression',
            name: 'Iron Cross Progression',
            sets: 3,
            reps: '5s'
          }
        ]
      }
    ]
  },
  {
    id: 'one-arm-push-up',
    name: 'One Arm Push Up',
    description: 'Padroneggia il piegamento a un braccio, un esercizio avanzato che richiede eccezionale forza e stabilità.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Standard Push Up',
    progressions: [
      {
        id: 'standard-push-up',
        level: 1,
        name: 'Standard Push Up',
        description: 'Padroneggia i piegamenti standard con un elevato numero di ripetizioni prima di passare alle varianti più difficili',
        targetReps: '25x Standard Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'standard-push-up-ex',
            name: 'Standard Push Up',
            sets: 4,
            reps: '15x'
          },
          {
            id: 'diamond-push-up',
            name: 'Diamond Push Up',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'plank',
            name: 'Plank',
            sets: 3,
            reps: '60s'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'archer-push-up',
        level: 2,
        name: 'Archer Push Up',
        description: 'Inizia a spostare il carico su un braccio alla volta con i piegamenti ad arco',
        targetReps: '8x Archer Push Up per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'archer-push-up-ex',
            name: 'Archer Push Up',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'standard-push-up',
            name: 'Standard Push Up',
            sets: 3,
            reps: '20x'
          },
          {
            id: 'typewriter-push-up',
            name: 'Typewriter Push Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'side-plank',
            name: 'Side Plank',
            sets: 3,
            reps: '30s per lato'
          }
        ]
      },
      {
        id: 'uneven-push-up',
        level: 3,
        name: 'Uneven Push Up',
        description: 'Progredisci mettendo una mano su un rialzo per aumentare il carico sul braccio a terra',
        targetReps: '8x Uneven Push Up per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'uneven-push-up-ex',
            name: 'Uneven Push Up',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'archer-push-up',
            name: 'Archer Push Up',
            sets: 3,
            reps: '8x per lato'
          },
          {
            id: 'decline-push-up',
            name: 'Decline Push Up',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'scapular-push-up',
            name: 'Scapular Push Up',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'partial-one-arm-push-up',
        level: 4,
        name: 'Partial One Arm Push Up',
        description: 'Esegui piegamenti a un braccio con range di movimento limitato o da una posizione elevata',
        targetReps: '5x Partial One Arm Push Up per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'partial-one-arm-push-up-ex',
            name: 'Partial One Arm Push Up',
            sets: 3,
            reps: '3x per braccio'
          },
          {
            id: 'uneven-push-up',
            name: 'Uneven Push Up',
            sets: 3,
            reps: '8x per lato'
          },
          {
            id: 'archer-push-up',
            name: 'Archer Push Up',
            sets: 3,
            reps: '10x per lato'
          },
          {
            id: 'weighted-push-up',
            name: 'Weighted Push Up',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'assisted-one-arm-push-up',
        level: 5,
        name: 'Assisted One Arm Push Up',
        description: 'Usa l\'altra mano come supporto minimo o una fascia elastica per assistenza',
        targetReps: '3x Assisted One Arm Push Up per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'assisted-one-arm-push-up-ex',
            name: 'Assisted One Arm Push Up',
            sets: 3,
            reps: '3x per braccio'
          },
          {
            id: 'partial-one-arm-push-up',
            name: 'Partial One Arm Push Up',
            sets: 3,
            reps: '5x per braccio'
          },
          {
            id: 'one-arm-plank',
            name: 'One Arm Plank',
            sets: 3,
            reps: '20s per lato'
          },
          {
            id: 'fingertip-push-up',
            name: 'Fingertip Push Up',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'full-one-arm-push-up',
        level: 6,
        name: 'Full One Arm Push Up',
        description: 'Padroneggia il piegamento completo con un solo braccio',
        targetReps: '3x Full One Arm Push Up per braccio',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-one-arm-push-up-ex',
            name: 'Full One Arm Push Up',
            sets: 3,
            reps: '1-2x per braccio'
          },
          {
            id: 'assisted-one-arm-push-up',
            name: 'Assisted One Arm Push Up',
            sets: 3,
            reps: '3x per braccio'
          },
          {
            id: 'one-arm-negative',
            name: 'One Arm Negative Push Up',
            sets: 3,
            reps: '3x per braccio'
          },
          {
            id: 'explosive-push-up',
            name: 'Explosive Push Up',
            sets: 3,
            reps: '8x'
          }
        ]
      }
    ]
  },
  {
    id: 'one-arm-handstand',
    name: 'One Arm Handstand',
    description: 'Padroneggia la verticale su un solo braccio, una delle skill più avanzate nel calisthenics che richiede eccezionale forza, equilibrio e controllo.',
    difficulty: 'elite',
    achieved: false,
    progress: 0,
    firstLevelName: 'Verticale al Muro',
    progressions: [
      {
        id: 'wall-handstand',
        level: 1,
        name: 'Verticale al Muro',
        description: 'Padroneggia la verticale con il supporto del muro prima di passare a varianti più impegnative',
        targetReps: '60s Wall Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-handstand-ex',
            name: 'Wall Handstand',
            sets: 5,
            reps: '30s'
          },
          {
            id: 'pike-push-up',
            name: 'Pike Push Up',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'handstand-shoulder-taps',
            name: 'Handstand Shoulder Taps',
            sets: 3,
            reps: '5x per lato'
          }
        ]
      },
      {
        id: 'freestanding-handstand',
        level: 2,
        name: 'Verticale Libera',
        description: 'Sviluppa l\'abilità di mantenere una verticale stabile senza supporto',
        targetReps: '30s Freestanding Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'freestanding-handstand-ex',
            name: 'Freestanding Handstand',
            sets: 5,
            reps: '15s'
          },
          {
            id: 'wall-handstand',
            name: 'Wall Handstand',
            sets: 3,
            reps: '60s'
          },
          {
            id: 'handstand-heel-pulls',
            name: 'Handstand Heel Pulls',
            sets: 4,
            reps: '8x'
          },
          {
            id: 'handstand-toe-pulls',
            name: 'Handstand Toe Pulls',
            sets: 4,
            reps: '8x'
          }
        ]
      },
      {
        id: 'handstand-push-up',
        level: 3,
        name: 'Handstand Push Up',
        description: 'Sviluppa la forza per eseguire piegamenti in verticale, cruciale per la verticale su un braccio',
        targetReps: '5x Handstand Push Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'handstand-push-up-ex',
            name: 'Handstand Push Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'pike-push-up',
            name: 'Pike Push Up',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'elevated-pike-push-up',
            name: 'Elevated Pike Push Up',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'freestanding-handstand',
            name: 'Freestanding Handstand',
            sets: 5,
            reps: '30s'
          }
        ]
      },
      {
        id: 'staggered-handstand',
        level: 4,
        name: 'Verticale con Mani Sfalsate',
        description: 'Inizia a spostare il peso su un braccio alla volta con le mani in posizione asimmetrica',
        targetReps: '20s Staggered Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'staggered-handstand-ex',
            name: 'Staggered Handstand',
            sets: 4,
            reps: '15s'
          },
          {
            id: 'handstand-push-up',
            name: 'Handstand Push Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'freestanding-handstand',
            name: 'Freestanding Handstand',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'handstand-weight-shifts',
            name: 'Handstand Weight Shifts',
            sets: 3,
            reps: '5x per lato'
          }
        ]
      },
      {
        id: 'partial-oahs',
        level: 5,
        name: 'Verticale Parziale su Un Braccio',
        description: 'Solleva un braccio dalla verticale mantenendo un leggero contatto con l\'altro',
        targetReps: '10s Partial OAHS per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'partial-oahs-ex',
            name: 'Partial One Arm Handstand',
            sets: 3,
            reps: '5s per lato'
          },
          {
            id: 'staggered-handstand',
            name: 'Staggered Handstand',
            sets: 4,
            reps: '20s'
          },
          {
            id: 'single-arm-support-hold',
            name: 'Single Arm Support Hold',
            sets: 3,
            reps: '10s per lato'
          },
          {
            id: 'single-arm-wall-handstand',
            name: 'Single Arm Wall Handstand',
            sets: 3,
            reps: '5s per lato'
          }
        ]
      },
      {
        id: 'wall-oahs',
        level: 6,
        name: 'Verticale su Un Braccio al Muro',
        description: 'Esegui la verticale su un braccio con il supporto del muro',
        targetReps: '15s Wall OAHS per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-oahs-ex',
            name: 'Wall One Arm Handstand',
            sets: 3,
            reps: '8s per lato'
          },
          {
            id: 'partial-oahs',
            name: 'Partial One Arm Handstand',
            sets: 3,
            reps: '10s per lato'
          },
          {
            id: 'single-arm-shoulder-shrugs',
            name: 'Single Arm Shoulder Shrugs',
            sets: 3,
            reps: '8x per lato'
          },
          {
            id: 'weighted-single-arm-holds',
            name: 'Weighted Single Arm Holds',
            sets: 3,
            reps: '10s per lato'
          }
        ]
      },
      {
        id: 'oahs',
        level: 7,
        name: 'One Arm Handstand',
        description: 'Padroneggia la verticale completa su un solo braccio',
        targetReps: '5s Freestanding OAHS per lato',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'oahs-ex',
            name: 'One Arm Handstand',
            sets: 3,
            reps: '2-3s per lato'
          },
          {
            id: 'wall-oahs',
            name: 'Wall One Arm Handstand',
            sets: 3,
            reps: '15s per lato'
          },
          {
            id: 'oahs-transitions',
            name: 'OAHS Transitions',
            sets: 3,
            reps: '3x per lato'
          },
          {
            id: 'freestanding-handstand',
            name: 'Freestanding Handstand',
            sets: 3,
            reps: '60s'
          }
        ]
      }
    ]
  },
  {
    id: 'hefesto',
    name: 'Hefesto',
    description: 'Padroneggia l\'hefesto, un esercizio avanzato di trazione inversa che richiede eccezionale forza di bicipiti e avambracci.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Chin Up',
    icon: '/icons/hefesto.png',
    progressions: [
      {
        id: 'chin-up',
        level: 1,
        name: 'Chin Up',
        description: 'Padroneggia le trazioni in presa supina prima di passare a varianti più difficili',
        targetReps: '12x Chin Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'chin-up-ex',
            name: 'Chin Up',
            sets: 4,
            reps: '8x'
          },
          {
            id: 'false-grip-hang',
            name: 'False Grip Hang',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'bicep-curl',
            name: 'Bicep Curl',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'reverse-grip-lat-pulldown',
            name: 'Reverse Grip Lat Pulldown',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'false-grip-chin-up',
        level: 2,
        name: 'False Grip Chin Up',
        description: 'Sviluppa forza con la presa falsa, essenziale per l\'hefesto',
        targetReps: '8x False Grip Chin Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'false-grip-chin-up-ex',
            name: 'False Grip Chin Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'chin-up',
            name: 'Chin Up',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'false-grip-commando-hang',
            name: 'False Grip Commando Hang',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'reverse-curl',
            name: 'Reverse Curl',
            sets: 3,
            reps: '12x'
          }
        ]
      },
      {
        id: 'ring-bent-arm-pull',
        level: 3,
        name: 'Ring Bent Arm Pull',
        description: 'Esegui trazioni con un angolo inverso, iniziando a simulare il movimento dell\'hefesto',
        targetReps: '5x Ring Bent Arm Pull',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'ring-bent-arm-pull-ex',
            name: 'Ring Bent Arm Pull',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'false-grip-chin-up',
            name: 'False Grip Chin Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'hollow-body-ring-pull',
            name: 'Hollow Body Ring Pull',
            sets: 3,
            reps: '6x'
          },
          {
            id: 'straight-bar-bent-arm-pull',
            name: 'Straight Bar Bent Arm Pull',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'negative-hefesto',
        level: 4,
        name: 'Negative Hefesto',
        description: 'Esegui la fase eccentrica (negativa) dell\'hefesto, partendo dalla posizione finale',
        targetReps: '5x Negative Hefesto',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'negative-hefesto-ex',
            name: 'Negative Hefesto',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'ring-bent-arm-pull',
            name: 'Ring Bent Arm Pull',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'false-grip-pull-up',
            name: 'False Grip Pull Up',
            sets: 3,
            reps: '6x'
          },
          {
            id: 'commando-pull-up',
            name: 'Commando Pull Up',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'partial-hefesto',
        level: 5,
        name: 'Partial Hefesto',
        description: 'Esegui l\'hefesto con un range di movimento limitato',
        targetReps: '3x Partial Hefesto',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'partial-hefesto-ex',
            name: 'Partial Hefesto',
            sets: 3,
            reps: '2x'
          },
          {
            id: 'negative-hefesto',
            name: 'Negative Hefesto',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'weighted-false-grip-pull',
            name: 'Weighted False Grip Pull',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pelican-curl',
            name: 'Pelican Curl',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'full-hefesto',
        level: 6,
        name: 'Full Hefesto',
        description: 'Padroneggia l\'hefesto completo con range di movimento pieno',
        targetReps: '3x Full Hefesto',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-hefesto-ex',
            name: 'Full Hefesto',
            sets: 3,
            reps: '1-2x'
          },
          {
            id: 'partial-hefesto',
            name: 'Partial Hefesto',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'hefesto-hold',
            name: 'Hefesto Hold',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'assisted-hefesto',
            name: 'Assisted Hefesto',
            sets: 3,
            reps: '3x'
          }
        ]
      }
    ]
  },
  {
    id: 'verticale',
    name: 'Verticale',
    description: 'Padroneggia la verticale, un esercizio fondamentale della ginnastica che sviluppa equilibrio, forza e controllo del corpo.',
    difficulty: 'intermediate',
    achieved: false,
    progress: 0,
    firstLevelName: 'Wall Plank',
    icon: '/icons/handstand.png',
    progressions: [
      {
        id: 'wall-plank',
        level: 1,
        name: 'Wall Plank',
        description: 'Inizia con un plank inclinato contro il muro per sviluppare la forza di base necessaria per la verticale',
        targetReps: '60s Wall Plank',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-plank-ex',
            name: 'Wall Plank',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'pike-push-up',
            name: 'Pike Push Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'child-pose-wrist-stretch',
            name: 'Child Pose Wrist Stretch',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'pike-handstand',
        level: 2,
        name: 'Pike Handstand',
        description: 'Avvicinati alla verticale con un esercizio a forma di V in cui i piedi sono ancora a terra',
        targetReps: '45s Pike Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pike-handstand-ex',
            name: 'Pike Handstand',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'wall-plank-elevated',
            name: 'Wall Plank (gambe elevate)',
            sets: 3,
            reps: '60s'
          },
          {
            id: 'pike-shoulder-shrugs',
            name: 'Pike Shoulder Shrugs',
            sets: 3,
            reps: '12x'
          },
          {
            id: 'down-dog-walks',
            name: 'Down Dog Walks',
            sets: 3,
            reps: '10 passi'
          }
        ]
      },
      {
        id: 'wall-handstand',
        level: 3,
        name: 'Wall Handstand',
        description: 'Esegui la verticale con il supporto del muro, con il petto rivolto verso il muro',
        targetReps: '60s Wall Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-handstand-ex',
            name: 'Wall Handstand',
            sets: 4,
            reps: '30s'
          },
          {
            id: 'pike-handstand',
            name: 'Pike Handstand',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'handstand-shoulder-taps',
            name: 'Handstand Shoulder Taps',
            sets: 3,
            reps: '5x per lato'
          },
          {
            id: 'elevated-pike-push-up',
            name: 'Elevated Pike Push Up',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'handstand-balancing',
        level: 4,
        name: 'Handstand Balancing',
        description: 'Inizia a staccarti dal muro e bilanciare brevemente in verticale libera',
        targetReps: '10s Handstand Balancing',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'handstand-balancing-ex',
            name: 'Handstand Balancing',
            sets: 5,
            reps: '5s'
          },
          {
            id: 'wall-handstand-toe-pulls',
            name: 'Wall Handstand Toe Pulls',
            sets: 4,
            reps: '8x'
          },
          {
            id: 'wall-handstand-heel-pulls',
            name: 'Wall Handstand Heel Pulls',
            sets: 4,
            reps: '8x'
          },
          {
            id: 'wall-handstand-60s',
            name: 'Wall Handstand',
            sets: 3,
            reps: '60s'
          }
        ]
      },
      {
        id: 'freestanding-handstand',
        level: 5,
        name: 'Freestanding Handstand',
        description: 'Padroneggia la verticale completa senza supporto',
        targetReps: '30s Freestanding Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'freestanding-handstand-ex',
            name: 'Freestanding Handstand',
            sets: 5,
            reps: '15s'
          },
          {
            id: 'handstand-balancing',
            name: 'Handstand Balancing',
            sets: 5,
            reps: '10s'
          },
          {
            id: 'freestanding-chest-to-wall',
            name: 'Freestanding to Chest-to-wall',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'handstand-pirouettes',
            name: 'Handstand Pirouettes',
            sets: 3,
            reps: '3x per lato'
          }
        ]
      },
      {
        id: 'handstand-press',
        level: 6,
        name: 'Handstand Press',
        description: 'Impara a entrare in verticale con un movimento di forza (press) anziché con slancio',
        targetReps: '3x Handstand Press',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'handstand-press-ex',
            name: 'Handstand Press',
            sets: 3,
            reps: '1-2x'
          },
          {
            id: 'freestanding-handstand',
            name: 'Freestanding Handstand',
            sets: 4,
            reps: '30s'
          },
          {
            id: 'tuck-up-handstand',
            name: 'Tuck Up to Handstand',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pike-press-negative',
            name: 'Pike Press Negative',
            sets: 3,
            reps: '5x'
          }
        ]
      }
    ]
  },
  {
    id: 'iron-cross',
    name: 'Iron Cross',
    description: 'Padroneggia la Croce di Ferro, una posizione agli anelli in cui le braccia sono aperte lateralmente formando una croce, richiedendo una forza eccezionale nelle spalle e nel core.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Support Hold',
    progressions: [
      {
        id: 'support-hold',
        level: 1,
        name: 'Support Hold',
        description: 'Sviluppa la forza di base con le braccia tese sopra gli anelli',
        targetReps: '60s Support Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'support-hold-ex',
            name: 'Support Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'ring-turn-out-hold',
            name: 'Ring Turn Out Hold',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'straight-arm-hang',
            name: 'Straight Arm Hang',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'ring-dips',
            name: 'Ring Dips',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'straight-arm-strength',
        level: 2,
        name: 'Straight Arm Strength',
        description: 'Rafforza i tendini e i tessuti connettivi per preparare le braccia alla Croce di Ferro',
        targetReps: '20s Ring Turn Out Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'ring-turn-out-hold-ex',
            name: 'Ring Turn Out Hold',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'support-hold',
            name: 'Support Hold',
            sets: 3,
            reps: '45s'
          },
          {
            id: 'planche-lean',
            name: 'Planche Lean',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'dumbell-maltese-press',
            name: 'Dumbbell Maltese Press',
            sets: 3,
            reps: '8x'
          }
        ]
      },
      {
        id: 'assisted-ring-fly',
        level: 3,
        name: 'Assisted Ring Fly',
        description: 'Inizia a praticare il movimento con l\'assistenza di elastici',
        targetReps: '8x Assisted Ring Fly',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'assisted-ring-fly-ex',
            name: 'Assisted Ring Fly',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'ring-fly-negative',
            name: 'Ring Fly Negative',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'dumbbell-fly',
            name: 'Dumbbell Fly',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'ring-support-hold',
            name: 'Ring Support Hold',
            sets: 3,
            reps: '60s'
          }
        ]
      },
      {
        id: 'negative-iron-cross',
        level: 4,
        name: 'Negative Iron Cross',
        description: 'Impara a scendere lentamente dalla posizione di supporto verso la croce di ferro',
        targetReps: '5x Negative Iron Cross (8s)',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'negative-iron-cross-ex',
            name: 'Negative Iron Cross',
            sets: 3,
            reps: '3x (5s)'
          },
          {
            id: 'assisted-ring-fly',
            name: 'Assisted Ring Fly',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'maltese-press',
            name: 'Maltese Press',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'weighted-ring-support',
            name: 'Weighted Ring Support',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'partial-iron-cross',
        level: 5,
        name: 'Partial Iron Cross',
        description: 'Mantieni la posizione con le braccia a circa 45 gradi invece che completamente estese',
        targetReps: '10s Partial Iron Cross Hold',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'partial-iron-cross-ex',
            name: 'Partial Iron Cross',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'negative-iron-cross',
            name: 'Negative Iron Cross',
            sets: 3,
            reps: '5x (8s)'
          },
          {
            id: 'assisted-iron-cross',
            name: 'Assisted Iron Cross',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'weighted-dips',
            name: 'Weighted Dips',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'full-iron-cross',
        level: 6,
        name: 'Full Iron Cross',
        description: 'Padroneggia la posizione completa della Croce di Ferro con le braccia completamente estese',
        targetReps: '5s Full Iron Cross',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-iron-cross-ex',
            name: 'Full Iron Cross',
            sets: 3,
            reps: '2s'
          },
          {
            id: 'partial-iron-cross',
            name: 'Partial Iron Cross',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'iron-cross-negative',
            name: 'Iron Cross Negative',
            sets: 3,
            reps: '5x (10s)'
          },
          {
            id: 'weighted-maltese-press',
            name: 'Weighted Maltese Press',
            sets: 3,
            reps: '5x'
          }
        ]
      }
    ]
  },
  {
    id: 'manna',
    name: 'Manna',
    description: 'Padroneggia la Manna, una posizione seduta con le gambe sollevate e il corpo sostenuto solo dalle mani, enfatizzando la forza del core e la flessibilità.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'L-Sit',
    progressions: [
      {
        id: 'tucked-l-sit',
        level: 1,
        name: 'Tucked L-Sit',
        description: 'Inizia con questa posizione di base per sviluppare la forza necessaria per la progressione',
        targetReps: '30s Tucked L-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'tucked-l-sit-ex',
            name: 'Tucked L-Sit',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'floor-l-sit-prep',
            name: 'Floor L-Sit Preparation',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'compression-work',
            name: 'Compression Work',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'seated-leg-raises',
            name: 'Seated Leg Raises',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'l-sit',
        level: 2,
        name: 'L-Sit',
        description: 'Avanza verso la posizione L-Sit con le gambe tese di fronte a te',
        targetReps: '30s L-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'l-sit-ex',
            name: 'L-Sit',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'tucked-l-sit',
            name: 'Tucked L-Sit',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'compression-pike',
            name: 'Compression Pike',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'hanging-leg-raise',
            name: 'Hanging Leg Raise',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'high-l-sit',
        level: 3,
        name: 'High L-Sit',
        description: 'Eleva le gambe sopra la parallela per aumentare la difficoltà',
        targetReps: '20s High L-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'high-l-sit-ex',
            name: 'High L-Sit',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'l-sit',
            name: 'L-Sit',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'l-sit-lifts',
            name: 'L-Sit Lifts',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'pike-compression',
            name: 'Pike Compression',
            sets: 3,
            reps: '15x'
          }
        ]
      },
      {
        id: 'v-sit',
        level: 4,
        name: 'V-Sit',
        description: 'Avanza verso la posizione a V con le gambe sollevate in avanti',
        targetReps: '15s V-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'v-sit-ex',
            name: 'V-Sit',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'high-l-sit',
            name: 'High L-Sit',
            sets: 3,
            reps: '20s'
          },
          {
            id: 'pike-pulses',
            name: 'Pike Pulses',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'v-sit-negatives',
            name: 'V-Sit Negatives',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'high-v-sit',
        level: 5,
        name: 'High V-Sit',
        description: 'Sposta le gambe verso l\'alto oltre la verticale in preparazione per la Manna',
        targetReps: '10s High V-Sit',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'high-v-sit-ex',
            name: 'High V-Sit',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'v-sit',
            name: 'V-Sit',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'shoulder-extension-stretch',
            name: 'Shoulder Extension Stretch',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'manna-attempts',
            name: 'Manna Attempts',
            sets: 5,
            reps: '1s'
          }
        ]
      },
      {
        id: 'straddle-manna',
        level: 6,
        name: 'Straddle Manna',
        description: 'Utilizza la posizione a gambe divaricate per facilitare l\'equilibrio nella Manna',
        targetReps: '8s Straddle Manna',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'straddle-manna-ex',
            name: 'Straddle Manna',
            sets: 3,
            reps: '3s'
          },
          {
            id: 'high-v-sit',
            name: 'High V-Sit',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'straddle-compression',
            name: 'Straddle Compression',
            sets: 3,
            reps: '15x'
          },
          {
            id: 'shoulder-extension-mobility',
            name: 'Shoulder Extension Mobility',
            sets: 3,
            reps: '30s'
          }
        ]
      },
      {
        id: 'full-manna',
        level: 7,
        name: 'Full Manna',
        description: 'Padroneggia la posizione Manna completa con gambe unite e corpo completamente disteso',
        targetReps: '5s Full Manna',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-manna-ex',
            name: 'Full Manna',
            sets: 3,
            reps: '2s'
          },
          {
            id: 'straddle-manna',
            name: 'Straddle Manna',
            sets: 3,
            reps: '8s'
          },
          {
            id: 'weighted-compression',
            name: 'Weighted Compression',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'reverse-leg-circles',
            name: 'Reverse Leg Circles',
            sets: 3,
            reps: '5x per gamba'
          }
        ]
      }
    ]
  },
  {
    id: '90-degree-hspu',
    name: '90-Degree Handstand Push-Up',
    description: 'Padroneggia il push-up verticale a 90 gradi, dove il corpo scende fino a formare un angolo di 90 gradi con le gambe parallele al suolo, richiedendo forza eccezionale in push.',
    difficulty: 'advanced',
    achieved: false,
    progress: 0,
    firstLevelName: 'Wall Handstand',
    progressions: [
      {
        id: 'wall-handstand',
        level: 1,
        name: 'Wall Handstand',
        description: 'Sviluppa stabilità nella verticale contro il muro per costruire una base solida',
        targetReps: '60s Wall Handstand',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'wall-handstand-ex',
            name: 'Wall Handstand',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'hollow-body-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '30s'
          },
          {
            id: 'pike-push-ups',
            name: 'Pike Push-Ups',
            sets: 3,
            reps: '10x'
          },
          {
            id: 'shoulder-shrugs-handstand',
            name: 'Shoulder Shrugs in Handstand',
            sets: 3,
            reps: '10x'
          }
        ]
      },
      {
        id: 'handstand-push-up',
        level: 2,
        name: 'Handstand Push-Up',
        description: 'Padroneggia il push-up in verticale, prerequisito fondamentale per la versione a 90 gradi',
        targetReps: '5x Handstand Push-Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'handstand-push-up-ex',
            name: 'Handstand Push-Up',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'elevated-pike-push-up',
            name: 'Elevated Pike Push-Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'wall-handstand',
            name: 'Wall Handstand',
            sets: 3,
            reps: '60s'
          },
          {
            id: 'hspu-negatives',
            name: 'HSPU Negatives',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'deep-hspu',
        level: 3,
        name: 'Deep HSPU',
        description: 'Aumenta la profondità del push-up in verticale per sviluppare maggiore forza',
        targetReps: '5x Deep HSPU',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'deep-hspu-ex',
            name: 'Deep HSPU',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'handstand-push-up',
            name: 'Handstand Push-Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'pike-press',
            name: 'Pike Press',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'elevation-hspu',
            name: 'Elevation HSPU',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'pseudo-planche-push-up',
        level: 4,
        name: 'Pseudo Planche Push-Up',
        description: 'Sviluppa la forza nel piano orizzontale con spinta in avanti nel push-up',
        targetReps: '8x Pseudo Planche Push-Up',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'pseudo-planche-push-up-ex',
            name: 'Pseudo Planche Push-Up',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'planche-lean',
            name: 'Planche Lean',
            sets: 3,
            reps: '15s'
          },
          {
            id: 'deep-hspu',
            name: 'Deep HSPU',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'advanced-frog-stand',
            name: 'Advanced Frog Stand',
            sets: 3,
            reps: '15s'
          }
        ]
      },
      {
        id: 'planche-hspu-transition',
        level: 5,
        name: 'Planche-HSPU Transition',
        description: 'Impara a passare dalla posizione di verticale verso l\'orizzontale e viceversa',
        targetReps: '5x Planche-HSPU Transition',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'planche-hspu-transition-ex',
            name: 'Planche-HSPU Transition',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'pseudo-planche-push-up',
            name: 'Pseudo Planche Push-Up',
            sets: 3,
            reps: '8x'
          },
          {
            id: 'tuck-planche',
            name: 'Tuck Planche',
            sets: 3,
            reps: '10s'
          },
          {
            id: 'handstand-to-bent-arm-planche',
            name: 'Handstand to Bent Arm Planche',
            sets: 3,
            reps: '3x'
          }
        ]
      },
      {
        id: '90-degree-hspu-negative',
        level: 6,
        name: '90-Degree HSPU Negative',
        description: 'Allenati a scendere lentamente dalla verticale alla posizione a 90 gradi',
        targetReps: '5x 90-Degree HSPU Negative',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: '90-degree-hspu-negative-ex',
            name: '90-Degree HSPU Negative',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'planche-hspu-transition',
            name: 'Planche-HSPU Transition',
            sets: 3,
            reps: '5x'
          },
          {
            id: 'straddle-planche-attempt',
            name: 'Straddle Planche Attempt',
            sets: 3,
            reps: '5s'
          },
          {
            id: 'deep-hspu',
            name: 'Deep HSPU',
            sets: 3,
            reps: '5x'
          }
        ]
      },
      {
        id: 'full-90-degree-hspu',
        level: 7,
        name: 'Full 90-Degree HSPU',
        description: 'Padroneggia il push-up a 90 gradi completo, dalla discesa al ritorno in verticale',
        targetReps: '3x Full 90-Degree HSPU',
        completed: false,
        progress: 0,
        supportExercises: [
          {
            id: 'full-90-degree-hspu-ex',
            name: 'Full 90-Degree HSPU',
            sets: 3,
            reps: '1x'
          },
          {
            id: '90-degree-hspu-negative',
            name: '90-Degree HSPU Negative',
            sets: 3,
            reps: '5x'
          },
          {
            id: '90-degree-hspu-partials',
            name: '90-Degree HSPU Partials',
            sets: 3,
            reps: '3x'
          },
          {
            id: 'weighted-hspu',
            name: 'Weighted HSPU',
            sets: 3,
            reps: '3x'
          }
        ]
      }
    ]
  }
];
// Helper per ottenere una skill tramite id
export function getSkillById(id: string): CalisthenicsSkill | undefined {
  return calisthenicsSkills.find(skill => skill.id === id);
}
