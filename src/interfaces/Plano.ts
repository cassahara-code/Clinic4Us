import { PlanoBenefit } from "./PlanoBenefit";

export interface Plano {
  id: string;
  planTitle: string;
  description: string;
  monthlyValue: number;
  annuallyValue: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  active: number;
  plansBenefits: PlanoBenefit[];
}
