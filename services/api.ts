// services/api.ts
import axios from 'axios';
import * as Storage from '../utils/storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await Storage.getToken();

    console.log("BASE URL:", config.baseURL);
    console.log("ENDPOINT:", config.url);
    console.log("FULL REQUEST URL:", config.baseURL + config.url);
    console.log("INTERCEPTOR TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("HEADERS:", config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;