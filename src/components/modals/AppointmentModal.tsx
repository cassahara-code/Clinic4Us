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
        <form style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
          </div>

          {/* Segunda linha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* 1º Responsável */}
            <div className="form-group">
              <label>1º Responsável</label>
              <input
                type="text"
                value={formData.firstResponsible}
                onChange={(e) => setFormData({ ...formData, firstResponsible: e.target.value })}
                placeholder="Não informado"
              />
            </div>

            {/* 2º Responsável */}
            <div className="form-group">
              <label>2º Responsável</label>
              <input
                type="text"
                value={formData.secondResponsible}
                onChange={(e) => setFormData({ ...formData, secondResponsible: e.target.value })}
                placeholder="Não informado"
              />
            </div>
          </div>

          {/* Terceira linha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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

          {/* Tipo de agendamento */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              color: '#6c757d',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>Tipo de agendamento</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="appointmentType"
                  value="unique"
                  checked={formData.appointmentType === 'unique'}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as 'unique' | 'recurring' })}
                />
                Único
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  placeholder="Qtde máxima (2 horas atrás)"
                  value={formData.maxOccurrences}
                  onChange={(e) => setFormData({ ...formData, maxOccurrences: Number(e.target.value) })}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    width: '200px'
                  }}
                />
              )}
            </div>
          </div>

          {/* Tipo de serviço */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
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
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Observações</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Observações"
              rows={3}
              style={{
                resize: 'vertical'
              }}
            />
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
              {mode === 'create' ? 'Agendar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;