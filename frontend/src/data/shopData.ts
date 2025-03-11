import { Product, ProductCategory, ProductReview } from '../types/shop';

export const productCategories: ProductCategory[] = [
  {
    id: 'concrete-weights',
    name: 'Pesi in Cemento',
    description: 'Pesi realizzati in cemento, progettati per offrire la stessa funzionalità dei tradizionali pesi in ghisa, ma a un costo notevolmente inferiore.',
    imageUrl: '/images/workout-header-bg.jpg',
    slug: 'concrete-weights'
  },
  {
    id: 'cable-machines',
    name: 'Macchine a Cavo',
    description: 'Soluzioni versatili che consentono di eseguire una vasta gamma di esercizi con un solo cavo, ideali per ottimizzare lo spazio.',
    imageUrl: '/images/workout-header-bg.jpg',
    slug: 'cable-machines'
  },
  {
    id: 'calisthenics',
    name: 'Attrezzi Calisthenics',
    description: 'Una selezione di attrezzi indispensabili per il bodyweight training, pensati per migliorare forza, equilibrio e mobilità.',
    imageUrl: '/images/workout-header-bg.jpg',
    slug: 'calisthenics'
  },
  {
    id: 'modern-equipment',
    name: 'Attrezzature Moderne',
    description: 'Strumenti innovativi che completano l\'allenamento, combinando tecnologia e design all\'avanguardia.',
    imageUrl: '/images/workout-header-bg.jpg',
    slug: 'modern-equipment'
  },
  {
    id: 'accessories',
    name: 'Accessori',
    description: 'Complementi essenziali per migliorare l\'efficacia e il comfort del tuo allenamento quotidiano.',
    imageUrl: '/images/workout-header-bg.jpg',
    slug: 'accessories'
  }
];

