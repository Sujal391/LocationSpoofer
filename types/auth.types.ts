// types/auth.types.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string; // "Customer" or "Admin" (assuming)
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message?: string;
  userId?: string;
}