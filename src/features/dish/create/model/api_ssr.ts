import type { Business, Dish } from '@/entities/dish/model/types';
import { fetchWithCookies } from '@/shared/lib/auth/fetch';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchDishes = async (businessId?: string): Promise<Dish[]> => {
  const url = businessId
    ? `${API_URL}/api/v1/dishes?business_id=${businessId}`
    : `${API_URL}/api/v1/dishes`;

  const response = await fetchWithCookies(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dishes');
  }

  return response.json();
};

export const fetchBots = async (): Promise<Business[]> => {
  const url = `${API_URL}/api/v1/businesses`;

  const response = await fetchWithCookies(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dishes');
  }

  return response.json();
};