export const products: Product[] = [
  // Pesi in Cemento
  {
    id: 'product-1',
    name: 'Kettlebell in Cemento 12kg',
    category: 'concrete-weights',
    description: 'Kettlebell realizzata in cemento ad alta resistenza, perfetta per esercizi di potenza e resistenza. Impugnatura ergonomica e base antiscivolo.',
    features: [
      'Realizzata in cemento ad alta resistenza',
      'Impugnatura ergonomica rivestita in gomma',
      'Base stabile con inserto antiscivolo',
      'Peso preciso con tolleranza +/- 1%',
      'Design compatto'
    ],
    price: 29.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.7,
    stock: 25,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Grigio Cemento', 'Nero Opaco', 'Blu Navy'],
      weights: ['8kg', '12kg', '16kg', '20kg', '24kg']
    },
    isBestseller: true
  },
  {
    id: 'product-2',
    name: 'Set Manubri in Cemento',
    category: 'concrete-weights',
    description: 'Set di manubri in cemento con barre in acciaio e dischi intercambiabili. Ottimo per esercizi di forza a casa senza spendere una fortuna.',
    features: [
      'Set completo con 2 barre e 8 dischi',
      'Dischi intercambiabili da 2kg e 4kg',
      'Barre in acciaio con impugnatura zigrinata',
      'Blocchi di sicurezza inclusi',
      'Valigetta per il trasporto'
    ],
    price: 79.99,
    discountPercentage: 15,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.5,
    stock: 15,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Grigio Standard', 'Nero Intenso'],
      weights: ['Starter (16kg totali)', 'Intermediate (24kg totali)', 'Advanced (32kg totali)']
    }
  },
  {
    id: 'product-3',
    name: 'Disco in Cemento 20kg',
    category: 'concrete-weights',
    description: 'Disco in cemento rinforzato con fibra per bilancieri standard. Diametro di 45cm compatibile con bilancieri olimpici.',
    features: [
      'Cemento rinforzato con fibra',
      'Anello in acciaio centrale',
      'Diametro standard olimpico',
      'Superficie texture anti-scivolamento',
      'Resistente a cadute e urti'
    ],
    price: 39.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.3,
    stock: 20,
    isCustomizable: true,
    customizationOptions: {
      weights: ['5kg', '10kg', '15kg', '20kg', '25kg']
    }
  },

  // Macchine a Cavo
  {
    id: 'product-4',
    name: 'Multi-Esercizio a Singolo Cavo',
    category: 'cable-machines',
    description: 'Sistema versatile per esercizi con cavo singolo, montabile a parete o soffitto. Ideale per chi cerca flessibilità in spazi ridotti.',
    features: [
      'Sistema a cavo con puleggia fluida',
      'Carico massimo 150kg',
      'Montaggio a parete, soffitto o supporto indipendente',
      '8 accessori inclusi (barra, maniglie, cavigliera)',
      'Cavo in kevlar ultra-resistente'
    ],
    price: 349.99,
    discountPercentage: 10,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.8,
    stock: 8,
    isCustomizable: false,
    isNewArrival: true
  },
  {
    id: 'product-5',
    name: 'Mini Tower a Doppio Cavo',
    category: 'cable-machines',
    description: 'Torre compatta con sistema a doppio cavo, perfetta per home gym. Consente di eseguire oltre 80 esercizi diversi in uno spazio ridotto.',
    features: [
      'Sistema a doppio cavo indipendente',
      'Pila pesi 2x50kg con incrementi di 5kg',
      'Ingombro ridotto (120x80cm)',
      'Sistema di cambio rapido accessori',
      'App dedicata con libreria esercizi'
    ],
    price: 699.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.9,
    stock: 5,
    isCustomizable: false,
    isBestseller: true
  },

  // Attrezzi Calisthenics
  {
    id: 'product-6',
    name: 'Parallettes Pieghevoli',
    category: 'calisthenics',
    description: 'Parallettes in acciaio pieghevoli per esercizi di calisthenics a casa. Ideali per L-sit, piegamenti, dip e handstand push-up.',
    features: [
      'Struttura in acciaio rinforzato',
      'Impugnature ergonomiche rivestite in gomma',
      'Sistema di chiusura rapida per trasporto',
      'Base stabile con inserto in gomma antiscivolo',
      'Altezza regolabile (15cm/25cm)'
    ],
    price: 59.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.6,
    stock: 30,
    isCustomizable: true,
    customizationOptions: {
      colors: ['Nero Opaco', 'Rosso', 'Blu']
    }
  },
  {
    id: 'product-7',
    name: 'Anelli da Ginnastica Professionali',
    category: 'calisthenics',
    description: 'Anelli da ginnastica in legno di betulla con cinghie numerate. Ideali per muscle-up, dip, row e altri esercizi avanzati.',
    features: [
      'Anelli in legno di betulla laminato',
      'Diametro 28mm (standard competizione)',
      'Cinghie ultra-resistenti da 5m con marcatura numerata',
      'Fibbie in acciaio a sgancio rapido',
      'Carico massimo testato 350kg'
    ],
    price: 69.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.7,
    stock: 25,
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: 'product-8',
    name: 'Barra Trazioni da Porta',
    category: 'calisthenics',
    description: 'Barra per trazioni da montare su telaio porta senza viti. Adatta per trazioni, butterfly pull-up e esercizi addominali in sospensione.',
    features: [
      'Montaggio senza attrezzi su telai porta standard',
      'Larghezza regolabile (62-92cm)',
      'Impugnature multiple (stretta, larga, neutra)',
      'Carico massimo 150kg',
      'Rivestimento anti-graffio sui supporti'
    ],
    price: 49.99,
    discountPercentage: 20,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.4,
    stock: 15,
    isCustomizable: false
  },

  // Attrezzature Moderne
  {
    id: 'product-9',
    name: 'Smart Band di Resistenza',
    category: 'modern-equipment',
    description: 'Banda di resistenza con sensori integrati che misurano forza, ripetizioni e tempo sotto tensione, sincronizzandosi con l\'app.',
    features: [
      'Sensori di forza e movimento integrati',
      'Resistenza variabile (10-50kg)',
      'Connessione Bluetooth 5.0',
      'Batteria ricaricabile (autonomia 20h)',
      'Compatibile con app Healthy Life Habits'
    ],
    price: 89.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.5,
    stock: 10,
    isCustomizable: false,
    isNewArrival: true
  },
  {
    id: 'product-10',
    name: 'Power Bag Interattiva',
    category: 'modern-equipment',
    description: 'Sacca pesata con distribuzione dinamica del peso e feedback in tempo reale durante l\'allenamento funzionale.',
    features: [
      'Sensori di movimento e accelerazione',
      'Distribuzione dinamica del peso',
      'Peso regolabile (5-25kg)',
      'Display LED integrato',
      'Modalità allenamento programmabili'
    ],
    price: 129.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.6,
    stock: 8,
    isCustomizable: false,
    isNewArrival: true
  },

  // Accessori
  {
    id: 'product-11',
    name: 'Set Mini Bands Premium',
    category: 'accessories',
    description: 'Set di 5 mini bands di diversa resistenza, ideali per attivazione, riabilitazione e allenamento glutei.',
    features: [
      'Set di 5 bande (molto leggera - extra forte)',
      'Materiale in lattice naturale premium',
      'Non si arrotolano durante l\'uso',
      'Custodia in mesh inclusa',
      'Guida esercizi digitale'
    ],
    price: 24.99,
    discountPercentage: 10,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.8,
    stock: 50,
    isCustomizable: false,
    isBestseller: true
  },
  {
    id: 'product-12',
    name: 'Supporto Smartphone per Allenamento',
    category: 'accessories',
    description: 'Supporto universale per smartphone con braccio regolabile, ideale per registrare o seguire workout. Compatibile con attrezzi fitness.',
    features: [
      'Compatibile con tutti gli smartphone',
      'Rotazione 360°',
      'Braccio regolabile con 3 snodi',
      'Morsetto universale per attrezzi (diametro 20-50mm)',
      'Sistema anti-vibrazione'
    ],
    price: 19.99,
    imageUrl: '/images/workout-header-bg.jpg',
    rating: 4.3,
    stock: 35,
    isCustomizable: false
  }
];

