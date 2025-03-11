import { CardioSkill } from '../types/cardioSkill';
import { v4 as uuidv4 } from 'uuid';

const cardioSkills: CardioSkill[] = [
  {
    id: uuidv4(),
    name: 'Corsa 5km',
    description: 'Completare una corsa di 5km in meno di 25 minuti',
    difficulty: 'intermediate',
    image: '/images/running.jpg',
    progress: 65,
    achieved: false,
    firstLevelName: 'Principiante',
    currentRecord: '28:45',
    personalBest: '27:30',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Corsa base (5km in 35min)',
        description: 'Completare 5km senza fermarsi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Camminata veloce',
            duration: '10 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Run/walk intervals',
            duration: '5 min corsa + 2 min camminata',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa lenta',
            duration: '20 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: '5km in 35 minuti',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Corsa intermedia (5km in 30min)',
        description: 'Migliorare il passo per completare 5km in 30 minuti',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa costante',
            duration: '25 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Interval training',
            duration: '1 min veloce + 1 min lento',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Hill repeats',
            duration: '30 secondi salita + recupero',
            intensity: 'Alta'
          }
        ],
        targetTime: '5km in 30 minuti',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Corsa avanzata (5km in 28min)',
        description: 'Aumentare ulteriormente la velocità',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Tempo run',
            duration: '20 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Fartlek',
            duration: '25 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Sprint intervals',
            duration: '30 sec sprint + 90 sec recupero',
            intensity: 'Alta'
          }
        ],
        targetTime: '5km in 28 minuti',
        completed: false,
        progress: 70
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Corsa avanzata (5km in 26min)',
        description: 'Perfezionare la tecnica e aumentare ancora la velocità',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Interval training',
            duration: '800m veloce + 400m recupero',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Progression run',
            duration: '25 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Strength training',
            duration: 'Circuito per gambe',
            intensity: 'Alta'
          }
        ],
        targetTime: '5km in 26 minuti',
        completed: false,
        progress: 30
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Corsa elite (5km in 25min)',
        description: 'Raggiungere l\'obiettivo di 5km in meno di 25 minuti',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Track repeats',
            duration: '400m a ritmo target',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Threshold run',
            duration: '20 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Race pace practice',
            duration: '1km a ritmo gara',
            intensity: 'Alta'
          }
        ],
        targetTime: '5km in meno di 25 minuti',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Da Camminata a Corsa',
    description: 'Correre per 10km senza fermarsi',
    difficulty: 'beginner',
    image: '/images/walk2run.jpg',
    progress: 85,
    achieved: false,
    firstLevelName: 'Camminata Attiva',
    currentRecord: '58:20',
    personalBest: '58:20',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Camminata veloce (5km)',
        description: 'Costruire resistenza di base con camminate veloci',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Camminata veloce',
            duration: '30 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Tapis roulant - pendenza',
            duration: '20 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Ellittica',
            duration: '15 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Completare 5km di camminata',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Run/Walk (6km)',
        description: 'Alternare corsa e camminata per 6km',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Interval run/walk',
            duration: '5 min corsa + 1 min camminata',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa lenta',
            duration: '20 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Cross training',
            duration: '30 minuti',
            intensity: 'Media'
          }
        ],
        targetTime: 'Completare 6km alternando corsa e camminata',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Corsa continua (7km)',
        description: 'Correre 7km senza fermarsi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa continua',
            duration: '35 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Long run',
            duration: '45 minuti',
            intensity: 'Media-Bassa'
          },
          {
            id: uuidv4(),
            name: 'Esercizi di respirazione',
            duration: '5 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Completare 7km senza fermarsi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Corsa continua (8.5km)',
        description: 'Aumentare la distanza a 8.5km',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Long run',
            duration: '50 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Easy run',
            duration: '30 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Hill training',
            duration: '25 minuti',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 8.5km senza fermarsi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Corsa continua (10km)',
        description: 'Raggiungere l\'obiettivo di correre 10km senza fermarsi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Long run progressivo',
            duration: '60 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Corsa a ritmo costante',
            duration: '45 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Recovery run',
            duration: '20 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Completare 10km senza fermarsi',
        completed: false,
        progress: 85
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'HIIT',
    description: 'Completare 20 minuti di HIIT ad alta intensità',
    difficulty: 'advanced',
    image: '/images/hiit.jpg',
    progress: 40,
    achieved: false,
    firstLevelName: 'HIIT Base',
    currentRecord: '12 minuti',
    personalBest: '15 minuti',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'HIIT base (10 minuti)',
        description: 'Introduzione agli allenamenti HIIT con intervalli brevi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Jumping jacks',
            duration: '20 sec lavoro + 40 sec riposo',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Mountain climbers',
            duration: '20 sec lavoro + 40 sec riposo',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Squat jumps',
            duration: '20 sec lavoro + 40 sec riposo',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 10 minuti di HIIT (1:2 lavoro:riposo)',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'HIIT intermedio (12 minuti)',
        description: 'Aumentare l\'intensità e ridurre i tempi di recupero',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Burpees',
            duration: '30 sec lavoro + 30 sec riposo',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'High knees',
            duration: '30 sec lavoro + 30 sec riposo',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Kettlebell swings',
            duration: '30 sec lavoro + 30 sec riposo',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 12 minuti di HIIT (1:1 lavoro:riposo)',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'HIIT avanzato (15 minuti)',
        description: 'Aumentare la durata e l\'intensità dell\'allenamento',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Circuit training',
            duration: '5 minuti per circuito',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Tabata',
            duration: '4 minuti per round',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Rowing intervals',
            duration: '1 min intense + 30 sec riposo',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 15 minuti di HIIT (2:1 lavoro:riposo)',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'HIIT intenso (18 minuti)',
        description: 'Aumentare durata e intensità con esercizi composti',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'AMRAP',
            duration: '6 minuti per round',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'EMOM',
            duration: '1 minuto',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Battle ropes',
            duration: '30 sec intense + 15 sec riposo',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 18 minuti di HIIT (3:1 lavoro:riposo)',
        completed: false,
        progress: 60
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'HIIT elite (20 minuti)',
        description: 'Raggiungere l\'obiettivo di 20 minuti di HIIT ad alta intensità',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Pyramid intervals',
            duration: '10 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Complexes',
            duration: '1 min lavoro + 15 sec riposo',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Max effort rounds',
            duration: '3 minuti',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare 20 minuti di HIIT (4:1 lavoro:riposo)',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Correre 10km',
    description: 'Programma di allenamento per arrivare a correre 10km senza fermarsi',
    difficulty: 'intermediate',
    image: '/images/running-10km.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Alternanza Corsa/Camminata',
    currentRecord: '-',
    personalBest: '-',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Alternanza Corsa/Camminata',
        description: 'Allenamento con alternanza tra corsa e camminata per costruire resistenza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Riscaldamento',
            duration: '5 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Run/Walk Intervals',
            duration: '20-30 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Defaticamento',
            duration: '5 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Completare 30 minuti di alternanza corsa/camminata',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Corsa Continua 5km',
        description: 'Costruire la resistenza per correre 5km senza fermarsi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Riscaldamento',
            duration: '5 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Corsa continua',
            duration: '20-25 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Defaticamento',
            duration: '5 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Correre 5km senza pause',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Progressione Tempo/Distanza',
        description: 'Incremento progressivo di tempo e distanza di corsa',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga settimanale',
            duration: '45-60 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Allenamento colline',
            duration: '30 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Corsa media',
            duration: '30-40 minuti',
            intensity: 'Media'
          }
        ],
        targetTime: 'Arrivare a correre 8km in preparazione per i 10km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: '10km Completi',
        description: 'Completare una corsa continua di 10km',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Riscaldamento',
            duration: '10 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Corsa di distanza',
            duration: '60-70 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Defaticamento',
            duration: '5-10 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Completare 10km in una singola sessione',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Mezza Maratona',
    description: 'Programma di allenamento per completare una mezza maratona (21,1km)',
    difficulty: 'advanced',
    image: '/images/half-marathon.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Costruzione Base',
    currentRecord: '-',
    personalBest: '-',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Costruzione Base',
        description: 'Costruire una base solida di resistenza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga',
            duration: '60-75 minuti',
            intensity: 'Media-Bassa'
          },
          {
            id: uuidv4(),
            name: 'Corsa intervallata',
            duration: '45 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Cross-training',
            duration: '40 minuti',
            intensity: 'Media'
          }
        ],
        targetTime: 'Costruire chilometraggio settimanale fino a 30km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Costruzione Volume',
        description: 'Aumentare il volume di allenamento e introdurre allenamenti specifici',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga progressiva',
            duration: '90-100 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Tempo run',
            duration: '50 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Recupero attivo',
            duration: '30-40 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Raggiungere una corsa lunga di 15km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Fase di Picco',
        description: 'Raggiungere il picco di allenamento con sessioni specifiche per la gara',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga',
            duration: '120-140 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Allenamento ritmo gara',
            duration: '60-75 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Interval training',
            duration: '60 minuti',
            intensity: 'Molto alta'
          }
        ],
        targetTime: 'Simulazione di gara su 15km a ritmo mezza maratona',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Tapering e Gara',
        description: 'Riduzione del carico e preparazione alla gara',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Riduzione volume',
            duration: 'Variabile',
            intensity: 'Media-Bassa'
          },
          {
            id: uuidv4(),
            name: 'Brevi sessioni di ritmo',
            duration: '30-40 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Strategia di gara',
            duration: 'N/A',
            intensity: 'N/A'
          }
        ],
        targetTime: 'Completare la mezza maratona (21,1km)',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Maratona',
    description: 'Programma di allenamento per completare una maratona (42,2km)',
    difficulty: 'elite',
    image: '/images/marathon.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Costruzione Base',
    currentRecord: '-',
    personalBest: '-',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Costruzione Base',
        description: 'Costruire una base aerobica solida',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga',
            duration: '90-120 minuti',
            intensity: 'Bassa-media'
          },
          {
            id: uuidv4(),
            name: 'Easy run',
            duration: '40-60 minuti',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Fartlek',
            duration: '45-60 minuti',
            intensity: 'Variabile'
          }
        ],
        targetTime: 'Costruire chilometraggio settimanale fino a 50km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Corse Lunghe',
        description: 'Sviluppare la capacità di correre distanze sempre maggiori',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga progressiva',
            duration: '150-180 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa media',
            duration: '60-75 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Allenamento collinare',
            duration: '60 minuti',
            intensity: 'Media-alta'
          }
        ],
        targetTime: 'Completare una corsa di 30km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Allenamento Specifico',
        description: 'Migliorare resistenza specifica e ritmo gara',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga con finish veloce',
            duration: '180-210 minuti',
            intensity: 'Media-alta alla fine'
          },
          {
            id: uuidv4(),
            name: 'Maratona pace training',
            duration: '90 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Simulazione parziale',
            duration: '150 minuti',
            intensity: 'Media-alta'
          }
        ],
        targetTime: 'Completare una mezza maratona a ritmo maratona + 10 sec/km',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Tapering e Gara',
        description: 'Riduzione progressiva del carico e preparazione alla gara',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Riduzione volume',
            duration: 'Variabile',
            intensity: 'Media-bassa'
          },
          {
            id: uuidv4(),
            name: 'Sessioni di ritmo',
            duration: '40-50 minuti',
            intensity: 'Media-alta'
          },
          {
            id: uuidv4(),
            name: 'Strategia maratona',
            duration: 'N/A',
            intensity: 'N/A'
          }
        ],
        targetTime: 'Completare la maratona (42,2km)',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Ultra Maratona',
    description: 'Programma di allenamento per completare una ultra maratona (50km+)',
    difficulty: 'elite',
    image: '/images/ultra-marathon.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Costruzione Base di Ultra',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Costruzione Base di Ultra',
        description: 'Costruire una solida base di chilometraggio con focus sulla resistenza',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa lunga settimanale',
            duration: '20-25km',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Corse su terreni variati',
            duration: '60-80km/settimana',
            intensity: 'Bassa-Media'
          },
          {
            id: uuidv4(),
            name: 'Allenamento con zaino',
            duration: '40-60 minuti',
            intensity: 'Media'
          }
        ],
        targetTime: 'Costruire base 60-80km settimanali',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Allenamenti Back-to-Back',
        description: 'Corse lunghe in giorni consecutivi per simulare la fatica dell\'ultra',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Back-to-back weekend',
            duration: '25km + 15km',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Recupero attivo',
            duration: 'Tra le sessioni',
            intensity: 'Bassa'
          },
          {
            id: uuidv4(),
            name: 'Corsa in stato di affaticamento',
            duration: '15-20km',
            intensity: 'Media'
          }
        ],
        targetTime: 'Completare back-to-back run di 40km totali',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Allenamento Specifico Ultra',
        description: 'Allenamenti specifici per le esigenze dell\'ultra maratona',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Alternanza corsa-camminata',
            duration: '30-40km',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Camminata in salita',
            duration: '60-90 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Simulazione punti ristoro',
            duration: '5-7 ore',
            intensity: 'Media-Alta'
          }
        ],
        targetTime: 'Completare sessioni di 5-7 ore',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Picco e Gara Ultra',
        description: 'Preparazione finale e completamento dell\'ultra maratona',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Simulazione gara',
            duration: '40-50km',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Taper graduale',
            duration: '2-3 settimane',
            intensity: 'Media-Bassa'
          },
          {
            id: uuidv4(),
            name: 'Strategia di gara',
            duration: 'Pianificazione completa',
            intensity: 'N/A'
          }
        ],
        targetTime: 'Completare Ultra Maratona',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Ironman',
    description: 'Programma di allenamento per completare un triathlon Ironman (3,9km nuoto, 180km bici, 42,2km corsa)',
    difficulty: 'elite',
    image: '/images/ironman.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Costruzione Base Multidisciplina',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Costruzione Base Multidisciplina',
        description: 'Costruire una solida base in tutte e tre le discipline',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Nuoto base',
            duration: '3-4 sessioni/settimana',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Ciclismo base',
            duration: '150-200km/settimana',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa base',
            duration: '30-40km/settimana',
            intensity: 'Media-Bassa'
          }
        ],
        targetTime: 'Allenamenti regolari nelle tre discipline',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Costruzione Endurance',
        description: 'Aumentare la resistenza su tutte le discipline',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Nuoto long swim',
            duration: '2-3km continui',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Bici long ride',
            duration: '70-100km',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa long run',
            duration: '15-20km',
            intensity: 'Media'
          }
        ],
        targetTime: 'Completare sessioni lunghe in ogni disciplina',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Allenamento Specifico Ironman',
        description: 'Allenamenti combinati e specifici per Ironman',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Brick workout',
            duration: 'Bici + corsa consecutivi',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Simulazione gara',
            duration: 'Mezze distanze',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Transizioni',
            duration: 'Pratica delle transizioni',
            intensity: 'Media'
          }
        ],
        targetTime: 'Completare mezze distanze Ironman',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Ironman Day',
        description: 'Preparazione finale e completamento dell\'Ironman',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Taper',
            duration: '2-3 settimane',
            intensity: 'Media-Bassa'
          },
          {
            id: uuidv4(),
            name: 'Strategia di gara',
            duration: 'Pianificazione completa',
            intensity: 'N/A'
          },
          {
            id: uuidv4(),
            name: 'Giorno della gara',
            duration: '9-17 ore',
            intensity: 'Progressiva'
          }
        ],
        targetTime: 'Completare Ironman',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Marathon des Sables',
    description: 'Programma di allenamento per completare la Marathon des Sables (250km in autosufficienza nel deserto)',
    difficulty: 'elite',
    image: '/images/mds.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Costruzione Base per MdS',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Costruzione Base per MdS',
        description: 'Costruire una solida base di resistenza e familiarizzazione con l\'ambiente',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa su terreni sabbiosi',
            duration: '60-80km/settimana',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Long run con zaino',
            duration: '25-30km',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Acclimatazione al caldo',
            duration: '20-30 minuti sauna',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Costruire base resistenza in ambiente caldo',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Adattamento Ambientale',
        description: 'Migliorare l\'adattamento al caldo e all\'equipaggiamento',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Sauna post-allenamento',
            duration: '30-40 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Back-to-back runs',
            duration: '30km + 20km',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Zaino pesante',
            duration: 'Corsa con 6-8kg',
            intensity: 'Media-Alta'
          }
        ],
        targetTime: 'Completare sessioni in condizioni ambientali difficili',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Autosufficienza e Equipaggiamento',
        description: 'Padroneggiare l\'autosufficienza e l\'equipaggiamento per il deserto',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Sessioni complete',
            duration: '6-8 ore',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Razionamento acqua',
            duration: 'Durante gli allenamenti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Long run notturno',
            duration: '20-25km',
            intensity: 'Media'
          }
        ],
        targetTime: 'Padroneggiare autosufficienza nel deserto',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Simulazione Gara',
        description: 'Eseguire sessioni di simulazione multi-giorno e preparazione finale',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Simulazione 3 giorni',
            duration: '25-30-20km consecutivi',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Gestione piedi',
            duration: 'Cura quotidiana',
            intensity: 'N/A'
          },
          {
            id: uuidv4(),
            name: 'Taper finale',
            duration: '2-3 settimane',
            intensity: 'Bassa-Media'
          }
        ],
        targetTime: 'Completare la Marathon des Sables',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Antarctic Ice Marathon',
    description: 'Programma di allenamento per completare una maratona in Antartide a -20°C',
    difficulty: 'elite',
    image: '/images/antarctic-marathon.jpg',
    progress: 0,
    achieved: false,
    firstLevelName: 'Adattamento al Freddo',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Adattamento al Freddo',
        description: 'Sviluppare resistenza alle basse temperature e condizioni fredde',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Allenamento in ambiente freddo',
            duration: '3-4 sessioni/settimana',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Corsa con strati multipli',
            duration: '45-60 minuti',
            intensity: 'Media-Alta'
          },
          {
            id: uuidv4(),
            name: 'Controllo respirazione',
            duration: '15-20 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Adattamento completo all\'ambiente freddo',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Tecnica di Corsa su Neve',
        description: 'Sviluppare tecnica e forza specifiche per correre su neve e ghiaccio',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Corsa su neve',
            duration: '30-40 minuti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Esercizi di stabilità',
            duration: '20-25 minuti',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Allenamento con zaino',
            duration: '40-50 minuti',
            intensity: 'Media-Alta'
          }
        ],
        targetTime: 'Padroneggiare la tecnica di corsa su neve',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Gestione Equipaggiamento Estremo',
        description: 'Padroneggiare l\'utilizzo dell\'equipaggiamento per il freddo estremo',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Sistema a strati',
            duration: 'Sessioni pratiche',
            intensity: 'Media'
          },
          {
            id: uuidv4(),
            name: 'Idratazione in condizioni estreme',
            duration: 'Durante gli allenamenti',
            intensity: 'Alta'
          },
          {
            id: uuidv4(),
            name: 'Manovre con guanti spessi',
            duration: '15-20 minuti',
            intensity: 'Bassa'
          }
        ],
        targetTime: 'Gestione efficiente dell\'equipaggiamento',
        completed: false,
        progress: 0
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Simulazione e Resistenza Mentale',
        description: 'Preparazione finale fisica e mentale per l\'Antarctic Ice Marathon',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Maratona con equipaggiamento',
            duration: '4-5 ore',
            intensity: 'Massima'
          },
          {
            id: uuidv4(),
            name: 'Visualizzazione',
            duration: '15-20 minuti/giorno',
            intensity: 'N/A'
          },
          {
            id: uuidv4(),
            name: 'Simulazione problemi',
            duration: 'Durante gli allenamenti',
            intensity: 'Alta'
          }
        ],
        targetTime: 'Completare l\'Antarctic Ice Marathon',
        completed: false,
        progress: 0
      }
    ]
  },
];

export default cardioSkills;
