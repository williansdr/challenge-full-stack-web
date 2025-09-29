// src/types/auth.ts

import type { UserRole } from "./student";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  ra: string;
  role: UserRole;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
