import { 
  DiaryEntry, 
  Goal, 
  MotivationalVideo, 
  Quote, 
  Transformation, 
  Badge, 
  Challenge,
  PreWorkoutBooster
} from '../types/motivation';

// Quotes
export const sampleQuotes: Quote[] = [
  {
    id: 'quote-1',
    text: 'Il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta.',
    author: 'Winston Churchill',
    category: 'perseverance',
    likes: 256,
    isUserGenerated: false,
    dateAdded: '2024-12-15',
    isFeatured: true
  },
  {
    id: 'quote-2',
    text: 'La differenza tra chi ce la fa e chi no non è la forza o la conoscenza, ma la volontà.',
    author: 'Vince Lombardi',
    category: 'discipline',
    likes: 189,
    isUserGenerated: false,
    dateAdded: '2024-11-20',
    isFeatured: false
  },
  {
    id: 'quote-3',
    text: 'Più duro è l\'allenamento, più facile è la battaglia.',
    author: 'Anonimo',
    category: 'motivation',
    likes: 312,
    isUserGenerated: true,
    userId: 'user-123',
    dateAdded: '2025-01-05',
    isFeatured: true
  }
];

// Videos
export const sampleVideos: MotivationalVideo[] = [
  {
    id: 'video-1',
    title: 'Come superare i momenti difficili',
    description: 'In questo video, Marco condivide la sua esperienza e fornisce consigli pratici per superare i momenti di difficoltà nel percorso fitness.',
    thumbnailUrl: '/images/motivation/video-thumbnail-1.jpg',
    videoUrl: '/videos/motivation/overcome-challenges.mp4',
    duration: 185,
    speaker: 'Marco Bianchi',
    category: 'expert',
    tags: ['sfide', 'ostacoli', 'resilienza'],
    views: 1256,
    likes: 328,
    dateAdded: '2025-01-10',
    isFeatured: true
  },
  {
    id: 'video-2',
    title: 'La mia trasformazione in 6 mesi',
    description: 'Anna racconta il suo viaggio di trasformazione e come è riuscita a perdere 15kg in 6 mesi grazie a costanza e determinazione.',
    thumbnailUrl: '/images/motivation/video-thumbnail-2.jpg',
    videoUrl: '/videos/motivation/transformation-story.mp4',
    duration: 243,
    speaker: 'Anna Rossi',
    category: 'community',
    tags: ['trasformazione', 'perdita peso', 'testimonianza'],
    views: 2189,
    likes: 456,
    dateAdded: '2024-12-22',
    isFeatured: false
  }
];

// Diary Entries
export const sampleDiaryEntries: DiaryEntry[] = [
  {
    id: 'diary-1',
    userId: 'user-1',
    title: 'L\'inizio del mio viaggio fitness',
    content: 'Oggi ho deciso di iniziare seriamente il mio percorso di trasformazione. Sono stanco di sentirmi senza energia e voglio ritrovare fiducia nel mio corpo.\n\nI miei principali ostacoli sono la mancanza di costanza e le vecchie abitudini alimentari. So che non sarà facile, ma sono determinato a cambiare.',
    mood: 'good',
    date: '2025-01-15T10:30:00.000Z',
    isPrivate: false,
    tags: ['nuovo inizio', 'motivazione', 'cambiamento']
  },
  {
    id: 'diary-2',
    userId: 'user-1',
    title: 'Superato un blocco',
    content: 'Dopo due settimane di stallo, finalmente ho visto dei progressi! Ho aumentato il peso nei miei esercizi e mi sento più energico durante la giornata.\n\nStavo per mollare, ma vedere questi piccoli progressi mi ha dato nuova motivazione.',
    mood: 'great',
    date: '2025-02-05T18:45:00.000Z',
    isPrivate: true,
    tags: ['progressi', 'superare ostacoli', 'costanza']
  }
];

// Goals
export const sampleGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Perdere 10kg in modo sano',
    description: 'Voglio perdere peso gradualmente attraverso una combinazione di alimentazione bilanciata e attività fisica regolare.',
    targetDate: '2025-06-30T00:00:00.000Z',
    isCompleted: false,
    progress: 35,
    category: 'fitness',
    milestones: [
      {
        id: 'milestone-1-1',
        title: 'Perdere i primi 3kg',
        isCompleted: true,
        completedDate: '2025-02-15T00:00:00.000Z'
      },
      {
        id: 'milestone-1-2',
        title: 'Allenarsi almeno 3 volte a settimana per un mese',
        isCompleted: false
      },
      {
        id: 'milestone-1-3',
        title: 'Ridurre il consumo di zuccheri',
        isCompleted: true,
        completedDate: '2025-01-25T00:00:00.000Z'
      }
    ],
    isPrivate: false
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Completare una maratona',
    description: 'Mi sto preparando per la mia prima maratona, un obiettivo che ho sempre voluto raggiungere.',
    targetDate: '2025-09-15T00:00:00.000Z',
    isCompleted: false,
    progress: 20,
    category: 'fitness',
    milestones: [
      {
        id: 'milestone-2-1',
        title: 'Correre 5km senza fermarsi',
        isCompleted: true,
        completedDate: '2025-01-10T00:00:00.000Z'
      },
      {
        id: 'milestone-2-2',
        title: 'Correre 10km',
        isCompleted: false
      },
      {
        id: 'milestone-2-3',
        title: 'Correre una mezza maratona',
        isCompleted: false
      }
    ],
    isPrivate: false
  }
];

