// services/user.service.ts
import api from './api';

export interface UserInfo {
  username: string;
  role: 'Admin' | 'Customer';
}

// You'll need to create this endpoint on your backend
// This is a placeholder - adjust based on your actual API
export const getUserInfo = async (): Promise<UserInfo> => {
  // If you have a /api/auth/me endpoint:
  // const response = await api.get<UserInfo>('/api/auth/me');
  // return response.data;
  
  // For now, we'll simulate based on username
  // You should replace this with actual API call
  const token = await api.defaults.headers.common['Authorization'];
  
  // This is a temporary solution - you MUST implement proper user info endpoint
  // For demo purposes, we'll decode the username from somewhere
  // In production, you should have a /api/auth/me endpoint
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // This is just for demonstration - replace with actual API
      resolve({
        username: 'user', // This should come from your API
        role: 'Customer' // This should come from your API
      });
    }, 500);
  });
};