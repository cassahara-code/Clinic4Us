import React, { useState, useEffect } from 'react';

// Interface para os dados da entidade
export interface EntityData {
  entityType: 'juridica' | 'fisica';
  cnpj: string;
  inscEstadual: string;
  inscMunicipal: string;
  fantasyName: string;
  socialName: string;
  ddd: string;
  phone: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  startTime: string;
  endTime: string;
}

// Props do componente
interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntityData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<EntityData>;
  title?: string;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<EntityData>({
    entityType: 'juridica',
    cnpj: '',
    inscEstadual: '',
    inscMunicipal: '',
    fantasyName: '',
    socialName: '',
    ddd: '',
    phone: '',
    email: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    startTime: '08:00',
    endTime: '18:00',
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
      entityType: 'juridica',
      cnpj: '',
      inscEstadual: '',
      inscMunicipal: '',
      fantasyName: '',
      socialName: '',
      ddd: '',
      phone: '',
      email: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      startTime: '08:00',
      endTime: '18:00'
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
            {title || (mode === 'create' ? 'Cadastrar Entidade' : 'Editar Entidade')}
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
          {/* Tipo de Pessoa */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#2D3748'
              }}>
                <input
                  type="radio"
                  name="entityType"
                  value="juridica"
                  checked={formData.entityType === 'juridica'}
                  onChange={(e) => setFormData({ ...formData, entityType: 'juridica' })}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#03B4C6'
                  }}
                />
                Pessoa Jurídica
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#2D3748'
              }}>
                <input
                  type="radio"
                  name="entityType"
                  value="fisica"
                  checked={formData.entityType === 'fisica'}
                  onChange={(e) => setFormData({ ...formData, entityType: 'fisica' })}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#03B4C6'
                  }}
                />
                Pessoa Física
              </label>
            </div>
          </div>

          {/* CNPJ/CPF */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>{formData.entityType === 'juridica' ? 'CNPJ' : 'CPF'}</label>
            <input
              type="text"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              placeholder={formData.entityType === 'juridica' ? 'CNPJ' : 'CPF'}
            />
          </div>

          {/* Inscrições */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label>Insc. Estadual</label>
              <input
                type="text"
                value={formData.inscEstadual}
                onChange={(e) => setFormData({ ...formData, inscEstadual: e.target.value })}
                placeholder="Insc. Estadual"
              />
            </div>
            <div className="form-group">
              <label>Insc. Municipal</label>
              <input
                type="text"
                value={formData.inscMunicipal}
                onChange={(e) => setFormData({ ...formData, inscMunicipal: e.target.value })}
                placeholder="Insc. Municipal"
              />
            </div>
          </div>

          {/* Nome Fantasia */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              value={formData.fantasyName}
              onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
              placeholder="Nome Fantasia"
            />
          </div>

          {/* Razão Social */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Razão Social</label>
            <input
              type="text"
              value={formData.socialName}
              onChange={(e) => setFormData({ ...formData, socialName: e.target.value })}
              placeholder="Razão Social"
            />
          </div>

          {/* DDD e Telefone */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label>DDD</label>
              <input
                type="text"
                value={formData.ddd}
                onChange={(e) => setFormData({ ...formData, ddd: e.target.value })}
                placeholder="DDD"
                maxLength={3}
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefone"
              />
            </div>
          </div>

          {/* E-mail */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="E-mail"
            />
          </div>

          {/* CEP */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>CEP</label>
            <input
              type="text"
              value={formData.cep}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              placeholder="CEP"
              style={{ maxWidth: '200px' }}
            />
          </div>

          {/* Logradouro e Número */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label>Logradouro (Rua, Avenida, etc.)</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Logradouro (Rua, Avenida, etc.)"
              />
            </div>
            <div className="form-group">
              <label>Número</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Nº"
              />
            </div>
          </div>

          {/* Complemento e Bairro */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label>Complemento</label>
              <input
                type="text"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Complemento"
              />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                placeholder="Bairro"
              />
            </div>
          </div>

          {/* Cidade e UF */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Cidade"
              />
            </div>
            <div className="form-group">
              <label>UF</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>

          {/* Horário Inicial e Final */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Hora Inicial</label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return (
                    <React.Fragment key={i}>
                      <option value={`${hour}:00`}>{`${hour}:00`}</option>
                      <option value={`${hour}:30`}>{`${hour}:30`}</option>
                    </React.Fragment>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Hora Final</label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return (
                    <React.Fragment key={i}>
                      <option value={`${hour}:00`}>{`${hour}:00`}</option>
                      <option value={`${hour}:30`}>{`${hour}:30`}</option>
                    </React.Fragment>
                  );
                })}
              </select>
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
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntityModal;
