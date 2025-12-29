// entities/auth/model/types.ts
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  user_agent: string | null;
  ip_address: string | null;
}

export type ContactType = 'email' | 'phone';

export interface SendCodeRequest {
  contact: string;
}

export interface VerifyCodeRequest {
  contact: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}