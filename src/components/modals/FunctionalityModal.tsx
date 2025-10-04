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
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Autocomplete,
  Chip
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

// Interface para os dados da funcionalidade
export interface FunctionalityData {
  category: string;
  name: string;
  description: string;
  url: string;
  order: number;
  isLoggedArea: boolean;
  isPublicArea: boolean;
  showInMenu: boolean;
  relatedFAQs: string[];
}

// Lista de categorias disponíveis
const AVAILABLE_CATEGORIES = [
  'Navegação - Todos os usuários',
  'Cliente - Usuários Cliente',
  'Sistema - Administração',
  'Paciente - Área do Paciente',
  'Profissional - Área do Profissional',
  'Financeiro',
  'Relatórios'
];

// Props do componente
interface FunctionalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FunctionalityData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<FunctionalityData>;
  title?: string;
}

const FunctionalityModal: React.FC<FunctionalityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<FunctionalityData>({
    category: '',
    name: '',
    description: '',
    url: '',
    order: 1,
    isLoggedArea: true,
    isPublicArea: false,
    showInMenu: false,
    relatedFAQs: [],
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      category: '',
      name: '',
      description: '',
      url: '',
      order: 1,
      isLoggedArea: true,
      isPublicArea: false,
      showInMenu: false,
      relatedFAQs: []
    });
    onClose();
  };

  // Salvar dados
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
          {title || (mode === 'create' ? 'Cadastrar Funcionalidade' : 'Editar Funcionalidade')}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Categoria */}
          <TextField
            select
            label="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            fullWidth
            placeholder="Selecione uma categoria"
            SelectProps={{
              displayEmpty: true,
              renderValue: (value: unknown) => {
                const strValue = value as string;
                if (!strValue) {
                  return <span style={{ color: '#999' }}>Selecione uma categoria</span>;
                }
                return strValue;
              }
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: inputs.select.labelFontSize,
                color: inputs.select.labelColor,
                backgroundColor: inputs.select.labelBackground,
                padding: inputs.select.labelPadding,
                '&.Mui-focused': { color: colors.primary }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: inputs.select.height,
                fontSize: inputs.select.fontSize,
                '& fieldset': {
                  borderColor: inputs.select.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: inputs.select.borderColor,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                }
              }
            }}
          >
            <MenuItem value="">Selecione uma categoria</MenuItem>
            {AVAILABLE_CATEGORIES.map((cat, index) => (
              <MenuItem key={index} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Funcionalidade */}
          <TextField
            label="Funcionalidade"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Funcionalidade"
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

          {/* Descrição */}
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição"
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

          {/* URL */}
          <TextField
            label="URL - Não pode ser igual a outra já cadastrada"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="URL"
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

          {/* Ordenação */}
          <TextField
            label="Ordenação"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            placeholder="Ordenação"
            inputProps={{ min: 1 }}
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

          {/* Checkboxes de área */}
          <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isLoggedArea}
                  onChange={(e) => setFormData({ ...formData, isLoggedArea: e.target.checked })}
                  sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
                />
              }
              label="Área logada"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', color: colors.textPrimary } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPublicArea}
                  onChange={(e) => setFormData({ ...formData, isPublicArea: e.target.checked })}
                  sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
                />
              }
              label="Área deslogada"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', color: colors.textPrimary } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.showInMenu}
                  onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                  sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
                />
              }
              label="Aparece no Menu"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', color: colors.textPrimary } }}
            />
          </Box>

          {/* FAQs relacionados */}
          <Autocomplete
            multiple
            options={[
              { id: 'faq1', label: 'Como cadastrar um paciente?' },
              { id: 'faq2', label: 'Como agendar uma consulta?' },
              { id: 'faq3', label: 'Como visualizar relatórios?' },
              { id: 'faq4', label: 'Como gerenciar permissões?' },
              { id: 'faq5', label: 'Como configurar notificações?' }
            ]}
            value={formData.relatedFAQs.map(id => ({
              id,
              label: {
                'faq1': 'Como cadastrar um paciente?',
                'faq2': 'Como agendar uma consulta?',
                'faq3': 'Como visualizar relatórios?',
                'faq4': 'Como gerenciar permissões?',
                'faq5': 'Como configurar notificações?'
              }[id] || id
            }))}
            onChange={(_, newValue) => {
              setFormData({ ...formData, relatedFAQs: newValue.map(v => v.id) });
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.label}
                  sx={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    '& .MuiChip-deleteIcon': {
                      color: colors.white,
                      '&:hover': {
                        color: colors.white,
                        opacity: 0.7
                      }
                    }
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="FAQs relacionados"
                placeholder="Selecione os FAQs"
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    fontSize: inputs.default.labelFontSize,
                    color: inputs.default.labelColor,
                    backgroundColor: inputs.default.labelBackground,
                    padding: inputs.default.labelPadding,
                    '&.Mui-focused': {
                      color: inputs.default.focus.labelColor,
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: 'calc(3 * 48px)',
                    alignItems: 'flex-start',
                    padding: '8px',
                    fontSize: inputs.default.fontSize,
                    '& fieldset': {
                      borderColor: inputs.default.borderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: inputs.default.hover.borderColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: inputs.default.focus.borderColor,
                      boxShadow: inputs.default.focus.boxShadow,
                    },
                    '& .MuiAutocomplete-endAdornment': {
                      top: '16px',
                      alignSelf: 'flex-start'
                    }
                  }
                }}
              />
            )}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '1.5rem 2rem', borderTop: `1px solid ${colors.backgroundAlt}`, backgroundColor: colors.background, gap: '1rem' }}>
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
            fontWeight: typography.fontWeight.medium,
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
          onClick={handleSave}
          variant="contained"
          sx={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: '1rem',
            fontWeight: typography.fontWeight.medium,
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
      </DialogActions>
    </Dialog>
  );
};

export default FunctionalityModal;
