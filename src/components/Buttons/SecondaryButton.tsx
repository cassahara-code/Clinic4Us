import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { buttons } from '../../theme/designSystem';

interface SecondaryButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Botão secundário padrão do sistema
 * Usa os padrões definidos no Design System
 */
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  size = 'medium',
  sx,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      backgroundColor: buttons.secondary.backgroundColor,
      color: buttons.secondary.color,
      fontSize: buttons.secondary.fontSize,
      fontWeight: buttons.secondary.fontWeight,
      textTransform: buttons.secondary.textTransform,
      borderRadius: buttons.secondary.borderRadius,
      boxShadow: buttons.secondary.boxShadow,
      '&:hover': {
        backgroundColor: buttons.secondary.hover.backgroundColor,
        boxShadow: buttons.secondary.hover.boxShadow,
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
      padding: buttons.secondary.padding,
      height: buttons.secondary.height,
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

export default SecondaryButton;
