import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { benefitsService, BenefitPayload } from "../services/benefitsService";

export const useBenefits = () =>
  useQuery({
    queryKey: ["benefits"],
    queryFn: benefitsService.getAll,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useCreateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: benefitsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
  });
};

export const useUpdateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: benefitsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
  });
};

export const useDeleteBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: benefitsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
    },
  });
};