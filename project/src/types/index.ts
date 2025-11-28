export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: string;
  sentiment: {
    positive: number;
    negative: number;
    aspects: {
      comfort?: number;
      fit?: number;
      quality?: number;
      freshness?: number;
      flavor?: number;
      durability?: number;
      waterproof?: number;
      userExperience?: number;
      aroma?: number;
      texture?: number;
      taste?: number;
      warmth?: number;
      style?: number;
      performance?: number;
      stickiness?: number;
      crispness?: number;
      spiciness?: number;
      creaminess?: number;
      value?: number;
      convenience?: number;
      authenticity?: number;
    };
  };
  dataAiHint: string;
  tags?: string[];
  videoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SearchIntent {
  type: 'product' | 'recipe' | 'skincare' | 'clothing' | 'electronics' | 'grocery';
  keywords: string[];
  budget?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  category?: string;
  ingredients?: string[];
  skinType?: string;
  preferences?: string[];
}

export interface RecommendationContext {
  currentCart: CartItem[];
  searchHistory: string[];
  category?: string;
  budget?: number;
}

export interface RecipeDetails {
  name: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  servings: number;
  description: string;
}