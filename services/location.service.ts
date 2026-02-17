// services/location.service.ts
import api from './api';
import { LocationData, LocationResponse } from '../types/location.types';

export const setLocation = async (location: LocationData): Promise<LocationResponse> => {
  const response = await api.post<LocationResponse>('/api/location/set', location);
  return response.data;
};