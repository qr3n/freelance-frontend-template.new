// entities/auth/model/hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from './api';
import type { SendCodeRequest, VerifyCodeRequest } from './types';

export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
  sessions: ['auth', 'sessions'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: () => authAPI.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSendCode() {
  return useMutation({
    mutationFn: (data: SendCodeRequest) => authAPI.sendCode(data),
  });
}

export function useVerifyCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => authAPI.verifyCode(data),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.sessions });
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.sessions,
    queryFn: () => authAPI.getSessions(),
    staleTime: 60 * 1000,
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authAPI.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.sessions });
    },
  });
}