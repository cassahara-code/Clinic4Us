export interface PlanBenefit {
  id: number;
  planId: number;
  itenDescription: string;
  covered: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface Plan {
  id: number;
  planTitle: string;
  description: string;
  monthlyValue: number;
  anualyValue: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  plansBenefits: PlanBenefit[];
}

export interface CreatePlanRequest {
  planTitle: string;
  description: string;
  monthlyValue: number;
  anualyValue: number;
  plansBenefits: {
    itenDescription: string;
    covered: boolean;
  }[];
}