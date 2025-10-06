import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

export interface BenefitPayload {
  id?: string;
  description: string;
}

export const benefitsService = {
  create: async (benefit: BenefitPayload) => {
    const response = await axios.post(`${API_BASE_URL}/Benefits`, benefit);
    return response.data;
  },
  update: async (benefit: BenefitPayload) => {
    const response = await axios.put(`${API_BASE_URL}/Benefits/${benefit.id}`, benefit);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/Benefits/${id}`);
    return response.data;
  },
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/Benefits`);
    return response.data;
  },
};