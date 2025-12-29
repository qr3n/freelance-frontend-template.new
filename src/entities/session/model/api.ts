import type { Session } from '@/entities/session/model/types';
import { User } from '@/entities/auth/model/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aidronik.com';

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/me`,
    {
      credentials: 'include',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}

export async function getUserSessions(): Promise<Session[]> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/sessions`,
    {
      credentials: 'include',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
}