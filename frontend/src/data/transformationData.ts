import { Coach, TransformationService, TransformationPlan, LiveEvent } from '../types/transformation';

export const coaches: Coach[] = [
  {
    id: 'coach-1',
    name: 'Marco Bianchi',
    role: 'Personal Trainer',
    specialty: ['Calisthenics', 'Forza', 'Atletica'],
    bio: 'Ex atleta olimpico specializzato in ginnastica, Marco ha sviluppato metodologie di allenamento innovative basate sul peso corporeo e sulla biomeccanica avanzata.',
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.9,
    experience: 12
  },
  {
    id: 'coach-2',
    name: 'Laura Rossi',
    role: 'Nutrizionista',
    specialty: ['Nutrizione Sportiva', 'Diete Personalizzate', 'Integrazione'],
    bio: 'Laureata in Scienze della Nutrizione con specializzazione in nutrizione sportiva, Laura ha lavorato con atleti professionisti in diverse discipline.',
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.8,
    experience: 8
  },
  {
    id: 'coach-3',
    name: 'Alessio Verdi',
    role: 'Fisioterapista',
    specialty: ['Recupero Sportivo', 'Prevenzione Infortuni', 'Massoterapia'],
    bio: 'Specializzato in riabilitazione sportiva, Alessio ha lavorato con squadre di calcio di Serie A e atleti olimpici, sviluppando protocolli di recupero innovativi.',
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.7,
    experience: 10
  },
  {
    id: 'coach-4',
    name: 'Sofia Neri',
    role: 'Mental Coach',
    specialty: ['Gestione dello Stress', 'Motivazione', 'Performance Mentale'],
    bio: 'Psicologa dello sport con esperienza internazionale, Sofia ha aiutato centinaia di atleti a superare blocchi mentali e migliorare la concentrazione e la performance.',
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.8,
    experience: 7
  },
  {
    id: 'coach-5',
    name: 'Matteo Ferrari',
    role: 'Coach di Weightlifting',
    specialty: ['Powerlifting', 'Strappi', 'Slanci'],
    bio: 'Campione nazionale di sollevamento pesi, Matteo ha sviluppato un approccio unico alla tecnica che massimizza la forza minimizzando il rischio di infortuni.',
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.9,
    experience: 15
  }
];

