export const AUTH_ROUTES = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  GOOGLE: '/auth/google',
  GITHUB: '/auth/github',
} as const;

export const PROTECTED_ROUTES = ['/dashboard', '/profile', '/projects'];
export const PUBLIC_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/'];