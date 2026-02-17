// services/auth.service.ts
import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';
import { saveToken } from '../utils/storage';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/auth/login', data);
  if (response.data.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/api/auth/create-customer', data);
  return response.data;
};