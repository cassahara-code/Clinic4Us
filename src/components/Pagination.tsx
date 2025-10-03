import React from 'react';
import { FirstPage, LastPage, ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageOptions: number[];
  totalItems: number;
  itemLabel?: string; // Ex: "planos", "pacientes", "profissionais"
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsPerPageOptions,
  totalItems,
  itemLabel = 'itens',
  onPageChange,
  onItemsPerPageChange
}) => {
  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPreviousPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const goToNextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));

  // Calcular índices de início e fim
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Descrição dos itens mostrados */}
      <div style={{
        color: '#4a5568',
        fontSize: '0.9rem'
      }}>
        Mostrando {startIndex + 1}-{endIndex} de <strong style={{
          color: '#2d3748',
          fontWeight: '600'
        }}>{totalItems}</strong> {itemLabel}
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Seletor de itens por página */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{
            fontSize: '0.85rem',
            color: '#6c757d',
            whiteSpace: 'nowrap'
          }}>
            Itens por página:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            style={{
              padding: '0.4rem 0.6rem',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: '#495057',
              background: 'white',
              height: '32px'
            }}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Navegação de páginas */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            title="Primeira página"
            style={{
              padding: '0.4rem 0.6rem',
              background: currentPage === 1 ? '#e9ecef' : '#007bff',
              color: currentPage === 1 ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <FirstPage />
          </button>

          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            title="Página anterior"
            style={{
              padding: '0.4rem 0.6rem',
              background: currentPage === 1 ? '#e9ecef' : '#007bff',
              color: currentPage === 1 ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <ChevronLeft />
          </button>

          <span style={{
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            color: '#495057',
            whiteSpace: 'nowrap'
          }}>
            {currentPage} de {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            title="Próxima página"
            style={{
              padding: '0.4rem 0.6rem',
              background: currentPage === totalPages ? '#e9ecef' : '#007bff',
              color: currentPage === totalPages ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <ChevronRight />
          </button>

          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            title="Última página"
            style={{
              padding: '0.4rem 0.6rem',
              background: currentPage === totalPages ? '#e9ecef' : '#007bff',
              color: currentPage === totalPages ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <LastPage />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
