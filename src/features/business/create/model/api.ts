// features/business/create/model/api.ts
import type { Business, BusinessCreateData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const createBusiness = async (data: BusinessCreateData): Promise<Business> => {
  const response = await fetch(`${API_URL}/api/v1/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create business');
  }

  return response.json();
};

export const fetchBusinesses = async (): Promise<Business[]> => {
  const response = await fetch(`${API_URL}/api/v1/businesses`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }

  return response.json();
};

export const fetchBusiness = async (businessId: string): Promise<Business> => {
  const response = await fetch(`${API_URL}/api/v1/businesses/${businessId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch business');
  }

  return response.json();
};