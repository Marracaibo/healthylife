import { MobilitySkill } from '../types/mobilitySkill';
import { v4 as uuidv4 } from 'uuid';

const mobilitySkills: MobilitySkill[] = [
  {
    id: uuidv4(),
    name: 'Spaccata Frontale',
    description: 'Eseguire una spaccata frontale completa',
    difficulty: 'intermediate',
    image: '/images/split.jpg',
    progress: 85,
    achieved: false,
    firstLevelName: 'Stretching base',
    areaFocus: 'Flessibilità dei flessori dell\'anca e hamstring',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Flessibilità base degli adduttori',
        description: 'Sviluppare la flessibilità di base per la spaccata',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Butterfly stretch',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Lateral lunges',
            sets: 3,
            duration: '10 per lato'
          },
          {
            id: uuidv4(),
            name: 'Adductor stretch seated',
            sets: 3,
            duration: '45 secondi'
          }
        ],
        targetMobility: 'Sedersi a terra con le gambe aperte a 90°',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Spaccata a 45° dal suolo',
        description: 'Aumentare l\'ampiezza della spaccata',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Cossack squat',
            sets: 3,
            duration: '8 per lato'
          },
          {
            id: uuidv4(),
            name: 'Horse stance',
            sets: 4,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Pancake stretch',
            sets: 3,
            duration: '60 secondi'
          }
        ],
        targetMobility: 'Spaccata frontale a 45cm da terra',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Spaccata a 25° dal suolo',
        description: 'Progredire verso una spaccata più profonda',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Middle split slides',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Frog pose',
            sets: 3,
            duration: '45 secondi'
          },
          {
            id: uuidv4(),
            name: 'Weighted butterfly',
            sets: 3,
            duration: '30 secondi'
          }
        ],
        targetMobility: 'Spaccata frontale a 25cm da terra',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Spaccata a 10° dal suolo',
        description: 'Avvicinarsi alla spaccata completa',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'PNF for middle splits',
            sets: 3,
            duration: '6 contrazioni da 10 secondi'
          },
          {
            id: uuidv4(),
            name: 'Wall split',
            sets: 3,
            duration: '60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Active flexibility drills',
            sets: 2,
            duration: '10 ripetizioni per esercizio'
          }
        ],
        targetMobility: 'Spaccata frontale a 10cm da terra',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Spaccata frontale completa',
        description: 'Raggiungere l\'obiettivo della spaccata frontale completa',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Active middle split lifts',
            sets: 3,
            duration: '8 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Oversplits (rialzati)',
            sets: 2,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Weighted middle splits',
            sets: 3,
            duration: '45 secondi'
          }
        ],
        targetMobility: 'Spaccata frontale con bacino a terra',
        completed: false,
        progress: 80
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Spaccata Laterale',
    description: 'Eseguire una spaccata laterale completa con entrambe le gambe',
    difficulty: 'advanced',
    image: '/images/side-split.jpg',
    progress: 60,
    achieved: false,
    firstLevelName: 'Apertura base dell\'anca',
    areaFocus: 'Flessibilità delle anche e adduttori',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Apertura base dell\'anca',
        description: 'Sviluppare la mobilità di base dell\'anca per la spaccata laterale',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Butterfly stretch',
            sets: 3,
            duration: '60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Frog pose',
            sets: 3,
            duration: '45 secondi'
          },
          {
            id: uuidv4(),
            name: 'Adductor stretch seduto',
            sets: 3,
            duration: '30 secondi per lato'
          }
        ],
        targetMobility: 'Sedersi comodamente in posizione butterfly con ginocchia vicine al pavimento',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Spaccata laterale parziale (90°)',
        description: 'Raggiungere una spaccata laterale con apertura di 90 gradi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Side lunge profondo',
            sets: 3,
            duration: '10 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Frog pose dinamica',
            sets: 3,
            duration: '20 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Horse stance',
            sets: 3,
            duration: '30-60 secondi'
          }
        ],
        targetMobility: 'Spaccata laterale con apertura di 90 gradi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Spaccata laterale parziale (120°)',
        description: 'Aumentare l\'apertura della spaccata laterale a 120 gradi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Pancake stretch',
            sets: 3,
            duration: '60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Adductor slides',
            sets: 3,
            duration: '10 ripetizioni per lato'
          },
          {
            id: uuidv4(),
            name: 'Spaccata laterale assistita',
            sets: 3,
            duration: '30 secondi'
          }
        ],
        targetMobility: 'Spaccata laterale con apertura di 120 gradi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Spaccata laterale parziale (150°)',
        description: 'Aumentare l\'apertura della spaccata laterale a 150 gradi',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Spaccata laterale con supporto',
            sets: 3,
            duration: '60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Adductor stretch isometrico',
            sets: 5,
            duration: '10s contrazione + 30s stretch'
          },
          {
            id: uuidv4(),
            name: 'Cossack squat',
            sets: 3,
            duration: '8 ripetizioni per lato'
          }
        ],
        targetMobility: 'Spaccata laterale con apertura di 150 gradi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Spaccata laterale completa (180°)',
        description: 'Raggiungere la spaccata laterale completa',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'PNF per adduttori',
            sets: 5,
            duration: '6s contrazione + 30s stretch'
          },
          {
            id: uuidv4(),
            name: 'Spaccata laterale assistita',
            sets: 3,
            duration: '60-90 secondi'
          },
          {
            id: uuidv4(),
            name: 'Spaccata laterale attiva',
            sets: 3,
            duration: '5 ripetizioni da 10 secondi'
          }
        ],
        targetMobility: 'Spaccata laterale completa con bacino allineato',
        completed: false,
        progress: 60
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Bridge (Ponte)',
    description: 'Eseguire un ponte completo con massima estensione della colonna vertebrale',
    difficulty: 'intermediate',
    image: '/images/bridge-pose.jpg',
    icon: '/icons/bridge.png',
    progress: 70,
    achieved: false,
    firstLevelName: 'Glute Bridge',
    areaFocus: 'Colonna vertebrale e spalle',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Glute Bridge',
        description: 'Sviluppare la forza di base e la mobilità dell\'anca',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Glute Bridge',
            sets: 3,
            duration: '15 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Cat-Cow Stretch',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Child\'s Pose',
            sets: 3,
            duration: '30 secondi'
          }
        ],
        targetMobility: 'Eseguire 20 Glute Bridge con controllo e attivazione completa',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Single Leg Bridge',
        description: 'Aumentare la forza e la stabilità con ponte a una gamba',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Single Leg Bridge',
            sets: 3,
            duration: '10 ripetizioni per gamba'
          },
          {
            id: uuidv4(),
            name: 'Sphinx Pose',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Thoracic Mobility Drill',
            sets: 3,
            duration: '8 ripetizioni'
          }
        ],
        targetMobility: 'Eseguire 15 Single Leg Bridge per gamba con controllo',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Bridge Pose (Setu Bandhasana)',
        description: 'Sviluppare la mobilità della colonna vertebrale in estensione',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Bridge Pose',
            sets: 5,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Camel Pose',
            sets: 3,
            duration: '20 secondi'
          },
          {
            id: uuidv4(),
            name: 'Shoulder Opener',
            sets: 3,
            duration: '30 secondi per lato'
          }
        ],
        targetMobility: 'Mantenere il Bridge Pose per 60 secondi con respirazione controllata',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Wheel Pose (Urdhva Dhanurasana)',
        description: 'Eseguire il ponte completo con braccia tese',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Wheel Pose',
            sets: 3,
            duration: '15-20 secondi'
          },
          {
            id: uuidv4(),
            name: 'Supported Bridge',
            sets: 3,
            duration: '45 secondi'
          },
          {
            id: uuidv4(),
            name: 'Shoulder Extension Drill',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetMobility: 'Eseguire il Wheel Pose con braccia tese e mantenere per 30 secondi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Full Bridge (Ponte completo)',
        description: 'Massima estensione della colonna vertebrale con varianti avanzate',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'One Leg Wheel Pose',
            sets: 3,
            duration: '10 secondi per gamba'
          },
          {
            id: uuidv4(),
            name: 'Bridge walkover progressions',
            sets: 3,
            duration: '5 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Deep Backbend Stretches',
            sets: 3,
            duration: '20 secondi ciascuno'
          }
        ],
        targetMobility: 'Eseguire il ponte completo con massima estensione e varianti a una gamba',
        completed: false,
        progress: 70
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Scorpion Pose',
    description: 'Eseguire la posizione dello scorpione (Vrschikasana) e mantenerla per 15 secondi',
    difficulty: 'elite',
    image: '/images/scorpion-pose.jpg',
    icon: '/icons/scorpion-pose.png',
    progress: 20,
    achieved: false,
    firstLevelName: 'Dolphin Pose',
    areaFocus: 'Flessibilità della schiena e forza delle spalle',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'Dolphin Pose',
        description: 'Sviluppare forza nelle spalle e flessibilità nella colonna vertebrale',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Dolphin Pose',
            sets: 3,
            duration: '30-60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Child\'s Pose con braccia estese',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Cobra Pose',
            sets: 5,
            duration: '15 secondi'
          }
        ],
        targetMobility: 'Mantenere Dolphin Pose per 60 secondi con stabilità',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Forearm Stand (Pincha Mayurasana)',
        description: 'Imparare l\'equilibrio sugli avambracci',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Forearm Stand al muro',
            sets: 5,
            duration: '20-30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Dolphin push-ups',
            sets: 3,
            duration: '10 ripetizioni'
          },
          {
            id: uuidv4(),
            name: 'Wheel Pose (Urdhva Dhanurasana)',
            sets: 3,
            duration: '15-20 secondi'
          }
        ],
        targetMobility: 'Mantenere Forearm Stand per 30 secondi con controllo',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Forearm Stand con apertura del petto',
        description: 'Iniziare ad aprire il petto e sviluppare la flessibilità della schiena',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Camel Pose (Ustrasana)',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Forearm Stand con piccola apertura',
            sets: 5,
            duration: '10-15 secondi'
          },
          {
            id: uuidv4(),
            name: 'Shoulder stretches',
            sets: 3,
            duration: '30 secondi per lato'
          }
        ],
        targetMobility: 'Forearm Stand con leggera apertura del petto',
        completed: false,
        progress: 70
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Scorpion Pose con gambe basse',
        description: 'Portare i piedi verso la testa in posizione di scorpione con gambe basse',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Forearm Wheel Pose',
            sets: 3,
            duration: '15 secondi'
          },
          {
            id: uuidv4(),
            name: 'Scorpion al muro',
            sets: 5,
            duration: '10 secondi'
          },
          {
            id: uuidv4(),
            name: 'Backbend progressivi',
            sets: 3,
            duration: '20 secondi ciascuno'
          }
        ],
        targetMobility: 'Mantenere una Scorpion Pose base per 10 secondi',
        completed: false,
        progress: 30
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Full Scorpion Pose',
        description: 'Raggiungere la posizione completa dello scorpione',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Scorpion Pose progressiva',
            sets: 5,
            duration: '5-10 secondi'
          },
          {
            id: uuidv4(),
            name: 'King Pigeon Pose',
            sets: 3,
            duration: '20 secondi per lato'
          },
          {
            id: uuidv4(),
            name: 'Hollow back training',
            sets: 3,
            duration: '15 secondi'
          }
        ],
        targetMobility: 'Mantenere la Scorpion Pose completa per 15 secondi',
        completed: false,
        progress: 0
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Firefly Pose',
    description: 'Eseguire la posizione Firefly (Tittibhasana) con braccia tese e gambe estese',
    difficulty: 'elite',
    image: '/images/firefly-pose.jpg',
    icon: '/icons/firefly-pose.png',
    progress: 30,
    achieved: false,
    firstLevelName: 'L-Sit a terra',
    areaFocus: 'Flessibilità delle anche e forza delle braccia',
    progressions: [
      {
        id: uuidv4(),
        level: 1,
        name: 'L-Sit a terra',
        description: 'Sviluppare la forza di base per sostenere il corpo',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'L-Sit con supporto',
            sets: 5,
            duration: '10-15 secondi'
          },
          {
            id: uuidv4(),
            name: 'Seated Forward Fold',
            sets: 3,
            duration: '60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Push-up con elevazione scapolare',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetMobility: 'Mantenere L-Sit a terra per 20 secondi',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 2,
        name: 'Malasana (Squat profondo)',
        description: 'Sviluppare la flessibilità delle anche e delle caviglie',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Malasana',
            sets: 3,
            duration: '45-60 secondi'
          },
          {
            id: uuidv4(),
            name: 'Lizard Pose',
            sets: 3,
            duration: '30 secondi per lato'
          },
          {
            id: uuidv4(),
            name: 'Crow Pose',
            sets: 5,
            duration: '10 secondi'
          }
        ],
        targetMobility: 'Squat profondo con talloni a terra e braccia tra le gambe',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 3,
        name: 'Prasarita Padottanasana con braccia a terra',
        description: 'Sviluppare la flessibilità delle anche in abduzione',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Wide-legged forward fold',
            sets: 3,
            duration: '45 secondi'
          },
          {
            id: uuidv4(),
            name: 'Prasarita con mani a terra',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Hamstring slides',
            sets: 3,
            duration: '10 ripetizioni per gamba'
          }
        ],
        targetMobility: 'Forward fold con gambe divaricate e mani completamente a terra',
        completed: true,
        progress: 100
      },
      {
        id: uuidv4(),
        level: 4,
        name: 'Firefly Prep (Tittibhasana Prep)',
        description: 'Posizione preparatoria con braccia tra le gambe e piedi sollevati',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Malasana con braccia interne',
            sets: 3,
            duration: '30 secondi'
          },
          {
            id: uuidv4(),
            name: 'Firefly con piedi a terra',
            sets: 5,
            duration: '15 secondi'
          },
          {
            id: uuidv4(),
            name: 'Seated leg lifts',
            sets: 3,
            duration: '10 ripetizioni'
          }
        ],
        targetMobility: 'Sollevare un piede alla volta nella posizione Firefly',
        completed: false,
        progress: 70
      },
      {
        id: uuidv4(),
        level: 5,
        name: 'Full Firefly Pose (Tittibhasana)',
        description: 'Posizione completa con braccia tese e gambe estese',
        supportExercises: [
          {
            id: uuidv4(),
            name: 'Firefly con supporto',
            sets: 3,
            duration: '10 secondi'
          },
          {
            id: uuidv4(),
            name: 'Firefly entrata e uscita',
            sets: 5,
            duration: '3-5 secondi per ripetizione'
          },
          {
            id: uuidv4(),
            name: 'L-Sit sulle parallele',
            sets: 3,
            duration: '15 secondi'
          }
        ],
        targetMobility: 'Mantenere la Firefly Pose completa per 15 secondi',
        completed: false,
        progress: 0
      }
    ]
  }
];

export default mobilitySkills;
