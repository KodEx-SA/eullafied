import api from '../api/axios';
import type { Role } from '../types';

export const rolesService = {
  async getAll(): Promise<Role[]> {
    const { data } = await api.get<Role[]>('/roles');
    return data;
  },
};
