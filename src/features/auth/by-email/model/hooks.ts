import { AuthorizationService, UserLogin, UserRegistration } from '@shared/api';
import { useMutation } from '@tanstack/react-query';

export const useAuthByEmail = () => {
  const signInMutation = useMutation({
    mutationFn: (data: UserLogin) =>
      AuthorizationService.login({ requestBody: data }),
    mutationKey: ['auth', 'signIn']
  });

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegistration) =>
      AuthorizationService.register({ requestBody: data }),
    mutationKey: ['auth', 'signUp']
  });

  return {
    signIn: signInMutation.mutate,
    signInState: {
      isLoading: signInMutation.isPending,
      isError: signInMutation.isError,
      error: signInMutation.error,
      data: signInMutation.data
    },
    signUp: signUpMutation.mutate,
    signUpState: {
      isLoading: signUpMutation.isPending,
      isError: signUpMutation.isError,
      error: signUpMutation.error,
      data: signUpMutation.data
    }
  };
};