// features/dish/create/model/api.ts
import type { Dish } from '@/entities/dish/model/types';
import { DishCreateData, DishCreateInput, DishUpdateData, DishUpdateInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Convert File to base64 data URL
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Create a new dish
 */
export const createDish = async (data: DishCreateData): Promise<Dish> => {
  const response = await fetch(`${API_URL}/api/v1/dishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create dish');
  }

  return response.json();
};

/**
 * Prepare dish data for creation (convert File to base64)
 */
export const prepareDishData = async (input: DishCreateInput): Promise<DishCreateData> => {
  const imageBase64 = await fileToBase64(input.image);

  return {
    business_id: input.business_id,
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price.trim(),
    image: imageBase64,
    is_available: input.is_available,
    category: input.category || null,
    cuisine: input.cuisine || null,
    tags: input.tags || [],
    ingredients: input.ingredients || [],
    allergens: input.allergens || [],
  };
};

/**
 * Update an existing dish
 */
export const updateDish = async (
  dishId: string,
  data: DishUpdateData
): Promise<Dish> => {
  const response = await fetch(`${API_URL}/api/v1/dishes/${dishId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update dish');
  }

  return response.json();
};

/**
 * Delete a dish
 */
export const deleteDish = async (dishId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/dishes/${dishId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete dish');
  }
};

/**
 * Prepare dish data for update (convert File to base64 if needed)
 */
export const prepareDishUpdateData = async (
  input: DishUpdateInput
): Promise<DishUpdateData> => {
  const result: DishUpdateData = {};

  if (input.title !== undefined) result.title = input.title.trim();
  if (input.description !== undefined) result.description = input.description.trim();
  if (input.price !== undefined) result.price = input.price.trim();
  if (input.is_available !== undefined) result.is_available = input.is_available;
  if (input.category !== undefined) result.category = input.category;
  if (input.cuisine !== undefined) result.cuisine = input.cuisine;
  if (input.tags !== undefined) result.tags = input.tags;
  if (input.ingredients !== undefined) result.ingredients = input.ingredients;
  if (input.allergens !== undefined) result.allergens = input.allergens;

  // Convert image to base64 if provided
  if (input.image) {
    result.image = await fileToBase64(input.image);
  }

  return result;
};