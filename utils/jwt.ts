// utils/jwt.ts
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  username?: string;
  role?: 'admin' | 'user';
  sub?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserRoleFromToken = (token: string): 'admin' | 'user' | null => {
  const decoded = decodeToken(token);
  // Check different possible field names for role
  return decoded?.role || decoded?.userRole || decoded?.type || null;
};

export const getUsernameFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  // Check different possible field names for username
  return decoded?.username || decoded?.sub || decoded?.user || decoded?.name || null;
};