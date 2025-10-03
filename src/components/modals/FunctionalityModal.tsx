import React, { useState, useEffect } from 'react';

// Interface para os dados da funcionalidade
export interface FunctionalityData {
  category: string;
  name: string;
  description: string;
  url: string;
  order: number;
  isLoggedArea: boolean;
  isPublicArea: boolean;
  showInMenu: boolean;
  relatedFAQs: string[];
}

// Lista de categorias disponíveis
const AVAILABLE_CATEGORIES = [
  'Navegação - Todos os usuários',
  'Cliente - Usuários Cliente',
  'Sistema - Administração',
  'Paciente - Área do Paciente',
  'Profissional - Área do Profissional',
  'Financeiro',
  'Relatórios'
];

// Props do componente
interface FunctionalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FunctionalityData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<FunctionalityData>;
  title?: string;
}

const FunctionalityModal: React.FC<FunctionalityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<FunctionalityData>({
    category: '',
    name: '',
    description: '',
    url: '',
    order: 1,
    isLoggedArea: true,
    isPublicArea: false,
    showInMenu: false,
    relatedFAQs: [],
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
      category: '',
      name: '',
      description: '',
      url: '',
      order: 1,
      isLoggedArea: true,
      isPublicArea: false,
      showInMenu: false,
      relatedFAQs: []
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
            {title || (mode === 'create' ? 'Cadastrar Funcionalidade' : 'Editar Funcionalidade')}
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
        <form style={{ padding: '1.5rem' }}>
          {/* Categoria */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                minWidth: '120px',
                width: '100%',
                paddingRight: '2rem'
              }}
            >
              <option value="">Categoria</option>
              {AVAILABLE_CATEGORIES.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Funcionalidade */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Funcionalidade</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Funcionalidade"
            />
          </div>

          {/* Descrição */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* URL */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>URL - Não pode ser igual a outra já cadastrada</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="URL"
            />
          </div>

          {/* Ordenação */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Ordenação</label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              placeholder="Ordenação"
            />
          </div>

          {/* Checkboxes de área */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
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
                  checked={formData.isLoggedArea}
                  onChange={(e) => setFormData({ ...formData, isLoggedArea: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#03B4C6'
                  }}
                />
                Área logada
              </label>

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
                  checked={formData.isPublicArea}
                  onChange={(e) => setFormData({ ...formData, isPublicArea: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#03B4C6'
                  }}
                />
                Área deslogada
              </label>
            </div>
          </div>

          {/* Aparece no Menu */}
          <div style={{ marginBottom: '0.75rem' }}>
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
                checked={formData.showInMenu}
                onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#03B4C6'
                }}
              />
              Aparece no Menu
            </label>
          </div>

          {/* FAQs relacionados */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>FAQs relacionados</label>
            <select
              multiple
              value={formData.relatedFAQs}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, relatedFAQs: selectedOptions });
              }}
              style={{
                minWidth: '120px',
                width: '100%',
                paddingRight: '2rem',
                minHeight: '120px',
                padding: '0.5rem'
              }}
            >
              <option value="">Choose some options...</option>
              <option value="faq1">Como cadastrar um paciente?</option>
              <option value="faq2">Como agendar uma consulta?</option>
              <option value="faq3">Como visualizar relatórios?</option>
              <option value="faq4">Como gerenciar permissões?</option>
              <option value="faq5">Como configurar notificações?</option>
            </select>
            <small style={{
              display: 'block',
              marginTop: '0.5rem',
              color: '#6c757d',
              fontSize: '0.85rem'
            }}>
              Segure Ctrl (ou Cmd no Mac) para selecionar múltiplas opções
            </small>
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
              {mode === 'create' ? 'Criar Funcionalidade' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FunctionalityModal;
