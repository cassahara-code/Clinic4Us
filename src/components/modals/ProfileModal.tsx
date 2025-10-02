import React, { useState, useEffect } from 'react';

// Interface para os dados do perfil
export interface ProfileData {
  name: string;
  description: string;
  type: 'Nativo Cliente' | 'Paciente' | 'Sistema' | 'Nativo Sistema';
  functionalities: ProfileFunctionality[];
}

// Interface para as funcionalidades do perfil
export interface ProfileFunctionality {
  name: string;
  included: boolean;
}

// Lista de funcionalidades disponíveis
const AVAILABLE_FUNCTIONALITIES = [
  'Meu perfil',
  'Inicial',
  'Fale conosco',
  'Quem Somos',
  'Home',
  'Sair',
  'FAQ',
  'Agenda Profissional',
  'Lista de Pacientes',
  'Paciente',
  'Disponib. Profissionais',
  'Relatórios',
  'Clientes',
  'Funcionalidades',
  'Perfis',
  'Usuários',
  'Entidades',
  'Usuários da',
  'Dashboard',
  'Configurações',
  'Financeiro',
  'Backup',
  'Auditoria'
];

// Props do componente
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<ProfileData>;
  title?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    description: '',
    type: 'Nativo Cliente',
    functionalities: AVAILABLE_FUNCTIONALITIES.map(name => ({ name, included: false })),
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const functionalities = AVAILABLE_FUNCTIONALITIES.map(name => {
        const existingFunc = initialData.functionalities?.find(f =>
          typeof f === 'string' ? f === name : f.name === name
        );
        return {
          name,
          included: existingFunc ? true : false
        };
      });

      setFormData(prev => ({
        ...prev,
        ...initialData,
        functionalities
      }));
    }
  }, [initialData]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Nativo Cliente',
      functionalities: AVAILABLE_FUNCTIONALITIES.map(name => ({ name, included: false }))
    });
    onClose();
  };

  // Salvar dados
  const handleSave = () => {
    onSave(formData);
    handleClose();
  };

  // Toggle de funcionalidade
  const toggleFunctionality = (functionalityName: string) => {
    setFormData({
      ...formData,
      functionalities: formData.functionalities.map(f =>
        f.name === functionalityName ? { ...f, included: !f.included } : f
      )
    });
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
          maxWidth: '900px',
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
            {title || (mode === 'create' ? 'Novo Perfil' : 'Editar Perfil')}
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
          {/* Primeira linha: Nome e Tipo */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Nome do Perfil</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Secretário"
              />
            </div>

            <div className="form-group">
              <label>Tipo de Perfil</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="Nativo Cliente">Nativo Cliente</option>
                <option value="Paciente">Paciente</option>
                <option value="Sistema">Sistema</option>
                <option value="Nativo Sistema">Nativo Sistema</option>
              </select>
            </div>
          </div>

          {/* Segunda linha: Descrição */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as características e permissões deste perfil..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Funcionalidades */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#2D3748',
              marginBottom: '1rem'
            }}>
              Funcionalidades do Perfil
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '0.75rem',
              padding: '1rem',
              background: '#F7FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0'
            }}>
              {formData.functionalities.map((functionality) => (
                <label
                  key={functionality.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    backgroundColor: functionality.included ? '#E6FFFA' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!functionality.included) {
                      e.currentTarget.style.backgroundColor = '#EDF2F7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!functionality.included) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={functionality.included}
                    onChange={() => toggleFunctionality(functionality.name)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#03B4C6'
                    }}
                  />
                  <span style={{
                    fontSize: '0.9rem',
                    color: functionality.included ? '#2D3748' : '#718096',
                    fontWeight: functionality.included ? '500' : 'normal'
                  }}>
                    {functionality.name}
                  </span>
                </label>
              ))}
            </div>
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
              {mode === 'create' ? 'Criar Perfil' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
