import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { usePlans, useDeletePlan } from "../../hooks/usePlans";
import { Plan } from "../../types/Plan";
import { PlanForm } from "./PlanForm";

export const PlanList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const { data: plans, isLoading, error } = usePlans();
  const deletePlanMutation = useDeletePlan();

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleDelete = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        await deletePlanMutation.mutateAsync(planToDelete.id);
        setDeleteConfirmOpen(false);
        setPlanToDelete(null);
      } catch (error) {
        console.error("Erro ao deletar plano:", error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPlan(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPlan(undefined);
  };

  if (showForm) {
    return (
      <PlanForm
        plan={selectedPlan}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Erro ao carregar planos. Tente novamente.</Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Administração de Planos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
        >
          Novo Plano
        </Button>
      </Box>

      {deletePlanMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao deletar plano. Tente novamente.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor Mensal</TableCell>
              <TableCell>Valor Anual</TableCell>
              <TableCell>Benefícios</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.planTitle}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  {plan.description.length > 50
                    ? `${plan.description.substring(0, 50)}...`
                    : plan.description}
                </TableCell>
                <TableCell>R$ {plan.monthlyValue.toFixed(2)}</TableCell>
                <TableCell>R$ {plan.anualyValue.toFixed(2)}</TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {plan.plansBenefits.slice(0, 3).map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit.itenDescription}
                        size="small"
                        color={benefit.covered ? "success" : "default"}
                      />
                    ))}
                    {plan.plansBenefits.length > 3 && (
                      <Chip
                        label={`+${plan.plansBenefits.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(plan)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(plan)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o plano "{planToDelete?.planTitle}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deletePlanMutation.isPending}
          >
            {deletePlanMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
