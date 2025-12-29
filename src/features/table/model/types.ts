// Entity types
export enum TableStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  OCCUPIED = 'occupied',
}

export interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: TableStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TableBooking {
  id: string;
  table_id: string;
  telegram_id: number;
  guest_name: string;
  guest_phone?: string | null;
  num_guests: number;
  booking_date: string; // ISO date string
  booking_time: string; // ISO time string
  duration_minutes: number;
  notes?: string | null;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

// API Data types (what we send to the backend)
export interface TableCreateData {
  table_number: number;
  capacity: number;
}

export interface TableUpdateData {
  table_number?: number;
  capacity?: number;
  status?: TableStatus;
  is_active?: boolean;
}

export interface TableBookingCreateData {
  telegram_id: number;
  guest_name: string;
  guest_phone?: string;
  num_guests: number;
  booking_date: string; // ISO date string (YYYY-MM-DD)
  booking_time: string; // ISO time string (HH:MM:SS)
  duration_minutes?: number;
  notes?: string;
}

// Input types (what we use in forms/components)
export interface TableCreateInput {
  business_id: string;
  table_number: number;
  capacity: number;
}

export interface TableUpdateInput {
  table_number?: number;
  capacity?: number;
  status?: TableStatus;
  is_active?: boolean;
}

export interface TableBookingCreateInput {
  business_id: string;
  table_id: string;
  telegram_id: number;
  guest_name: string;
  guest_phone?: string;
  num_guests: number;
  booking_date: string;
  booking_time: string;
  duration_minutes?: number;
  notes?: string;
}

// Bulk tables types
export interface BulkTablesData {
  total_tables: number;
  default_capacity: number;
}

export interface BulkTablesInput {
  business_id: string;
  total_tables: number;
  default_capacity: number;
}

export interface BulkTablesResponse {
  created: number;
  updated: number;
  deleted: number;
  total: number;
  tables: Table[];
}