export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  emergencyContact: EmergencyContact;
  createdAt: string;
}

export interface PatientInput {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  emergencyContact?: EmergencyContact;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string[];
}
