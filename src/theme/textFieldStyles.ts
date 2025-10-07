/**
 * CLINIC4US - TEXTFIELD STYLES
 *
 * Estilos padronizados para campos TextField do Material-UI
 * Baseado no Design System e nos modais existentes
 */

import { colors, inputs } from './designSystem';

/**
 * Estilo padrão para TextField simples (não multiline)
 */
export const getDefaultTextFieldSx = () => ({
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
});

/**
 * Estilo padrão para TextField multiline (textarea)
 */
export const getMultilineTextFieldSx = () => ({
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
});

/**
 * InputLabelProps padrão para TextField simples
 */
export const getDefaultInputLabelProps = () => ({
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
});

/**
 * InputLabelProps padrão para TextField multiline
 */
export const getMultilineInputLabelProps = () => ({
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
});

/**
 * Estilo para TextField com InputAdornment (para microfone, clear, etc)
 */
export const getMultilineWithAdornmentSx = () => ({
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
      paddingRight: '60px', // Espaço para os ícones
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
});
