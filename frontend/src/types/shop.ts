export interface Product {
  id: string;
  name: string;
  category: 'concrete-weights' | 'cable-machines' | 'calisthenics' | 'modern-equipment' | 'accessories';
  description: string;
  features: string[];
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  rating: number;
  stock: number;
  isCustomizable: boolean;
  customizationOptions?: {
    colors?: string[];
    sizes?: string[];
    weights?: string[];
  };
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  customizations?: {
    color?: string;
    size?: string;
    weight?: string;
  };
}

export interface WishlistItem {
  productId: string;
  dateAdded: string;
}
