// shared/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { userAtom, isLoadingAuthAtom } from '@/features/auth/model/storage';
import { getCurrentUser } from '@/features/auth/login/model/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom);
  const setIsLoading = useSetAtom(isLoadingAuthAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        setUser(user);
        queryClient.setQueryData(['currentUser'], user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, setIsLoading, queryClient]);

  return <>{children}</>;
}