// services/debug.service.ts
import api from './api';
import { HashResponse } from '../types/debug.types';

export const getPasswordHash = async (password: string): Promise<HashResponse> => {
  const response = await api.get<HashResponse>('/api/debug/hash', {
    params: { password },
  });
  return response.data;
};