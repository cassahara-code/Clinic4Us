import { PlanoBenefit } from "./PlanoBenefit";

export interface CreatePlanoRequest {
  id: string;
  planTitle: string;
  description: string;
  monthlyValue: number;
  anualyValue: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  plansBenefits: PlanoBenefit[];
}
