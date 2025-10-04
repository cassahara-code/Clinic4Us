import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { inputs } from '../../theme/designSystem';

/**
 * TextField padrão do sistema
 * Usa os padrões definidos no Design System
 */
const StandardTextField: React.FC<TextFieldProps> = ({
  sx,
  ...props
}) => {
  return (
    <TextField
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          height: inputs.default.height,
          fontSize: inputs.default.fontSize,
          backgroundColor: inputs.default.backgroundColor,
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
          '&.Mui-error fieldset': {
            borderColor: inputs.default.error.borderColor,
          },
          '&.Mui-error.Mui-focused fieldset': {
            boxShadow: inputs.default.error.boxShadow,
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: inputs.default.padding,
          color: inputs.default.textColor,
          '&::placeholder': {
            color: inputs.default.placeholderColor,
            opacity: 1,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default StandardTextField;
