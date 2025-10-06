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
  Autocomplete,
  Chip,
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

// Interface para os dados do perfil
export interface ProfileData {
  name: string;
  description: string;
  type: 'Nativo Cliente' | 'Paciente' | 'Sistema' | 'Nativo Sistema';
  functionalities: ProfileFunctionality[];
}

// Interface para as funcionalidades do perfil
export interface ProfileFunctionality {
  name: string;
  included: boolean;
}

// Lista de funcionalidades disponíveis
const AVAILABLE_FUNCTIONALITIES = [
  'Meu perfil',
  'Inicial',
  'Fale conosco',
  'Quem Somos',
  'Home',
  'Sair',
  'FAQ',
  'Agenda Profissional',
  'Lista de Pacientes',
  'Paciente',
  'Disponib. Profissionais',
  'Relatórios',
  'Clientes',
  'Funcionalidades',
  'Perfis',
  'Usuários',
  'Entidades',
  'Usuários da',
  'Dashboard',
  'Configurações',
  'Financeiro',
  'Backup',
  'Auditoria'
];

// Props do componente
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<ProfileData>;
  title?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    description: '',
    type: 'Nativo Cliente',
    functionalities: AVAILABLE_FUNCTIONALITIES.map(name => ({ name, included: false })),
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const functionalities = AVAILABLE_FUNCTIONALITIES.map(name => {
        const existingFunc = initialData.functionalities?.find(f =>
          typeof f === 'string' ? f === name : f.name === name
        );
        return {
          name,
          included: existingFunc ? true : false
        };
      });

      setFormData(prev => ({
        ...prev,
        ...initialData,
        functionalities
      }));
    }
  }, [initialData]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Nativo Cliente',
      functionalities: AVAILABLE_FUNCTIONALITIES.map(name => ({ name, included: false }))
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
      {/* Cabeçalho do modal */}
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
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1.4rem',
            fontWeight: typography.fontWeight.semibold,
            margin: 0
          }}
        >
          {title || (mode === 'create' ? 'Novo Perfil' : 'Editar Perfil')}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: colors.white,
            padding: '0.25rem',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo do modal */}
      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        {/* Primeira linha: Nome e Tipo */}
        <Box sx={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '2 1 300px', minWidth: '200px' }}>
            <TextField
              label="Nome do Perfil"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Secretário"
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
                  height: inputs.default.height,
                  fontSize: inputs.default.fontSize,
                  '& fieldset': {
                    borderColor: inputs.default.borderColor,
                    legend: {
                      maxWidth: inputs.default.legendMaxWidth,
                    },
                  },
                  '&:hover fieldset': {
                    borderColor: inputs.default.hover.borderColor,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: inputs.default.focus.borderColor,
                    boxShadow: inputs.default.focus.boxShadow,
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ flex: '1 1 180px', minWidth: '120px' }}>
            <TextField
              select
              label="Tipo de Perfil"
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: inputs.select.labelFontSize,
                  color: inputs.select.labelColor,
                  backgroundColor: inputs.select.labelBackground,
                  padding: inputs.select.labelPadding,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: inputs.select.height,
                  fontSize: inputs.select.fontSize,
                  '& fieldset': {
                    borderColor: inputs.select.borderColor,
                  },
                },
              }}
            >
              <MenuItem value="Nativo Cliente">Nativo Cliente</MenuItem>
              <MenuItem value="Paciente">Paciente</MenuItem>
              <MenuItem value="Sistema">Sistema</MenuItem>
              <MenuItem value="Nativo Sistema">Nativo Sistema</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Segunda linha: Descrição */}
        <Box sx={{ marginBottom: '1.5rem' }}>
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva as características e permissões deste perfil..."
            InputLabelProps={{
              shrink: inputs.multiline.labelShrink,
              sx: {
                fontSize: inputs.multiline.labelFontSize,
                color: inputs.multiline.labelColor,
                backgroundColor: inputs.multiline.labelBackground,
                padding: inputs.multiline.labelPadding,
                '&.Mui-focused': {
                  color: colors.primary,
                },
              },
            }}
            sx={{
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
        </Box>

        {/* Funcionalidades */}
        <Box sx={{ marginBottom: '2rem' }}>
          <Autocomplete
            multiple
            options={AVAILABLE_FUNCTIONALITIES.map(name => ({ id: name, label: name }))}
            value={formData.functionalities.filter(f => f.included).map(f => ({ id: f.name, label: f.name }))}
            onChange={(_, newValue) => {
              const updatedFunctionalities = AVAILABLE_FUNCTIONALITIES.map(name => ({
                name,
                included: newValue.some(v => v.id === name)
              }));
              setFormData({ ...formData, functionalities: updatedFunctionalities });
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
                label="Funcionalidades do Perfil"
                placeholder="Selecione as funcionalidades"
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

export default ProfileModal;
