export interface Coach {
  id: string;
  name: string;
  role: string;
  specialty: string[];
  bio: string;
  imageUrl: string;
  rating: number;
  experience: number; // anni di esperienza
  availability?: string[];
}

export interface TransformationService {
  id: string;
  name: string;
  category: 'training' | 'nutrition' | 'recovery' | 'events';
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  coaches: string[]; // IDs dei coach che offrono questo servizio
  benefits: string[];
  isOnline: boolean;
  isLive: boolean;
  isSingleTime: boolean; // true per servizi one-time, false per servizi inclusi nell'abbonamento
}

export interface TransformationPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'quarterly' | 'yearly';
  imageUrl?: string;
  features: string[];
  includedServices: string[]; // IDs dei servizi inclusi
  discountedServices: Array<{
    serviceId: string;
    discountPercentage: number;
  }>;
  isMostPopular?: boolean;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  host: string; // ID del coach o ospite
  imageUrl: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  category: 'webinar' | 'masterclass' | 'challenge' | 'qa';
  tags: string[];
}

export interface CustomerJourney {
  userId: string;
  activePlan?: TransformationPlan;
  startDate?: string;
  endDate?: string;
  goals: string[];
  notes: string;
  upcomingAppointments: Array<{
    serviceId: string;
    coachId: string;
    date: string;
    time: string;
  }>;
  completedServices: string[]; // IDs dei servizi completati
  progressMetrics?: {
    initialAssessment?: any;
    latestAssessment?: any;
    weightProgress?: Array<{date: string, value: number}>;
    strengthProgress?: Array<{date: string, exercise: string, value: number}>;
    // Altri metri di progresso
  };
}
