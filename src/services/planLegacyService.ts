import axios from 'axios';

export interface PlanLegacyBenefit {
  itenDescription: string;
  covered: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PlanLegacy {
  planTitle: string;
  description: string;
  monthlyValue: number;
  anualyValue: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  plansBenefits: PlanLegacyBenefit[];
}

export const getLegacyPlans = async (): Promise<PlanLegacy[]> => {
  const { data } = await axios.get('/api/Plan/legacy');
  return data;
};

export const createLegacyPlan = async (plan: PlanLegacy): Promise<PlanLegacy> => {
  const { data } = await axios.post('/api/Plan/legacy', plan);
  return data;
};

export const updateLegacyPlan = async ({ id, plan }: { id: string; plan: PlanLegacy }): Promise<PlanLegacy> => {
  const { data } = await axios.put(`/api/Plan/legacy/${id}`, plan);
  return data;
};

export const deleteLegacyPlan = async (id: string): Promise<void> => {
  await axios.delete(`/api/Plan/legacy/${id}`);
};
