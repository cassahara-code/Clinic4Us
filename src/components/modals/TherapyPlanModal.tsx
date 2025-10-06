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
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

interface TherapyPlanFormData {
  title: string;
  justification: string;
  qualityLevel: string;
  objective: string;
  qualityLevelPreferred: string;
  sessionsQuantity: string;
  metric: string;
  observations: string;
  period: string;
  priority: string;
  startDate: string;
  endDate: string;
  cid: string;
  disregardCid: boolean;
  team: string;
  professional: string;
  specialty: string;
  responsibles: string;
}

interface TherapyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: TherapyPlanFormData) => void;
  editData?: TherapyPlanFormData | null;
  mode: 'add' | 'edit' | 'delete';
}

const TherapyPlanModal: React.FC<TherapyPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  mode
}) => {
  const [formData, setFormData] = useState<TherapyPlanFormData>(
    editData || {
      title: '',
      justification: '',
      qualityLevel: '',
      objective: '',
      qualityLevelPreferred: '',
      sessionsQuantity: '',
      metric: '',
      observations: '',
      period: '',
      priority: '',
      startDate: '',
      endDate: '',
      cid: '',
      disregardCid: false,
      team: '',
      professional: '',
      specialty: '',
      responsibles: ''
    }
  );

  // Mock data para os selects
  const qualityLevels = [
    'Pretendido (Objetivo)',
    'Deve ser pretendido que é marcador da justificativa'
  ];

  const priorities = ['Baixa', 'Média', 'Alta'];
  const periods = ['Período 01', 'Período 02'];
  const cids = ['CID 1', 'CID 2', 'CID 3'];
  const teams = ['Equipe 1', 'Equipe 2', 'Equipe 3'];
  const professionals = ['Profissional 1', 'Profissional 2', 'Profissional 3'];
  const specialties = ['Especialidade 1', 'Especialidade 2', 'Especialidade 3'];

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      justification: '',
      qualityLevel: '',
      objective: '',
      qualityLevelPreferred: '',
      sessionsQuantity: '',
      metric: '',
      observations: '',
      period: '',
      priority: '',
      startDate: '',
      endDate: '',
      cid: '',
      disregardCid: false,
      team: '',
      professional: '',
      specialty: '',
      responsibles: ''
    });
    onClose();
  };

  const handleDelete = () => {
    if (editData) {
      onSave(formData);
      handleClose();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Cadastrar Plano Terapêutico';
      case 'edit':
        return 'Editar Plano Terapêutico';
      case 'delete':
        return 'Excluir Plano Terapêutico';
      default:
        return 'Plano Terapêutico';
    }
  };

  const renderDeleteContent = () => (
    <Box sx={{ padding: '1.5rem 0' }}>
      <Typography sx={{ fontSize: '1rem', color: colors.textPrimary, mb: 2 }}>
        Tem certeza que deseja excluir o plano terapêutico <strong>{editData?.title}</strong>?
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: colors.textSecondary }}>
        Esta ação não poderá ser desfeita.
      </Typography>
    </Box>
  );

  const renderFormContent = () => (
    <Box sx={{ display: 'flex', gap: '1.5rem' }}>
      {/* Coluna esquerda */}
      <Box sx={{ flex: '1' }}>
        <TextField
          label="Título do plano"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Título do plano"
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
          label="Justificativa*"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          placeholder="Justificativa"
          fullWidth
          multiline
          rows={4}
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

        <TextField
          label="Nível de qualidade (Justificativa)*"
          value={formData.qualityLevel}
          onChange={(e) => setFormData({ ...formData, qualityLevel: e.target.value })}
          select
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
        >
          <MenuItem value="">Selecione</MenuItem>
          {qualityLevels.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Objetivo*"
          value={formData.objective}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          placeholder="Objetivo"
          fullWidth
          multiline
          rows={4}
          InputLabelProps={{ shrink: true }}
          sx={{
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
      </Box>

      {/* Coluna central */}
      <Box sx={{ flex: '1' }}>
        <TextField
          label="Nível de qualidade - pretendido (Objetivo)*"
          value={formData.qualityLevelPreferred}
          onChange={(e) => setFormData({ ...formData, qualityLevelPreferred: e.target.value })}
          select
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
        >
          <MenuItem value="">Selecione</MenuItem>
          {qualityLevels.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quantidade de sessões para atingir o objetivo*"
          value={formData.sessionsQuantity}
          onChange={(e) => setFormData({ ...formData, sessionsQuantity: e.target.value })}
          select
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
        >
          <MenuItem value="">Selecione</MenuItem>
          {[5, 10, 15, 20, 25, 30].map((num) => (
            <MenuItem key={num} value={num.toString()}>{num}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Métrica"
          value={formData.metric}
          onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
          placeholder="Métrica"
          fullWidth
          multiline
          rows={4}
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

        <TextField
          label="Observações"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          placeholder="Observações"
          fullWidth
          multiline
          rows={4}
          InputLabelProps={{ shrink: true }}
          sx={{
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
      </Box>

      {/* Coluna direita */}
      <Box sx={{ flex: '1' }}>
        <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField
            label="Período"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            select
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
          >
            <MenuItem value="">Selecione</MenuItem>
            {periods.map((period) => (
              <MenuItem key={period} value={period}>{period}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Prioridade"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            select
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
          >
            <MenuItem value="">Baixa</MenuItem>
            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>{priority}</MenuItem>
            ))}
          </TextField>
        </Box>

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

        <TextField
          label="Selecione o CID"
          value={formData.cid}
          onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
          select
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: '0.5rem',
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
        >
          <MenuItem value="">CID</MenuItem>
          {cids.map((cid) => (
            <MenuItem key={cid} value={cid}>{cid}</MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.disregardCid}
              onChange={(e) => setFormData({ ...formData, disregardCid: e.target.checked })}
              sx={{
                color: colors.primary,
                '&.Mui-checked': { color: colors.primary }
              }}
            />
          }
          label="Desconsiderar CID"
          sx={{
            marginBottom: '1rem',
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem',
              color: colors.textSecondary
            }
          }}
        />

        <TextField
          label="Equipe"
          value={formData.team}
          onChange={(e) => setFormData({ ...formData, team: e.target.value })}
          select
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
        >
          <MenuItem value="">Equipe</MenuItem>
          {teams.map((team) => (
            <MenuItem key={team} value={team}>{team}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Profissional"
          value={formData.professional}
          onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
          select
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
        >
          <MenuItem value="">Profissional</MenuItem>
          {professionals.map((professional) => (
            <MenuItem key={professional} value={professional}>{professional}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Especialidade"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          select
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
        >
          <MenuItem value="">Especialidade</MenuItem>
          {specialties.map((specialty) => (
            <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Responsáveis"
          value={formData.responsibles}
          onChange={(e) => setFormData({ ...formData, responsibles: e.target.value })}
          placeholder="Responsáveis"
          fullWidth
          multiline
          rows={2}
          InputLabelProps={{ shrink: true }}
          sx={{
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
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xl"
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
          {getTitle()}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        {mode === 'delete' ? renderDeleteContent() : renderFormContent()}
      </DialogContent>

      <Box sx={{
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        borderTop: `1px solid ${colors.border}`
      }}>
        <Button
          onClick={handleClose}
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
        <Button
          onClick={mode === 'delete' ? handleDelete : handleSave}
          variant="contained"
          sx={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            backgroundColor: mode === 'delete' ? '#dc3545' : colors.primary,
            color: colors.white,
            fontSize: '1rem',
            fontWeight: typography.fontWeight.semibold,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: mode === 'delete' ? '#c82333' : '#029AAB',
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            }
          }}
        >
          {mode === 'delete' ? 'Excluir' : 'Salvar'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default TherapyPlanModal;
