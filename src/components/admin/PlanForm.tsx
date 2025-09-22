import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useCreatePlan, useUpdatePlan } from "../../hooks/usePlans";
import { Plan, CreatePlanRequest } from "../../types/Plan";

interface PlanFormProps {
  plan?: Plan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BenefitForm {
  itenDescription: string;
  covered: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  plan,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    planTitle: "",
    description: "",
    monthlyValue: 0,
    anualyValue: 0,
  });

  const [benefits, setBenefits] = useState<BenefitForm[]>([
    { itenDescription: "", covered: true },
  ]);

  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  useEffect(() => {
    if (plan) {
      setFormData({
        planTitle: plan.planTitle,
        description: plan.description,
        monthlyValue: plan.monthlyValue,
        anualyValue: plan.anualyValue,
      });
      setBenefits(
        plan.plansBenefits.map((benefit) => ({
          itenDescription: benefit.itenDescription,
          covered: benefit.covered,
        }))
      );
    }
  }, [plan]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBenefitChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setBenefits((prev) =>
      prev.map((benefit, i) =>
        i === index ? { ...benefit, [field]: value } : benefit
      )
    );
  };

  const addBenefit = () => {
    setBenefits((prev) => [...prev, { itenDescription: "", covered: true }]);
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const planData: CreatePlanRequest = {
      ...formData,
      plansBenefits: benefits.filter(
        (benefit) => benefit.itenDescription.trim() !== ""
      ),
    };

    try {
      if (plan) {
        await updatePlanMutation.mutateAsync({ id: plan.id, plan: planData });
      } else {
        await createPlanMutation.mutateAsync(planData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    }
  };

  const isLoading =
    createPlanMutation.isPending || updatePlanMutation.isPending;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {plan ? "Editar Plano" : "Novo Plano"}
      </Typography>

      {(createPlanMutation.isError || updatePlanMutation.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao salvar plano. Tente novamente.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Título do Plano"
            value={formData.planTitle}
            onChange={(e) => handleInputChange("planTitle", e.target.value)}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descrição"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor Mensal (R$)"
              value={formData.monthlyValue}
              onChange={(e) =>
                handleInputChange(
                  "monthlyValue",
                  parseFloat(e.target.value) || 0
                )
              }
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Valor Anual (R$)"
              value={formData.anualyValue}
              onChange={(e) =>
                handleInputChange(
                  "anualyValue",
                  parseFloat(e.target.value) || 0
                )
              }
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Benefícios do Plano</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addBenefit}
              variant="outlined"
              size="small"
            >
              Adicionar Benefício
            </Button>
          </Box>

          <Stack spacing={2}>
            {benefits.map((benefit, index) => (
              <Box
                key={index}
                sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    sx={{ flex: 1 }}
                    label={`Benefício ${index + 1}`}
                    value={benefit.itenDescription}
                    onChange={(e) =>
                      handleBenefitChange(
                        index,
                        "itenDescription",
                        e.target.value
                      )
                    }
                    required
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={benefit.covered}
                        onChange={(e) =>
                          handleBenefitChange(
                            index,
                            "covered",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Incluído"
                  />
                  <IconButton
                    onClick={() => removeBenefit(index)}
                    disabled={benefits.length === 1}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Salvando..." : plan ? "Atualizar" : "Criar Plano"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};
