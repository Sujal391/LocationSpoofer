// services/auth.service.ts
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';
import { saveToken } from '../utils/storage';
import api from './api';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Making login API call...');
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    console.log('API Response:', response.data);
    
    // Save token
    if (response.data.token) {
      await saveToken(response.data.token);
      console.log('Token saved');
    }
    
    if (response.data.token) {
      await saveToken(response.data.token);
      api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      console.log('Token saved and header set');
    }

    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/api/auth/create-customer', data);
  return response.data;
};