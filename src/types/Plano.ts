export interface PlanoBenefit {
  id: string;
  planId: string;
  itenDescription: string;
  covered: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Plano {
  id: string;
  planTitle: string;
  description: string;
  monthlyValue: number;
  anualyValue: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;  
  updatedBy: string;
  active: number
  plansBenefits: PlanoBenefit[];
}

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
