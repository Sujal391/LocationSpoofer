// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_ROLE_KEY = 'user_role';
const USERNAME_KEY = 'username';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_ROLE_KEY);
    await AsyncStorage.removeItem(USERNAME_KEY);
  } catch (error) {
    console.error('Error removing token', error);
  }
};

export const saveUserRole = async (role: 'admin' | 'user') => {
  try {
    await AsyncStorage.setItem(USER_ROLE_KEY, role);
  } catch (error) {
    console.error('Error saving user role', error);
  }
};

export const getUserRole = async (): Promise<'admin' | 'user' | null> => {
  try {
    return await AsyncStorage.getItem(USER_ROLE_KEY) as 'admin' | 'user' | null;
  } catch (error) {
    console.error('Error getting user role', error);
    return null;
  }
};

export const saveUsername = async (username: string) => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
  } catch (error) {
    console.error('Error saving username', error);
  }
};

export const getUsername = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(USERNAME_KEY);
  } catch (error) {
    console.error('Error getting username', error);
    return null;
  }
};