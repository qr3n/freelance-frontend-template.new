// entities/dish/model/types.ts

export interface Dish {
  id: string;
  business_id: string;
  title: string;
  description: string;
  price: string;
  image_path: string;
  is_available: boolean;
  tags: string[];
  category: string | null;
  cuisine: string | null;
  ingredients: string[];
  allergens: string[];
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  business_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}