import type { Business } from '@/entities/business/model/types';
import type { BusinessUpdateData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const updateBusiness = async (
  businessId: string,
  data: BusinessUpdateData
): Promise<Business> => {
  const response = await fetch(`${API_URL}/api/v1/businesses/${businessId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update business');
  }

  return response.json();
};
