
// Table API functions
import type { Table, TableBooking } from '@/features/table/model/types';
import { fetchWithCookies } from '@/shared/lib/auth/fetch';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchTables = async (businessId: string): Promise<Table[]> => {
  const response = await fetchWithCookies(
    `${API_URL}/api/v1/businesses/${businessId}/tables`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }

  return response.json();
};

export const fetchTableBookings = async (
  businessId: string,
  tableId: string
): Promise<TableBooking[]> => {
  const response = await fetchWithCookies(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}/bookings`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch table bookings');
  }

  return response.json();
};