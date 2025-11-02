import { cookies } from 'next/headers';

export const COOKIE_NAMES = {
  SESSION_TOKEN: 'session_token',
  CSRF_TOKEN: 'csrf_token',
} as const;

export const getCsrfToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.CSRF_TOKEN)?.value || null;
};

export const getSessionToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.SESSION_TOKEN)?.value || null;
};
