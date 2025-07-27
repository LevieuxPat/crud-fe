import axios from "axios";
import {Patient, PatientInput} from "@/types/patient";
import {AuthResponse, LoginRequest, RegisterRequest, User,} from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://crud-be-ujjp.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not on the login page (root path)
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  // Register
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<{ users: User[] }> => {
    const response = await api.get<{ users: User[] }>("/auth/users");
    return response.data;
  },
};

export const patientApi = {
  // Get all patients
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  // Get patient by ID
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (patient: PatientInput): Promise<Patient> => {
    const response = await api.post<Patient>("/patients", patient);
    return response.data;
  },

  // Update patient
  update: async (
    id: number,
    patient: Partial<PatientInput>
  ): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${id}`, patient);
    return response.data;
  },

  // Delete patient
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/patients/${id}`);
    return response.data;
  },

  // Health check
  health: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get<{ status: string; timestamp: string }>(
      "/health"
    );
    return response.data;
  },
};

export default api;
