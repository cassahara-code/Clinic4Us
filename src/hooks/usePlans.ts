import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { planService } from '../services/planService';
import { CreatePlanRequest } from '../types/Plan';

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: planService.getAllPlans,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados "fresh"
    gcTime: 10 * 60 * 1000, // 10 minutos - tempo no cache
    refetchOnWindowFocus: false, // Não refetch ao focar janela
    refetchOnMount: false, // Não refetch ao montar se já tem dados
    refetchOnReconnect: false, // Não refetch ao reconectar
  });
};

export const usePlan = (id: number) => {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: () => planService.getPlanById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: planService.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, plan }: { id: number; plan: CreatePlanRequest }) =>
      planService.updatePlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: planService.deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};