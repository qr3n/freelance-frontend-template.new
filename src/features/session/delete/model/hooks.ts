'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteSession } from './api';

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Сессия успешно удалена');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Не удалось удалить сессию');
    },
  });
}