import api from '../api/axios';
import type { Department } from '../types';

interface CreateDepartmentDto {
  name: string;
  description?: string;
  headOfDepartment?: string;
}

export const departmentsService = {
  async getAll(): Promise<Department[]> {
    const { data } = await api.get<Department[]>('/departments');
    return data;
  },

  async getOne(id: string): Promise<Department> {
    const { data } = await api.get<Department>(`/departments/${id}`);
    return data;
  },

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const { data } = await api.post<Department>('/departments', dto);
    return data;
  },

  async update(id: string, dto: Partial<CreateDepartmentDto>): Promise<Department> {
    const { data } = await api.patch<Department>(`/departments/${id}`, dto);
    return data;
  },
};
