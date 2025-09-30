import React, { useState, useEffect } from 'react';

// Interface para os dados do plano
export interface PlanData {
  name: string;
  description: string;
  price: number;
  annualPrice: number;
  duration: number;
  maxUsers: number;
  features: PlanFeature[];
  status: 'Ativo' | 'Inativo';
}

// Interface para as funcionalidades do plano
export interface PlanFeature {
  name: string;
  included: boolean;
}

// Lista de funcionalidades disponíveis
const AVAILABLE_FEATURES = [
  'Agenda básica',
  'Agenda avançada',
  'Cadastro de pacientes',
  'Múltiplos profissionais',
  'Relatórios simples',
  'Relatórios completos',
  'Integração WhatsApp',
  'API personalizada',
  'Suporte 24/7',
  'Customizações',
  'Recursos ilimitados',
  'Backup automático',
  'Segurança avançada',
  'Treinamento da equipe'
];

// Props do componente
interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlanData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<PlanData>;
  title?: string;
}

const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<PlanData>({
    name: '',
    description: '',
    price: 0,
    annualPrice: 0,
    duration: 12,
    maxUsers: 1,
    features: AVAILABLE_FEATURES.map(name => ({ name, included: false })),
    status: 'Ativo',
    ...initialData
  });

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const features = AVAILABLE_FEATURES.map(name => {
        const existingFeature = initialData.features?.find(f =>
          typeof f === 'string' ? f === name : f.name === name
        );
        return {
          name,
          included: existingFeature ? true : false
        };
      });

      setFormData(prev => ({
        ...prev,
        ...initialData,
        features
      }));
    }
  }, [initialData]);

  // Função para formatar preço
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para parse do preço
  const parseCurrency = (value: string) => {
    const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      annualPrice: 0,
      duration: 12,
      maxUsers: 1,
      features: AVAILABLE_FEATURES.map(name => ({ name, included: false })),
      status: 'Ativo'
    });
    onClose();
  };

  // Salvar dados
  const handleSave = () => {
    onSave(formData);
    handleClose();
  };

  // Toggle de funcionalidade
  const toggleFeature = (featureName: string) => {
    setFormData({
      ...formData,
      features: formData.features.map(f =>
        f.name === featureName ? { ...f, included: !f.included } : f
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
            {title || (mode === 'create' ? 'Novo Plano' : 'Editar Plano')}
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
          {/* Primeira linha: Nome e Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Nome do Plano</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Plano Básico"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Segunda linha: Descrição */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as características do plano..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Terceira linha: Valores Mensal e Anual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Valor mensal (R$)</label>
              <input
                type="text"
                value={formatCurrency(formData.price)}
                onChange={(e) => setFormData({ ...formData, price: parseCurrency(e.target.value) })}
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label>Valor anual (R$)</label>
              <input
                type="text"
                value={formatCurrency(formData.annualPrice)}
                onChange={(e) => setFormData({ ...formData, annualPrice: parseCurrency(e.target.value) })}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Quarta linha: Duração e Máximo de Usuários */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>Duração (meses)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                placeholder="12"
              />
            </div>

            <div className="form-group">
              <label>Máx. Usuários</label>
              <input
                type="number"
                min="1"
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 1 })}
                placeholder="5"
              />
            </div>
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
              Funcionalidades do Plano
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
              {formData.features.map((feature) => (
                <label
                  key={feature.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    backgroundColor: feature.included ? '#E6FFFA' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!feature.included) {
                      e.currentTarget.style.backgroundColor = '#EDF2F7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!feature.included) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={() => toggleFeature(feature.name)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#03B4C6'
                    }}
                  />
                  <span style={{
                    fontSize: '0.9rem',
                    color: feature.included ? '#2D3748' : '#718096',
                    fontWeight: feature.included ? '500' : 'normal'
                  }}>
                    {feature.name}
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
              {mode === 'create' ? 'Criar Plano' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
