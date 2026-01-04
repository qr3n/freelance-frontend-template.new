import type { Table, TableBooking, BulkTablesData, BulkTablesResponse } from './types';
import { TableCreateData, TableUpdateData, TableBookingCreateData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchTables = async (businessId: string): Promise<Table[]> => {
  const response = await fetch(
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

export const fetchTable = async (
  businessId: string,
  tableId: string
): Promise<Table> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch table');
  }

  return response.json();
};

export const createTable = async (
  businessId: string,
  data: TableCreateData
): Promise<Table> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create table');
  }

  return response.json();
};

export const updateTable = async (
  businessId: string,
  tableId: string,
  data: TableUpdateData
): Promise<Table> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update table');
  }

  return response.json();
};

export const deleteTable = async (
  businessId: string,
  tableId: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete table');
  }
};

export const createTableBooking = async (
  businessId: string,
  tableId: string,
  data: TableBookingCreateData
): Promise<TableBooking> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}/bookings`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create booking');
  }

  return response.json();
};

export const fetchTableBookings = async (
  businessId: string,
  tableId: string
): Promise<TableBooking[]> => {
  const response = await fetch(
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

export const cancelTableBooking = async (
  businessId: string,
  tableId: string,
  bookingId: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/${tableId}/bookings/${bookingId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel booking');
  }
};

// Bulk tables operations
export const bulkUpdateTables = async (
  businessId: string,
  data: BulkTablesData
): Promise<BulkTablesResponse> => {
  const response = await fetch(
    `${API_URL}/api/v1/businesses/${businessId}/tables/bulk`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update tables');
  }

  return response.json();
};