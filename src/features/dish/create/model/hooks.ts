// features/dish/create/model/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDish,
  prepareDishData,
  updateDish,
  deleteDish,
  prepareDishUpdateData
} from './api';
import type { Dish } from '@/entities/dish/model/types';
import { DishCreateInput, DishUpdateInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aidronik.com';

/**
 * Fetch dishes from API
 */
export const fetchDishes = async (businessId?: string): Promise<Dish[]> => {
  const url = businessId
    ? `${API_URL}/api/v1/dishes?business_id=${businessId}`
    : `${API_URL}/api/v1/dishes`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dishes');
  }

  return response.json();
};

/**
 * Hook to fetch dishes
 */
export const useDishes = (businessId?: string, initialData?: Dish[]) => {
  console.log('=== useDishes Hook ===');
  console.log('businessId:', businessId);
  console.log('initialData:', initialData);
  console.log('initialData length:', initialData?.length);

  const result = useQuery<Dish[]>({
    queryKey: ['dishes', businessId],
    queryFn: () => fetchDishes(businessId),
    placeholderData: initialData,
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

/**
 * Hook to create a dish
 */
export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DishCreateInput) => {
      if (!input.image) {
        throw new Error('Image is required');
      }

      const preparedData = await prepareDishData(input);
      return createDish(preparedData);
    },
    onSuccess: (newDish, variables) => {
      // Update cache with the new dish
      queryClient.setQueryData<Dish[]>(
        ['dishes', variables.business_id],
        (old = []) => {
          return [newDish, ...old];
        }
      );

      // Invalidate queries for reliability
      queryClient.invalidateQueries({
        queryKey: ['dishes', variables.business_id],
      });
    },
  });
};

/**
 * Hook to update a dish
 */
export const useUpdateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
                         dishId,
                         data,
                       }: {
      dishId: string;
      data: DishUpdateInput;
    }) => {
      const preparedData = await prepareDishUpdateData(data);
      return updateDish(dishId, preparedData);
    },
    onSuccess: (updatedDish) => {
      // Update the specific dish in all cached queries
      queryClient.setQueriesData<Dish[]>(
        { queryKey: ['dishes'] },
        (old) => {
          if (!old) return old;
          return old.map((dish) =>
            dish.id === updatedDish.id ? updatedDish : dish
          );
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
};

/**
 * Hook to delete a dish
 */
export const useDeleteDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDish,
    onSuccess: (_, deletedDishId) => {
      // Remove the dish from all cached queries
      queryClient.setQueriesData<Dish[]>(
        { queryKey: ['dishes'] },
        (old) => {
          if (!old) return old;
          return old.filter((dish) => dish.id !== deletedDishId);
        }
      );

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
};