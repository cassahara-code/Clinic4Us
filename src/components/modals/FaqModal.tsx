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
  Box
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { colors, typography, inputs } from '../../theme/designSystem';

export interface FaqData {
  id?: string;
  category: string;
  question: string;
  answer: string;
  videoUrl?: string;
  links?: { text: string; url: string }[];
}

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FaqData) => void;
  faqData?: FaqData;
  mode: 'create' | 'edit';
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onSave, faqData, mode }) => {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [links, setLinks] = useState<{ text: string; url: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (faqData) {
      setCategory(faqData.category || '');
      setQuestion(faqData.question || '');
      setAnswer(faqData.answer || '');
      setVideoUrl(faqData.videoUrl || '');
      setLinks(faqData.links || []);
    } else {
      resetForm();
    }
  }, [faqData, isOpen]);

  const resetForm = () => {
    setCategory('');
    setQuestion('');
    setAnswer('');
    setVideoUrl('');
    setLinks([]);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!question.trim()) {
      newErrors.question = 'Pergunta é obrigatória';
    }

    if (!answer.trim()) {
      newErrors.answer = 'Resposta é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const data: FaqData = {
      id: faqData?.id,
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      videoUrl: videoUrl.trim() || undefined,
      links: links.filter(link => link.text.trim() && link.url.trim())
    };

    onSave(data);
    resetForm();
  };

  const handleAddLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleClose = () => {
    resetForm();
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
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1.4rem',
            fontWeight: typography.fontWeight.semibold,
            margin: 0,
          }}
        >
          {mode === 'create' ? 'Novo Item FAQ' : 'Editar Item FAQ'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: colors.white,
            padding: '0.25rem',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '1.5rem !important', paddingTop: '2rem !important' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {/* Categoria */}
          <TextField
            label="Categoria"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Administração Cliente"
            error={!!errors.category}
            helperText={errors.category}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: inputs.default.height,
                '& fieldset': {
                  borderColor: errors.category ? '#E53E3E' : colors.border,
                },
                '&:hover fieldset': {
                  borderColor: errors.category ? '#E53E3E' : colors.border,
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors.category ? '#E53E3E' : colors.primary,
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                '&.Mui-focused': {
                  color: errors.category ? '#E53E3E' : colors.primary,
                },
              },
            }}
          />

          {/* Pergunta */}
          <TextField
            label="Pergunta"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite a pergunta"
            error={!!errors.question}
            helperText={errors.question}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: inputs.default.height,
                '& fieldset': {
                  borderColor: errors.question ? '#E53E3E' : colors.border,
                },
                '&:hover fieldset': {
                  borderColor: errors.question ? '#E53E3E' : colors.border,
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors.question ? '#E53E3E' : colors.primary,
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                '&.Mui-focused': {
                  color: errors.question ? '#E53E3E' : colors.primary,
                },
              },
            }}
          />

          {/* Resposta */}
          <TextField
            label="Resposta"
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Digite a resposta"
            multiline
            rows={6}
            error={!!errors.answer}
            helperText={errors.answer}
            InputLabelProps={{
              shrink: inputs.multiline.labelShrink,
              sx: {
                fontSize: inputs.multiline.labelFontSize,
                color: inputs.multiline.labelColor,
                backgroundColor: inputs.multiline.labelBackground,
                padding: inputs.multiline.labelPadding,
                '&.Mui-focused': {
                  color: errors.answer ? '#E53E3E' : colors.primary,
                },
              },
            }}
            sx={{
              gridColumn: '1 / -1',
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
                  borderColor: errors.answer ? '#E53E3E' : inputs.multiline.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: errors.answer ? '#E53E3E' : inputs.multiline.borderColor,
                },
                '&.Mui-focused fieldset': {
                  borderColor: errors.answer ? '#E53E3E' : colors.primary,
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

          {/* URL do Vídeo */}
          <TextField
            label="URL do Vídeo (opcional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/exemplo"
            InputLabelProps={{ shrink: true }}
            sx={{
              gridColumn: '1 / -1',
              '& .MuiOutlinedInput-root': {
                height: inputs.default.height,
                '& fieldset': {
                  borderColor: colors.border,
                },
                '&:hover fieldset': {
                  borderColor: colors.border,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: inputs.default.labelFontSize,
                color: colors.textSecondary,
                backgroundColor: colors.white,
                padding: inputs.default.labelPadding,
                '&.Mui-focused': {
                  color: colors.primary,
                },
              },
            }}
          />

          {/* Links Relacionados */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography
              sx={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: typography.fontWeight.semibold,
                color: colors.text,
                fontSize: typography.fontSize.sm,
              }}
            >
              Links Relacionados
            </Typography>
            {links.map((link, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <TextField
                  value={link.text}
                  onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                  placeholder="Texto do link"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  placeholder="URL"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  onClick={() => handleRemoveLink(index)}
                  sx={{
                    backgroundColor: '#dc3545',
                    color: colors.white,
                    width: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#c82333',
                    }
                  }}
                >
                  <Delete sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={handleAddLink}
              variant="outlined"
              sx={{
                marginTop: '0.5rem',
                textTransform: 'none',
                borderColor: colors.border,
                color: colors.textSecondary,
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: 'rgba(3, 180, 198, 0.04)',
                }
              }}
            >
              + Adicionar Link
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: '1.5rem 2rem',
          borderTop: `1px solid ${colors.backgroundAlt}`,
          backgroundColor: colors.background,
          gap: '1rem',
        }}
      >
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

export default FaqModal;
