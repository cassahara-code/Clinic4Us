import React, { useMemo } from 'react';
import { Box, TextField, IconButton, Tooltip, Typography } from '@mui/material';
import { FilterAltOff } from '@mui/icons-material';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  initialStartDate,
  initialEndDate,
}) => {
  // Verificar se os filtros foram alterados
  const filtersChanged = useMemo(() => {
    if (!initialStartDate || !initialEndDate) return false;
    return startDate !== initialStartDate || endDate !== initialEndDate;
  }, [startDate, endDate, initialStartDate, initialEndDate]);

  return (
    <Box className="dashboard-date-filter">
      <Box className="dashboard-date-input-group">
        <TextField
          label="Data Inicial"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '40px',
              fontSize: '1rem',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#ced4da',
              },
              '&:hover fieldset': {
                borderColor: '#ced4da',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#03B4C6',
                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '0.375rem 0.5rem',
              color: '#495057',
            },
          }}
        />
      </Box>
      <Box className="dashboard-date-input-group">
        <TextField
          label="Data Final"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '40px',
              fontSize: '1rem',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#ced4da',
              },
              '&:hover fieldset': {
                borderColor: '#ced4da',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#03B4C6',
                boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '0.375rem 0.5rem',
              color: '#495057',
            },
          }}
        />
      </Box>
      <Box className="dashboard-clear-filter">
        <Tooltip title={filtersChanged ? "Limpar filtros" : "Nenhum filtro aplicado"}>
          <span>
            <IconButton
              onClick={onClear}
              disabled={!filtersChanged}
              sx={{
                bgcolor: filtersChanged ? '#6c757d' : '#e9ecef',
                color: filtersChanged ? 'white' : '#6c757d',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: filtersChanged ? '#5a6268' : '#e9ecef',
                },
                '&.Mui-disabled': {
                  bgcolor: '#e9ecef',
                  color: '#6c757d',
                  opacity: 0.5,
                },
              }}
            >
              <FilterAltOff fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DateRangeFilter;
