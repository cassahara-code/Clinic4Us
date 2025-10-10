import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '../interfaces/Patient';

const mockPatients: Patient[] = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-9999' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 88888-8888' },
  { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 77777-7777' },
];

const fetchPatients = async (): Promise<Patient[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockPatients;
};

const createPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...patient, id: Date.now() };
};

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};