// Transformations
export const sampleTransformations: Transformation[] = [
  {
    id: 'transform-1',
    userId: 'user-2',
    userName: 'Marco Verdi',
    userAvatarUrl: '/images/avatars/user-2.jpg',
    title: 'Da sedentario a runner in 8 mesi',
    story: 'Otto mesi fa non riuscivo a correre nemmeno per 5 minuti. Oggi ho completato la mia prima mezza maratona! Il percorso non è stato facile, ci sono stati momenti in cui volevo mollare, ma la costanza e il supporto della community mi hanno aiutato a superare i momenti difficili.\n\nHo iniziato con brevi sessioni di corsa/camminata alternata, aumentando gradualmente il tempo di corsa. Dopo 3 mesi sono riuscito a correre per 30 minuti senza fermarmi, e da lì è stato un continuo miglioramento.',
    beforeImageUrl: '/images/transformations/transform-1-before.jpg',
    afterImageUrl: '/images/transformations/transform-1-after.jpg',
    duration: '8 mesi',
    weightBefore: 92,
    weightAfter: 76,
    mainFocus: 'endurance',
    challenges: ['Mancanza di fiato', 'Dolori articolari iniziali', 'Motivazione altalenante'],
    tips: ['Inizia gradualmente', 'Alterna corsa e camminata', 'Trova un gruppo di corsa'],
    datePosted: '2025-02-10',
    likes: 156,
    comments: [
      {
        id: 'comment-1-1',
        userId: 'user-3',
        userName: 'Laura Bianchi',
        userAvatarUrl: '/images/avatars/user-3.jpg',
        content: 'Complimenti Marco! La tua storia è davvero ispiratrice. Anch\'io sto iniziando a correre e spero di raggiungere i tuoi risultati!',
        datePosted: '2025-02-11',
        likes: 5
      },
      {
        id: 'comment-1-2',
        userId: 'user-4',
        userName: 'Giovanni Rossi',
        userAvatarUrl: '/images/avatars/user-4.jpg',
        content: 'Che trasformazione incredibile! Quanto tempo hai dedicato settimanalmente all\'allenamento?',
        datePosted: '2025-02-12',
        likes: 2
      }
    ],
    isVerified: true
  }
];

// Badges
export const sampleBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Motivatore del Mese',
    description: 'Assegnato all\'utente che ha fornito il supporto più significativo alla community nell\'ultimo mese.',
    imageUrl: '/images/badges/motivator.png',
    category: 'community',
    level: 'gold',
    isEarned: false
  },
  {
    id: 'badge-2',
    name: 'Supera Te Stesso',
    description: 'Completato un obiettivo personale significativo.',
    imageUrl: '/images/badges/achievement.png',
    category: 'achievement',
    level: 'silver',
    dateEarned: '2025-01-20',
    isEarned: true
  }
];

// Challenges
export const sampleChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30 Giorni di Movimento',
    description: 'Fai almeno 30 minuti di attività fisica ogni giorno per 30 giorni consecutivi.',
    imageUrl: '/images/challenges/30-days-movement.jpg',
    startDate: '2025-03-01',
    endDate: '2025-03-30',
    participants: 534,
    category: 'fitness',
    tasks: [
      {
        id: 'task-1-1',
        description: 'Completa 30 minuti di allenamento ogni giorno',
        points: 10,
        isCompleted: false
      },
      {
        id: 'task-1-2',
        description: 'Condividi la tua esperienza sui social media',
        points: 5,
        isCompleted: false
      }
    ],
    prizes: [
      {
        rank: 1,
        description: 'Abbonamento premium gratuito per 3 mesi + badge esclusivo',
        imageUrl: '/images/prizes/premium-subscription.png'
      },
      {
        rank: 2,
        description: 'Abbonamento premium gratuito per 1 mese',
        imageUrl: '/images/prizes/premium-subscription.png'
      }
    ],
    isActive: true,
    userProgress: 0
  }
];

// Pre-Workout Boosters
export const sampleBoosters: PreWorkoutBooster[] = [
  {
    id: 'booster-1',
    title: 'Energia Massima',
    type: 'audio',
    content: '/audio/boosters/energy-max.mp3',
    speaker: 'Marco Trainer',
    duration: 45,
    intensity: 'extreme',
    category: 'energy',
    tags: ['energia', 'potenza', 'forza'],
    plays: 1245,
    likes: 356
  },
  {
    id: 'booster-2',
    title: 'Focus Mentale',
    type: 'audio',
    content: '/audio/boosters/mental-focus.mp3',
    speaker: 'Laura Coach',
    duration: 30,
    intensity: 'moderate',
    category: 'focus',
    tags: ['concentrazione', 'mente', 'chiarezza'],
    plays: 987,
    likes: 241
  },
  {
    id: 'booster-3',
    title: 'Potenza Esplosiva',
    type: 'audio',
    content: '/audio/boosters/explosive-power.mp3',
    speaker: 'Andrea Pro',
    duration: 60,
    intensity: 'intense',
    category: 'power',
    tags: ['esplosività', 'potenza', 'adrenalina'],
    plays: 1653,
    likes: 420
  },
  {
    id: 'booster-4',
    title: 'Motivazione da Campione',
    type: 'quote',
    content: 'Non contano le dimensioni del cane nella lotta, è la dimensione della lotta nel cane che conta!',
    speaker: 'Mark Trainer',
    intensity: 'extreme',
    category: 'motivation',
    tags: ['motivazione', 'determinazione', 'grinta'],
    plays: 2156,
    likes: 589
  }
];
