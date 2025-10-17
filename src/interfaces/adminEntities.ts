export interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  loginTime: string;
}

export interface Entity {
  id: string;
  fantasyName: string;
  cnpjCpf: string;
  socialName: string;
  workingHours: string;
  entityType?: "juridica" | "fisica";
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  ddd?: string;
  phone?: string;
  email?: string;
  addressZipcode?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressComplement?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  startTime?: string;
  endTime?: string;
}
