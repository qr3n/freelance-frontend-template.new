import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './config';

export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname);
};

export const shouldRedirectToAuth = (pathname: string, isAuthenticated: boolean): boolean => {
  return isProtectedRoute(pathname) && !isAuthenticated;
};

export const shouldRedirectFromAuth = (pathname: string, isAuthenticated: boolean): boolean => {
  return pathname.startsWith('/auth') && isAuthenticated;
};