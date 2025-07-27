export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: "user" | "admin";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthError {
  error: string;
  details: string[];
}
