export interface PlanoBenefit {
  itenDescription: string;
  covered: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Plano {
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

export interface CreatePlanoRequest {
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
