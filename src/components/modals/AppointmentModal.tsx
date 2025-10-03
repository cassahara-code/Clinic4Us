import React, { useState, useEffect } from 'react';

// Interface para os dados do agendamento
export interface AppointmentData {
  patient: string;
  firstResponsible: string;
  secondResponsible: string;
  professional: string;
  team: string;
  serviceType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  appointmentType: 'unique' | 'recurring';
  recurrenceType: string;
  maxOccurrences: number;
  unitValue: string;
  discount: string;
  totalUnit: string;
  totalValue: string;
  observations: string;
}

// Props do componente
interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentData) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<AppointmentData>;
  title?: string;
  patientsList: string[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {},
  title,
  patientsList
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<AppointmentData>({
    patient: '',
    firstResponsible: '',
    secondResponsible: '',
    professional: '',
    team: '',
    serviceType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    appointmentType: 'unique',
    recurrenceType: '',
    maxOccurrences: 1,
    unitValue: '',
    discount: '',
    totalUnit: '',
    totalValue: '',
    observations: '',
    ...initialData
  });

  // Estados para busca de pacientes
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  // Atualizar form quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.patient) {
        setSelectedPatient(initialData.patient);
        setPatientSearchTerm(initialData.patient);
      }
    }
  }, [initialData]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setIsPatientDropdownOpen(false);
    };

    if (isPatientDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isPatientDropdownOpen]);

  // Funções para busca de pacientes
  const getFilteredPatients = () => {
    if (patientSearchTerm.length < 3) return [];
    return patientsList.filter(patient =>
      patient.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );
  };

  const handlePatientSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPatientSearchTerm(value);

    if (value === '') {
      setSelectedPatient('');
      setFormData({ ...formData, patient: '' });
    }

    setIsPatientDropdownOpen(value.length >= 3);
  };

  const handlePatientSelect = (patient: string) => {
    const patientName = patient.split(' - ')[0];
    setSelectedPatient(patient);
    setPatientSearchTerm(patientName);
    setFormData({ ...formData, patient: patientName });
    setIsPatientDropdownOpen(false);
  };

  // Função para calcular horário final
  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Atualizar horário final quando horário inicial mudar
  useEffect(() => {
    if (formData.startTime) {
      setFormData(prev => ({
        ...prev,
        endTime: calculateEndTime(prev.startTime)
      }));
    }
  }, [formData.startTime]);

  // Tabela de preços por tipo de serviço
  const servicePrices: { [key: string]: { unitValue: number; discount: number } } = {
    'Consulta': { unitValue: 150.00, discount: 10.00 },
    'Exame': { unitValue: 200.00, discount: 15.00 },
    'Procedimento': { unitValue: 300.00, discount: 20.00 },
    'Retorno': { unitValue: 80.00, discount: 5.00 },
    'Avaliação': { unitValue: 120.00, discount: 8.00 }
  };

  // Calcular valores automaticamente quando tipo de serviço ou tipo de agendamento mudar
  useEffect(() => {
    if (formData.serviceType && servicePrices[formData.serviceType]) {
      const { unitValue, discount } = servicePrices[formData.serviceType];
      const totalUnit = unitValue - discount;
      const occurrences = formData.appointmentType === 'recurring' ? formData.maxOccurrences : 1;
      const totalValue = totalUnit * occurrences;

      setFormData(prev => ({
        ...prev,
        unitValue: unitValue.toFixed(2),
        discount: discount.toFixed(2),
        totalUnit: totalUnit.toFixed(2),
        totalValue: totalValue.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        unitValue: '',
        discount: '',
        totalUnit: '',
        totalValue: ''
      }));
    }
  }, [formData.serviceType, formData.appointmentType, formData.maxOccurrences]);

  // Limpar formulário ao fechar
  const handleClose = () => {
    setFormData({
      patient: '',
      firstResponsible: '',
      secondResponsible: '',
      professional: '',
      team: '',
      serviceType: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      appointmentType: 'unique',
      recurrenceType: '',
      maxOccurrences: 1,
      unitValue: '',
      discount: '',
      totalUnit: '',
      totalValue: '',
      observations: ''
    });
    setPatientSearchTerm('');
    setIsPatientDropdownOpen(false);
    setSelectedPatient('');
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
            {title || (mode === 'create' ? 'Novo Agendamento' : 'Editar Agendamento')}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {/* Paciente */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Paciente (Digite pelo menos 3 letras)</label>

              <input
                type="text"
                placeholder={selectedPatient ? selectedPatient.split(' - ')[0] : "Digite o nome do paciente..."}
                value={selectedPatient ? selectedPatient.split(' - ')[0] : patientSearchTerm}
                onChange={handlePatientSearchChange}
                onClick={(e) => e.stopPropagation()}
                style={{
                  border: isPatientDropdownOpen ? '1px solid #03B4C6' : undefined,
                  fontWeight: selectedPatient ? '500' : 'normal'
                }}
              />

              {/* Dropdown com resultados */}
              {isPatientDropdownOpen && getFilteredPatients().length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 2px)',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {getFilteredPatients().map((patient, index) => (
                    <div
                      key={patient}
                      onClick={() => handlePatientSelect(patient)}
                      style={{
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderBottom: index < getFilteredPatients().length - 1 ? '1px solid #e9ecef' : 'none',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                          fontWeight: '500',
                          color: '#495057'
                        }}>
                          {patient.split(' - ')[0]}
                        </span>
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#6c757d',
                          marginTop: '2px'
                        }}>
                          {patient.split(' - ').slice(1).join(' - ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profissional */}
            <div className="form-group">
              <label>Profissional</label>
              <select
                value={formData.professional}
                onChange={(e) => setFormData({ ...formData, professional: e.target.value })}
              >
                <option value="">Selecione um profissional</option>
                <option value="Dr. João Silva">Dr. João Silva</option>
                <option value="Dra. Maria Santos">Dra. Maria Santos</option>
                <option value="Dr. Pedro Costa">Dr. Pedro Costa</option>
                <option value="Dra. Ana Oliveira">Dra. Ana Oliveira</option>
                <option value="Dr. Carlos Ferreira">Dr. Carlos Ferreira</option>
                <option value="Dra. Lucia Almeida">Dra. Lucia Almeida</option>
                <option value="Dr. Roberto Lima">Dr. Roberto Lima</option>
                <option value="Dra. Patricia Rocha">Dra. Patricia Rocha</option>
              </select>
            </div>
          </div>

          {/* Segunda linha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {/* Coluna esquerda: Responsáveis e Equipe */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* 1º Responsável */}
              <div className="form-group">
                <label>1º Responsável</label>
                <input
                  type="text"
                  value={formData.firstResponsible}
                  readOnly
                  disabled
                  placeholder="Não informado"
                  style={{
                    backgroundColor: '#e9ecef',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {/* 2º Responsável */}
              <div className="form-group">
                <label>2º Responsável</label>
                <input
                  type="text"
                  value={formData.secondResponsible}
                  readOnly
                  disabled
                  placeholder="Não informado"
                  style={{
                    backgroundColor: '#e9ecef',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              {/* Equipe */}
              <div className="form-group">
                <label>Equipe</label>
                <select
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                >
                  <option value="">Selecione uma equipe</option>
                  <option value="Equipe A">Equipe A</option>
                  <option value="Equipe B">Equipe B</option>
                  <option value="Equipe C">Equipe C</option>
                </select>
              </div>

              {/* Tipo de serviço */}
              <div className="form-group">
                <label>Tipo de serviço</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="">Tipo de serviço</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Exame">Exame</option>
                  <option value="Procedimento">Procedimento</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Avaliação">Avaliação</option>
                </select>
              </div>

              {/* Observações */}
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observações"
                  rows={2}
                  style={{
                    resize: 'vertical',
                    padding: '0.5rem',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Coluna direita: Data/Hora Inicial, Final, Tipo de agendamento e Valores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Data/Hora Inicial */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Horário</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Data/Hora Final */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label>Data Final</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Horário Final</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Tipo de agendamento */}
              <div className="form-group">
                <label>Tipo de agendamento</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value="unique"
                      checked={formData.appointmentType === 'unique'}
                      onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as 'unique' | 'recurring' })}
                    />
                    Único
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value="recurring"
                      checked={formData.appointmentType === 'recurring'}
                      onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as 'unique' | 'recurring' })}
                    />
                    Recorrente
                  </label>
                  {formData.appointmentType === 'recurring' && (
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtde máxima"
                      value={formData.maxOccurrences}
                      onChange={(e) => setFormData({ ...formData, maxOccurrences: Number(e.target.value) })}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #ced4da',
                        borderRadius: '6px',
                        width: '100px',
                        fontSize: '1rem'
                      }}
                    />
                  )}
                </div>

                {/* Opções de recorrência */}
                {formData.appointmentType === 'recurring' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.9rem',
                      color: '#495057',
                      marginBottom: '0.25rem',
                      fontWeight: '500'
                    }}>Periodicidade</label>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="daily"
                          checked={formData.recurrenceType === 'daily'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                        />
                        Diário
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="weekly"
                          checked={formData.recurrenceType === 'weekly'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                        />
                        Semanal
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="biweekly"
                          checked={formData.recurrenceType === 'biweekly'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                        />
                        Quinzenal
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="recurrenceType"
                          value="monthly"
                          checked={formData.recurrenceType === 'monthly'}
                          onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                        />
                        Mensal
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Valores calculados em grid 2x2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {/* Valor Unitário */}
                <div className="form-group">
                  <label>Valor Unitário</label>
                  <input
                    type="text"
                    value={formData.unitValue ? `R$ ${formData.unitValue}` : ''}
                    readOnly
                    disabled
                    style={{
                      backgroundColor: '#e9ecef',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Desconto Unitário */}
                <div className="form-group">
                  <label>Desconto Unitário</label>
                  <input
                    type="text"
                    value={formData.discount ? `R$ ${formData.discount}` : ''}
                    readOnly
                    disabled
                    style={{
                      backgroundColor: '#e9ecef',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Total Unitário */}
                <div className="form-group">
                  <label>Total Unitário</label>
                  <input
                    type="text"
                    value={formData.totalUnit ? `R$ ${formData.totalUnit}` : ''}
                    readOnly
                    disabled
                    style={{
                      backgroundColor: '#e9ecef',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                {/* Total Geral */}
                <div className="form-group">
                  <label>Total</label>
                  <input
                    type="text"
                    value={formData.totalValue ? `R$ ${formData.totalValue}` : ''}
                    readOnly
                    disabled
                    style={{
                      backgroundColor: '#e9ecef',
                      cursor: 'not-allowed',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '0.75rem',
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
              {mode === 'create' ? 'Agendar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;