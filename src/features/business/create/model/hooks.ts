// features/business/create/model/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBusiness, fetchBusinesses } from './api';
import type { BusinessCreateData, Business } from './types';

const BUSINESSES_QUERY_KEY = ['businesses'] as const;

export const useBusinesses = () => {
  return useQuery({
    queryKey: BUSINESSES_QUERY_KEY,
    queryFn: fetchBusinesses,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BusinessCreateData) => createBusiness(data),
    onSuccess: (newBusiness) => {
      queryClient.setQueryData<Business[]>(BUSINESSES_QUERY_KEY, (old = []) => {
        return [newBusiness, ...old];
      });
    },
  });
};