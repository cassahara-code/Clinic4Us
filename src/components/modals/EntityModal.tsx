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
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

export interface EntityData {
  entityType: 'juridica' | 'fisica';
  cnpj: string;
  inscEstadual: string;
  inscMunicipal: string;
  fantasyName: string;
  socialName: string;
  ddd: string;
  phone: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  startTime: string;
  endTime: string;
}

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntityData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<EntityData>;
  title?: string;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  const [formData, setFormData] = useState<EntityData>({
    entityType: 'juridica',
    cnpj: '',
    inscEstadual: '',
    inscMunicipal: '',
    fantasyName: '',
    socialName: '',
    ddd: '',
    phone: '',
    email: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    startTime: '08:00',
    endTime: '18:00',
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
      entityType: 'juridica',
      cnpj: '',
      inscEstadual: '',
      inscMunicipal: '',
      fantasyName: '',
      socialName: '',
      ddd: '',
      phone: '',
      email: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      startTime: '08:00',
      endTime: '18:00'
    });
    onClose();
  };

  const handleSave = () => {
    onSave(formData);
    handleClose();
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [
      { value: `${hour}:00`, label: `${hour}:00` },
      { value: `${hour}:30`, label: `${hour}:30` }
    ];
  }).flat();

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
          {title || (mode === 'create' ? 'Cadastrar Entidade' : 'Editar Entidade')}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: colors.white, padding: '0.25rem', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem' }}>
        <FormControl component="fieldset" sx={{ marginBottom: '0.75rem' }}>
          <RadioGroup
            row
            value={formData.entityType}
            onChange={(e) => setFormData({ ...formData, entityType: e.target.value as 'juridica' | 'fisica' })}
          >
            <FormControlLabel
              value="juridica"
              control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
              label="Pessoa Jurídica"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', color: colors.text } }}
            />
            <FormControlLabel
              value="fisica"
              control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
              label="Pessoa Física"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.95rem', color: colors.text } }}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          label={formData.entityType === 'juridica' ? 'CNPJ' : 'CPF'}
          value={formData.cnpj}
          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
          placeholder={formData.entityType === 'juridica' ? 'CNPJ' : 'CPF'}
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TextField
            label="Insc. Estadual"
            value={formData.inscEstadual}
            onChange={(e) => setFormData({ ...formData, inscEstadual: e.target.value })}
            placeholder="Insc. Estadual"
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
            label="Insc. Municipal"
            value={formData.inscMunicipal}
            onChange={(e) => setFormData({ ...formData, inscMunicipal: e.target.value })}
            placeholder="Insc. Municipal"
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
          label="Nome Fantasia"
          value={formData.fantasyName}
          onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
          placeholder="Nome Fantasia"
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
          label="Razão Social"
          value={formData.socialName}
          onChange={(e) => setFormData({ ...formData, socialName: e.target.value })}
          placeholder="Razão Social"
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TextField
            label="DDD"
            value={formData.ddd}
            onChange={(e) => setFormData({ ...formData, ddd: e.target.value })}
            placeholder="DDD"
            inputProps={{ maxLength: 3 }}
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
            label="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Telefone"
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
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="E-mail"
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
          label="CEP"
          value={formData.cep}
          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
          placeholder="CEP"
          margin="dense"
          InputLabelProps={{ shrink: true }}
          sx={{
            marginBottom: '1.5rem',
            maxWidth: '200px',
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TextField
            label="Logradouro (Rua, Avenida, etc.)"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="Logradouro (Rua, Avenida, etc.)"
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
            label="Número"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="Nº"
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TextField
            label="Complemento"
            value={formData.complement}
            onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
            placeholder="Complemento"
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
            label="Bairro"
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            placeholder="Bairro"
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <TextField
            label="Cidade"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Cidade"
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
            label="UF"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="UF"
            inputProps={{ maxLength: 2 }}
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
          <TextField
            select
            label="Hora Inicial"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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
            {timeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Hora Final"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
            {timeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: '1.5rem 2rem', borderTop: `1px solid ${colors.backgroundAlt}`, backgroundColor: colors.background, gap: '1rem' }}>
        <Button onClick={handleClose} variant="outlined" sx={{ padding: '0.75rem 1.5rem', border: `1px solid ${colors.border}`, borderRadius: '6px', backgroundColor: colors.white, color: colors.textSecondary, fontSize: '1rem', fontWeight: typography.fontWeight.medium, textTransform: 'none', '&:hover': { backgroundColor: colors.background, borderColor: '#adb5bd' } }}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ padding: '0.75rem 1.5rem', borderRadius: '6px', backgroundColor: colors.primary, color: colors.white, fontSize: '1rem', fontWeight: typography.fontWeight.medium, textTransform: 'none', boxShadow: 'none', '&:hover': { backgroundColor: '#029AAB', boxShadow: 'none', transform: 'translateY(-1px)' } }}>
          Cadastrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityModal;
