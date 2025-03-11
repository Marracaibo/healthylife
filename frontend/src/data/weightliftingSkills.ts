import { WeightliftingSkill } from '../types/weightliftingSkill';
import { v4 as uuidv4 } from 'uuid';

const weightliftingSkills: WeightliftingSkill[] = [
  {
    id: uuidv4(),
    name: 'Panca Piana',
    description: 'Raggiungere la forza necessaria per sollevare 100kg nella panca piana',
    difficulty: 'advanced',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Panca con bilanciere (60kg)',
        description: 'Padroneggiare la tecnica base con un peso moderato',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Panca piana',
            sets: 3,
            reps: '8',
            weight: '60kg'
          },
          {
            id: uuidv4(),
            name: 'Push-up',
            sets: 3,
            reps: '15'
          },
          {
            id: uuidv4(),
            name: 'Panca inclinata',
            sets: 3,
            reps: '10',
            weight: '50kg'
          },
          {
            id: uuidv4(),
            name: 'Dips',
            sets: 3,
            reps: '10'
          }
        ],
        targetWeight: 'Panca piana 5x5 con 60kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Panca con bilanciere (75kg)',
        description: 'Aumentare la forza per raggiungere 75kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Panca piana',
            sets: 5,
            reps: '5',
            weight: '75kg'
          },
          {
            id: uuidv4(),
            name: 'Close-grip bench',
            sets: 3,
            reps: '8',
            weight: '60kg'
          },
          {
            id: uuidv4(),
            name: 'Push-up decline',
            sets: 3,
            reps: '12'
          },
          {
            id: uuidv4(),
            name: 'Flies con manubri',
            sets: 3,
            reps: '12',
            weight: '16kg'
          }
        ],
        targetWeight: 'Panca piana 5x5 con 75kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Panca con bilanciere (85kg)',
        description: 'Perfezionare la forza per arrivare a 85kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Panca piana',
            sets: 5,
            reps: '5',
            weight: '85kg'
          },
          {
            id: uuidv4(),
            name: 'Floor press',
            sets: 3,
            reps: '6',
            weight: '70kg'
          },
          {
            id: uuidv4(),
            name: 'Dips pesati',
            sets: 3,
            reps: '8',
            weight: '+15kg'
          },
          {
            id: uuidv4(),
            name: 'Machine chest press',
            sets: 3,
            reps: '10',
            weight: '80kg'
          }
        ],
        targetWeight: 'Panca piana 5x5 con 85kg',
        completed: false,
        progress: 65
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Panca con bilanciere (95kg)',
        description: 'Incrementare la forza per sollevare 95kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Panca piana',
            sets: 5,
            reps: '3',
            weight: '95kg'
          },
          {
            id: uuidv4(),
            name: 'Panca stretta',
            sets: 4,
            reps: '6',
            weight: '75kg'
          },
          {
            id: uuidv4(),
            name: 'Panca piana manubri',
            sets: 3,
            reps: '8',
            weight: '40kg x2'
          },
          {
            id: uuidv4(),
            name: 'Push-up con banda elastica',
            sets: 3,
            reps: '8',
            weight: 'banda forte'
          }
        ],
        targetWeight: 'Panca piana 1 RM con 95kg',
        completed: false,
        progress: 20
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Panca con bilanciere (100kg)',
        description: 'Raggiungere l\'obiettivo finale di 100kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Panca piana',
            sets: 5,
            reps: '1-3',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Bench press negativa',
            sets: 3,
            reps: '5',
            weight: '105kg'
          },
          {
            id: uuidv4(),
            name: 'Pin press',
            sets: 4,
            reps: '5',
            weight: '90kg'
          },
          {
            id: uuidv4(),
            name: 'Panca piana piramidale',
            sets: 5,
            reps: '5/3/2/1/1',
            weight: '80-105kg'
          }
        ],
        targetWeight: 'Panca piana 1 RM con 100kg',
        completed: false,
        progress: 0
      }
    ],
    achieved: false,
    progress: 57,
    firstLevelName: 'Panca piana 100kg',
    currentWeight: '85kg',
    personalRecord: '90kg'
  },
  {
    id: uuidv4(),
    name: 'Squat',
    description: 'Sviluppare la forza per uno squat completo con 120kg',
    difficulty: 'intermediate',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Squat base (bodyweight)',
        description: 'Padroneggiare la tecnica dello squat senza pesi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Bodyweight squat',
            sets: 3,
            reps: '20'
          },
          {
            id: uuidv4(),
            name: 'Wall sit',
            sets: 3,
            reps: '45 secondi'
          },
          {
            id: uuidv4(),
            name: 'Split squat',
            sets: 3,
            reps: '10 per lato'
          },
          {
            id: uuidv4(),
            name: 'Goblet squat',
            sets: 3,
            reps: '12',
            weight: '16kg'
          }
        ],
        targetWeight: 'Squat 3x20 con peso corporeo',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Squat con bilanciere (70kg)',
        description: 'Iniziare con pesi moderati per sviluppare la forza di base',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Back squat',
            sets: 5,
            reps: '5',
            weight: '70kg'
          },
          {
            id: uuidv4(),
            name: 'Front squat',
            sets: 3,
            reps: '8',
            weight: '50kg'
          },
          {
            id: uuidv4(),
            name: 'Leg press',
            sets: 3,
            reps: '12',
            weight: '120kg'
          },
          {
            id: uuidv4(),
            name: 'Romanian deadlift',
            sets: 3,
            reps: '10',
            weight: '60kg'
          }
        ],
        targetWeight: 'Squat 5x5 con 70kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Squat con bilanciere (90kg)',
        description: 'Incrementare il peso per costruire forza nelle gambe',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Back squat',
            sets: 5,
            reps: '5',
            weight: '90kg'
          },
          {
            id: uuidv4(),
            name: 'Hack squat',
            sets: 3,
            reps: '8',
            weight: '80kg'
          },
          {
            id: uuidv4(),
            name: 'Bulgarian split squat',
            sets: 3,
            reps: '8 per lato',
            weight: '20kg x2'
          },
          {
            id: uuidv4(),
            name: 'Leg extension',
            sets: 3,
            reps: '12',
            weight: '60kg'
          }
        ],
        targetWeight: 'Squat 5x5 con 90kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Squat con bilanciere (105kg)',
        description: 'Aumentare ulteriormente la forza delle gambe',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Back squat',
            sets: 5,
            reps: '3',
            weight: '105kg'
          },
          {
            id: uuidv4(),
            name: 'Pause squat',
            sets: 3,
            reps: '5',
            weight: '90kg'
          },
          {
            id: uuidv4(),
            name: 'Box squat',
            sets: 3,
            reps: '5',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Leg press',
            sets: 3,
            reps: '8',
            weight: '160kg'
          }
        ],
        targetWeight: 'Squat 3RM con 105kg',
        completed: false,
        progress: 70
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Squat con bilanciere (120kg)',
        description: 'Raggiungere l\'obiettivo finale di 120kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Back squat',
            sets: 3,
            reps: '1-3',
            weight: '120kg'
          },
          {
            id: uuidv4(),
            name: 'Half squat',
            sets: 3,
            reps: '5',
            weight: '130kg'
          },
          {
            id: uuidv4(),
            name: 'Front squat',
            sets: 3,
            reps: '5',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Squat piramidale',
            sets: 5,
            reps: '5/3/2/1/1',
            weight: '100-125kg'
          }
        ],
        targetWeight: 'Squat 1RM con 120kg',
        completed: false,
        progress: 0
      }
    ],
    achieved: false,
    progress: 74,
    firstLevelName: 'Squat 120kg',
    currentWeight: '105kg',
    personalRecord: '110kg'
  },
  {
    id: uuidv4(),
    name: 'Stacco da Terra',
    description: 'Sviluppare la forza per uno stacco completo con 150kg',
    difficulty: 'elite',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Stacco base (80kg)',
        description: 'Padroneggiare la tecnica dello stacco con peso moderato',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            sets: 3,
            reps: '8',
            weight: '80kg'
          },
          {
            id: uuidv4(),
            name: 'Romanian deadlift',
            sets: 3,
            reps: '10',
            weight: '60kg'
          },
          {
            id: uuidv4(),
            name: 'Rack pull',
            sets: 3,
            reps: '8',
            weight: '90kg'
          },
          {
            id: uuidv4(),
            name: 'Back extension',
            sets: 3,
            reps: '12'
          }
        ],
        targetWeight: 'Stacco 3x8 con 80kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Stacco intermedio (100kg)',
        description: 'Sviluppare forza per arrivare a 100kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            sets: 5,
            reps: '5',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Sumo deadlift',
            sets: 3,
            reps: '8',
            weight: '90kg'
          },
          {
            id: uuidv4(),
            name: 'Good mornings',
            sets: 3,
            reps: '10',
            weight: '60kg'
          },
          {
            id: uuidv4(),
            name: 'Pull-through',
            sets: 3,
            reps: '12',
            weight: '40kg'
          }
        ],
        targetWeight: 'Stacco 5x5 con 100kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Stacco avanzato (120kg)',
        description: 'Incrementare il peso per costruire forza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            sets: 5,
            reps: '5',
            weight: '120kg'
          },
          {
            id: uuidv4(),
            name: 'Deficit deadlift',
            sets: 3,
            reps: '6',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Hip thrust',
            sets: 3,
            reps: '10',
            weight: '100kg'
          },
          {
            id: uuidv4(),
            name: 'Pull-up',
            sets: 3,
            reps: '8',
            weight: '+10kg'
          }
        ],
        targetWeight: 'Stacco 5x5 con 120kg',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Stacco pesante (135kg)',
        description: 'Aumentare ulteriormente la forza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            sets: 5,
            reps: '3',
            weight: '135kg'
          },
          {
            id: uuidv4(),
            name: 'Block pull',
            sets: 3,
            reps: '5',
            weight: '145kg'
          },
          {
            id: uuidv4(),
            name: 'Pendlay row',
            sets: 3,
            reps: '8',
            weight: '80kg'
          },
          {
            id: uuidv4(),
            name: 'Stiff leg deadlift',
            sets: 3,
            reps: '8',
            weight: '100kg'
          }
        ],
        targetWeight: 'Stacco 3RM con 135kg',
        completed: false,
        progress: 50
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Stacco elite (150kg)',
        description: 'Raggiungere l\'obiettivo finale di 150kg',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Deadlift',
            sets: 3,
            reps: '1-3',
            weight: '150kg'
          },
          {
            id: uuidv4(),
            name: 'Banded deadlift',
            sets: 3,
            reps: '3',
            weight: '140kg + bands'
          },
          {
            id: uuidv4(),
            name: 'Rack pull',
            sets: 3,
            reps: '3',
            weight: '170kg'
          },
          {
            id: uuidv4(),
            name: 'Deadlift piramidale',
            sets: 5,
            reps: '5/3/2/1/1',
            weight: '120-155kg'
          }
        ],
        targetWeight: 'Stacco 1RM con 150kg',
        completed: false,
        progress: 0
      }
    ],
    achieved: false,
    progress: 70,
    firstLevelName: 'Stacco da terra 150kg',
    currentWeight: '135kg',
    personalRecord: '140kg'
  },
];

export default weightliftingSkills;
