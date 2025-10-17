import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { EntityRequest, EntityResponse } from "../types/entity";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const entityService = {
  getAllEntities: async (): Promise<EntityResponse[]> => {
    const response = await api.get("/Entities");
    return response.data;
  },
  createEntity: async (data: EntityRequest): Promise<EntityResponse> => {
    const response = await api.post("/Entities", data);
    return response.data;
  },
  updateEntity: async (id: string, data: EntityRequest): Promise<EntityResponse> => {
    const response = await api.put(`/Entities/${id}`, data);
    return response.data;
  },
  deleteEntity: async (id: string): Promise<void> => {
    await api.delete(`/Entities/${id}`);
  },
};
