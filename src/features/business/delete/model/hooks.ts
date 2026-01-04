'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteBusiness } from './api';

const BUSINESSES_QUERY_KEY = ['businesses'] as const;

export const useDeleteBusiness = (businessId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteBusiness(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESSES_QUERY_KEY });
      toast.success('Бизнес успешно удалён');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось удалить бизнес');
    },
  });

  return mutation;
};
