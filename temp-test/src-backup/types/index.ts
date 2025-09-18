export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  medicalHistory?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}