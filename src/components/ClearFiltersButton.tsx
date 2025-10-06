import React from 'react';
import { FilterAltOff } from '@mui/icons-material';

interface ClearFiltersButtonProps {
  onClick: () => void;
  title?: string;
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onClick,
  title = 'Limpar filtros'
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: '40px',
        height: '40px',
        background: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#5a6268';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#6c757d';
      }}
    >
      <FilterAltOff fontSize="small" />
    </button>
  );
};

export default ClearFiltersButton;
