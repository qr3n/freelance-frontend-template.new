// features/dish/create/model/types.ts

export interface DishCreateInput {
  business_id: string;
  title: string;
  description: string;
  price: string;
  image: File;
  is_available: boolean;
  category?: string | null;
  cuisine?: string | null;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
}

export interface DishCreateData {
  business_id: string;
  title: string;
  description: string;
  price: string;
  image: string; // base64
  is_available: boolean;
  category?: string | null;
  cuisine?: string | null;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
}

export interface DishUpdateInput {
  title?: string;
  description?: string;
  price?: string;
  image?: File | null;
  is_available?: boolean;
  category?: string | null;
  cuisine?: string | null;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
}

export interface DishUpdateData {
  title?: string;
  description?: string;
  price?: string;
  image?: string; // base64
  is_available?: boolean;
  category?: string | null;
  cuisine?: string | null;
  tags?: string[];
  ingredients?: string[];
  allergens?: string[];
}