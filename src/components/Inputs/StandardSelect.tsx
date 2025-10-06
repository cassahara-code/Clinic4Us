import React from 'react';
import { Select, SelectProps } from '@mui/material';
import { inputs } from '../../theme/designSystem';

/**
 * Select padrão do sistema
 * Usa os padrões definidos no Design System
 */
const StandardSelect: React.FC<SelectProps> = ({
  sx,
  ...props
}) => {
  return (
    <Select
      sx={{
        minWidth: inputs.select.minWidth,
        height: inputs.select.height,
        fontSize: inputs.select.fontSize,
        backgroundColor: inputs.select.backgroundColor,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: inputs.select.borderColor,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: inputs.default.hover.borderColor,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: inputs.default.focus.borderColor,
          boxShadow: inputs.default.focus.boxShadow,
        },
        '& .MuiSelect-select': {
          padding: inputs.select.padding,
          color: inputs.select.textColor,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default StandardSelect;
