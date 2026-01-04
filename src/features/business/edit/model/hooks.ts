'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateBusiness } from './api';
import type { BusinessUpdateData } from './types';
import type { Business } from '@/entities/business/model/types';

const BUSINESSES_QUERY_KEY = ['businesses'] as const;

export const useUpdateBusiness = (businessId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: BusinessUpdateData) => updateBusiness(businessId, data),
    onSuccess: (updatedBusiness) => {
      queryClient.setQueryData<Business[]>(BUSINESSES_QUERY_KEY, (old = []) => {
        return old.map((business) =>
          business.id === businessId ? updatedBusiness : business
        );
      });
      queryClient.invalidateQueries({ queryKey: BUSINESSES_QUERY_KEY });
      toast.success('Бизнес успешно обновлён');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось обновить бизнес');
    },
  });

  return mutation;
};
