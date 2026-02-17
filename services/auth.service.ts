// services/auth.service.ts
import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';
import { saveToken } from '../utils/storage';

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