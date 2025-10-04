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
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

// Interface para os dados do agendamento
export interface AppointmentData {
  patient: string;
  firstResponsible: string;
  secondResponsible: string;
  professional: string;
  team: string;
  serviceType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  appointmentType: 'unique' | 'recurring';
  recurrenceType: string;
  maxOccurrences: number;
  unitValue: string;
  discount: string;
  totalUnit: string;
  totalValue: string;
  observations: string;
  confirmationStatus: string;
  attendanceStatus: string;
}

// Props do componente
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<AppointmentData>;
  title?: string;
  patientsList: string[];
  showPricing?: boolean; // Controla a visibilidade dos campos de valores
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title,
  patientsList,
  showPricing = true
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<AppointmentData>({
    patient: '',
    firstResponsible: '',
    secondResponsible: '',
    professional: '',
    team: '',
    serviceType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    appointmentType: 'unique',
    recurrenceType: '',
    maxOccurrences: 1,
    unitValue: '',
    discount: '',
    totalUnit: '',
    totalValue: '',
    observations: '',
    confirmationStatus: '',
    attendanceStatus: '',
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Função para calcular horário final
  const calculateEndTime = (startTime: string) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Atualizar horário final quando horário inicial mudar
  useEffect(() => {
    if (formData.startTime) {
      setFormData(prev => ({
        ...prev,
        endTime: calculateEndTime(prev.startTime)
      }));
    }
  }, [formData.startTime]);

  // Tabela de preços por tipo de serviço
  const servicePrices: { [key: string]: { unitValue: number; discount: number } } = {
    'Consulta': { unitValue: 150.00, discount: 10.00 },
    'Exame': { unitValue: 200.00, discount: 15.00 },
    'Procedimento': { unitValue: 300.00, discount: 20.00 },
    'Retorno': { unitValue: 80.00, discount: 5.00 },
    'Avaliação': { unitValue: 120.00, discount: 8.00 }
  };

  // Calcular valores automaticamente
  useEffect(() => {
    if (formData.serviceType && servicePrices[formData.serviceType]) {
      const { unitValue, discount } = servicePrices[formData.serviceType];
      const totalUnit = unitValue - discount;
      const occurrences = formData.appointmentType === 'recurring' ? formData.maxOccurrences : 1;
      const totalValue = totalUnit * occurrences;

      setFormData(prev => ({
        ...prev,
        unitValue: unitValue.toFixed(2),
        discount: discount.toFixed(2),
        totalUnit: totalUnit.toFixed(2),
        totalValue: totalValue.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        unitValue: '',
        discount: '',
        totalUnit: '',
        totalValue: ''
      }));
    }
  }, [formData.serviceType, formData.appointmentType, formData.maxOccurrences]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      patient: '',
      firstResponsible: '',
      secondResponsible: '',
      professional: '',
      team: '',
      serviceType: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      appointmentType: 'unique',
      recurrenceType: '',
      maxOccurrences: 1,
      unitValue: '',
      discount: '',
      totalUnit: '',
      totalValue: '',
      observations: '',
      confirmationStatus: '',
      attendanceStatus: ''
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
          {title || (mode === 'create' ? 'Novo Agendamento' : 'Editar Agendamento')}
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
        {/* Primeira linha: Paciente e Profissional */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Autocomplete
            freeSolo
            options={patientsList}
            value={formData.patient}
            onChange={(_, newValue) => {
              const patientName = newValue ? newValue.split(' - ')[0] : '';
              setFormData({ ...formData, patient: patientName });
            }}
            onInputChange={(_, newInputValue) => {
              setFormData({ ...formData, patient: newInputValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Paciente"
                placeholder="Digite pelo menos 3 letras"
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
            )}
          />

          <TextField
            select
            label="Profissional"
            value={formData.professional}
            onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
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
            <MenuItem value="">Selecione um profissional</MenuItem>
            <MenuItem value="Dr. João Silva">Dr. João Silva</MenuItem>
            <MenuItem value="Dra. Maria Santos">Dra. Maria Santos</MenuItem>
            <MenuItem value="Dr. Pedro Costa">Dr. Pedro Costa</MenuItem>
            <MenuItem value="Dra. Ana Oliveira">Dra. Ana Oliveira</MenuItem>
            <MenuItem value="Dr. Carlos Ferreira">Dr. Carlos Ferreira</MenuItem>
            <MenuItem value="Dra. Lucia Almeida">Dra. Lucia Almeida</MenuItem>
            <MenuItem value="Dr. Roberto Lima">Dr. Roberto Lima</MenuItem>
            <MenuItem value="Dra. Patricia Rocha">Dra. Patricia Rocha</MenuItem>
          </TextField>
        </Box>

        {/* Segunda linha: Layout com 2 colunas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Coluna esquerda */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <TextField
              label="1º Responsável"
              value={formData.firstResponsible}
              placeholder="Não informado"
              disabled
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: inputs.default.labelFontSize,
                  color: inputs.default.labelColor,
                  backgroundColor: inputs.default.labelBackground,
                  padding: inputs.default.labelPadding,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: inputs.default.height,
                  fontSize: inputs.default.fontSize,
                  backgroundColor: colors.backgroundAlt,
                  '& fieldset': {
                    borderColor: inputs.default.borderColor,
                  },
                },
              }}
            />

            <TextField
              label="2º Responsável"
              value={formData.secondResponsible}
              placeholder="Não informado"
              disabled
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: inputs.default.labelFontSize,
                  color: inputs.default.labelColor,
                  backgroundColor: inputs.default.labelBackground,
                  padding: inputs.default.labelPadding,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: inputs.default.height,
                  fontSize: inputs.default.fontSize,
                  backgroundColor: colors.backgroundAlt,
                  '& fieldset': {
                    borderColor: inputs.default.borderColor,
                  },
                },
              }}
            />

            <TextField
              select
              label="Equipe"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
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
              <MenuItem value="">Selecione uma equipe</MenuItem>
              <MenuItem value="Equipe A">Equipe A</MenuItem>
              <MenuItem value="Equipe B">Equipe B</MenuItem>
              <MenuItem value="Equipe C">Equipe C</MenuItem>
            </TextField>

            <TextField
              select
              label="Tipo de serviço"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
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
              <MenuItem value="">Tipo de serviço</MenuItem>
              <MenuItem value="Consulta">Consulta</MenuItem>
              <MenuItem value="Exame">Exame</MenuItem>
              <MenuItem value="Procedimento">Procedimento</MenuItem>
              <MenuItem value="Retorno">Retorno</MenuItem>
              <MenuItem value="Avaliação">Avaliação</MenuItem>
            </TextField>

            <TextField
              label="Observações"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Observações"
              multiline
              rows={2}
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

          {/* Coluna direita */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Data/Hora Inicial */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <TextField
                label="Data Inicial"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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

              <TextField
                label="Horário"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
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

            {/* Data/Hora Final */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <TextField
                label="Data Final"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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

              <TextField
                label="Horário Final"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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

            {/* Tipo de agendamento */}
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: typography.fontWeight.semibold,
                  color: '#2D3748',
                  marginBottom: '0.5rem',
                  '&.Mui-focused': {
                    color: '#2D3748',
                  },
                }}
              >
                Tipo de agendamento
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <RadioGroup
                  row
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({
                    ...formData,
                    appointmentType: e.target.value as 'unique' | 'recurring',
                    recurrenceType: e.target.value === 'unique' ? '' : formData.recurrenceType,
                    maxOccurrences: e.target.value === 'unique' ? 1 : Math.max(formData.maxOccurrences, 2)
                  })}
                  sx={{ flexShrink: 0 }}
                >
                  <FormControlLabel
                    value="unique"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Único"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                  <FormControlLabel
                    value="recurring"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Recorrente"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                </RadioGroup>
                {formData.appointmentType === 'recurring' && (
                  <TextField
                    type="number"
                    placeholder="Qtde máxima"
                    value={formData.maxOccurrences}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData({ ...formData, maxOccurrences: value > 100 ? 100 : value });
                    }}
                    inputProps={{ min: 2, max: 100 }}
                    sx={{
                      width: '120px',
                      '& .MuiOutlinedInput-root': {
                        height: inputs.default.height,
                        fontSize: inputs.default.fontSize,
                        '& fieldset': {
                          borderColor: inputs.default.borderColor,
                        },
                      },
                    }}
                  />
                )}
              </Box>
            </FormControl>

            {/* Periodicidade */}
            {formData.appointmentType === 'recurring' && (
              <FormControl>
                <FormLabel
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: typography.fontWeight.medium,
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    '&.Mui-focused': {
                      color: colors.textPrimary,
                    },
                  }}
                >
                  Periodicidade
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.recurrenceType}
                  onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                  sx={{ gap: '1rem' }}
                >
                  <FormControlLabel
                    value="daily"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Diário"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                  <FormControlLabel
                    value="weekly"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Semanal"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                  <FormControlLabel
                    value="biweekly"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Quinzenal"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                  <FormControlLabel
                    value="monthly"
                    control={<Radio sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />}
                    label="Mensal"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                  />
                </RadioGroup>
              </FormControl>
            )}

            {/* Valores calculados - Visível apenas se showPricing for true */}
            {showPricing && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <TextField
                  label="Valor Unitário"
                  value={formData.unitValue ? `R$ ${formData.unitValue}` : ''}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: colors.backgroundAlt,
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                    },
                  }}
                />

                <TextField
                  label="Desconto Unitário"
                  value={formData.discount ? `R$ ${formData.discount}` : ''}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: colors.backgroundAlt,
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                    },
                  }}
                />

                <TextField
                  label="Total Unitário"
                  value={formData.totalUnit ? `R$ ${formData.totalUnit}` : ''}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: colors.backgroundAlt,
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                    },
                  }}
                />

                <TextField
                  label="Total"
                  value={formData.totalValue ? `R$ ${formData.totalValue}` : ''}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      fontSize: inputs.default.labelFontSize,
                      color: inputs.default.labelColor,
                      backgroundColor: inputs.default.labelBackground,
                      padding: inputs.default.labelPadding,
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: colors.backgroundAlt,
                      '& fieldset': {
                        borderColor: inputs.default.borderColor,
                      },
                    },
                    '& input': {
                      fontWeight: typography.fontWeight.semibold,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        padding: '1.5rem 2rem',
        borderTop: `1px solid ${colors.backgroundAlt}`,
        backgroundColor: colors.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Dropdowns de Confirmação e Presença */}
        <Box sx={{ display: 'flex', gap: '1rem', flex: '1 1 auto' }}>
          <TextField
            select
            label="Confirmação"
            value={formData.confirmationStatus}
            onChange={(e) => setFormData({ ...formData, confirmationStatus: e.target.value })}
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
              minWidth: '150px',
              '& .MuiOutlinedInput-root': {
                height: inputs.select.height,
                fontSize: inputs.select.fontSize,
                '& fieldset': {
                  borderColor: inputs.select.borderColor,
                },
              },
            }}
          >
            <MenuItem value="">Selecione</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Confirmado">Confirmado</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
          </TextField>

          <TextField
            select
            label="Presença"
            value={formData.attendanceStatus}
            onChange={(e) => setFormData({ ...formData, attendanceStatus: e.target.value })}
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
              minWidth: '150px',
              '& .MuiOutlinedInput-root': {
                height: inputs.select.height,
                fontSize: inputs.select.fontSize,
                '& fieldset': {
                  borderColor: inputs.select.borderColor,
                },
              },
            }}
          >
            <MenuItem value="">Selecione</MenuItem>
            <MenuItem value="Aguardando">Aguardando</MenuItem>
            <MenuItem value="Presente">Presente</MenuItem>
            <MenuItem value="Faltou">Faltou</MenuItem>
          </TextField>
        </Box>

        {/* Botões de ação */}
        <Box sx={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          {mode === 'edit' && (
            <Button
              onClick={() => {
                // Adicionar lógica de exclusão
                console.log('Excluir agendamento');
              }}
              variant="contained"
              sx={{
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                backgroundColor: colors.error,
                color: colors.white,
                fontSize: '1rem',
                fontWeight: typography.fontWeight.medium,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#c82333',
                  boxShadow: 'none',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Excluir
            </Button>
          )}

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
            {mode === 'create' ? 'Agendar' : 'Salvar'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentModal;
