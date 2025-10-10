import { useMutation } from "@tanstack/react-query";
import { planoService } from "../services/planoService";
import { CreatePlanoRequest } from "../interfaces/CreatePlanoRequest";

export const useCreateLegacyPlano = () => {
  return useMutation({
    mutationFn: planoService.createLegacyPlano,
  });
};

export const useUpdateLegacyPlano = () => {
  return useMutation({
    mutationFn: ({ id, plano }: { id: string; plano: CreatePlanoRequest }) =>
      planoService.updateLegacyPlano(id, plano),
  });
};

export const useDeleteLegacyPlano = () => {
  return useMutation({
    mutationFn: planoService.deleteLegacyPlano,
  });
};
