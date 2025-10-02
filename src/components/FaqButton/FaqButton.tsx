import React from 'react';

interface FaqButtonProps {
  onClick?: () => void;
}

const FaqButton: React.FC<FaqButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navegar para página de FAQ (será criada posteriormente)
      window.location.href = `${window.location.origin}/?page=faq`;
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '40px',
        height: '40px',
        minWidth: '40px',
        minHeight: '40px',
        borderRadius: '50%',
        background: '#03B4C6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#029AAB';
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#03B4C6';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      }}
      title="Ajuda / FAQ"
      aria-label="Ajuda / FAQ"
    >
      ?
    </div>
  );
};

export default FaqButton;
