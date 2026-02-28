import api from '../api/axios';
import type { User } from '../types';

interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
}

interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roleId?: string;
  departmentId?: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  async getOne(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async create(dto: CreateUserDto): Promise<User> {
    const { data } = await api.post<User>('/users', dto);
    return data;
  },

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, dto);
    return data;
  },

  async deactivate(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
