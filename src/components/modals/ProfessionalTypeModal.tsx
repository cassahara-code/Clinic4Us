import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

export interface ProfessionalTypeData {
  name: string;
  description: string;
  active: boolean;
}

interface ProfessionalTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfessionalTypeData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<ProfessionalTypeData>;
  title?: string;
}

const ProfessionalTypeModal: React.FC<ProfessionalTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  const [formData, setFormData] = useState<ProfessionalTypeData>({
    name: '',
    description: '',
    active: true,
    ...initialData
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      active: true
    });
    onClose();
  };

  const handleSave = () => {
    onSave(formData);
    handleClose();
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
          {title || (mode === 'create' ? 'Novo Tipo de Profissional' : 'Editar Tipo de Profissional')}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <TextField
          label="Nome do Tipo de Profissional"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Psicólogo(a), Fonoaudiólogo(a)"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: '1.5rem',
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
          placeholder="Descreva as características deste tipo de profissional..."
          fullWidth
          multiline
          rows={4}
          margin="dense"
          InputLabelProps={{
            shrink: inputs.multiline.labelShrink,
            sx: {
              fontSize: inputs.multiline.labelFontSize,
              color: inputs.multiline.labelColor,
              backgroundColor: inputs.multiline.labelBackground,
              padding: inputs.multiline.labelPadding,
              '&.Mui-focused': { color: colors.primary }
            }
          }}
          sx={{
            marginBottom: '1.5rem',
            '& .MuiOutlinedInput-root': {
              position: inputs.multiline.position,
              opacity: inputs.multiline.opacity,
              alignItems: inputs.multiline.alignItems,
              fontSize: inputs.multiline.fontSize,
              minHeight: inputs.multiline.minHeight,
              maxHeight: inputs.multiline.maxHeight,
              overflow: inputs.multiline.overflow,
              padding: 0,
              '& fieldset': {
                borderColor: inputs.multiline.borderColor,
              },
              '&:hover fieldset': {
                borderColor: inputs.multiline.borderColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
              },
              '& textarea': {
                wordWrap: inputs.multiline.wordWrap,
                whiteSpace: inputs.multiline.whiteSpace,
                padding: inputs.multiline.inputPadding,
                height: inputs.multiline.textareaHeight,
                maxHeight: inputs.multiline.textareaMaxHeight,
                overflow: `${inputs.multiline.textareaOverflow} !important`,
                boxSizing: inputs.multiline.textareaBoxSizing,
                '&::-webkit-scrollbar': {
                  width: inputs.multiline.scrollbarWidth,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: inputs.multiline.scrollbarTrackColor,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: inputs.multiline.scrollbarThumbColor,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: inputs.multiline.scrollbarThumbHoverColor,
                  },
                },
              },
            },
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              sx={{
                color: colors.primary,
                '&.Mui-checked': { color: colors.primary }
              }}
            />
          }
          label="Ativo"
          sx={{
            marginBottom: '2rem',
            '& .MuiFormControlLabel-label': {
              fontSize: '0.95rem',
              color: colors.text
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ padding: '1.5rem 2rem', borderTop: `1px solid ${colors.backgroundAlt}`, backgroundColor: colors.background, gap: '1rem' }}>
        <Button onClick={handleClose} variant="outlined" sx={{ padding: '0.75rem 1.5rem', border: `1px solid ${colors.border}`, borderRadius: '6px', backgroundColor: colors.white, color: colors.textSecondary, fontSize: '1rem', fontWeight: typography.fontWeight.medium, textTransform: 'none', '&:hover': { backgroundColor: colors.background, borderColor: '#adb5bd' } }}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ padding: '0.75rem 1.5rem', borderRadius: '6px', backgroundColor: colors.primary, color: colors.white, fontSize: '1rem', fontWeight: typography.fontWeight.medium, textTransform: 'none', boxShadow: 'none', '&:hover': { backgroundColor: '#029AAB', boxShadow: 'none', transform: 'translateY(-1px)' } }}>
          {mode === 'create' ? 'Criar Tipo de Profissional' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfessionalTypeModal;
