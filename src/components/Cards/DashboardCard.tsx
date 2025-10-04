import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { cards } from '../../theme/designSystem';

interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  iconColor?: string;
  children: React.ReactNode;
  height?: string | number;
}

/**
 * Card padrão do Dashboard
 * Usa os padrões definidos no Design System
 */
const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  iconColor = '#03B4C6',
  children,
  height,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: cards.default.backgroundColor,
        borderRadius: cards.default.borderRadius,
        padding: cards.default.padding,
        boxShadow: cards.default.boxShadow,
        border: cards.default.border,
        height: height || cards.default.dashboardHeight,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box
            className="dashboard-card-icon"
            sx={{
              backgroundColor: iconColor,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant="h6"
          className="dashboard-card-title"
          sx={{ fontSize: '1rem' }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DashboardCard;
