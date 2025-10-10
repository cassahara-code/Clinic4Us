import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';
import { colors, typography } from '../../theme/designSystem';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  warningMessage,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
        return colors.primary;
      default:
        return '#dc3545';
    }
  };

  const getConfirmButtonHoverColor = () => {
    switch (type) {
      case 'danger':
        return '#c82333';
      case 'warning':
        return '#e0a800';
      case 'info':
        return '#029AAB';
      default:
        return '#c82333';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
          {title}
        </Typography>
        <IconButton
          onClick={onCancel}
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
        <Typography
          sx={{
            fontSize: '1rem',
            color: colors.text,
            marginBottom: warningMessage ? '1.5rem' : 0,
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>

        {warningMessage && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '6px',
              border: '1px solid #ffeaa7',
            }}
          >
            <Warning sx={{ fontSize: '1.25rem', color: '#f59e0b' }} />
            <Typography sx={{ fontSize: '0.875rem', color: '#856404', lineHeight: 1.5 }}>
              {warningMessage}
            </Typography>
          </Box>
        )}
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
          onClick={onCancel}
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
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            backgroundColor: getConfirmButtonColor(),
            color: colors.white,
            fontSize: '1rem',
            fontWeight: typography.fontWeight.medium,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: getConfirmButtonHoverColor(),
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            }
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
