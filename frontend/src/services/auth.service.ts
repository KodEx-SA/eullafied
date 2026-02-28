import api from '../api/axios';
import type { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — clear tokens regardless
    }
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async refreshTokens(userId: string, refreshToken: string) {
    const { data } = await api.post('/auth/refresh', { userId, refreshToken });
    return data;
  },
};