export const services: TransformationService[] = [
  {
    id: 'service-1',
    name: 'Piano di Allenamento Personalizzato',
    category: 'training',
    description: 'Piano di allenamento su misura basato sui tuoi obiettivi, livello di fitness e disponibilità di tempo/attrezzature.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 79.99,
    duration: '4 settimane',
    coaches: ['coach-1', 'coach-5'],
    benefits: [
      'Programma dettagliato giorno per giorno',
      'Adattato alle tue esigenze specifiche',
      'Include progressioni e variazioni',
      'Video dimostrativi per ogni esercizio'
    ],
    isOnline: true,
    isLive: false,
    isSingleTime: true
  },
  {
    id: 'service-2',
    name: 'Sessione Live 1-1 con Personal Trainer',
    category: 'training',
    description: 'Sessione di allenamento in diretta con un personal trainer dedicato che ti guiderà attraverso esercizi personalizzati.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 49.99,
    duration: '60 minuti',
    coaches: ['coach-1', 'coach-5'],
    benefits: [
      'Feedback in tempo reale sulla tecnica',
      'Adattamento immediato in base alle tue capacità',
      'Motivazione diretta dal coach',
      'Risposte alle tue domande durante la sessione'
    ],
    isOnline: true,
    isLive: true,
    isSingleTime: true
  },
  {
    id: 'service-3',
    name: 'Piano Alimentare Personalizzato',
    category: 'nutrition',
    description: 'Piano alimentare creato su misura per supportare i tuoi obiettivi di fitness e soddisfare le tue preferenze alimentari.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 89.99,
    duration: '4 settimane',
    coaches: ['coach-2'],
    benefits: [
      'Distribuzione ottimale di macro e micronutrienti',
      'Lista della spesa settimanale',
      'Suggerimenti per pasti pre e post allenamento',
      'Alternative per preferenze alimentari specifiche'
    ],
    isOnline: true,
    isLive: false,
    isSingleTime: true
  },
  {
    id: 'service-4',
    name: 'Consulenza Nutrizionale',
    category: 'nutrition',
    description: 'Sessione individuale con un nutrizionista per discutere obiettivi, abitudini e strategie alimentari.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 59.99,
    duration: '45 minuti',
    coaches: ['coach-2'],
    benefits: [
      'Analisi delle attuali abitudini alimentari',
      'Raccomandazioni personalizzate',
      'Strategie per superare ostacoli specifici',
      'Consigli su integratori se necessario'
    ],
    isOnline: true,
    isLive: true,
    isSingleTime: true
  },
  {
    id: 'service-5',
    name: 'Sessione di Massoterapia Sportiva',
    category: 'recovery',
    description: 'Trattamento di massaggio specializzato per atleti e sportivi, mirato al recupero e al miglioramento delle prestazioni.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 69.99,
    duration: '60 minuti',
    coaches: ['coach-3'],
    benefits: [
      'Riduzione della tensione muscolare',
      'Miglioramento della circolazione',
      'Accelerazione del recupero post-allenamento',
      'Prevenzione degli infortuni'
    ],
    isOnline: false,
    isLive: true,
    isSingleTime: true
  },
  {
    id: 'service-6',
    name: 'Piano di Mobilità e Stretching',
    category: 'recovery',
    description: 'Programma personalizzato di esercizi di mobilità e stretching per migliorare la flessibilità e prevenire infortuni.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 39.99,
    duration: '4 settimane',
    coaches: ['coach-1', 'coach-3'],
    benefits: [
      'Miglioramento della postura',
      'Aumento dell\'ampiezza di movimento',
      'Riduzione dei dolori muscolari',
      'Prevenzione degli infortuni'
    ],
    isOnline: true,
    isLive: false,
    isSingleTime: true
  },
  {
    id: 'service-7',
    name: 'Consulenza sul Sonno e Recupero',
    category: 'recovery',
    description: 'Sessione con un esperto per ottimizzare il tuo sonno e le strategie di recupero per massimizzare i risultati dell\'allenamento.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 49.99,
    duration: '45 minuti',
    coaches: ['coach-3', 'coach-4'],
    benefits: [
      'Analisi delle abitudini di sonno attuali',
      'Strategie per migliorare la qualità del sonno',
      'Tecniche di rilassamento e recupero',
      'Ottimizzazione dei tempi di recupero tra allenamenti'
    ],
    isOnline: true,
    isLive: true,
    isSingleTime: true
  },
  {
    id: 'service-8',
    name: 'Mental Training per Performance',
    category: 'recovery',
    description: 'Sessioni di coaching mentale per sviluppare resilienza, focus e attitudine vincente nello sport e nel fitness.',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 59.99,
    duration: '60 minuti',
    coaches: ['coach-4'],
    benefits: [
      'Tecniche di visualizzazione per il successo',
      'Strategie per la gestione dello stress',
      'Sviluppo della mentalità vincente',
      'Miglioramento della concentrazione durante l\'allenamento'
    ],
    isOnline: true,
    isLive: true,
    isSingleTime: true
  }
];

export const transformationPlans: TransformationPlan[] = [
  {
    id: 'basic-plan',
    name: 'Piano Base',
    description: 'Il punto di partenza ideale per iniziare il tuo percorso di trasformazione con accesso ai contenuti essenziali e sconti sui servizi premium.',
    price: 19.99,
    duration: 'monthly',
    imageUrl: '/images/workout-header-bg.jpg',
    features: [
      'Accesso a video di allenamento on-demand',
      'App di tracciamento degli allenamenti',
      'Supporto via email',
      'Community esclusiva'
    ],
    includedServices: [],
    discountedServices: [
      { serviceId: 'service-1', discountPercentage: 10 },
      { serviceId: 'service-3', discountPercentage: 10 },
      { serviceId: 'service-6', discountPercentage: 10 }
    ]
  },
  {
    id: 'premium-plan',
    name: 'Piano Premium',
    description: 'Un piano completo per chi cerca un supporto più strutturato con servizi inclusi e consulenze regolari per raggiungere risultati ottimali.',
    price: 49.99,
    duration: 'monthly',
    imageUrl: '/images/workout-header-bg.jpg',
    features: [
      'Tutto del Piano Base',
      'Piano di allenamento mensile personalizzato',
      'Consulenza nutrizionale mensile',
      'Accesso a webinar esclusivi',
      'Supporto prioritario 7 giorni su 7'
    ],
    includedServices: [
      'service-1',
      'service-4'
    ],
    discountedServices: [
      { serviceId: 'service-2', discountPercentage: 20 },
      { serviceId: 'service-3', discountPercentage: 20 },
      { serviceId: 'service-5', discountPercentage: 15 },
      { serviceId: 'service-7', discountPercentage: 15 },
      { serviceId: 'service-8', discountPercentage: 15 }
    ],
    isMostPopular: true
  },
  {
    id: 'elite-plan',
    name: 'Piano Elite',
    description: 'Il massimo supporto possibile per atleti seri e chi cerca una trasformazione totale con accesso completo a tutti i nostri servizi.',
    price: 99.99,
    duration: 'monthly',
    imageUrl: '/images/workout-header-bg.jpg',
    features: [
      'Tutto del Piano Premium',
      'Piano di allenamento settimanale personalizzato',
      'Piano nutrizionale personalizzato',
      '2 sessioni live mensili con personal trainer',
      'Consulenza mensile sul recupero',
      'Accesso VIP a tutti gli eventi e masterclass',
      'Supporto diretto con il team di esperti'
    ],
    includedServices: [
      'service-1',
      'service-2',
      'service-3',
      'service-4',
      'service-6',
      'service-7'
    ],
    discountedServices: [
      { serviceId: 'service-5', discountPercentage: 30 },
      { serviceId: 'service-8', discountPercentage: 30 }
    ]
  }
];

