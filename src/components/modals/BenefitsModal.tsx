import React, { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';

interface Benefit {
  id: string;
  name: string;
}

interface BenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (benefits: Benefit[]) => void;
}

const BenefitsModal: React.FC<BenefitsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', name: 'Agenda básica' },
    { id: '2', name: 'Cadastro de pacientes' },
    { id: '3', name: 'Relatórios simples' },
    { id: '4', name: 'Agenda avançada' },
    { id: '5', name: 'Múltiplos profissionais' },
    { id: '6', name: 'Relatórios completos' },
    { id: '7', name: 'Integração WhatsApp' },
    { id: '8', name: 'Recursos ilimitados' },
    { id: '9', name: 'API personalizada' },
    { id: '10', name: 'Suporte 24/7' },
    { id: '11', name: 'Customizações' }
  ]);

  const [newBenefitName, setNewBenefitName] = useState('');
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);

  const handleAddBenefit = () => {
    if (newBenefitName.trim()) {
      if (editingBenefitId) {
        // Editar benefício existente
        setBenefits(benefits.map(ben =>
          ben.id === editingBenefitId
            ? { ...ben, name: newBenefitName.trim() }
            : ben
        ));
        setEditingBenefitId(null);
      } else {
        // Adicionar novo benefício
        const newBenefit: Benefit = {
          id: `ben-${Date.now()}`,
          name: newBenefitName.trim()
        };
        setBenefits([...benefits, newBenefit]);
      }
      setNewBenefitName('');
    }
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setNewBenefitName(benefit.name);
    setEditingBenefitId(benefit.id);
  };

  const handleDeleteBenefit = (benefitId: string) => {
    setBenefits(benefits.filter(ben => ben.id !== benefitId));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do modal */}
        <div style={{
          background: '#03B4C6',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            Benefícios dos Planos
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '2rem' }}>
          {/* Descrição */}
          <p style={{
            margin: '0 0 1.5rem 0',
            fontSize: '0.95rem',
            color: '#6c757d'
          }}>
            Benefícios são as funcionalidades e recursos incluídos em cada plano.
          </p>

          {/* Campo de adicionar/editar benefício */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              {editingBenefitId ? 'Editar Benefício' : 'Benefício'}
            </label>
            <input
              type="text"
              value={newBenefitName}
              onChange={(e) => setNewBenefitName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddBenefit();
                }
              }}
              placeholder="Benefício"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                fontSize: '1rem',
                color: '#495057',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {editingBenefitId && (
                <button
                  onClick={() => {
                    setEditingBenefitId(null);
                    setNewBenefitName('');
                  }}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.75rem 1.5rem',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleAddBenefit}
                style={{
                  flex: '1 1 auto',
                  padding: '0.75rem',
                  background: '#03B4C6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0298a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#03B4C6'}
              >
                {editingBenefitId ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>

          {/* Lista de benefícios */}
          <div className="admin-plans-list-container" style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div className="admin-plans-table">
              {/* Header da lista */}
              <div className="admin-plans-table-header" style={{
                display: 'flex',
                gridTemplateColumns: 'unset'
              }}>
                <div style={{ flex: '1 1 auto', textAlign: 'left' }}>Benefício</div>
                <div style={{ flex: '0 0 140px', textAlign: 'right' }}>Ações</div>
              </div>

              {/* Items da lista */}
              <div className="admin-plans-table-body">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="admin-plans-table-row"
                    style={{
                      display: 'flex',
                      gridTemplateColumns: 'unset'
                    }}
                  >
                    <div style={{ flex: '1 1 auto', textAlign: 'left' }} data-label="Benefício">
                      {benefit.name}
                    </div>
                    <div className="admin-plans-actions" style={{ flex: '0 0 140px', textAlign: 'left' }} data-label="Ações">
                      <button
                        className="action-btn"
                        onClick={() => handleEditBenefit(benefit)}
                        title="Editar benefício"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteBenefit(benefit.id)}
                        title="Excluir benefício"
                        style={{ backgroundColor: '#f0f0f0', color: '#6c757d' }}
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsModal;
