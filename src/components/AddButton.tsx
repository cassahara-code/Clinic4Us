import React from 'react';
import { Add } from '@mui/icons-material';

interface AddButtonProps {
  onClick: () => void;
  title?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, title = 'Adicionar' }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: '#48bb78',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#38a169'}
      onMouseLeave={(e) => e.currentTarget.style.background = '#48bb78'}
    >
      <Add style={{ color: 'white' }} />
    </button>
  );
};

export default AddButton;
