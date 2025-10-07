import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { Plano, CreatePlanoRequest } from "../types/Plano";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const planoService = {
  getAllPlanos: async (): Promise<Plano[]> => {
    const response = await api.get("/Plan/legacy");
    return response.data;
  },
  createLegacyPlano: async (plano: CreatePlanoRequest): Promise<Plano> => {
    const response = await api.post("/Plan/legacy", plano);
    return response.data;
  },
  updateLegacyPlano: async (id: string, plano: CreatePlanoRequest): Promise<Plano> => {
    const response = await api.put(`/Plan/legacy/${id}`, plano);
    return response.data;
  },
  deleteLegacyPlano: async (id: string): Promise<void> => {
    await api.delete(`/Plan/legacy/${id}`);
  },
};
