import { AgilitySkill } from '../types/agilitySkill';
import { v4 as uuidv4 } from 'uuid';

const agilitySkills: AgilitySkill[] = [
  // Le skill di agilità verranno aggiunte qui
  {
    id: uuidv4(),
    name: 'Ruota',
    description: 'Eseguire una ruota con tecnica corretta e buona linearità',
    difficulty: 'beginner',
    image: '/images/cartwheel.jpg',
    icon: '/icons/ruota.png',
    progress: 70,
    achieved: false,
    firstLevelName: 'Ruota laterale con supporto',
    areaFocus: 'Coordinazione laterale e orientamento spaziale',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Ruota laterale con supporto',
        description: 'Imparare il movimento base della ruota con l\'aiuto di un supporto',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Allungamento laterale del busto',
            sets: 3,
            duration: '10 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Ruota al muro',
            sets: 5,
            duration: '5 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Ponte con spinta',
            sets: 3,
            duration: '8 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire una ruota con l\'aiuto del muro o di un istruttore',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Ruota con gamba piegata',
        description: 'Eseguire una ruota con una gamba piegata per facilitare il movimento',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Affondi laterali',
            sets: 3,
            duration: '10 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Ruota con gamba piegata',
            sets: 5,
            duration: '5 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Equilibrio su una gamba',
            sets: 3,
            duration: '30 secondi per gamba'
          }
        ],
        targetAgility: 'Eseguire una ruota con una gamba piegata senza supporto',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Ruota base',
        description: 'Eseguire una ruota completa con entrambe le gambe tese',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Spinte verticali',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Ruota su linea',
            sets: 5,
            duration: '5 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Verticale al muro',
            sets: 3,
            duration: '20 secondi'
          }
        ],
        targetAgility: 'Eseguire una ruota completa con buona forma',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Ruota con una mano',
        description: 'Eseguire una ruota utilizzando una sola mano come supporto',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Equilibrio su una mano',
            sets: 3,
            duration: '10 secondi per mano'
          },
          {
            id: uuidv4(),
            name: 'Ruota con mano ritardata',
            sets: 5,
            duration: '3 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Push-up su un braccio',
            sets: 3,
            duration: '5 ripetizioni per braccio'
          }
        ],
        targetAgility: 'Eseguire una ruota con una sola mano',
        completed: false,
        progress: 60
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Ruota senza mani',
        description: 'Eseguire una ruota senza utilizzare le mani (aerial cartwheel)',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Salti laterali',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Ruota con mani appena a terra',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Salto con rotazione',
            sets: 3,
            duration: '8 ripetizioni per direzione'
          }
        ],
        targetAgility: 'Eseguire una ruota aerea (senza mani)',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Backflip',
    description: 'Eseguire un salto mortale all\'indietro con tecnica corretta e atterraggio stabile',
    difficulty: 'elite',
    image: '/images/backflip.jpg',
    icon: '/icons/backflip.png',
    progress: 30,
    achieved: false,
    firstLevelName: 'Roll all\'indietro',
    areaFocus: 'Potenza esplosiva e orientamento spaziale',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Roll all\'indietro',
        description: 'Imparare a rotolare all\'indietro per sviluppare la sensibilità della rotazione',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Candela (shoulder stand)',
            sets: 3,
            duration: '20 secondi'
          },
          {
            id: uuidv4(),
            name: 'Roll all\'indietro',
            sets: 5,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Squat jump',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un roll all\'indietro fluido e controllato',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Back handspring con assistenza',
        description: 'Imparare il movimento del back handspring con l\'aiuto di un istruttore',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Ponte con spinta',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Jump back to handstand',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Vertical jump',
            sets: 3,
            duration: '12 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un back handspring con assistenza',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Backflip su tappeto elastico',
        description: 'Eseguire un backflip completo su una superficie che facilita il salto',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Salti sul tappeto elastico',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Backflip su tappeto con assistenza',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Tuck jump',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un backflip completo su tappeto elastico',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Backflip con assistenza',
        description: 'Eseguire un backflip su superficie normale con l\'assistenza di un istruttore',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Box jump',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Backflip con cintura di sicurezza',
            sets: 5,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Salti in basso con rotazione',
            sets: 3,
            duration: '5 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un backflip con minima assistenza',
        completed: false,
        progress: 70
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Backflip completo',
        description: 'Eseguire un backflip completo senza assistenza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Depth jump',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Backflip su materasso',
            sets: 5,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Esercizi di visualizzazione',
            sets: 3,
            duration: '5 minuti'
          }
        ],
        targetAgility: 'Eseguire un backflip completo e sicuro senza assistenza',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Frontflip',
    description: 'Eseguire un salto mortale in avanti con tecnica corretta e atterraggio stabile',
    difficulty: 'elite',
    image: '/images/frontflip.jpg',
    progress: 25,
    achieved: false,
    firstLevelName: 'Roll in avanti',
    areaFocus: 'Potenza esplosiva e controllo del corpo in aria',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Roll in avanti',
        description: 'Imparare a rotolare in avanti per sviluppare la sensibilità della rotazione',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Forward roll',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Tuck jump',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Squat jump con tuck',
            sets: 3,
            duration: '8 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un roll in avanti fluido e controllato',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Dive roll',
        description: 'Imparare a tuffarsi in avanti e rotolare',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Plank jump forward',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Dive roll su materasso',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Broad jump',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un dive roll con buona altezza',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Frontflip su tappeto elastico',
        description: 'Eseguire un frontflip completo su una superficie che facilita il salto',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Salti sul tappeto elastico',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Frontflip su tappeto con assistenza',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Tuck jump con rotazione',
            sets: 3,
            duration: '8 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un frontflip completo su tappeto elastico',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Frontflip con assistenza',
        description: 'Eseguire un frontflip su superficie normale con l\'assistenza di un istruttore',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Box jump con tuck',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Frontflip con cintura di sicurezza',
            sets: 5,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Salti in basso con rotazione frontale',
            sets: 3,
            duration: '5 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire un frontflip con minima assistenza',
        completed: false,
        progress: 50
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Frontflip completo',
        description: 'Eseguire un frontflip completo senza assistenza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Depth jump con tuck',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Frontflip su materasso',
            sets: 5,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Esercizi di visualizzazione',
            sets: 3,
            duration: '5 minuti'
          }
        ],
        targetAgility: 'Eseguire un frontflip completo e sicuro senza assistenza',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Mezza Volta (Rondata)',
    description: 'Eseguire una mezza volta con tecnica corretta e atterraggio stabile',
    difficulty: 'intermediate',
    image: '/images/roundoff.jpg',
    icon: '/icons/mezza volta.png',
    progress: 65,
    achieved: false,
    firstLevelName: 'Ruota con quarto di giro',
    areaFocus: 'Coordinazione e potenza di spinta',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Ruota con quarto di giro',
        description: 'Imparare a eseguire una ruota terminando con un quarto di giro',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Ruota base',
            sets: 3,
            duration: '8 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Salti con rotazione',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Ruota con piedi uniti alla fine',
            sets: 3,
            duration: '8 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire una ruota terminando con i piedi uniti',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Mezza volta con assistenza',
        description: 'Imparare il movimento della mezza volta con l\'aiuto di un istruttore',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Verticale e caduta sul dorso',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Mezza volta con assistenza',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Jump half turn',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire una mezza volta con assistenza',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Mezza volta base',
        description: 'Eseguire una mezza volta completa con atterraggio stabile',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Verticale con spinta',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Mezza volta su linea',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Rebound jumps',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire una mezza volta con buona tecnica',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Mezza volta con rimbalzo',
        description: 'Eseguire una mezza volta con rimbalzo finale per preparare combinazioni',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Tuck jump da fermo',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Mezza volta e salto',
            sets: 5,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Esercizi pliometrici',
            sets: 3,
            duration: '30 secondi'
          }
        ],
        targetAgility: 'Eseguire una mezza volta con rimbalzo potente',
        completed: false,
        progress: 60
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Mezza volta in combinazione',
        description: 'Eseguire una mezza volta seguita da un altro elemento acrobatico',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Mezza volta e back handspring',
            sets: 3,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Mezza volta e salto carpiato',
            sets: 5,
            duration: '3 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Esercizi di connessione',
            sets: 3,
            duration: '5 ripetizioni'
          }
        ],
        targetAgility: 'Eseguire una mezza volta in combinazione con altri elementi',
        completed: false,
        progress: 0
      }
    ]
  }
];

export default agilitySkills;
