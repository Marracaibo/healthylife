// Test file di medie dimensioni
import { DiaryEntry, Goal, MotivationalVideo, Quote } from '../types/motivation';

export const testQuotes: Quote[] = [
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

export const testVideos: MotivationalVideo[] = [
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
