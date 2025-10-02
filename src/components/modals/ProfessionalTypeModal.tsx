import React, { useState, useEffect } from 'react';

// Interface para os dados do tipo de profissional
export interface ProfessionalTypeData {
  name: string;
  description: string;
  active: boolean;
}

// Props do componente
interface ProfessionalTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfessionalTypeData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<ProfessionalTypeData>;
  title?: string;
}

const ProfessionalTypeModal: React.FC<ProfessionalTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ProfessionalTypeData>({
    name: '',
    description: '',
    active: true,
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      active: true
    });
    onClose();
  };

  // Salvar dados
  const handleSave = () => {
    onSave(formData);
    handleClose();
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
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
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
            {title || (mode === 'create' ? 'Novo Tipo de Profissional' : 'Editar Tipo de Profissional')}
          </h3>
          <button
            onClick={handleClose}
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

        {/* Formulário */}
        <form style={{ padding: '2rem' }}>
          {/* Nome do Tipo de Profissional */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Nome do Tipo de Profissional</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Psicólogo(a), Fonoaudiólogo(a)"
            />
          </div>

          {/* Descrição */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as características deste tipo de profissional..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Status Ativo */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#2D3748'
              }}
            >
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#03B4C6'
                }}
              />
              Ativo
            </label>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e9ecef'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #ced4da',
                borderRadius: '6px',
                background: 'white',
                color: '#6c757d',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#adb5bd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#ced4da';
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                background: '#03B4C6',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0298a8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#03B4C6'}
            >
              {mode === 'create' ? 'Criar Tipo de Profissional' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalTypeModal;
