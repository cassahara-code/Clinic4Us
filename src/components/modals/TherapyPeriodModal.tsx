import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Autocomplete,
  Chip
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

interface TherapyPeriod {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  administrators: string[];
}

interface TherapyPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (periods: TherapyPeriod[]) => void;
}

const TherapyPeriodModal: React.FC<TherapyPeriodModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [periods, setPeriods] = useState<TherapyPeriod[]>([
    {
      id: '1',
      title: 'Período 01',
      description: 'Primeiro semestre',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      administrators: ['Hilton Cassahara - Diretoria']
    },
    {
      id: '2',
      title: 'Período 02',
      description: 'Segundo semestre',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      administrators: ['Hilton Cassahara - Diretoria']
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    administrators: [] as string[]
  });

  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);

  // Mock de administradores disponíveis
  const availableAdministrators = [
    'Hilton Cassahara - Diretoria',
    'Dr. Silva - Coordenação',
    'Dra. Oliveira - Supervisão',
    'Dr. Santos - Gestão',
    'Dra. Costa - Administração'
  ];

  const handleSavePeriod = () => {
    if (formData.title.trim() && formData.startDate && formData.endDate) {
      if (editingPeriodId) {
        setPeriods(periods.map(period =>
          period.id === editingPeriodId
            ? { ...period, ...formData }
            : period
        ));
        setEditingPeriodId(null);
      } else {
        const newPeriod: TherapyPeriod = {
          id: `period-${Date.now()}`,
          ...formData
        };
        setPeriods([...periods, newPeriod]);
      }
      resetForm();
    }
  };

  const handleEditPeriod = (period: TherapyPeriod) => {
    setFormData({
      title: period.title,
      description: period.description,
      startDate: period.startDate,
      endDate: period.endDate,
      administrators: period.administrators
    });
    setEditingPeriodId(period.id);
  };

  const handleDeletePeriod = (periodId: string) => {
    setPeriods(periods.filter(period => period.id !== periodId));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      administrators: []
    });
    setEditingPeriodId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
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
          Períodos de execução
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Box sx={{ display: 'flex', gap: '2rem' }}>
          {/* Formulário à esquerda */}
          <Box sx={{ flex: '0 0 400px' }}>
            <TextField
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                marginBottom: '1rem',
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

            <TextField
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição"
              fullWidth
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
              sx={{
                marginBottom: '1rem',
                '& .MuiOutlinedInput-root': {
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

            <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <TextField
                label="Data Inicial"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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

              <TextField
                label="Data Final"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
            </Box>

            <Autocomplete
              multiple
              options={availableAdministrators}
              value={formData.administrators}
              onChange={(event, newValue) => {
                setFormData({ ...formData, administrators: newValue });
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      backgroundColor: colors.backgroundAlt,
                      '& .MuiChip-deleteIcon': {
                        color: colors.textSecondary,
                        '&:hover': { color: colors.text }
                      }
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Administradores"
                  placeholder="Selecione administradores"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              sx={{
                marginBottom: '1.5rem',
                '& .MuiOutlinedInput-root': {
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

            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              {editingPeriodId && (
                <Button
                  onClick={resetForm}
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
                onClick={handleSavePeriod}
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
                Cadastrar
              </Button>
            </Box>
          </Box>

          {/* Períodos à direita */}
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: typography.fontWeight.semibold, marginBottom: '1rem' }}>
              Períodos
            </Typography>
            <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              {/* Cabeçalho da tabela */}
              <Box sx={{
                display: 'flex',
                padding: '12px 16px',
                backgroundColor: '#e9ecef',
                borderBottom: '2px solid #dee2e6',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#495057'
              }}>
                <Box sx={{ flex: '0 0 150px', textAlign: 'left' }}>Título</Box>
                <Box sx={{ flex: '0 0 150px', textAlign: 'left' }}>Data Inicial</Box>
                <Box sx={{ flex: '0 0 150px', textAlign: 'left' }}>Data Final</Box>
                <Box sx={{ flex: '0 0 100px', textAlign: 'right' }}>Ações</Box>
              </Box>

              {/* Linhas da tabela */}
              {periods.map((period, index) => (
                <Box
                  key={period.id}
                  sx={{
                    display: 'flex',
                    padding: '12px 16px',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                    borderBottom: '1px solid #e9ecef',
                    '&:hover': { backgroundColor: '#f0f9fa' }
                  }}
                >
                  <Box sx={{ flex: '0 0 150px', textAlign: 'left', color: '#212529', fontSize: '0.875rem' }}>
                    {period.title}
                  </Box>
                  <Box sx={{ flex: '0 0 150px', textAlign: 'left', color: '#6c757d', fontSize: '0.875rem' }}>
                    {new Date(period.startDate).toLocaleDateString('pt-BR')}
                  </Box>
                  <Box sx={{ flex: '0 0 150px', textAlign: 'left', color: '#6c757d', fontSize: '0.875rem' }}>
                    {new Date(period.endDate).toLocaleDateString('pt-BR')}
                  </Box>
                  <Box sx={{ flex: '0 0 100px', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => handleEditPeriod(period)}
                      title="Editar período"
                      sx={{
                        backgroundColor: colors.primary,
                        color: colors.white,
                        padding: '0.5rem',
                        width: '32px',
                        height: '32px',
                        '&:hover': { backgroundColor: '#029AAB' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeletePeriod(period.id)}
                      title="Excluir período"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        color: colors.textSecondary,
                        padding: '0.5rem',
                        width: '32px',
                        height: '32px',
                        '&:hover': { backgroundColor: '#e0e0e0' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TherapyPeriodModal;
