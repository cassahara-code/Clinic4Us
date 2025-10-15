export interface EntityRequest {
  active: boolean;
  addressCity: string;
  addressComplement: string;
  addressDistrict: string;
  addressNumber: string;
  addressState: string;
  addressStreet: string;
  addressZipcode: string;
  companyName: string;
  defaultEntity: boolean;
  document: string;
  email: string;
  entityNickName: string;
  finalWorkHour: string;
  initialWorkHour: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  personType: 'juridica' | 'fisica';
  phone: string;
  phoneCodeArea: string;
  whatsappNumber: number;
  slug: string;
}

export interface EntityResponse {
  id: string;
  // outros campos retornados pela API
}
