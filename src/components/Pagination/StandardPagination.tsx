import React from 'react';
import { Box, Pagination, FormControl, Select, MenuItem, Typography } from '@mui/material';
import { pagination } from '../../theme/designSystem';

interface StandardPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

/**
 * Componente de paginação padrão do sistema
 * Usa os padrões definidos no Design System
 */
const StandardPagination: React.FC<StandardPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        padding: pagination.container.padding,
        backgroundColor: pagination.container.backgroundColor,
        borderTop: '1px solid #e9ecef',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Itens por página:
        </Typography>
        <FormControl size="small">
          <Select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            sx={{
              minWidth: '70px',
              height: '32px',
              fontSize: '0.875rem',
            }}
          >
            {[5, 10, 15, 20, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 2 }}>
          Exibindo {startItem}-{endItem} de {totalItems}
        </Typography>
      </Box>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => onPageChange(page)}
        size={pagination.component.size}
        showFirstButton={pagination.component.showFirstButton}
        showLastButton={pagination.component.showLastButton}
        sx={{
          '& .MuiPaginationItem-root': {
            color: pagination.component.itemColor,
            '&.Mui-selected': {
              backgroundColor: pagination.component.selectedBackgroundColor,
              color: pagination.component.selectedColor,
              '&:hover': {
                backgroundColor: pagination.component.selectedHoverColor,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default StandardPagination;