export const liveEvents: LiveEvent[] = [
  {
    id: 'event-1',
    title: 'Masterclass: I Segreti del Front Lever',
    description: 'Scopri le tecniche avanzate e le progressioni per padroneggiare il front lever con il campione nazionale Marco Bianchi.',
    date: '2025-03-15',
    time: '18:00',
    duration: '90 minuti',
    host: 'coach-1',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 29.99,
    maxParticipants: 100,
    currentParticipants: 42,
    category: 'masterclass',
    tags: ['calisthenics', 'front lever', 'forza', 'tutorial']
  },
  {
    id: 'event-2',
    title: 'Webinar: Nutrizione per la Massima Performance',
    description: 'Strategie nutrizionali avanzate per ottimizzare energia, recupero e crescita muscolare con la Dott.ssa Laura Rossi.',
    date: '2025-03-20',
    time: '19:30',
    duration: '60 minuti',
    host: 'coach-2',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 19.99,
    maxParticipants: 200,
    currentParticipants: 78,
    category: 'webinar',
    tags: ['nutrizione', 'performance', 'macro', 'timing']
  },
  {
    id: 'event-3',
    title: 'Challenge: 30 Giorni di Trasformazione',
    description: 'Partecipa alla nostra sfida di 30 giorni con allenamenti giornalieri, piano alimentare e supporto continuo dal nostro team di esperti.',
    date: '2025-04-01',
    time: '08:00',
    duration: '30 giorni',
    host: 'coach-1',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 49.99,
    maxParticipants: 500,
    currentParticipants: 213,
    category: 'challenge',
    tags: ['challenge', 'trasformazione', 'community', 'risultati']
  },
  {
    id: 'event-4',
    title: 'Q&A Live: Prevenzione e Recupero Infortuni',
    description: 'Sessione di domande e risposte con il nostro fisioterapista esperto Alessio Verdi. Porta i tuoi dubbi e problemi specifici.',
    date: '2025-03-25',
    time: '20:00',
    duration: '60 minuti',
    host: 'coach-3',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 0,
    maxParticipants: 300,
    currentParticipants: 156,
    category: 'qa',
    tags: ['infortuni', 'recupero', 'prevenzione', 'mobilità']
  },
  {
    id: 'event-5',
    title: 'Masterclass: Powerlifting Avanzato',
    description: 'Tecniche avanzate di powerlifting con focus su squat, panca e stacco con il campione Matteo Ferrari.',
    date: '2025-04-10',
    time: '18:30',
    duration: '120 minuti',
    host: 'coach-5',
    imageUrl: '/images/workout-header-bg.jpg',
    price: 34.99,
    maxParticipants: 80,
    currentParticipants: 35,
    category: 'masterclass',
    tags: ['powerlifting', 'forza', 'tecnica', 'performance']
  }
];

export function getCoachById(id: string): Coach | undefined {
  return coaches.find(coach => coach.id === id);
}

export function getServiceById(id: string): TransformationService | undefined {
  return services.find(service => service.id === id);
}

export function getServicesByCategory(category: 'training' | 'nutrition' | 'recovery' | 'events'): TransformationService[] {
  return services.filter(service => service.category === category);
}

export function getEventsByCategory(category: 'webinar' | 'masterclass' | 'challenge' | 'qa'): LiveEvent[] {
  return liveEvents.filter(event => event.category === category);
}

export function getUpcomingEvents(): LiveEvent[] {
  const today = new Date();
  return liveEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  }).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export function getPlanById(id: string): TransformationPlan | undefined {
  return transformationPlans.find(plan => plan.id === id);
}
