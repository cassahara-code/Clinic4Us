import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { buttons } from '../../theme/designSystem';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Botão primário padrão do sistema
 * Usa os padrões definidos no Design System
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  size = 'medium',
  sx,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      backgroundColor: buttons.primary.backgroundColor,
      color: buttons.primary.color,
      fontSize: buttons.primary.fontSize,
      fontWeight: buttons.primary.fontWeight,
      textTransform: buttons.primary.textTransform,
      borderRadius: buttons.primary.borderRadius,
      boxShadow: buttons.primary.boxShadow,
      '&:hover': {
        backgroundColor: buttons.primary.hover.backgroundColor,
        boxShadow: buttons.primary.hover.boxShadow,
      },
    };

    // Ajustar estilos baseado no tamanho
    if (size === 'small') {
      return {
        ...baseStyles,
        padding: buttons.small.padding,
        fontSize: buttons.small.fontSize,
        height: buttons.small.height,
      };
    }

    if (size === 'large') {
      return {
        ...baseStyles,
        padding: buttons.large.padding,
        fontSize: buttons.large.fontSize,
        height: buttons.large.height,
      };
    }

    // Tamanho medium (padrão)
    return {
      ...baseStyles,
      padding: buttons.primary.padding,
      height: buttons.primary.height,
    };
  };

  return (
    <Button
      variant="contained"
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
