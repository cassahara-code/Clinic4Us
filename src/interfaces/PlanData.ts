import { PlanFeature } from "./PlanFeature";
export interface PlanData {
  name: string;
  description: string;
  price: number;
  annualPrice: number;
  duration: number;
  maxUsers: number;
  monthlyValue: number;
  annuallyValue: number;
  features: PlanFeature[];
  status: "Ativo" | "Inativo";
}
