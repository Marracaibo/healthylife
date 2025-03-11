export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  date: string;
  isPrivate: boolean;
  tags: string[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
  progress: number; // 0-100
  category: 'fitness' | 'nutrition' | 'mindset' | 'lifestyle' | 'other';
  milestones: Milestone[];
  isPrivate: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedDate?: string;
}

export interface MotivationalVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  speaker: string;
  category: 'expert' | 'athlete' | 'community' | 'coach';
  tags: string[];
  views: number;
  likes: number;
  dateAdded: string;
  isFeatured: boolean;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: 'motivation' | 'mindset' | 'success' | 'perseverance' | 'discipline' | 'growth';
  likes: number;
  isUserGenerated: boolean;
  userId?: string;
  dateAdded: string;
  isFeatured: boolean;
}

export interface Transformation {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  title: string;
  story: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  duration: string; // e.g. "3 months", "1 year"
  weightBefore?: number;
  weightAfter?: number;
  mainFocus: 'weight-loss' | 'muscle-gain' | 'strength' | 'endurance' | 'flexibility' | 'general-fitness' | 'mental-health';
  challenges: string[];
  tips: string[];
  datePosted: string;
  likes: number;
  comments: TransformationComment[];
  isVerified: boolean;
}

export interface TransformationComment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  content: string;
  datePosted: string;
  likes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'achievement' | 'consistency' | 'milestone' | 'community' | 'challenge';
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  dateEarned?: string;
  isEarned: boolean;
  requiredPoints?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  participants: number;
  category: 'fitness' | 'nutrition' | 'mindset' | 'social' | 'lifestyle';
  tasks: ChallengeTask[];
  prizes: ChallengePrize[];
  isActive: boolean;
  isCompleted?: boolean;
  userProgress?: number; // 0-100
}

export interface ChallengeTask {
  id: string;
  description: string;
  points: number;
  isCompleted?: boolean;
}

export interface ChallengePrize {
  rank: number;
  description: string;
  imageUrl?: string;
}

export interface PreWorkoutBooster {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'quote';
  content: string; // URL per audio/video, testo per quote
  speaker?: string;
  duration?: number; // in seconds, per audio/video
  intensity: 'mild' | 'moderate' | 'intense' | 'extreme';
  category: 'motivation' | 'focus' | 'energy' | 'power';
  tags: string[];
  plays: number;
  likes: number;
  isFavorite?: boolean;
}
