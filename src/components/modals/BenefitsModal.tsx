import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

interface Benefit {
  id: string;
  name: string;
}

interface BenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
}

const BenefitsModal: React.FC<BenefitsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', name: 'Agenda básica' },
    { id: '2', name: 'Cadastro de pacientes' },
    { id: '3', name: 'Relatórios simples' },
    { id: '4', name: 'Agenda avançada' },
    { id: '5', name: 'Múltiplos profissionais' },
    { id: '6', name: 'Relatórios completos' },
    { id: '7', name: 'Integração WhatsApp' },
    { id: '8', name: 'Recursos ilimitados' },
    { id: '9', name: 'API personalizada' },
    { id: '10', name: 'Suporte 24/7' },
    { id: '11', name: 'Customizações' }
  ]);

  const [newBenefitName, setNewBenefitName] = useState('');
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);

  const handleAddBenefit = () => {
    if (newBenefitName.trim()) {
      if (editingBenefitId) {
        setBenefits(benefits.map(ben =>
          ben.id === editingBenefitId
            ? { ...ben, name: newBenefitName.trim() }
            : ben
        ));
        setEditingBenefitId(null);
      } else {
        const newBenefit: Benefit = {
          id: `ben-${Date.now()}`,
          name: newBenefitName.trim()
        };
        setBenefits([...benefits, newBenefit]);
      }
      setNewBenefitName('');
    }
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setNewBenefitName(benefit.name);
    setEditingBenefitId(benefit.id);
  };

  const handleDeleteBenefit = (benefitId: string) => {
    setBenefits(benefits.filter(ben => ben.id !== benefitId));
  };

  const handleClose = () => {
    setEditingBenefitId(null);
    setNewBenefitName('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary,
          color: colors.white,
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h3" sx={{ fontSize: '1.4rem', fontWeight: typography.fontWeight.semibold, margin: 0 }}>
          Benefícios dos Planos
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Typography sx={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: colors.textSecondary }}>
          Benefícios são as funcionalidades e recursos incluídos em cada plano.
        </Typography>

        <Box sx={{ marginBottom: '1.5rem' }}>
          <TextField
            label={editingBenefitId ? 'Editar Benefício' : 'Benefício'}
            value={newBenefitName}
            onChange={(e) => setNewBenefitName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddBenefit();
              }
            }}
            placeholder="Benefício"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: inputs.default.height,
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.border },
                '&.Mui-focused fieldset': { borderColor: colors.primary }
              },
              '& .MuiInputLabel-root': {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                '&.Mui-focused': { color: colors.primary }
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {editingBenefitId && (
              <Button
                onClick={() => {
                  setEditingBenefitId(null);
                  setNewBenefitName('');
                }}
                variant="outlined"
                sx={{
                  padding: '0.75rem 1.5rem',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  backgroundColor: colors.white,
                  color: colors.textSecondary,
                  fontSize: '1rem',
                  fontWeight: typography.fontWeight.semibold,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: colors.background,
                    borderColor: '#adb5bd',
                  }
                }}
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={handleAddBenefit}
              variant="contained"
              sx={{
                flex: '1 1 auto',
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: colors.primary,
                color: colors.white,
                fontSize: '1rem',
                fontWeight: typography.fontWeight.semibold,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#029AAB',
                  boxShadow: 'none',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Salvar
            </Button>
          </Box>
        </Box>

        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', padding: '0.75rem', backgroundColor: colors.backgroundAlt, borderBottom: `2px solid ${colors.border}`, fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.sm }}>
            <Box sx={{ flex: '1 1 auto', textAlign: 'left' }}>Benefício</Box>
            <Box sx={{ flex: '0 0 140px', textAlign: 'right' }}>Ações</Box>
          </Box>

          {benefits.map((benefit) => (
            <Box
              key={benefit.id}
              sx={{
                display: 'flex',
                padding: '1rem 0.75rem',
                borderBottom: `1px solid ${colors.backgroundAlt}`,
                '&:hover': { backgroundColor: colors.background }
              }}
            >
              <Box sx={{ flex: '1 1 auto', textAlign: 'left', color: colors.text }}>{benefit.name}</Box>
              <Box sx={{ flex: '0 0 140px', textAlign: 'left', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={() => handleEditBenefit(benefit)}
                  title="Editar benefício"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: colors.textSecondary,
                    padding: '0.5rem',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteBenefit(benefit.id)}
                  title="Excluir benefício"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: colors.textSecondary,
                    padding: '0.5rem',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BenefitsModal;
