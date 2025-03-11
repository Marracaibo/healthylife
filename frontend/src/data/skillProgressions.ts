import { SkillProgression } from '../types/skillProgression';

export const skillProgressions: SkillProgression[] = [
  {
    id: 'aerobox',
    name: 'Aerobox',
    category: 'cardio',
    description: 'Allenamento che combina tecniche di boxe e aerobica per migliorare resistenza cardiovascolare',
    coverImage: '/images/skills/aerobox-cover.jpg',
    iconUrl: '/icons/cardio.png',
    finalVideo: '/videos/skills/aerobox-final.mp4',
    difficultyLevel: 2,
    estimatedTimeToAchieve: '8 settimane',
    prerequisites: ['Discreta forma fisica di base'],
    steps: [
      {
        id: 'aerobox-base',
        name: 'Tecniche Base',
        description: 'Apprendere i movimenti base dell\'aerobox',
        difficulty: 1,
        gifUrl: '/gif/skills/aerobox-base.gif',
        instructions: [
          'Impara i colpi base: jab, cross, gancio',
          'Pratica i movimenti delle gambe: affondi e saltelli',
          'Esegui sequenze semplici di 3-4 movimenti',
          'Allena la coordinazione tra braccia e gambe',
          'Mantieni un ritmo costante per 10-15 minuti'
        ],
        tips: [
          'Concentrati sulla forma corretta piuttosto che sulla velocità',
          'Usa musica a 120-130 BPM per mantenere il ritmo',
          'Ricorda di respirare regolarmente durante l\'esecuzione'
        ],
        estimatedTimeToMaster: '2 settimane'
      },
      {
        id: 'aerobox-kombos',
        name: 'Combinazioni Avanzate',
        description: 'Padroneggiare combinazioni di colpi fluide e dinamiche',
        difficulty: 2,
        gifUrl: '/gif/skills/aerobox-kombos.gif',
        instructions: [
          'Crea sequenze di 6-8 colpi in successione',
          'Aggiungi schivate e spostamenti laterali',
          'Alterna alta e bassa intensità (interval training)',
          'Mantieni l\'allenamento per 20-30 minuti',
          'Incorpora esercizi di core tra le sequenze'
        ],
        tips: [
          'Immagina di colpire un avversario per migliorare la tecnica',
          'Aumenta gradualmente la velocità mantenendo la forma corretta',
          'Usa un timer per intervalli di 2 minuti di attività e 30 secondi di recupero'
        ],
        estimatedTimeToMaster: '3 settimane'
      },
      {
        id: 'aerobox-resistance',
        name: 'Resistenza e Potenza',
        description: 'Sviluppare resistenza cardiovascolare e potenza nei colpi',
        difficulty: 3,
        gifUrl: '/gif/skills/aerobox-resistance.gif',
        instructions: [
          'Aumenta la durata delle sessioni a 45-60 minuti',
          'Utilizza piccoli pesi alle mani (0.5-1kg) per alcuni round',
          'Incorpora round di shadowboxing ad alta intensità',
          'Aggiungi esercizi esplosivi come burpees tra le sequenze',
          'Mantieni la frequenza cardiaca elevata per periodi più lunghi'
        ],
        tips: [
          'Monitora la frequenza cardiaca per rimanere nella zona target',
          'Idratati adeguatamente durante tutta la sessione',
          'L\'aerobox completo combina cardio, forza e coordinazione'
        ],
        estimatedTimeToMaster: '3 settimane'
      }
    ]
  },
  {
    id: 'handstand',
    name: 'Verticale',
    category: 'calisthenics',
    description: 'Impara a fare la verticale contro un muro fino a raggiungere la verticale libera',
    coverImage: '/images/skills/handstand-cover.jpg',
    iconUrl: '/icons/handstand.png',
    finalVideo: '/videos/skills/handstand-final.mp4',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '3-6 mesi',
    prerequisites: ['Forza base nelle spalle', 'Buona mobilità delle spalle'],
    steps: [
      {
        id: 'handstand-wall-plank',
        name: 'Wall Plank',
        description: 'Posizione di plank con i piedi appoggiati al muro, creando un angolo di circa 45° con il suolo',
        difficulty: 1,
        gifUrl: '/gif/skills/handstand-wall-plank.gif',
        instructions: [
          'Mettiti in posizione di plank rivolto verso il pavimento',
          'Cammina con i piedi sul muro fino a creare un angolo di circa 45°',
          'Mantieni la posizione per 30-60 secondi',
          'Ripeti 3-5 volte'
        ],
        tips: ['Mantieni gli addominali contratti', 'Spingi attivamente attraverso le spalle'],
        estimatedTimeToMaster: '1-2 settimane'
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
        tips: [
          'Concentrati sulla velocità e potenza nella parte superiore del movimento',
          'Mantieni il core contratto durante tutto l\'esercizio',
          'Riposa adeguatamente tra le serie per massimizzare la potenza'
        ],
        estimatedTimeToMaster: '2-3 settimane'
      }
    ]
  },
  {
    id: 'bench-press-100kg',
    name: 'Panca Piana 100kg',
    category: 'powerlifting',
    description: 'Progressione per arrivare a sollevare 100kg nella panca piana',
    coverImage: '/images/skills/bench-press-cover.jpg',
    iconUrl: '/icons/strength.png',
    finalVideo: '/videos/skills/bench-press-final.mp4',
    difficultyLevel: 3,
    estimatedTimeToAchieve: '6-12 mesi',
    prerequisites: ['Esperienza base con i pesi', 'Tecnica corretta di panca piana'],
    steps: [
      {
        id: 'bench-press-form',
        name: 'Tecnica di Base',
        description: 'Padroneggiare la corretta tecnica della panca piana',
        difficulty: 1,
        gifUrl: '/gif/skills/bench-press-form.gif',
        instructions: [
          'Sdraiati sulla panca con i piedi ben piantati a terra',
          'Impugna il bilanciere con una presa leggermente più ampia delle spalle',
          'Abbassa il bilanciere in modo controllato fino al petto',
          'Spingi verso l\'alto fino a estendere completamente le braccia',
          'Concentrati sulla corretta attivazione dei pettorali'
        ],
        tips: [
          'Mantieni sempre le scapole retratte e "in tasca"',
          'Non rimbalzare il bilanciere sul petto',
          'Mantieni i glutei a contatto con la panca durante tutto il movimento'
        ],
        estimatedTimeToMaster: '2-3 settimane'
      }
    ]
  },
  {
    id: 'muscle-up',
    name: 'Muscle Up',
    category: 'calisthenics',
    description: 'Padroneggia il muscle up, un movimento avanzato che combina pull-up e dip in un unico fluido esercizio',
    coverImage: '/images/skills/muscle-up-cover.jpg',
    iconUrl: '/icons/muscleup.png',
    finalVideo: '/videos/skills/muscle-up-final.mp4',
    difficultyLevel: 5,
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
          'Impugnare la sbarra con una presa leggermente più larga delle spalle',
          'Iniziare la pull-up in modo normale',
          'Accelerare il movimento nella fase di trazione',
          'Cercare di portare il petto il più in alto possibile verso la sbarra',
          'Eseguire 3 serie da 5-8 ripetizioni'
        ],
        tips: [
          'Concentrati sulla velocità e potenza nella parte superiore del movimento',
          'Mantieni il core contratto durante tutto l\'esercizio',
          'Riposa adeguatamente tra le serie per massimizzare la potenza'
        ],
        estimatedTimeToMaster: '2-3 settimane'
      },
      {
        id: 'muscle-up-transition',
        name: 'Transizione',
        description: 'Allenare specificamente la fase di transizione del muscle up',
        difficulty: 3,
        gifUrl: '/gif/skills/muscle-up-transition.gif',
        instructions: [
          'Esegui una pull-up esplosiva',
          'Quando il petto raggiunge la sbarra, ruota i polsi',
          'Porta i gomiti sopra la sbarra',
          'Esegui lentamente questa fase con aiuto se necessario'
        ],
        tips: [
          'All\'inizio è normale utilizzare un po\' di slancio (kipping)',
          'Puoi usare elastici o aiuto di un partner per questa fase',
          'Concentrati sulla rotazione dei polsi nel momento giusto'
        ],
        estimatedTimeToMaster: '3-4 settimane'
      }
    ]
  },
  {
    id: 'run-5km',
    name: 'Correre 5km',
    category: 'cardio',
    description: 'Programma di allenamento per arrivare a correre 5km senza fermarsi',
    coverImage: '/images/skills/run-5km-cover.jpg',
    iconUrl: '/icons/running.png',
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
          'L\'obiettivo è ridurre gradualmente le pause fino a eliminarle completamente',
          'Defaticamento: cammina per 5 minuti alla fine'
        ],
        tips: [
          'Monitora il tuo progresso con un\'app di corsa',
          'Concentrati sul mantenere un ritmo costante piuttosto che sulla velocità',
          'Presta attenzione alla tua postura durante la corsa'
        ],
        estimatedTimeToMaster: '3 settimane'
      }
    ]
  },
  {
    id: 'handstand-push-up',
    name: 'Handstand Push Up',
    category: 'calisthenics',
    description: 'Padroneggia il push up in verticale, un esercizio avanzato per spalle e tricipiti.',
    coverImage: '/images/skills/handstand-pushup-cover.jpg',
    iconUrl: '/icons/handstand.png',
    finalVideo: '/videos/skills/handstand-pushup-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '6-12 mesi',
    prerequisites: ['Forza nelle spalle', 'Capacità di mantenere la verticale contro il muro'],
    steps: [
      {
        id: 'pike-push-up',
        name: 'Pike Push Up',
        description: 'Inizia con il pike push up per sviluppare la forza di base necessaria per sbloccare il livello successivo',
        difficulty: 1,
        gifUrl: '/gif/skills/pike-pushup.gif',
        instructions: [
          'Posizionati in una posizione a "V" invertita, con glutei in alto',
          'Piega i gomiti per abbassare la testa verso il pavimento',
          'Spingi verso l\'alto per tornare alla posizione di partenza',
          'Fai 3 serie da 8-12 ripetizioni'
        ],
        tips: ['Mantieni gli addominali contratti', 'Concentrati sulla forza delle spalle'],
        estimatedTimeToMaster: '2-3 settimane'
      },
      {
        id: 'adv-pike-push-up',
        name: 'Advanced Pike Push Up',
        description: 'Progredisci verso il pike push up avanzato per sviluppare ulteriore forza e sbloccare il livello successivo',
        difficulty: 2,
        gifUrl: '/gif/skills/adv-pike-pushup.gif',
        instructions: [
          'Posizionati in una posizione a "V" invertita, con i piedi elevati su una sedia o panca',
          'Piega i gomiti per abbassare la testa verso il pavimento',
          'Spingi verso l\'alto per tornare alla posizione di partenza',
          'Fai 3 serie da 6-10 ripetizioni'
        ],
        tips: ['Mantieni la schiena dritta', 'Più alti sono i piedi, più difficile sarà l\'esercizio'],
        estimatedTimeToMaster: '3-4 settimane'
      },
      {
        id: 'wall-handstand-push-up',
        name: 'Wall Handstand Push Up',
        description: 'Avanza verso il push up in verticale contro il muro per sbloccare il livello successivo',
        difficulty: 3,
        gifUrl: '/gif/skills/wall-handstand-pushup.gif',
        instructions: [
          'Posizionati in verticale contro il muro',
          'Piega lentamente i gomiti per abbassare la testa verso il pavimento',
          'Spingi verso l\'alto per tornare alla posizione di partenza',
          'Fai 3 serie da 3-5 ripetizioni'
        ],
        tips: ['Mantieni il corpo allineato', 'Usa un cuscino sotto la testa per sicurezza'],
        estimatedTimeToMaster: '4-6 settimane'
      },
      {
        id: 'neg-handstand-push-up',
        name: 'Negative Handstand Push Up',
        description: 'Progredisci verso il push up in verticale negativo per sbloccare il livello finale',
        difficulty: 4,
        gifUrl: '/gif/skills/neg-handstand-pushup.gif',
        instructions: [
          'Posizionati in verticale contro il muro',
          'Abbassati lentamente verso il pavimento, controllando la discesa',
          'Usa le gambe per tornare alla posizione di partenza',
          'Fai 3 serie da 3-5 ripetizioni'
        ],
        tips: ['Concentrati sulla fase negativa (discesa)', 'Mantieni il controllo durante tutto il movimento'],
        estimatedTimeToMaster: '4-6 settimane'
      },
      {
        id: 'full-handstand-push-up',
        name: 'Full Handstand Push Up',
        description: 'Padroneggia il push up in verticale completo per raggiungere l\'obiettivo finale',
        difficulty: 5,
        gifUrl: '/gif/skills/full-handstand-pushup.gif',
        instructions: [
          'Posizionati in verticale contro il muro',
          'Abbassati fino a toccare il pavimento con la testa',
          'Spingi verso l\'alto per tornare alla posizione di partenza senza aiuto',
          'Fai 3 serie da 2-3 ripetizioni'
        ],
        tips: ['Mantieni il corpo rigido e allineato', 'Respira correttamente durante l\'esercizio'],
        estimatedTimeToMaster: '6-8 settimane'
      }
    ]
  },
  {
    id: 'run-10km',
    name: 'Correre 10km',
    category: 'cardio',
    description: 'Programma di allenamento per arrivare a correre 10km senza fermarsi',
    coverImage: '/images/skills/run-10km-cover.jpg',
    iconUrl: '/icons/running.png',
    finalVideo: '/videos/skills/run-10km-final.mp4',
    difficultyLevel: 2,
    estimatedTimeToAchieve: '12 settimane',
    prerequisites: ['Buona salute generale', 'Scarpe da corsa adeguate'],
    steps: [
      {
        id: 'run-walk-intervals-10k',
        name: 'Alternanza Corsa/Camminata',
        description: 'Allenamento con alternanza tra corsa e camminata per costruire resistenza',
        difficulty: 1,
        gifUrl: '/gif/skills/run-walk-intervals.gif',
        instructions: [
          'Cammina per 5 minuti come riscaldamento',
          'Corri per 2 minuti, poi cammina per 1 minuto',
          'Ripeti questa alternanza per un totale di 20-30 minuti',
          'Aumenta gradualmente il tempo di corsa e riduci quello di camminata',
          'Esegui questo allenamento 3-4 volte a settimana'
        ],
        tips: [
          'Mantieni un ritmo sostenibile durante la corsa',
          'Usa un orologio o un\'app per monitorare gli intervalli',
          'Concentrati sulla respirazione regolare'
        ],
        estimatedTimeToMaster: '3 settimane'
      },
      {
        id: 'continuous-5km-run',
        name: 'Corsa Continua 5km',
        description: 'Costruire la resistenza per correre 5km senza fermarsi',
        difficulty: 2,
        gifUrl: '/gif/skills/continuous-5km-run.gif',
        instructions: [
          'Riscaldamento: cammina velocemente per 5 minuti',
          'Corri a ritmo lento ma costante, cercando di non fermarti',
          'Inizia con 2-3km e aumenta gradualmente la distanza',
          'L\'obiettivo è arrivare a correre 5km senza pause',
          'Defaticamento: cammina per 5 minuti alla fine'
        ],
        tips: [
          'Mantieni un ritmo conversazionale (dovresti poter parlare durante la corsa)',
          'Non preoccuparti della velocità, concentrati sulla distanza',
          'Bevi acqua prima e dopo l\'allenamento'
        ],
        estimatedTimeToMaster: '4 settimane'
      },
      {
        id: 'tempo-distance-progression',
        name: 'Progressione Tempo/Distanza',
        description: 'Incremento progressivo di tempo e distanza di corsa',
        difficulty: 3,
        gifUrl: '/gif/skills/tempo-distance-progression.gif',
        instructions: [
          'Una volta raggiunta la capacità di correre 5km, inizia ad aumentare gradualmente la distanza',
          'Aggiungi 1km alla tua corsa lunga settimanale',
          'Mantieni 2-3 corse settimanali più brevi (3-5km)',
          'Includi un allenamento di colline o intervalli una volta a settimana per migliorare la resistenza',
          'L\'obiettivo è arrivare a correre 8km in preparazione per i 10km'
        ],
        tips: [
          'Non aumentare il chilometraggio totale settimanale più del 10%',
          'Inserisci una settimana di recupero ogni 3-4 settimane, riducendo la distanza del 20-30%',
          'Mantieni un diario di allenamento per monitorare i progressi'
        ],
        estimatedTimeToMaster: '3 settimane'
      },
      {
        id: 'final-10km-run',
        name: '10km Completi',
        description: 'Completare una corsa continua di 10km',
        difficulty: 4,
        gifUrl: '/gif/skills/final-10km-run.gif',
        instructions: [
          'Riscaldamento: cammina e corri lentamente per 10 minuti',
          'Inizia a un ritmo più lento del solito per conservare energia',
          'Mantieni un passo costante per tutta la distanza',
          'Usa punti di riferimento per dividere mentalmente la corsa in sezioni gestibili',
          'Defaticamento: cammina per 5-10 minuti dopo aver completato la distanza'
        ],
        tips: [
          'Idratati adeguatamente prima, eventualmente durante e dopo la corsa',
          'Se necessario, è accettabile includere brevi pause di camminata',
          'Assicurati di aver mangiato adeguatamente 1-2 ore prima della corsa',
          'Celebra il traguardo raggiunto!'
        ],
        estimatedTimeToMaster: '2 settimane'
      }
    ]
  },
  {
    id: 'half-marathon',
    name: 'Mezza Maratona',
    category: 'cardio',
    description: 'Programma di allenamento per completare una mezza maratona (21,1km)',
    coverImage: '/images/skills/half-marathon-cover.jpg',
    iconUrl: '/icons/running.png',
    finalVideo: '/videos/skills/half-marathon-final.mp4',
    difficultyLevel: 3,
    estimatedTimeToAchieve: '16 settimane',
    prerequisites: ['Capacità di correre 10km', 'Esperienza di corsa di almeno 6 mesi'],
    steps: [
      {
        id: 'half-marathon-base',
        name: 'Costruzione Base',
        description: 'Rafforzare la base di resistenza fino a 10km con regolarità',
        difficulty: 1,
        gifUrl: '/gif/skills/half-marathon-base.gif',
        instructions: [
          'Corri 3-4 volte a settimana, con distanze variabili',
          'Una corsa lunga settimanale di 10km',
          'Due corse medie di 5-7km',
          'Una corsa breve/recupero di 3-5km',
          'Focus sulla costruzione di resistenza aerobica (zona 2 di frequenza cardiaca)'
        ],
        tips: [
          'Focus sulla regolarità e consistenza, non sulla velocità',
          'Aggiungi un giorno di cross-training (nuoto, ciclismo, yoga) per prevenire infortuni',
          'Introduci esercizi di rafforzamento per core e gambe 2 volte a settimana'
        ],
        estimatedTimeToMaster: '4 settimane'
      },
      {
        id: 'half-marathon-build',
        name: 'Costruzione Resistenza',
        description: 'Aumentare gradualmente la distanza della corsa lunga fino a 15km',
        difficulty: 2,
        gifUrl: '/gif/skills/half-marathon-build.gif',
        instructions: [
          'Aumenta la distanza della corsa lunga settimanale di 1-2km ogni settimana',
          'Mantieni le altre corse settimanali, aumentando leggermente anche la loro distanza',
          'Introduci un allenamento di colline o ripetute una volta a settimana per costruire forza',
          'L\'obiettivo è arrivare a correre 15km come corsa lunga',
          'Inserisci una settimana di recupero ogni 3 settimane'
        ],
        tips: [
          'Non aumentare la distanza settimanale totale più del 10%',
          'Porta con te acqua e eventualmente gel energetici per le corse più lunghe',
          'Cura particolarmente il recupero: sonno, alimentazione e stretching'
        ],
        estimatedTimeToMaster: '5 settimane'
      },
      {
        id: 'half-marathon-peak',
        name: 'Preparazione alla Distanza',
        description: 'Completare corse lunghe fino a 18km in preparazione per la mezza maratona',
        difficulty: 3,
        gifUrl: '/gif/skills/half-marathon-peak.gif',
        instructions: [
          'Porta la corsa lunga settimanale a 16-18km',
          'Continua con gli allenamenti di velocità o colline una volta a settimana',
          'Esegui un long run lento (1 minuto/km più lento del ritmo gara)',
          'Sperimenta con l\'alimentazione e l\'idratazione durante le corse lunghe',
          'Simula le condizioni di gara (orario, percorso, equipaggiamento)'
        ],
        tips: [
          'Inizia a pensare alla strategia di gara',
          'Prova le scarpe e l\'abbigliamento che userai il giorno della gara',
          'Impara a gestire il ritmo: inizia lento, finisci forte'
        ],
        estimatedTimeToMaster: '5 settimane'
      },
      {
        id: 'half-marathon-taper',
        name: 'Mezza Maratona Completa',
        description: 'Affinamento finale e completamento della mezza maratona',
        difficulty: 4,
        gifUrl: '/gif/skills/half-marathon-complete.gif',
        instructions: [
          'Riduci progressivamente il volume di allenamento nelle ultime 2 settimane (tapering)',
          'Mantieni alcune sessioni di intensità, ma riduci la durata',
          'Cura particolarmente idratazione, alimentazione e riposo',
          'Prepara un piano gara con ritmo obiettivo e strategia di alimentazione',
          'Completa la distanza di 21,1km in gara o in allenamento'
        ],
        tips: [
          'Dividi mentalmente la gara in sezioni: primi 5km, fino a metà, fino al 30km, ultimi 5km',
          'Non partire troppo veloce, è il più comune errore dei principianti',
          'Celebra il traguardo, indipendentemente dal tempo finale!',
          'Pianifica un adeguato recupero post-gara di 1-2 settimane'
        ],
        estimatedTimeToMaster: '2 settimane'
      }
    ]
  },
  {
    id: 'full-marathon',
    name: 'Maratona',
    category: 'cardio',
    description: 'Programma di allenamento per completare una maratona (42,2km)',
    coverImage: '/images/skills/full-marathon-cover.jpg',
    iconUrl: '/icons/running.png',
    finalVideo: '/videos/skills/full-marathon-final.mp4',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '20 settimane',
    prerequisites: ['Completamento di una mezza maratona', 'Esperienza di corsa di almeno 1 anno'],
    steps: [
      {
        id: 'marathon-base-building',
        name: 'Costruzione Base',
        description: 'Costruire una solida base di chilometraggio con focus sulla resistenza',
        difficulty: 1,
        gifUrl: '/gif/skills/marathon-base.gif',
        instructions: [
          'Corri 4-5 volte a settimana con un chilometraggio settimanale di 40-50km',
          'Long run settimanale di 15-18km',
          'Corse medie di 8-12km',
          'Una o due corse brevi/recupero di 5-8km',
          'Focus sulla costruzione di resistenza aerobica (zona 2 di frequenza cardiaca)'
        ],
        tips: [
          'Mantieni le corse a un ritmo facile e sostenibile',
          'Inserisci una settimana di scarico ogni 3-4 settimane',
          'Aggiungi 2-3 sessioni di forza a settimana per prevenire infortuni',
          'Cura l\'idratazione e l\'alimentazione anche fuori dagli allenamenti'
        ],
        estimatedTimeToMaster: '6 settimane'
      },
      {
        id: 'marathon-long-runs',
        name: 'Long Run Progressivi',
        description: 'Aumentare gradualmente la distanza delle corse lunghe settimanali',
        difficulty: 2,
        gifUrl: '/gif/skills/marathon-long-runs.gif',
        instructions: [
          'Aumenta il long run settimanale di 1-3km ogni settimana',
          'Alterna settimane con aumento della distanza e settimane di mantenimento',
          'Gradualmente aumenta la distanza di entrambe le sessioni',
          'Impara a correre in stato di affaticamento (la seconda corsa)',
          'Sperimenta diverse strategie di recupero tra le sessioni'
        ],
        tips: [
          'Esegui i long run a 30-90 secondi/km più lenti del ritmo maratona previsto',
          'Sperimenta con diversi gel, barrette e bevande per trovare ciò che funziona per te',
          'Allenati all\'ora del giorno in cui si svolgerà la maratona, quando possibile',
          'Presta attenzione ai segnali di affaticamento eccessivo o potenziali infortuni'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'marathon-specific',
        name: 'Allenamento Specifico',
        description: 'Incorporare elementi specifici per la maratona e simulazioni parziali',
        difficulty: 3,
        gifUrl: '/gif/skills/marathon-specific.gif',
        instructions: [
          'Esegui corse a ritmo maratona: sezioni di 8-16km al ritmo pianificato per la gara',
          'Incorpora allenamenti di "maratona progressiva": inizia lento e aumenta gradualmente il ritmo',
          'Esegui una simulazione di mezza maratona a ritmo gara',
          'Perfeziona la strategia di alimentazione e idratazione',
          'Mantieni il long run settimanale tra 25-32km'
        ],
        tips: [
          'Prova le precise scarpe, calze e abbigliamento che userai in gara',
          'Simula anche le condizioni meteo, se possibile (caldo, freddo, pioggia)',
          'Studia il percorso della maratona e simula dislivelli simili in allenamento',
          'Pratica strategie mentali per gestire i momenti difficili ("muro" dei 30km)'
        ],
        estimatedTimeToMaster: '4 settimane'
      },
      {
        id: 'marathon-taper',
        name: 'Maratona Day',
        description: 'Preparazione finale e completamento della maratona',
        difficulty: 4,
        gifUrl: '/gif/skills/marathon-taper.gif',
        instructions: [
          'Taper di 2-3 settimane: riduci volume ma mantieni alcune sessioni di intensità',
          'Prepara tutto l\'equipaggiamento e organizza le borse per le transizioni',
          'Crea un piano gara dettagliato per ogni disciplina e transizione',
          'Pianifica la strategia nutrizionale: cosa, quando e quanto',
          'Segui la regola "Nulla di nuovo il giorno della gara"'
        ],
        tips: [
          'Dividi la gara in piccoli traguardi consecutivi',
          'Mantieni la calma e adatta la strategia se necessario',
          'Ricorda di goderti l\'esperienza, specialmente sul rettilineo finale',
          'Quando senti "You are a marathoner" al traguardo, avrai raggiunto un traguardo straordinario!'
        ],
        estimatedTimeToMaster: '2 settimane'
      }
    ]
  },
  {
    id: 'ultra-marathon',
    name: 'Ultra Maratona',
    category: 'cardio',
    description: 'Programma di allenamento per completare una ultra maratona (50km+)',
    coverImage: '/images/skills/ultra-marathon-cover.jpg',
    iconUrl: '/icons/endurance.png',
    finalVideo: '/videos/skills/ultra-marathon-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '24 settimane',
    prerequisites: ['Completamento di almeno una maratona', 'Esperienza di corsa di 2+ anni'],
    steps: [
      {
        id: 'ultra-base-building',
        name: 'Costruzione Base di Ultra',
        description: 'Costruire una solida base di resistenza e familiarizzazione con l\'ambiente',
        difficulty: 1,
        gifUrl: '/gif/skills/ultra-base.gif',
        instructions: [
          'Corri 60-80km settimanali con almeno il 50% su terreni sabbiosi/sterrati',
          'Includi long run di 25-30km con zaino leggero (3-5kg)',
          'Inizia allenamenti di acclimatazione al caldo (sauna, allenamenti nelle ore più calde)',
          'Introduci allenamenti di forza specifici per gambe e core 2-3 volte a settimana',
          'Esegui sessioni di camminata veloce con zaino in salita'
        ],
        tips: [
          'Inizia a sperimentare con diverse calzature da trail/desert running',
          'Allenati con abbigliamento che usi in gara (protezione solare, ghette)',
          'Abituati a bere regolarmente anche se non hai sete',
          'Rafforza particolarmente caviglie e stabilizzatori'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'back-to-back-runs',
        name: 'Allenamenti Back-to-Back',
        description: 'Corse lunghe in giorni consecutivi per simulare la fatica dell\'ultra',
        difficulty: 2,
        gifUrl: '/gif/skills/back-to-back-runs.gif',
        instructions: [
          'Esegui corse lunghe in giorni consecutivi (es. 25km sabato + 15km domenica)',
          'Alterna weekend con back-to-back e weekend con singola corsa molto lunga',
          'Gradualmente aumenta la distanza di entrambe le sessioni',
          'Impara a correre in stato di affaticamento (la seconda corsa)',
          'Sperimenta diverse strategie di recupero tra le sessioni'
        ],
        tips: [
          'Il secondo giorno, parti estremamente lento e valuta come si sente il corpo',
          'Focus sul tempo di corsa più che sulla distanza esatta',
          'Pratica l\'alimentazione e idratazione come farai in gara',
          'Impara ad ascoltare il tuo corpo e adattare il passo'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'ultra-specific',
        name: 'Allenamento Specifico Ultra',
        description: 'Allenamenti specifici per le esigenze dell\'ultra maratona',
        difficulty: 3,
        gifUrl: '/gif/skills/ultra-specific.gif',
        instructions: [
          'Includi allenamenti di camminata veloce (anche in salita)',
          'Alterna corsa e camminata durante i long run (strategia per ultra)',
          'Esegui long run di 30-40km, o 5-7 ore di attività',
          'Pratica la risoluzione di problemi: vesciche, crampi, nausea',
          'Simula punti di ristoro e tempi di sosta durante gli allenamenti'
        ],
        tips: [
          'Diventa efficiente nel mangiare e bere mentre ti muovi',
          'Impara a gestire adeguatamente vesciche o irritazioni ai piedi',
          'Testa tutto l\'equipaggiamento in situazioni reali prima della gara',
          'Impara a riparare il tuo equipaggiamento (scarpe, zaino, etc.)'
        ],
        estimatedTimeToMaster: '6 settimane'
      },
      {
        id: 'peak-ultra-training',
        name: 'Picco e Gara Ultra',
        description: 'Preparazione finale e completamento dell\'ultra maratona',
        difficulty: 4,
        gifUrl: '/gif/skills/ultra-race.gif',
        instructions: [
          'Esegui 1-2 simulazioni di gara di 40-50km (70-80% della distanza target)',
          'Taper finale di 2-3 settimane con riduzione del volume',
          'Mantieni qualche corsa in salita anche durante il taper',
          'Prepara dettagliatamente strategia di gara, alimentazione e attrezzatura',
          'Prepara strategie mentali per superare i momenti difficili'
        ],
        tips: [
          'Dividi mentalmente l\'ultra in sezioni gestibili',
          'Ricorda che camminare in salita è una strategia, non una resa',
          'Pensa "da ristoro a ristoro" non all\'intera distanza',
          'Festeggia ogni ultra completata, indipendentemente dal tempo!'
        ],
        estimatedTimeToMaster: '4 settimane'
      }
    ]
  },
  {
    id: 'ironman-triathlon',
    name: 'Ironman',
    category: 'cardio',
    description: 'Programma di allenamento per completare un triathlon Ironman (3,9km nuoto, 180km bici, 42,2km corsa)',
    coverImage: '/images/skills/ironman-cover.jpg',
    iconUrl: '/icons/endurance.png',
    finalVideo: '/videos/skills/ironman-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '30 settimane',
    prerequisites: ['Esperienza in triathlon olimpico/half Ironman', 'Buone capacità di nuoto, ciclismo e corsa'],
    steps: [
      {
        id: 'ironman-base',
        name: 'Costruzione Base Multidisciplina',
        description: 'Costruire una solida base in tutte e tre le discipline',
        difficulty: 1,
        gifUrl: '/gif/skills/ironman-base.gif',
        instructions: [
          'Nuoto: 3 sessioni settimanali, focus sulla tecnica e resistenza (3-4km per sessione)',
          'Bici: 3 sessioni settimanali, focus su resistenza aerobica (2-3 ore)',
          'Corsa: 3 sessioni settimanali, costruzione chilometraggio (40-50km/settimana)',
          'Forza: 2 sessioni settimanali di condizionamento generale',
          'Includi alcune sessioni di transizioni (bici-corsa)'
        ],
        tips: [
          'Crea una routine sostenibile a lungo termine',
          'Focus sulla qualità in ogni disciplina',
          'Alternare giorni impegnativi e giorni di recupero',
          'Mantieni un diario di allenamento dettagliato'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'ironman-build',
        name: 'Sviluppo Specifico per Disciplina',
        description: 'Aumento progressivo di volume e intensità specifica per ciascuna disciplina',
        difficulty: 2,
        gifUrl: '/gif/skills/ironman-build.gif',
        instructions: [
          'Nuoto: Aggiungi sessioni in acque libere e lavoro sulla velocità',
          'Bici: Aumenta uscite lunghe (4-5 ore) e aggiungi lavoro in salita',
          'Corsa: Incrementa long run (2-2.5 ore) e includi sessioni di ritmo',
          'Introduci sessioni di "brick" più lunghe (bici seguita immediatamente da corsa)',
          'Sperimenta con nutrizione da gara durante gli allenamenti più lunghi'
        ],
        tips: [
          'Lavora sui tuoi punti deboli in modo specifico',
          'Usa il trainer bici indoor per sessioni di qualità in sicurezza',
          'Simula condizioni di gara quando possibile',
          'Mantieni un approccio equilibrato tra le tre discipline'
        ],
        estimatedTimeToMaster: '10 settimane'
      },
      {
        id: 'ironman-brick',
        name: 'Allenamenti Combinati (Brick)',
        description: 'Sessioni specifiche che combinano discipline multiple',
        difficulty: 3,
        gifUrl: '/gif/skills/ironman-brick.gif',
        instructions: [
          'Esegui un "brick" completo settimanale (nuoto-bici-corsa in sequenza)',
          'Alterna brick lunghi e brick corti ad alta intensità',
          'Pratica le transizioni come farai in gara',
          'Simula l\'alimentazione e idratazione da gara durante i brick',
          'Includi sessioni di nuoto in acque libere quando possibile'
        ],
        tips: [
          'Focus sulle sensazioni delle gambe dopo la bici',
          'Perfeziona la tua strategia nutrizionale durante i long workout',
          'Prepara mentalmente le fasi difficili (ultimi 10km di corsa)',
          'Riposa adeguatamente dopo i workout più impegnativi'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'ironman-peak',
        name: 'Half Ironman di Preparazione',
        description: 'Completare un half Ironman come test e preparazione finale',
        difficulty: 4,
        gifUrl: '/gif/skills/ironman-half.gif',
        instructions: [
          'Completa un half Ironman 8-10 settimane prima dell\'Ironman completo',
          'Usa la gara come test per equipaggiamento e strategia nutrizionale',
          'Valuta ritmo e gestione dello sforzo nelle tre discipline',
          'Recupera completamente prima di riprendere gli allenamenti intensi',
          'Adatta gli ultimi mesi di allenamento in base ai feedback della gara'
        ],
        tips: [
          'Non cercare la performance massima, ma una gara controllata',
          'Prendi nota di ciò che funziona e cosa migliorare',
          'Usa la gara per costruire fiducia',
          'Concentrati sul processo più che sul risultato'
        ],
        estimatedTimeToMaster: '2 settimane'
      },
      {
        id: 'ironman-taper',
        name: 'Ironman Day',
        description: 'Preparazione finale e completamento dell\'Ironman',
        difficulty: 5,
        gifUrl: '/gif/skills/ironman-final.gif',
        instructions: [
          'Taper di 2-3 settimane: riduci volume ma mantieni alcune sessioni di intensità',
          'Prepara tutto l\'equipaggiamento e organizza le borse per le transizioni',
          'Crea un piano gara dettagliato per ogni disciplina e transizione',
          'Pianifica la strategia nutrizionale: cosa, quando e quanto',
          'Segui la regola "Nulla di nuovo il giorno della gara"'
        ],
        tips: [
          'Dividi la gara in piccoli traguardi consecutivi',
          'Mantieni la calma e adatta la strategia se necessario',
          'Ricorda di goderti l\'esperienza, specialmente sul rettilineo finale',
          'Quando senti "You are an Ironman" al traguardo, avrai raggiunto un traguardo straordinario!'
        ],
        estimatedTimeToMaster: '2 settimane'
      }
    ]
  },
  {
    id: 'marathon-des-sables',
    name: 'Marathon des Sables',
    category: 'cardio',
    description: 'Programma di allenamento per completare la Marathon des Sables, una ultra maratona di 250km nel deserto del Sahara',
    coverImage: '/images/skills/marathon-des-sables-cover.jpg',
    iconUrl: '/icons/endurance.png',
    finalVideo: '/videos/skills/marathon-des-sables-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '36 settimane',
    prerequisites: ['Esperienza con ultramaratone', 'Buona resistenza al caldo e alla fatica'],
    steps: [
      {
        id: 'mds-base',
        name: 'Costruzione Base per MdS',
        description: 'Costruire una solida base di resistenza e familiarizzazione con l\'ambiente',
        difficulty: 1,
        gifUrl: '/gif/skills/mds-base.gif',
        instructions: [
          'Corri 60-80km settimanali con almeno il 50% su terreni sabbiosi/sterrati',
          'Includi long run di 25-30km con zaino leggero (3-5kg)',
          'Inizia allenamenti di acclimatazione al caldo (sauna, allenamenti nelle ore più calde)',
          'Introduci allenamenti di forza specifici per gambe e core 2-3 volte a settimana',
          'Esegui sessioni di camminata veloce con zaino in salita'
        ],
        tips: [
          'Inizia a sperimentare con diverse calzature da trail/desert running',
          'Allenati con abbigliamento che usi in gara (protezione solare, ghette)',
          'Abituati a bere regolarmente anche se non hai sete',
          'Rafforza particolarmente caviglie e stabilizzatori'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'mds-heat-adaptation',
        name: 'Adattamento Ambientale',
        description: 'Migliorare l\'adattamento al caldo e all\'equipaggiamento',
        difficulty: 2,
        gifUrl: '/gif/skills/mds-heat.gif',
        instructions: [
          'Intensifica gli allenamenti in condizioni di caldo (sauna post-allenamento, strati extra)',
          'Aumenta il peso dello zaino nei long run (6-8kg)',
          'Esegui back-to-back runs lunghi con zaino (es. 30km + 20km in giorni consecutivi)',
          'Pratica la gestione della sabbia (uso ghette, calze anti-sabbia)',
          'Inizia a testare il cibo disidratato/liofilizzato che userai in gara'
        ],
        tips: [
          'L\'adattamento al caldo richiede 10-14 giorni di esposizione costante',
          'Monitora la tua sudorazione e idratazione',
          'Sperimenta con elettroliti e integratori salini',
          'Allena la camminata efficiente, fondamentale per il deserto'
        ],
        estimatedTimeToMaster: '10 settimane'
      },
      {
        id: 'mds-self-sufficiency',
        name: 'Autosufficienza e Equipaggiamento',
        description: 'Padroneggiare l\'autosufficienza e l\'equipaggiamento per il deserto',
        difficulty: 3,
        gifUrl: '/gif/skills/mds-equipment.gif',
        instructions: [
          'Esegui sessioni lunghe (6-8 ore) con tutto l\'equipaggiamento di gara',
          'Perfeziona il tuo zaino, riducendo il peso ma mantenendo l\'essenziale',
          'Pratica il razionamento dell\'acqua durante gli allenamenti',
          'Esegui un long run notturno con equipaggiamento completo',
          'Simula la preparazione del cibo come in gara dopo lunghe sessioni'
        ],
        tips: [
          'Ogni grammo conta: rivedi ripetutamente il tuo equipaggiamento',
          'Sperimenta la routine di cura dei piedi (prevenzione vesciche)',
          'Testa tutto l\'equipaggiamento in situazioni reali prima della gara',
          'Impara a riparare il tuo equipaggiamento (scarpe, zaino, etc.)'
        ],
        estimatedTimeToMaster: '12 settimane'
      },
      {
        id: 'mds-simulation',
        name: 'Simulazione Gara',
        description: 'Preparazione finale e strategie di gara',
        difficulty: 4,
        gifUrl: '/gif/skills/mds-simulation.gif',
        instructions: [
          'Completa un weekend di simulazione: 3 giorni consecutivi con 25-30-20km',
          'Usa esattamente l\'equipaggiamento, cibo e abbigliamento di gara',
          'Perfeziona gestione energetica, passo e strategia giornaliera',
          'Pratica la gestione quotidiana dei piedi e delle piccole problematiche',
          'Taper finale di 2-3 settimane con focus su recupero e acclimatazione'
        ],
        tips: [
          'Prepara una checklist dettagliata pre-partenza',
          'Rivedi e memorizza il regolamento di gara',
          'Prepara strategie mentali per i momenti difficili',
          'Ricorda: terminare la Marathon des Sables è un\'impresa straordinaria in sé'
        ],
        estimatedTimeToMaster: '6 settimane'
      }
    ]
  },
  {
    id: 'antarctic-ice-marathon',
    name: 'Antarctic Ice Marathon',
    category: 'cardio',
    description: 'Programma di allenamento per completare una maratona in Antartide a -20°C',
    coverImage: '/images/skills/antarctic-marathon-cover.jpg',
    iconUrl: '/icons/endurance.png',
    finalVideo: '/videos/skills/antarctic-marathon-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '36 settimane',
    prerequisites: ['Esperienza di maratona', 'Buona resistenza al freddo e alle condizioni estreme'],
    steps: [
      {
        id: 'cold-adaptation',
        name: 'Adattamento al Freddo',
        description: 'Sviluppare resistenza alle basse temperature e condizioni fredde',
        difficulty: 1,
        gifUrl: '/gif/skills/antarctic-cold.gif',
        instructions: [
          'Allenati in condizioni fredde quanto più possibile (inverno, prime ore del mattino)',
          'Includi sessioni di allenamento con indumenti a strati multipli',
          'Esegui sessioni di corsa su neve/ghiaccio quando disponibili',
          'Pratica il controllo della respirazione in ambienti freddi',
          'Svolgi allenamenti alternati in ambienti caldi/freddi per migliorare l\'adattabilità'
        ],
        tips: [
          'Inizia la pratica di vestirsi a strati correttamente',
          'Allenati anche in condizioni di vento/pioggia per abituarti al disagio',
          'Usa gli acquazzoni e le intemperie come opportunità di allenamento',
          'Applica vasellina su faccia e parti esposte durante gli allenamenti freddi'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'snow-running-technique',
        name: 'Tecnica di Corsa su Neve',
        description: 'Sviluppare tecnica e forza specifiche per correre su neve e ghiaccio',
        difficulty: 2,
        gifUrl: '/gif/skills/antarctic-technique.gif',
        instructions: [
          'Pratica la corsa sulla neve con passi più corti e frequenti',
          'Sviluppa forza nelle caviglie e nei muscoli stabilizzatori',
          'Allenati con scarpe chiodate o con trazione migliorata su ghiaccio',
          'Includi esercizi di equilibrio su superfici instabili',
          'Esegui allenamenti con pesi/zaino per simulare gli strati di abbigliamento'
        ],
        tips: [
          'Focus sulla postura e sull\'atterraggio a piede piatto/mediopiede',
          'Pratica la corsa a piedi asciutti (evita infiltrazioni di neve)',
          'Sviluppa forza nella parte superiore del corpo per il bilanciamento',
          'Allena la percezione del terreno anche con calzature ingombranti'
        ],
        estimatedTimeToMaster: '10 settimane'
      },
      {
        id: 'cold-equipment',
        name: 'Gestione Equipaggiamento Estremo',
        description: 'Padroneggiare l\'utilizzo dell\'equipaggiamento per il freddo estremo',
        difficulty: 3,
        gifUrl: '/gif/skills/antarctic-equipment.gif',
        instructions: [
          'Sperimenta e seleziona il sistema di abbigliamento a strati ottimale',
          'Pratica vestirsi e gestire i micro-aggiustamenti durante la corsa',
          'Testa diversi sistemi di copertura per viso, mani e piedi',
          'Simula la gestione dell\'idratazione in condizioni di congelamento',
          'Pratica manovre semplici (aprire zaino, prendere cibo) con guanti spessi'
        ],
        tips: [
          'La chiave è un sistema di strati che permetta la regolazione fine',
          'Previeni la sudorazione eccessiva che poi ghiaccia (ventilazione)',
          'Testa tutto l\'equipaggiamento in situazioni reali prima della gara',
          'Impara a riconoscere i primi segnali di congelamento e ipotermia'
        ],
        estimatedTimeToMaster: '12 settimane'
      },
      {
        id: 'antarctic-simulation',
        name: 'Simulazione e Resistenza Mentale',
        description: 'Preparazione finale fisica e mentale per l\'Antarctic Ice Marathon',
        difficulty: 4,
        gifUrl: '/gif/skills/antarctic-mental.gif',
        instructions: [
          'Completa almeno una maratona completa con equipaggiamento parziale da freddo',
          'Esegui sessioni in camera fredda (se disponibile) o in condizioni naturali estreme',
          'Pratica tecniche di visualizzazione e resistenza mentale',
          'Preparati alla solitudine e monotonia visiva dell\'Antartide',
          'Simula problemi (guanto perso, bevanda ghiacciata) e pratica le soluzioni'
        ],
        tips: [
          'Crea una mentalità di resilienza: "posso resistere a qualsiasi cosa per X ore"',
          'Sviluppa mantras e strategie di coping per i momenti difficili',
          'Ricorda: in Antartide sei completamente dipendente dal tuo equipaggiamento',
          'Completare l\'Antarctic Ice Marathon è una delle imprese più rare al mondo!'
        ],
        estimatedTimeToMaster: '6 settimane'
      }
    ]
  },
  {
    id: 'spartan-race',
    name: 'Spartan Race',
    category: 'cardio',
    description: 'Programma di allenamento per completare una Spartan Race con tutti gli ostacoli',
    coverImage: '/images/skills/spartan-race-cover.jpg',
    iconUrl: '/icons/strength.png',
    finalVideo: '/videos/skills/spartan-race-final.mp4',
    difficultyLevel: 4,
    estimatedTimeToAchieve: '16 settimane',
    prerequisites: ['Buona base di fitness generale', 'Capacità di correre 5-10km'],
    steps: [
      {
        id: 'spartan-conditioning',
        name: 'Condizionamento Base',
        description: 'Costruire la base di forza e resistenza necessaria per una Spartan Race',
        difficulty: 1,
        gifUrl: '/gif/skills/spartan-conditioning.gif',
        instructions: [
          'Corri 3-4 volte a settimana, alternando distanze (5-8km) e terreni',
          'Esegui 2-3 allenamenti settimanali di forza funzionale',
          'Includi esercizi di base: squat, affondi, trazioni, flessioni, plank',
          'Aggiungi circuit training ad alta intensità (HIIT) 1-2 volte a settimana',
          'Inizia a sviluppare la presa con esercizi specifici per avambracci e mani'
        ],
        tips: [
          'Corri su terreni misti: sterrato, colline, scale quando possibile',
          'Svolgi allenamenti anche con condizioni meteo avverse',
          'Inizia a rafforzare le spalle e la schiena per gli ostacoli di arrampicata',
          'Usa il peso corporeo prima di aggiungere carichi esterni'
        ],
        estimatedTimeToMaster: '4 settimane'
      },
      {
        id: 'spartan-obstacles',
        name: 'Allenamento Specifico Ostacoli',
        description: 'Sviluppare le abilità tecniche necessarie per superare gli ostacoli',
        difficulty: 2,
        gifUrl: '/gif/skills/spartan-obstacles.gif',
        instructions: [
          'Pratica arrampicate su corda e muro con tecniche specifiche',
          'Esegui allenamenti di trasporto con carichi (secchi d\'acqua, sacchi di sabbia)',
          'Allena il lancio del giavellotto e tecniche di mira',
          'Sviluppa abilità di equilibrio su superfici instabili',
          'Perfeziona tecniche di arrampicata e superamento ostacoli'
        ],
        tips: [
          'Cerca parchi con strutture per calisthenics per simulare ostacoli',
          'Usa playground o parchi avventura per praticare tecniche specifiche',
          'Impara a modulare la forza durante gli ostacoli per non esaurirti',
          'Costruisci resistenza nella presa con hanging holds e farmer walks'
        ],
        estimatedTimeToMaster: '6 settimane'
      },
      {
        id: 'spartan-intensity',
        name: 'Allenamento ad Alta Intensità',
        description: 'Sviluppare la capacità di gestire l\'intensità e il lattato durante la gara',
        difficulty: 3,
        gifUrl: '/gif/skills/spartan-intensity.gif',
        instructions: [
          'Esegui interval training con alta intensità seguiti da sfide di ostacoli',
          'Crea circuiti che simulano la sequenza corsa-ostacolo-corsa',
          'Includi allenamenti "Death by Burpees" (aumentando progressivamente)',
          'Allenati in condizioni di fatica per simulare la gara',
          'Incrementa la durata degli allenamenti fino a superare il tempo previsto di gara'
        ],
        tips: [
          'I burpees sono la penalità per gli ostacoli falliti: allenali molto',
          'Simula la fatica delle braccia prima di affrontare ostacoli di arrampicata',
          'Allena l\'abilità di recuperare velocemente tra gli sforzi intensi',
          'Impara a modulare l\'intensità e a gestire le energie durante tutto il percorso'
        ],
        estimatedTimeToMaster: '4 settimane'
      },
      {
        id: 'spartan-race-simulation',
        name: 'Simulazione Gara',
        description: 'Preparazione finale e strategie di gara',
        difficulty: 4,
        gifUrl: '/gif/skills/spartan-race-simulation.gif',
        instructions: [
          'Completa una simulazione di gara con tutti gli elementi possibili',
          'Perfeziona la strategia nutrizionale durante lo sforzo prolungato',
          'Pratica la gestione del terreno fangoso e bagnato',
          'Definisci la strategia per ogni tipologia di ostacolo',
          'Prepara mentalmente le penalizzazioni (30 burpees) in caso di fallimento'
        ],
        tips: [
          'Scegli abbigliamento e calzature adeguati: leggeri, che non trattengono acqua',
          'Risparmia energia negli ostacoli che sai padroneggiare',
          'Ricorda: è meglio rallentare e completare un ostacolo che fallire e fare burpees',
          'Preparati mentalmente: la Spartan Race è tanto mentale quanto fisica!'
        ],
        estimatedTimeToMaster: '2 settimane'
      }
    ]
  },
  {
    id: 'seven-marathons',
    name: '7 Maratone in 7 Giorni',
    category: 'cardio',
    description: 'Programma di allenamento per completare 7 maratone in 7 giorni consecutivi su 7 diversi continenti',
    coverImage: '/images/skills/seven-marathons-cover.jpg',
    iconUrl: '/icons/elite.png',
    finalVideo: '/videos/skills/seven-marathons-final.mp4',
    difficultyLevel: 5,
    estimatedTimeToAchieve: '52 settimane',
    prerequisites: ['Esperienza con almeno 5 maratone', 'Capacità di recupero eccellente'],
    steps: [
      {
        id: 'ultra-endurance-base',
        name: 'Base di Ultra-Endurance',
        description: 'Costruire una solida base di resistenza ultra e capacità di recupero',
        difficulty: 1,
        gifUrl: '/gif/skills/seven-marathons-base.gif',
        instructions: [
          'Corri 80-100km settimanali con long run di 30-35km',
          'Esegui sessioni di back-to-back long runs (es. 25km sabato + 25km domenica)',
          'Includi allenamenti di recupero attivo e sviluppa tecniche di recupero veloce',
          'Costruisci una base muscolare robusta con allenamenti di forza specifici',
          'Sviluppa una forte base aerobica con lunghe sessioni a bassa intensità'
        ],
        tips: [
          'Costruisci gradualmente il volume, dando priorità alla consistenza',
          'Sperimenta con diverse tecniche di recupero: compressione, bagni freddi, massaggi',
          'Padroneggia l\'alimentazione durante lo sforzo prolungato',
          'Sviluppa una mentalità di "run today knowing you run tomorrow"'
        ],
        estimatedTimeToMaster: '16 settimane'
      },
      {
        id: 'back-to-back-marathons',
        name: 'Maratone Consecutive',
        description: 'Sviluppare la capacità di correre maratone in giorni consecutivi',
        difficulty: 2,
        gifUrl: '/gif/skills/back-to-back-marathons.gif',
        instructions: [
          'Inizia con weekend di doppia lunga distanza (30km sabato + 25km domenica)',
          'Progressivamente aumenta fino a due maratone complete in un weekend',
          'Perfeziona la strategia di alimentazione e idratazione tra gli eventi',
          'Sviluppa protocolli di recupero efficaci tra le maratone',
          'Allenati a correre in condizioni di fatica accumulata'
        ],
        tips: [
          'La chiave è il recupero tra gli eventi, non la velocità',
          'Sperimenta con diverse strategie di pacing per giorni consecutivi',
          'Dai massima priorità al riposo e all\'alimentazione tra le maratone',
          'Monitora attentamente i segnali di sovrallenamento o infortuni'
        ],
        estimatedTimeToMaster: '12 settimane'
      },
      {
        id: 'multi-day-recovery',
        name: 'Recupero Multi-Giorno',
        description: 'Padroneggiare le strategie di recupero e gestione per eventi multi-giorno',
        difficulty: 3,
        gifUrl: '/gif/skills/multi-day-recovery.gif',
        instructions: [
          'Completa una simulazione di 3-4 maratone in 3-4 giorni consecutivi',
          'Perfeziona le routine di recupero notturne e post-gara',
          'Sviluppa strategie per minimizzare l\'infiammazione muscolare',
          'Crea una routine di mobilità e stretching tra le maratone',
          'Pratica tecniche avanzate di recupero muscolare e mentale'
        ],
        tips: [
          'Concentrati sul sonno di qualità anche in condizioni difficili/jet lag',
          'Perfeziona la tua tecnica di corsa per minimizzare l\'impatto',
          'Sviluppa un mindset resistente per affrontare il dolore inevitabile',
          'Stabilisci una routine quotidiana precisa che funzioni in qualsiasi condizione'
        ],
        estimatedTimeToMaster: '12 settimane'
      },
      {
        id: 'climate-adaptation',
        name: 'Adattamento Climatico e Jet Lag',
        description: 'Preparazione per correre in diversi climi e gestire il jet lag',
        difficulty: 4,
        gifUrl: '/gif/skills/climate-adaptation.gif',
        instructions: [
          'Esegui allenamenti in diverse condizioni climatiche estreme (caldo, freddo, umidità)',
          'Sviluppa tecniche di gestione del jet lag e disturbi del sonno',
          'Crea strategie per ciascun continente e le sue specifiche condizioni',
          'Pratica la gestione dell\'equipaggiamento per climi diversi',
          'Prepara un piano dettagliato per l\'alimentazione e idratazione in ogni continente'
        ],
        tips: [
          'Usa sauna, bagni di ghiaccio e camere climatiche per simulare condizioni estreme',
          'Impara tecniche per indurre rapidamente il sonno e massimizzare il recupero',
          'Prepara piani alimentari specifici per ogni continente',
          'Ricorda: l\'adattamento mentale è importante quanto quello fisico'
        ],
        estimatedTimeToMaster: '8 settimane'
      },
      {
        id: 'seven-continents-challenge',
        name: 'La Sfida dei 7 Continenti',
        description: 'Esecuzione della sfida completa con preparazione logistica',
        difficulty: 5,
        gifUrl: '/gif/skills/seven-continents-challenge.gif',
        instructions: [
          'Pianifica dettagliatamente la logistica tra continenti (voli, trasporti, alloggi)',
          'Prepara strategie per minimizzare lo stress durante gli spostamenti',
          'Gestisci l\'equipaggiamento per tutti i climi in un bagaglio efficiente',
          'Sviluppa una mentalità "un giorno alla volta" per affrontare la sfida',
          'Crea un team di supporto per assistenza fisica e mentale durante la sfida'
        ],
        tips: [
          'Non esiste una preparazione perfetta per una sfida così estrema',
          'Sii flessibile e pronto ad adattare strategie e aspettative',
          'Il successo di questa sfida è tanto mentale quanto fisico',
          'Ricorda: completare 7 maratone in 7 giorni su 7 continenti è un\'impresa leggendaria!'
        ],
        estimatedTimeToMaster: '4 settimane'
      }
    ]
  },
];

// Helper per ottenere skill per categoria
export function getSkillsByCategory(category: 'calisthenics' | 'powerlifting' | 'cardio' | 'mobility'): SkillProgression[] {
  return skillProgressions.filter(skill => skill.category === category);
}

// Helper per ottenere una skill tramite id
export function getSkillProgressionById(id: string): SkillProgression | undefined {
  return skillProgressions.find(skill => skill.id === id);
}

// Helper per ottenere tutte le skill
export function getAllSkills(): SkillProgression[] {
  return skillProgressions;
}
