// entities/auth/model/api.ts
import type {
  User,
  Session,
  SendCodeRequest,
  VerifyCodeRequest,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aidronik.com';
const API_PREFIX = '/api/v1';

class AuthAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}${API_PREFIX}/auth`;
  }

  async sendCode(data: SendCodeRequest): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send code');
    }

    return response.json();
  }

  async verifyCode(data: VerifyCodeRequest): Promise<User> {
    const response = await fetch(`${this.baseUrl}/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to verify code');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }
  }

  async getSessions(): Promise<Session[]> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return response.json();
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }
}

export const authAPI = new AuthAPI();