export const productReviews: ProductReview[] = [
  {
    id: 'review-1',
    productId: 'product-1',
    userName: 'Marco B.',
    rating: 5,
    comment: 'Incredibile qualità per il prezzo. Ho acquistato la kettlebell da 16kg e la qualità costruttiva è eccellente. L\'impugnatura è comoda anche durante sessioni lunghe.',
    date: '2025-01-15'
  },
  {
    id: 'review-2',
    productId: 'product-1',
    userName: 'Laura R.',
    rating: 4,
    comment: 'Ottimo prodotto, resistente e ben realizzato. L\'unico neo è che il colore è leggermente diverso da quello mostrato in foto.',
    date: '2025-01-22'
  },
  {
    id: 'review-3',
    productId: 'product-4',
    userName: 'Alessandro V.',
    rating: 5,
    comment: 'La macchina a cavo ha rivoluzionato il mio home gym! Installazione facile e ora posso fare praticamente qualsiasi esercizio in uno spazio limitato.',
    date: '2025-02-05',
    imageUrl: '/images/workout-header-bg.jpg'
  },
  {
    id: 'review-4',
    productId: 'product-7',
    userName: 'Sofia M.',
    rating: 5,
    comment: 'Gli anelli sono fantastici, qualità professionale. Le cinghie numerate facilitano molto la regolazione simmetrica.',
    date: '2025-01-30'
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isBestseller || p.isNewArrival).slice(0, 6);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.category === categoryId);
};

export const getProductById = (productId: string): Product | undefined => {
  return products.find(p => p.id === productId);
};

export const getProductReviews = (productId: string): ProductReview[] => {
  return productReviews.filter(r => r.productId === productId);
};

export const getCategoryById = (categoryId: string): ProductCategory | undefined => {
  return productCategories.find(c => c.id === categoryId);
};
