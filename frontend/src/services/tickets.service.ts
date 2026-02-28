import api from '../api/axios';
import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../types';

export const ticketsService = {
  async getAll(): Promise<Ticket[]> {
    const { data } = await api.get<Ticket[]>('/tickets');
    return data;
  },

  async getOne(id: string): Promise<Ticket> {
    const { data } = await api.get<Ticket>(`/tickets/${id}`);
    return data;
  },

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const { data } = await api.post<Ticket>('/tickets', dto);
    return data;
  },

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const { data } = await api.patch<Ticket>(`/tickets/${id}`, dto);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`);
  },
};
