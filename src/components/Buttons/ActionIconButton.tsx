import React from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { actionIcons } from '../../theme/designSystem';

interface ActionIconButtonProps extends Omit<IconButtonProps, 'color'> {
  variant: 'whatsapp' | 'email' | 'folder' | 'edit' | 'delete';
  tooltip?: string;
}

/**
 * Botão de ação com ícone padrão do sistema
 * Usa os padrões definidos no Design System
 */
const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  variant,
  tooltip,
  children,
  sx,
  ...props
}) => {
  const getButtonStyles = () => {
    const variantStyles = actionIcons[variant];

    return {
      bgcolor: variantStyles.backgroundColor,
      color: variantStyles.color,
      width: variantStyles.size === 'small' ? 32 : 40,
      height: variantStyles.size === 'small' ? 32 : 40,
      '&:hover': {
        bgcolor: variantStyles.hoverBackgroundColor,
      },
    };
  };

  const button = (
    <IconButton
      size={actionIcons[variant].size}
      sx={{
        ...getButtonStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </IconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default ActionIconButton;
