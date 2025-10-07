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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Close, Mic, InfoOutlined, Clear } from '@mui/icons-material';
import { colors, typography, inputs, buttons } from '../../theme/designSystem';
import { getMultilineTextFieldSx, getMultilineInputLabelProps } from '../../theme/textFieldStyles';

interface EvolutionFormData {
  appointment: string;
  disregardTherapyPlan: boolean;
  period: string;
  therapyPlan: string;
  qualityLevel: string; // Nível de qualidade atual (1-10)
  gasScale: string;
  patientCondition: string;
  patientSituation: string;
  conditionJustification: string;
  approachUsed: string;
  resourceUsed: string;
  therapeuticEvolution: string;
  conductGuidance: string;
  observations: string;
}

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evolutionData: EvolutionFormData) => void;
  editData?: EvolutionFormData | null;
  mode: 'add' | 'edit';
}

const EvolutionModal: React.FC<EvolutionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  mode
}) => {
  const [formData, setFormData] = useState<EvolutionFormData>(
    editData || {
      appointment: '',
      disregardTherapyPlan: false,
      period: '',
      therapyPlan: '',
      qualityLevel: '',
      gasScale: '',
      patientCondition: '',
      patientSituation: '',
      conditionJustification: '',
      approachUsed: '',
      resourceUsed: '',
      therapeuticEvolution: '',
      conductGuidance: '',
      observations: ''
    }
  );

  // Estados para controle de gravação de voz
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecordingField, setActiveRecordingField] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [interimText, setInterimText] = useState<string>(''); // Texto provisório em tempo real

  // Ref para o timer de inatividade
  const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Estados para nível de qualidade inicial e meta (vem do plano terapêutico)
  const [qualityLevelInitial, setQualityLevelInitial] = useState<string>('');
  const [qualityLevelGoal, setQualityLevelGoal] = useState<string>('');

  // Atualizar formData quando editData mudar
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  // Buscar dados do plano terapêutico quando selecionado
  useEffect(() => {
    if (formData.therapyPlan) {
      // TODO: Em produção, buscar da API
      // const planData = await fetch(`/api/therapy-plans/${formData.therapyPlan}`);

      // Mock: simular dados do plano terapêutico
      setQualityLevelInitial('3'); // Nível inicial do plano
      setQualityLevelGoal('8'); // Meta do plano
    } else {
      setQualityLevelInitial('');
      setQualityLevelGoal('');
    }
  }, [formData.therapyPlan]);

  // Ref para armazenar o campo ativo (para evitar recriação do recognition)
  const activeFieldRef = React.useRef<string | null>(null);
  const isRecordingRef = React.useRef<boolean>(false);

  // Atualizar refs quando os estados mudarem
  useEffect(() => {
    activeFieldRef.current = activeRecordingField;
    isRecordingRef.current = isRecording;
  }, [activeRecordingField, isRecording]);

  // Função para iniciar o timer de inatividade (60 segundos)
  const startInactivityTimer = () => {
    // Limpar timer anterior se existir
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Criar novo timer de 60 segundos
    inactivityTimerRef.current = setTimeout(() => {
      console.log('Reconhecimento de voz desligado por inatividade (60 segundos sem fala)');

      if (recognition) {
        recognition.stop();
      }

      setIsRecording(false);
      setActiveRecordingField(null);
      setInterimText('');

      alert('Gravação desligada automaticamente após 1 minuto de inatividade.');
    }, 60000); // 60 segundos
  };

  // Função para limpar o timer de inatividade
  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  // Inicializar Web Speech API (apenas uma vez)
  useEffect(() => {
    // Verificar se o navegador suporta Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API não suportada neste navegador');
      return;
    }

    try {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onstart = () => {
        console.log('Reconhecimento de voz iniciado');
        // Iniciar timer de inatividade quando começar a gravação
        startInactivityTimer();
      };

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const currentField = activeFieldRef.current;

        // Verificar se o campo ativo é válido
        if (!currentField) {
          return;
        }

        // Resetar timer de inatividade quando detectar fala
        startInactivityTimer();

        // Atualizar texto provisório em tempo real
        if (interimTranscript) {
          setInterimText(interimTranscript);
        }

        // Adicionar texto final ao campo e limpar texto provisório
        if (finalTranscript) {
          setFormData(prev => {
            const currentValue = prev[currentField as keyof EvolutionFormData];
            // Garantir que currentValue não é undefined
            const safeCurrentValue = typeof currentValue === 'string' ? currentValue : '';
            return {
              ...prev,
              [currentField]: safeCurrentValue + finalTranscript
            };
          });
          setInterimText('');
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);

        // Limpar timer de inatividade
        clearInactivityTimer();

        // Mensagens de erro mais amigáveis
        let errorMessage = 'Erro no reconhecimento de voz.';
        if (event.error === 'not-allowed') {
          errorMessage = 'Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'Nenhuma fala detectada. Por favor, fale mais alto.';
        } else if (event.error === 'network') {
          errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
        }

        alert(errorMessage);
        setIsRecording(false);
        setActiveRecordingField(null);
        setInterimText('');
      };

      recognitionInstance.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognitionInstance.start();
          } catch (error) {
            console.error('Erro ao reiniciar reconhecimento:', error);
            clearInactivityTimer(); // Limpar timer ao falhar
            setIsRecording(false);
            setActiveRecordingField(null);
            setInterimText('');
          }
        }
      };

      setRecognition(recognitionInstance);
      console.log('Web Speech API inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar Web Speech API:', error);
    }

    // Cleanup: limpar timer quando componente desmontar
    return () => {
      clearInactivityTimer();
    };
  }, []);

  // Função para limpar campo
  const clearField = (fieldName: keyof EvolutionFormData) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  // Função para iniciar/parar gravação
  const toggleRecording = (fieldName: string) => {
    if (isRecording && activeRecordingField === fieldName) {
      // Parar gravação manualmente
      clearInactivityTimer(); // Limpar timer de inatividade

      if (recognition) {
        recognition.stop();
      }
      setIsRecording(false);
      setActiveRecordingField(null);
      setInterimText('');
    } else if (!isRecording) {
      // Iniciar gravação
      if (recognition) {
        setActiveRecordingField(fieldName);
        setIsRecording(true);
        setInterimText('');
        try {
          recognition.start();
        } catch (error: any) {
          console.error('Erro ao iniciar gravação:', error);
          clearInactivityTimer(); // Limpar timer em caso de erro
          setIsRecording(false);
          setActiveRecordingField(null);
          setInterimText('');

          // Mensagem de erro específica
          if (error.message && error.message.includes('already started')) {
            alert('Reconhecimento de voz já está ativo. Por favor, aguarde.');
          } else {
            alert('Erro ao iniciar gravação. Verifique as permissões do microfone e tente novamente.');
          }
        }
      } else {
        alert('Seu navegador não suporta reconhecimento de voz.\n\nPor favor, use o Google Chrome para esta funcionalidade.\n\nO Microsoft Edge pode ter problemas com reconhecimento de voz.');
      }
    }
  };

  // Mock data
  const appointments = ['Agendamento 1', 'Agendamento 2', 'Agendamento 3'];
  const periods = ['Período 01', 'Período 02'];
  const therapyPlans = ['Plano Terapêutico 1', 'Plano Terapêutico 2', 'Plano Terapêutico 3'];
  const qualityLevels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const gasScales = ['Escala 1', 'Escala 2', 'Escala 3'];
  const conditions = ['Estável', 'Melhorando', 'Piorando', 'Sem alteração'];
  const situations = ['Ativo', 'Em observação', 'Repouso', 'Alta'];
  const approaches = ['Abordagem 1', 'Abordagem 2', 'Abordagem 3'];
  const resources = ['Recurso 1', 'Recurso 2', 'Recurso 3'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;

      // Se marcou "Desconsiderar plano terapêutico", limpar campos relacionados
      if (name === 'disregardTherapyPlan' && checked) {
        setFormData(prev => ({
          ...prev,
          [name]: checked,
          period: '',
          therapyPlan: '',
          qualityLevel: ''
        }));
        setQualityLevelInitial('');
        setQualityLevelGoal('');
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const getTitle = () => {
    return mode === 'add' ? 'Registrar evolução' : 'Editar evolução';
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.primary,
          color: colors.white,
          padding: '16px 24px',
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold
        }}
      >
        {getTitle()}
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.white,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Coluna Esquerda */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Agendamento */}
              <TextField
                select
                fullWidth
                name="appointment"
                label="Agendamento (Considera datas até 30 dias retroativas)"
                value={formData.appointment}
                onChange={handleInputChange}
                placeholder="Agendamento"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    fontSize: inputs.default.fontSize,
                    '& fieldset': { borderColor: inputs.default.borderColor },
                    '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                    '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                {appointments.map((appointment) => (
                  <MenuItem key={appointment} value={appointment}>
                    {appointment}
                  </MenuItem>
                ))}
              </TextField>

              {/* Checkbox Desconsiderar plano terapêutico */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="disregardTherapyPlan"
                    checked={formData.disregardTherapyPlan}
                    onChange={handleInputChange}
                    sx={{
                      color: colors.primary,
                      '&.Mui-checked': { color: colors.primary }
                    }}
                  />
                }
                label="Desconsiderar plano terapêutico"
                sx={{ fontSize: typography.fontSize.sm }}
              />

              {/* Período */}
              {!formData.disregardTherapyPlan && (
                <TextField
                  select
                  fullWidth
                  name="period"
                  label="Períodos de execução de plano terapêutico"
                  value={formData.period}
                  onChange={handleInputChange}
                  placeholder="Período"
                  InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    fontSize: inputs.default.fontSize,
                    '& fieldset': { borderColor: inputs.default.borderColor },
                    '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                    '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                  <MenuItem key={period} value={period}>
                    {period}
                  </MenuItem>
                ))}
              </TextField>
              )}

              {/* Plano terapêutico */}
              {!formData.disregardTherapyPlan && (
                <TextField
                  select
                  fullWidth
                  name="therapyPlan"
                  label="Plano terapêutico"
                  value={formData.therapyPlan}
                  onChange={handleInputChange}
                  placeholder="Plano terapêutico"
                  InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    fontSize: inputs.default.fontSize,
                    '& fieldset': { borderColor: inputs.default.borderColor },
                    '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                    '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                {therapyPlans.map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </TextField>
              )}

              {/* Nível de qualidade - Inicial, Meta e Atual */}
              {!formData.disregardTherapyPlan && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <TextField
                  fullWidth
                  name="qualityLevelInitial"
                  label="Nível qualidade - Inicial"
                  value={qualityLevelInitial ? `Inicial: ${qualityLevelInitial}` : 'Aguardando plano'}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: '#f8f9fa',
                      '& fieldset': { borderColor: inputs.default.borderColor }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: inputs.default.labelFontSize,
                      color: colors.textSecondary,
                      backgroundColor: colors.white,
                      padding: inputs.default.labelPadding
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="qualityLevelGoal"
                  label="Nível qualidade - Meta"
                  value={qualityLevelGoal ? `Meta: ${qualityLevelGoal}` : 'Aguardando plano'}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      backgroundColor: '#f8f9fa',
                      '& fieldset': { borderColor: inputs.default.borderColor }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: inputs.default.labelFontSize,
                      color: colors.textSecondary,
                      backgroundColor: colors.white,
                      padding: inputs.default.labelPadding
                    }
                  }}
                />
                <TextField
                  select
                  fullWidth
                  name="qualityLevel"
                  label="Nível de qualidade - Atual"
                  value={formData.qualityLevel}
                  onChange={handleInputChange}
                  disabled={formData.disregardTherapyPlan}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      '& fieldset': { borderColor: inputs.default.borderColor },
                      '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                      '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              )}

              {/* Avaliação escala GAS */}
              <TextField
                select
                fullWidth
                name="gasScale"
                label="Avaliação escala GAS"
                value={formData.gasScale}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: inputs.default.height,
                    fontSize: inputs.default.fontSize,
                    '& fieldset': { borderColor: inputs.default.borderColor },
                    '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                    '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                {gasScales.map((scale) => (
                  <MenuItem key={scale} value={scale}>
                    {scale}
                  </MenuItem>
                ))}
              </TextField>

              {/* Condição e Situação do paciente */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <TextField
                  select
                  fullWidth
                  name="patientCondition"
                  label="Condição do paciente"
                  value={formData.patientCondition}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      '& fieldset': { borderColor: inputs.default.borderColor },
                      '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                      '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  name="patientSituation"
                  label="Situação do paciente"
                  value={formData.patientSituation}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      '& fieldset': { borderColor: inputs.default.borderColor },
                      '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                      '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                  {situations.map((situation) => (
                    <MenuItem key={situation} value={situation}>
                      {situation}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Justificativa da condição */}
              <TextField
                fullWidth
                multiline
                rows={3}
                name="conditionJustification"
                label="Justificativa da condição"
                value={formData.conditionJustification}
                onChange={handleInputChange}
                placeholder="Justificativa da condição"
                InputLabelProps={getMultilineInputLabelProps()}
                sx={getMultilineTextFieldSx()}
              />

              {/* Abordagem e Recurso */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <TextField
                  select
                  fullWidth
                  name="approachUsed"
                  label="Abordagem utilizada"
                  value={formData.approachUsed}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      '& fieldset': { borderColor: inputs.default.borderColor },
                      '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                      '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                  {approaches.map((approach) => (
                    <MenuItem key={approach} value={approach}>
                      {approach}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  name="resourceUsed"
                  label="Recurso utilizado"
                  value={formData.resourceUsed}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: inputs.default.height,
                      fontSize: inputs.default.fontSize,
                      '& fieldset': { borderColor: inputs.default.borderColor },
                      '&:hover fieldset': { borderColor: inputs.default.hover.borderColor },
                      '&.Mui-focused fieldset': { borderColor: inputs.default.focus.borderColor }
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
                  {resources.map((resource) => (
                    <MenuItem key={resource} value={resource}>
                      {resource}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Coluna Direita */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Mensagem informativa sobre gravação de voz */}
              <Box
                sx={{
                  backgroundColor: '#e7f3ff',
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start'
                }}
              >
                <InfoOutlined
                  sx={{
                    color: '#0066cc',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: '#003d7a',
                      fontWeight: typography.fontWeight.semibold,
                      marginBottom: '0.25rem'
                    }}
                  >
                    Gravação de Voz
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      color: '#004080',
                      lineHeight: 1.5
                    }}
                  >
                    • Clique no ícone do microfone para iniciar a gravação
                    <br />
                    • Aguarde 2 segundos antes de começar a falar
                    <br />
                    • A gravação para automaticamente após 1 minuto sem captar fala
                    <br />
                    • Use o Google Chrome para melhor desempenho
                  </Typography>
                </Box>
              </Box>

              {/* Evolução Terapêutica */}
              <TextField
                fullWidth
                multiline
                rows={8}
                name="therapeuticEvolution"
                label="Evolução Terapêutica"
                value={
                  activeRecordingField === 'therapeuticEvolution'
                    ? (formData.therapeuticEvolution || '') + (interimText || '')
                    : (formData.therapeuticEvolution || '')
                }
                onChange={handleInputChange}
                placeholder="Descreva a evolução terapêutica..."
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
                InputProps={{
                  endAdornment: (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                      {formData.therapeuticEvolution && (
                        <IconButton
                          size="small"
                          onClick={() => clearField('therapeuticEvolution')}
                          sx={{
                            color: '#6c757d',
                            '&:hover': {
                              color: '#dc3545',
                              backgroundColor: 'rgba(220, 53, 69, 0.1)'
                            }
                          }}
                        >
                          <Clear sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => toggleRecording('therapeuticEvolution')}
                        disabled={isRecording && activeRecordingField !== 'therapeuticEvolution'}
                        sx={{
                          color: isRecording && activeRecordingField === 'therapeuticEvolution' ? '#dc3545' : colors.primary,
                          animation: isRecording && activeRecordingField === 'therapeuticEvolution' ? 'pulse 1.5s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                          },
                          '&:disabled': {
                            color: '#ccc',
                            cursor: 'not-allowed'
                          }
                        }}
                      >
                        <Mic sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </Box>
                  )
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

              {/* Orientação de conduta */}
              <TextField
                fullWidth
                multiline
                rows={8}
                name="conductGuidance"
                label="Orientação de conduta"
                value={
                  activeRecordingField === 'conductGuidance'
                    ? (formData.conductGuidance || '') + (interimText || '')
                    : (formData.conductGuidance || '')
                }
                onChange={handleInputChange}
                placeholder="Descreva as orientações de conduta..."
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
                InputProps={{
                  endAdornment: (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                      {formData.conductGuidance && (
                        <IconButton
                          size="small"
                          onClick={() => clearField('conductGuidance')}
                          sx={{
                            color: '#6c757d',
                            '&:hover': {
                              color: '#dc3545',
                              backgroundColor: 'rgba(220, 53, 69, 0.1)'
                            }
                          }}
                        >
                          <Clear sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => toggleRecording('conductGuidance')}
                        disabled={isRecording && activeRecordingField !== 'conductGuidance'}
                        sx={{
                          color: isRecording && activeRecordingField === 'conductGuidance' ? '#dc3545' : colors.primary,
                          animation: isRecording && activeRecordingField === 'conductGuidance' ? 'pulse 1.5s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                          },
                          '&:disabled': {
                            color: '#ccc',
                            cursor: 'not-allowed'
                          }
                        }}
                      >
                        <Mic sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </Box>
                  )
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

              {/* Observações */}
              <TextField
                fullWidth
                multiline
                rows={6}
                name="observations"
                label="Observações (não são apresentadas nos relatórios)"
                value={
                  activeRecordingField === 'observations'
                    ? (formData.observations || '') + (interimText || '')
                    : (formData.observations || '')
                }
                onChange={handleInputChange}
                placeholder="Observações internas..."
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
                InputProps={{
                  endAdornment: (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                      {formData.observations && (
                        <IconButton
                          size="small"
                          onClick={() => clearField('observations')}
                          sx={{
                            color: '#6c757d',
                            '&:hover': {
                              color: '#dc3545',
                              backgroundColor: 'rgba(220, 53, 69, 0.1)'
                            }
                          }}
                        >
                          <Clear sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => toggleRecording('observations')}
                        disabled={isRecording && activeRecordingField !== 'observations'}
                        sx={{
                          color: isRecording && activeRecordingField === 'observations' ? '#dc3545' : colors.primary,
                          animation: isRecording && activeRecordingField === 'observations' ? 'pulse 1.5s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                          },
                          '&:disabled': {
                            color: '#ccc',
                            cursor: 'not-allowed'
                          }
                        }}
                      >
                        <Mic sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </Box>
                  )
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
          </Box>
      </DialogContent>

      {/* Botões de ação fixos */}
      <DialogActions sx={{
        padding: '1.5rem 2rem',
        borderTop: `1px solid ${colors.backgroundAlt}`,
        backgroundColor: colors.background,
        gap: '1rem'
      }}>
        <Button
          onClick={onClose}
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
              borderColor: '#adb5bd'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
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
              transform: 'translateY(-1px)'
            }
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvolutionModal;
