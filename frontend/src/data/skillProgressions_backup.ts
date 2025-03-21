import { SkillProgression } from '../types/skillProgression';

export const skillProgressions: SkillProgression[] = [
  {
    id: 'handstand',
    name: 'Verticale',
    category: 'calisthenics',
    description: 'Impara a fare la verticale contro un muro fino a raggiungere la verticale libera',
    coverImage: '/images/skills/handstand-cover.jpg',
    finalVideo: '/videos/skills/handstand-final.mp4',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '3-6 mesi',
    prerequisites: ['Forza base nelle spalle', 'Buona mobilitÃ  delle spalle'],
    steps: [
      {
        id: 'handstand-wall-plank',
        name: 'Wall Plank',
        description: 'Posizione di plank con i piedi appoggiati al muro, creando un angolo di circa 45Â° con il suolo',
        difficulty: 1,
        gifUrl: '/gif/skills/handstand-wall-plank.gif',
        instructions: [
          'Mettiti in posizione di plank rivolto verso il pavimento',
          'Cammina con i piedi sul muro fino a creare un angolo di circa 45Â°',
          'Mantieni la posizione per 30-60 secondi',
          'Ripeti 3-5 volte'
        ],
        tips: ['Mantieni gli addominali contratti', 'Spingi attivamente attraverso le spalle'],
        estimatedTimeToMaster: '1-2 settimane',
        nextStepId: 'handstand-pike-pushups'
      },
      {
        id: 'handstand-pike-pushups',
        name: 'Pike Push-ups',
        description: 'Push-up in posizione a "V" per rafforzare le spalle',
        difficulty: 2,
        gifUrl: '/gif/skills/handstand-pike-pushups.gif',
        instructions: [
          'Posizionati in una posizione a "V" invertita, con glutei in alto',
          'Piega i gomiti per abbassare la testa verso il pavimento',
          'Spingi verso l\'alto per tornare alla posizione di partenza',
          'Fai 3 serie da 8-12 ripetizioni'
        ],
        estimatedTimeToMaster: '2-3 settimane',
        nextStepId: 'handstand-wall-walks'
      },
      {
        id: 'handstand-wall-walks',
        name: 'Wall Walks',
        description: 'Esercizio dove cammini con le mani verso il muro fino a raggiungere la posizione verticale',
        difficulty: 3,
        gifUrl: '/gif/skills/handstand-wall-walks.gif',
        instructions: [
          'Inizia in posizione di plank con i piedi contro il muro',
          'Cammina con le mani verso il muro, avvicinando i piedi alla testa',
          'Continua finchÃ© non sei in posizione verticale contro il muro',
          'Lentamente torna alla posizione iniziale',
          'Ripeti 3-5 volte'
        ],
        estimatedTimeToMaster: '3-4 settimane',
        nextStepId: 'handstand-against-wall'
      },
      {
        id: 'handstand-against-wall',
        name: 'Verticale contro il muro',
        description: 'Verticale completa con supporto del muro',
        difficulty: 4,
        gifUrl: '/gif/skills/handstand-against-wall.gif',
        instructions: [
          'Posizionati con le mani a circa 10-15 cm dal muro',
          'Dai un calcio per sollevare le gambe al muro',
          'Allinea il corpo in una linea retta',
          'Mantieni per 30-60 secondi',
          'Ripeti 3-5 volte'
        ],
        tips: ['Guarda leggermente avanti tra le mani, non indietro', 'Spalle completamente estese', 'Corpo teso'],
        estimatedTimeToMaster: '4-6 settimane',
        nextStepId: 'handstand-freestanding'
      },
      {
        id: 'handstand-freestanding',
        name: 'Verticale libera',
        description: 'Verticale senza supporto',
        difficulty: 5,
        gifUrl: '/gif/skills/handstand-freestanding.gif',
        instructions: [
          'Inizia con la verticale contro il muro',
          'Stacca gradualmente un piede dal muro e cerca l\'equilibrio',
          'Stacca entrambi i piedi quando ti senti sicuro',
          'Cerca di mantenere la posizione per 5-10 secondi',
          'Aumenta gradualmente il tempo'
        ],
        tips: ['Fai piccole correzioni con le dita', 'Respirazione controllata', 'Pratica quotidiana'],
        estimatedTimeToMaster: '6-12 settimane'
      }
    ]
  },
  {
    id: 'bench-press-100kg',
    name: 'Panca Piana 100kg',
    category: 'weightlifting',
    description: 'Progressione per arrivare a sollevare 100kg nella panca piana',
    coverImage: '/images/skills/bench-press-cover.jpg',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '6-12 mesi',
    prerequisites: ['Base di forza nella parte superiore del corpo', 'Tecnica corretta della panca piana'],
    steps: [
      {
        id: 'bench-press-technique',
        name: 'Tecnica di base',
        description: 'Imparare la corretta tecnica della panca piana',
        difficulty: 1,
        videoUrl: '/videos/skills/bench-press-technique.mp4',
        instructions: [
          'Sdraiati sulla panca con i piedi ben piantati a terra',
          'Afferra il bilanciere con una presa leggermente piÃ¹ ampia delle spalle',
          'Arcua leggermente la schiena e ritrai le scapole',
          'Abbassa il bilanciere al centro del petto',
          'Spingi il bilanciere verso l\'alto fino all\'estensione completa',
          'Fai 3 serie da 8-12 ripetizioni con peso leggero'
        ],
        tips: ['Mantieni i polsi dritti', 'Respira correttamente: inspira scendendo, espira salendo'],
        estimatedTimeToMaster: '2-3 settimane',
        nextStepId: 'bench-press-60-percent'
      },
      {
        id: 'bench-press-60-percent',
        name: '60% del peso corporeo',
        description: 'Arrivare a sollevare il 60% del proprio peso corporeo',
        difficulty: 2,
        instructions: [
          'Determina il tuo peso corporeo e calcola il 60%',
          'Segui un programma di allenamento progressivo',
          'Allenati 2-3 volte a settimana',
          'Utilizza un sistema di progressione come 5x5 o 3x8-12',
          'Aumenta il peso di 2.5kg quando completi tutte le serie e ripetizioni con facilitÃ '
        ],
        estimatedTimeToMaster: '1-2 mesi',
        nextStepId: 'bench-press-bodyweight'
      },
      {
        id: 'bench-press-bodyweight',
        name: 'Peso corporeo',
        description: 'Arrivare a sollevare il proprio peso corporeo nella panca piana',
        difficulty: 3,
        instructions: [
          'Continua ad aumentare progressivamente il peso',
          'Includi esercizi accessori come dips, pushup e lavoro con manubri',
          'Considera di aggiungere un giorno di allenamento con alte ripetizioni (12-15) e peso moderato',
          'Assicurati adeguato recupero e nutrizione'
        ],
        estimatedTimeToMaster: '3-6 mesi',
        nextStepId: 'bench-press-125-bodyweight'
      },
      {
        id: 'bench-press-125-bodyweight',
        name: '125% del peso corporeo',
        description: 'Arrivare a sollevare il 125% del proprio peso corporeo',
        difficulty: 4,
        instructions: [
          'Implementa cicli di periodizzazione',
          'Includi settimane di deload ogni 4-6 settimane',
          'Focalizzati su specifici punti deboli (tricipiti, deltoidi, ecc.)',
          'Considera di variare la larghezza della presa e utilizzo di bande o catene',
          'Mantieni programmi di 8-12 settimane con obiettivi progressivi'
        ],
        estimatedTimeToMaster: '4-8 mesi',
        nextStepId: 'bench-press-100kg'
      },
      {
        id: 'bench-press-100kg',
        name: '100kg Panca Piana',
        description: 'Raggiungere l\'obiettivo di sollevare 100kg nella panca piana',
        difficulty: 5,
        instructions: [
          'Affina la tecnica per massima efficienza',
          'Implementa allenamenti specifici per la forza pura (1-5 ripetizioni)',
          'Aggiungi esercizi di supporto per punti deboli',
          'Cicli di carico e scarico ben programmati',
          'Considera metodi avanzati come rest-pause, cluster sets o joker sets'
        ],
        tips: ['Valuta se utilizzare un belt per la panca', 'Considera un programma di allenamento specifico come Smolov Jr.', 'Non sottovalutare il recupero e la nutrizione'],
        estimatedTimeToMaster: '2-4 mesi (dall\'ultimo passo)'
      }
    ]
  },
  {
    id: 'front-lever',
    name: 'Front Lever',
    category: 'calisthenics',
    description: 'Impara a eseguire un front lever completo, un impressionante esercizio di forza isometrica',
    coverImage: '/images/skills/front-lever-cover.jpg',
    finalVideo: '/videos/skills/front-lever-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '6-12 mesi',
    prerequisites: ['Pull-up con buona forma', 'Core strength'],
    steps: [
      {
        id: 'front-lever-tuck',
        name: 'Tuck Front Lever',
        description: 'Posizione di front lever con le ginocchia piegate verso il petto',
        difficulty: 2,
        gifUrl: '/gif/skills/front-lever-tuck.gif',
        instructions: [
          'Impugnare la sbarra con una presa prona (palmi in avanti)',
          'Sollevarsi in una posizione di pull-up completo',
          'Mantenendo le braccia tese, portare le ginocchia al petto',
          'Abbassare lentamente il corpo fino a essere parallelo al suolo',
          'Mantenere la posizione per 10-15 secondi'
        ],
        tips: [
          'Concentrati sulla retrazione delle scapole',
          'Mantieni sempre le braccia tese durante l\'esercizio',
          'Respira normalmente durante l\'isometria'
        ],
        estimatedTimeToMaster: '3-4 settimane'
      },
      {
        id: 'front-lever-advanced-tuck',
        name: 'Advanced Tuck Front Lever',
        description: 'Posizione di front lever con le ginocchia meno piegate, avvicinandosi alla posizione finale',
        difficulty: 3,
        gifUrl: '/gif/skills/front-lever-advanced-tuck.gif',
        instructions: [
          'Dalla posizione di tuck front lever, estendi leggermente le gambe',
          'Mantieni la posizione del busto parallela al suolo',
          'Mantieni la posizione per 8-12 secondi',
          'Fai 3-5 set con riposo di 2 minuti'
        ],
        tips: [
          'Assicurati che la schiena rimanga piatta',
          'L\'angolo dell\'anca dovrebbe essere circa 90-120 gradi'
        ],
        estimatedTimeToMaster: '4-6 settimane'
      },
      {
        id: 'front-lever-one-leg',
        name: 'One Leg Front Lever',
        description: 'Front lever con una gamba estesa e l\'altra piegata',
        difficulty: 4,
        gifUrl: '/gif/skills/front-lever-one-leg.gif',
        instructions: [
          'Dalla posizione di advanced tuck, estendi una gamba completamente',
          'Mantieni l\'altra gamba piegata',
          'Assicurati che il corpo rimanga parallelo al suolo',
          'Alterna le gambe negli allenamenti per uno sviluppo simmetrico'
        ],
        tips: [
          'Punta le dita del piede della gamba estesa',
          'Mantieni la tensione nell\'addome',
          'Se perdi l\'allineamento, torna alla posizione precedente'
        ],
        estimatedTimeToMaster: '6-8 settimane'
      },
      {
        id: 'front-lever-full',
        name: 'Full Front Lever',
        description: 'Front lever completo con entrambe le gambe estese',
        difficulty: 5,
        gifUrl: '/gif/skills/front-lever-full.gif',
        instructions: [
          'Impugnare la sbarra con presa prona',
          'Sollevarsi e portare il corpo in posizione orizzontale',
          'Estendere completamente entrambe le gambe',
          'Mantenere il corpo perfettamente allineato, dalla testa ai piedi',
          'Tenere la posizione iniziando da 3-5 secondi'
        ],
        tips: [
          'Cerca di mantenere un\'attivazione totale del core e della schiena',
          'La respirazione Ã¨ fondamentale: non trattenere il respiro',
          'Filma i tuoi tentativi per verificare l\'allineamento corretto'
        ],
        estimatedTimeToMaster: '8-12 settimane'
      }
    ]
  },
  {
    id: 'muscle-up',
    name: 'Muscle Up',
    category: 'calisthenics',
    description: 'Padroneggia il muscle up, un movimento avanzato che combina pull-up e dip in un unico fluido esercizio',
    coverImage: '/images/skills/muscle-up-cover.jpg',
    finalVideo: '/videos/skills/muscle-up-final.mp4',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '3-6 mesi',
    prerequisites: ['10+ pull-up consecutive', 'Buona forza nelle dip'],
    steps: [
      {
        id: 'muscle-up-explosive-pullup',
        name: 'Pull-up Esplosive',
        description: 'Pull-up con fase concentrica esplosiva per preparare il movimento del muscle up',
        difficulty: 2,
        gifUrl: '/gif/skills/muscle-up-explosive-pullup.gif',
        instructions: [
          'Impugnare la sbarra con una presa leggermente piÃ¹ larga delle spalle',
          'Iniziare la pull-up in modo normale',
          'Accelerare il movimento nella fase di trazione',
          'Cercare di portare il petto il piÃ¹ in alto possibile verso la sbarra',
          'Eseguire 3-4 serie da 5-8 ripetizioni'
        ],
        tips: [
          'Concentrati sulla velocitÃ  e potenza nella parte superiore del movimento',
          'Utilizza un leggero kipping (slancio) se necessario per imparare il movimento'
        ],
        estimatedTimeToMaster: '2-3 settimane'
      },
      {
        id: 'muscle-up-transition',
        name: 'Transizione Muscle Up',
        description: 'Esercizio specifico per la fase di transizione del muscle up',
        difficulty: 3,
        gifUrl: '/gif/skills/muscle-up-transition.gif',
        instructions: [
          'Posizionarsi su una sbarra bassa o anelli',
          'Partire da una posizione intermedia (petto all\'altezza della sbarra)',
          'Esercitarsi nel movimento di rotazione dei polsi e transizione sopra la sbarra',
          'Concentrarsi sul passaggio fluido dalla trazione alla spinta'
        ],
        tips: [
          'Questa Ã¨ la fase piÃ¹ tecnica del muscle up',
          'Praticare il movimento lentamente per memorizzare il pattern motorio'
        ],
        estimatedTimeToMaster: '3-4 settimane'
      },
      {
        id: 'muscle-up-negative',
        name: 'Muscle Up Negativo',
        description: 'Esecuzione della fase eccentrica (discesa) del muscle up',
        difficulty: 3,
        gifUrl: '/gif/skills/muscle-up-negative.gif',
        instructions: [
          'Saltare o utilizzare una piattaforma per iniziare sopra la sbarra',
          'Partire dalla posizione alta del muscle up (braccia tese)',
          'Scendere lentamente attraverso la fase di transizione',
          'Completare il movimento nella posizione bassa del pull-up',
          'Eseguire 3-5 ripetizioni per 2-3 serie'
        ],
        tips: [
          'Controlla la velocitÃ  durante tutto il movimento',
          'PiÃ¹ lento esegui il negativo, maggiore sarÃ  il beneficio'
        ],
        estimatedTimeToMaster: '3-4 settimane'
      },
      {
        id: 'muscle-up-full',
        name: 'Muscle Up Completo',
        description: 'Esecuzione completa del muscle up',
        difficulty: 4,
        gifUrl: '/gif/skills/muscle-up-full.gif',
        instructions: [
          'Impugnare la sbarra con una presa prona leggermente piÃ¹ larga delle spalle',
          'Iniziare con un pull-up esplosivo',
          'Quando il petto raggiunge la sbarra, ruotare i polsi ed eseguire la transizione',
          'Completare il movimento con l\'estensione delle braccia in posizione di dip',
          'Scendere in modo controllato e ripetere'
        ],
        tips: [
          'Allâ€™inizio Ã¨ normale utilizzare un poâ€™ di slancio (kipping)',
          'Con la pratica, cerca di rendere il movimento sempre piÃ¹ controllato e fluido',
          'Filma i tuoi tentativi per migliorare la tecnica'
        ],
        estimatedTimeToMaster: '4-8 settimane'
      }
    ]
  },
  {
    id: 'run-5km',
    name: 'Correre 5km',
    category: 'cardio',
    description: 'Programma di allenamento per arrivare a correre 5km senza fermarsi',
    coverImage: '/images/skills/run-5km-cover.jpg',
    finalVideo: '/videos/skills/run-5km-final.mp4',
    difficultyLevel: 2,
    estimatedTimeToAchieve: '8-12 settimane',
    prerequisites: ['Buona salute generale', 'Scarpe da corsa adeguate'],
    steps: [
      {
        id: 'run-walk-intervals',
        name: 'Intervalli Corsa/Camminata',
        description: 'Alternare periodi di corsa leggera e camminata per costruire resistenza',
        difficulty: 1,
        gifUrl: '/gif/skills/run-walk-intervals.gif',
        instructions: [
          'Cammina per 5 minuti come riscaldamento',
          'Corri lentamente per 1 minuto',
          'Cammina per 2 minuti per recuperare',
          'Ripeti questo ciclo per un totale di 20 minuti',
          'Termina con 5 minuti di camminata di defaticamento'
        ],
        tips: [
          'Concentrati sulla respirazione regolare durante la corsa',
          'Corri a un ritmo in cui potresti sostenere una conversazione',
          'Esegui questo allenamento 3 volte a settimana con un giorno di riposo tra le sessioni'
        ],
        estimatedTimeToMaster: '2 settimane'
      },
      {
        id: 'run-2km',
        name: 'Corsa Continua 2km',
        description: 'Costruire la resistenza per correre 2km senza fermarsi',
        difficulty: 2,
        gifUrl: '/gif/skills/run-2km.gif',
        instructions: [
          'Riscaldamento: cammina velocemente per 5 minuti',
          'Corri a ritmo lento ma costante per 2km',
          'Se necessario, inserisci brevi pause di camminata',
          'Lâ€™obiettivo Ã¨ ridurre gradualmente le pause fino a eliminarle completamente',
          'Defaticamento: cammina per 5 minuti alla fine'
        ],
        tips: [
          'Monitora il tuo progresso con unâ€™app di corsa',
          'Concentrati sul mantenere un ritmo costante piuttosto che sulla velocitÃ ',
          'Presta attenzione alla tua postura durante la corsa'
        ],
        estimatedTimeToMaster: '3 settimane'
      },
      {
        id: 'run-3km',
        name: 'Corsa Continua 3km',
        description: 'Aumentare la distanza di corsa a 3km',
        difficulty: 2,
        gifUrl: '/gif/skills/run-3km.gif',
        instructions: [
          'Riscaldamento: cammina velocemente per 5 minuti',
          'Corri a ritmo lento e costante puntando a completare 3km',
          'Mantieni un ritmo che ti permetta di parlare senza troppa fatica',
          'Alterna questo allenamento con sessioni di corsa piÃ¹ brevi e intense',
          'Defaticamento: cammina per 5 minuti e esegui stretching'
        ],
        tips: [
          'Introduci un allenamento di corsa in salita una volta a settimana per aumentare la forza',
          'Assicurati di riposarti adeguatamente tra gli allenamenti',
          'Lâ€™alimentazione e lâ€™idratazione sono fondamentali per migliorare le prestazioni'
        ],
        estimatedTimeToMaster: '3 settimane'
      },
      {
        id: 'run-5km',
        name: 'Corsa Continua 5km',
        description: 'Completare una corsa continua di 5km',
        difficulty: 3,
        gifUrl: '/gif/skills/run-5km.gif',
        instructions: [
          'Riscaldamento: cammina velocemente e fai esercizi di mobilitÃ  per 5-10 minuti',
          'Inizia con un ritmo confortevole e sostenibile',
          'Concentrati sulla respirazione regolare e sulla postura',
          'Mantieni un passo costante per tutta la distanza',
          'Dopo aver raggiunto lâ€™obiettivo dei 5km, lavora sul migliorare il tempo'
        ],
        tips: [
          'Celebra questo traguardo importante!',
          'Considera di partecipare a una corsa/evento di 5km per mettere alla prova le tue capacitÃ ',
          'Ora puoi scegliere se aumentare la distanza o migliorare la velocitÃ  sui 5km'
        ],
        estimatedTimeToMaster: '4 settimane'
      }
    ]
  }
];

// Funzione di utilitÃ  per ottenere una skill per ID
export function getSkillProgressionById(id: string): SkillProgression | undefined {
  return skillProgressions.find(skill => skill.id === id);
}

// Funzione per ottenere tutte le skill di una categoria specifica
export function getSkillsByCategory(category: 'calisthenics' | 'weightlifting' | 'cardio' | 'mobility'): SkillProgression[] {
  return skillProgressions.filter(skill => skill.category === category);
}
