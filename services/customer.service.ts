// services/customer.service.ts
import api from './api';
import { Customer } from '../types/customer.types';

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    console.log('Fetching customers...');
    const response = await api.get<Customer[]>('/api/users/customers');
    console.log('Customers fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};