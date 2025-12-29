import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTables,
  fetchTable,
  createTable,
  updateTable,
  deleteTable,
  fetchTableBookings,
  createTableBooking,
  cancelTableBooking,
  bulkUpdateTables,
} from './api';
import type { Table, TableBooking, BulkTablesResponse } from './types';
import {
  TableCreateInput,
  TableUpdateInput,
  TableBookingCreateInput,
  BulkTablesInput
} from './types';

// Query keys
const TABLES_QUERY_KEY = ['tables'] as const;
const TABLE_BOOKINGS_QUERY_KEY = ['tableBookings'] as const;

// Tables hooks
export const useTables = (businessId: string, initialData?: Table[]) => {
  console.log('=== useTables Hook ===');
  console.log('businessId:', businessId);
  console.log('initialData:', initialData);
  console.log('initialData length:', initialData?.length);

  const result = useQuery<Table[]>({
    queryKey: [...TABLES_QUERY_KEY, businessId],
    queryFn: () => fetchTables(businessId),
    placeholderData: initialData,
    enabled: !!businessId,
  });

  console.log('Query result:', {
    data: result.data,
    dataLength: result.data?.length,
    isLoading: result.isLoading,
    status: result.status,
    fetchStatus: result.fetchStatus,
  });
  console.log('======================');

  return result;
};

export const useTable = (businessId: string, tableId: string) => {
  return useQuery<Table>({
    queryKey: [...TABLES_QUERY_KEY, businessId, tableId],
    queryFn: () => fetchTable(businessId, tableId),
    enabled: !!businessId && !!tableId,
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TableCreateInput) => {
      return createTable(input.business_id, {
        table_number: input.table_number,
        capacity: input.capacity,
      });
    },
    onSuccess: (newTable, variables) => {
      // Обновляем кэш с конкретным businessId
      queryClient.setQueryData<Table[]>(
        [...TABLES_QUERY_KEY, variables.business_id],
        (old = []) => {
          return [newTable, ...old];
        }
      );

      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.business_id],
      });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
                         businessId,
                         tableId,
                         data,
                       }: {
      businessId: string;
      tableId: string;
      data: TableUpdateInput;
    }) => {
      return updateTable(businessId, tableId, data);
    },
    onSuccess: (updatedTable, variables) => {
      // Обновляем конкретный стол в кэше
      queryClient.setQueryData<Table>(
        [...TABLES_QUERY_KEY, variables.businessId, variables.tableId],
        updatedTable
      );

      // Обновляем список столов
      queryClient.setQueryData<Table[]>(
        [...TABLES_QUERY_KEY, variables.businessId],
        (old = []) => {
          return old.map((table) =>
            table.id === variables.tableId ? updatedTable : table
          );
        }
      );

      // Инвалидируем запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.businessId],
      });
    },
  });
};

// Bulk tables operations
export const useBulkUpdateTables = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BulkTablesInput) => {
      return bulkUpdateTables(input.business_id, {
        total_tables: input.total_tables,
        default_capacity: input.default_capacity,
      });
    },
    onSuccess: (result: BulkTablesResponse, variables) => {
      console.log('=== Bulk Tables Update Success ===');
      console.log('Created:', result.created);
      console.log('Updated:', result.updated);
      console.log('Deleted:', result.deleted);
      console.log('Total:', result.total);

      // Полностью заменяем кэш списка столов новыми данными
      queryClient.setQueryData<Table[]>(
        [...TABLES_QUERY_KEY, variables.business_id],
        result.tables
      );

      // Инвалидируем все связанные запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.business_id],
      });

      // Также инвалидируем бронирования, так как столы могли измениться
      queryClient.invalidateQueries({
        queryKey: [...TABLE_BOOKINGS_QUERY_KEY, variables.business_id],
      });

      console.log('===================================');
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
                         businessId,
                         tableId,
                       }: {
      businessId: string;
      tableId: string;
    }) => {
      return deleteTable(businessId, tableId);
    },
    onSuccess: (_, variables) => {
      // Удаляем из кэша списка
      queryClient.setQueryData<Table[]>(
        [...TABLES_QUERY_KEY, variables.businessId],
        (old = []) => {
          return old.filter((table) => table.id !== variables.tableId);
        }
      );

      // Инвалидируем запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.businessId],
      });
    },
  });
};

// Table Bookings hooks
export const useTableBookings = (businessId: string, tableId: string, initialData?: TableBooking[]) => {
  return useQuery<TableBooking[]>({
    queryKey: [...TABLE_BOOKINGS_QUERY_KEY, businessId, tableId],
    queryFn: () => fetchTableBookings(businessId, tableId),
    placeholderData: initialData,
    enabled: !!businessId && !!tableId,
  });
};

export const useCreateTableBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TableBookingCreateInput) => {
      return createTableBooking(input.business_id, input.table_id, {
        telegram_id: input.telegram_id,
        guest_name: input.guest_name,
        guest_phone: input.guest_phone,
        num_guests: input.num_guests,
        booking_date: input.booking_date,
        booking_time: input.booking_time,
        duration_minutes: input.duration_minutes,
        notes: input.notes,
      });
    },
    onSuccess: (newBooking, variables) => {
      // Обновляем кэш бронирований
      queryClient.setQueryData<TableBooking[]>(
        [...TABLE_BOOKINGS_QUERY_KEY, variables.business_id, variables.table_id],
        (old = []) => {
          return [newBooking, ...old];
        }
      );

      // Инвалидируем запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLE_BOOKINGS_QUERY_KEY, variables.business_id, variables.table_id],
      });

      // Также инвалидируем таблицы, чтобы обновить статус
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.business_id],
      });
    },
  });
};

export const useCancelTableBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
                         businessId,
                         tableId,
                         bookingId,
                       }: {
      businessId: string;
      tableId: string;
      bookingId: string;
    }) => {
      return cancelTableBooking(businessId, tableId, bookingId);
    },
    onSuccess: (_, variables) => {
      // Удаляем бронирование из кэша
      queryClient.setQueryData<TableBooking[]>(
        [...TABLE_BOOKINGS_QUERY_KEY, variables.businessId, variables.tableId],
        (old = []) => {
          return old.filter((booking) => booking.id !== variables.bookingId);
        }
      );

      // Инвалидируем запросы
      queryClient.invalidateQueries({
        queryKey: [...TABLE_BOOKINGS_QUERY_KEY, variables.businessId, variables.tableId],
      });

      // Обновляем таблицы
      queryClient.invalidateQueries({
        queryKey: [...TABLES_QUERY_KEY, variables.businessId],
      });
    },
  });
};