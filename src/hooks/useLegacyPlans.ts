import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLegacyPlans,
  createLegacyPlan,
  updateLegacyPlan,
  deleteLegacyPlan,
  PlanLegacy,
} from '../services/planLegacyService';

export function useLegacyPlans() {
  return useQuery({
    queryKey: ['legacyPlans'],
    queryFn: getLegacyPlans,
  });
}

export function useCreateLegacyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLegacyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyPlans'] });
    },
  });
}

export function useUpdateLegacyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLegacyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyPlans'] });
    },
  });
}

export function useDeleteLegacyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLegacyPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legacyPlans'] });
    },
  });
}
