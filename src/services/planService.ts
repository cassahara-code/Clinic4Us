import axios from 'axios';
import { Plan, CreatePlanRequest } from '../types/Plan';

const API_BASE_URL = 'https://localhost:7185/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planService = {
  getAllPlans: async (): Promise<Plan[]> => {
    const response = await api.get('/Plan');
    console.log("--=====>", response)
    return response.data;
  },

  getPlanById: async (id: number): Promise<Plan> => {
    const response = await api.get(`/Plan/${id}`);
    return response.data;
  },

  createPlan: async (plan: CreatePlanRequest): Promise<Plan> => {
    const response = await api.post('/Plan', plan);
    return response.data;
  },

  updatePlan: async (id: number, plan: CreatePlanRequest): Promise<Plan> => {
    const response = await api.put(`/Plan/${id}`, plan);
    return response.data;
  },

  deletePlan: async (id: number): Promise<void> => {
    await api.delete(`/Plan/${id}`);
  },
};