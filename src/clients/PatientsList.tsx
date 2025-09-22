import React, { useState, useEffect } from "react";
import "./Login.css";
import "./PatientsList.css";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";

interface MenuItemProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: MenuItemProps[];
  loginTime: string;
}

interface Patient {
  id: string;
  name: string;
  document: string;
  responsible: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
  isComplete: boolean;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  professional: string;
  birthDate: string;
}

const PatientsList: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard, goToSchedule, goToPatients, goToPatientRegister } = useNavigation();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Ativo' | 'Inativo'>('Ativo');
  const [genderFilter, setGenderFilter] = useState<'Todos' | 'Masculino' | 'Feminino' | 'Outro'>('Todos');
  const [professionalFilter, setProfessionalFilter] = useState('Selecione');

  // Estados do modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Lista de profissionais para filtro
  const professionalsList = [
    'Dr. João Silva - Cardiologista',
    'Dra. Maria Santos - Pediatra',
    'Dr. Pedro Oliveira - Ortopedista',
    'Dra. Ana Costa - Dermatologista',
    'Dr. Carlos Ferreira - Neurologista',
    'Dra. Lucia Rodrigues - Ginecologista',
    'Dr. Rafael Almeida - Clínico Geral',
    'Dra. Fernanda Lima - Psiquiatra',
    'Dr. Roberto Souza - Oftalmologista',
    'Dra. Patricia Mendes - Endocrinologista',
    'Dr. André Castro - Urologista',
    'Dra. Beatriz Rocha - Reumatologista'
  ];

  // Dados de exemplo dos pacientes com informações de nascimento
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Abdul Aziz Walid Saada',
      document: '53095900805',
      responsible: 'milena Hamed Abdouni',
      phone: '11 969315000',
      status: 'Ativo',
      isComplete: true,
      gender: 'Masculino',
      professional: 'Dr. João Silva - Cardiologista',
      birthDate: '2015-03-15'
    },
    {
      id: '2',
      name: 'Adam Feitosa Rebouças',
      document: '06760953800',
      responsible: 'Maria Helena Ap. Feitosa...',
      phone: '11 962983112',
      status: 'Ativo',
      isComplete: false,
      gender: 'Masculino',
      professional: 'Dra. Maria Santos - Pediatra',
      birthDate: '2018-07-22'
    },
    {
      id: '3',
      name: 'Alana De Souza Medeiros',
      document: '05042045805',
      responsible: 'Thales Alexandre Melo De Souza...',
      phone: '11 990067750',
      status: 'Ativo',
      isComplete: false,
      gender: 'Feminino',
      professional: 'Dr. Pedro Oliveira - Ortopedista',
      birthDate: '2020-11-08'
    },
    {
      id: '4',
      name: 'Alice Barbosa Lobo Montoani...',
      document: '01020405',
      responsible: 'Maria Laura Barbosa Lobo...',
      phone: '00 000000',
      status: 'Inativo',
      isComplete: false,
      gender: 'Feminino',
      professional: 'Dra. Ana Costa - Dermatologista',
      birthDate: '2019-05-30'
    },
    {
      id: '5',
      name: 'Alice De Matos Poço',
      document: '56565657780',
      responsible: 'Luana Rosa De Matos Silva Poço',
      phone: '11 995489919',
      status: 'Ativo',
      isComplete: true,
      gender: 'Feminino',
      professional: 'Dr. Carlos Ferreira - Neurologista',
      birthDate: '2016-12-03'
    },
    {
      id: '6',
      name: 'Alice Hikari Kimoto Yasuoka',
      document: '47327423869',
      responsible: 'Elaine Yucari Kimoto Yasuoka',
      phone: '11 997158686',
      status: 'Ativo',
      isComplete: true,
      gender: 'Feminino',
      professional: 'Dra. Lucia Rodrigues - Ginecologista',
      birthDate: '2017-09-14'
    }
  ]);

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.document.includes(searchTerm) ||
                         patient.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'Todos' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'Todos' || patient.gender === genderFilter;
    const matchesProfessional = professionalFilter === 'Selecione' || patient.professional === professionalFilter;

    return matchesSearch && matchesStatus && matchesGender && matchesProfessional;
  });

  // Simulação de carregamento da sessão do usuário
  useEffect(() => {
    const simulatedUserSession: UserSession = {
      email: "user@clinic4us.com",
      alias: "User Demo",
      clinicName: "Clínica Demo",
      role: "Professional",
      permissions: ["view_schedule", "manage_appointments"],
      menuItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Agenda", href: "/schedule" },
        { label: "Pacientes", href: "/patients" },
        { label: "Relatórios", href: "/reports" }
      ],
      loginTime: new Date().toISOString()
    };

    setUserSession(simulatedUserSession);
  }, []);

  // Função para calcular idade
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Função para formatar data de nascimento
  const formatBirthDate = (birthDate: string): string => {
    const date = new Date(birthDate);
    return date.toLocaleDateString('pt-BR');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Ativo');
    setGenderFilter('Todos');
    setProfessionalFilter('Selecione');
  };

  const handleAddPatient = () => {
    goToPatientRegister();
  };

  const handlePatientRowClick = (patientId: string) => {
    goToPatientRegister(patientId);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    try {
      // Aqui seria feita a chamada da API para exclusão lógica
      console.log(`Excluindo paciente: ${patientToDelete.name} (ID: ${patientToDelete.id})`);

      // TODO: Implementar chamada da API
      // await deletePatientAPI(patientToDelete.id);

      // Fechar modal
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);

      // TODO: Atualizar lista de pacientes após exclusão
      // refetchPatients();

    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      // TODO: Mostrar mensagem de erro
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handlePatientAction = (action: string, patientId: string) => {
    const patient = patients.find(p => p.id === patientId);

    if (action === 'email' && patient) {
      // Usar mailto para abrir aplicação de email
      const subject = encodeURIComponent(`Contato - ${patient.name}`);
      const body = encodeURIComponent(`Olá ${patient.name},\n\nEsperamos que esteja bem.\n\nAtenciosamente,\nEquipe Clinic4Us`);

      // Criar link mailto
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

      // Abrir aplicação de email
      window.location.href = mailtoLink;
    } else if (action === 'whatsapp' && patient) {
      // Limpar e formatar número do telefone para WhatsApp
      const phoneNumber = patient.phone.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      const message = encodeURIComponent(`Olá ${patient.name}, esperamos que esteja bem. Equipe Clinic4Us`);

      // Criar link do WhatsApp
      const whatsappLink = `https://wa.me/55${phoneNumber}?text=${message}`;

      // Abrir WhatsApp em nova aba
      window.open(whatsappLink, '_blank');
    } else if (action === 'calendar' && patient) {
      // Abrir página de agendamento em nova aba com paciente pré-selecionado
      const scheduleUrl = `${window.location.origin}${window.location.pathname}?page=schedule&patient=${encodeURIComponent(patient.name)}`;
      window.open(scheduleUrl, '_blank');
    } else if (action === 'cadastro' && patient) {
      // Navegar para página de cadastro do paciente
      goToPatientRegister(patient.id);
    } else if (action === 'delete' && patient) {
      // Abrir modal de confirmação de exclusão
      setPatientToDelete(patient);
      setIsDeleteModalOpen(true);
    } else {
      console.log(`Ação ${action} para paciente ${patientId}`);
    }
  };

  if (!userSession) {
    return <div>Carregando...</div>;
  }

  const loggedMenuItems = [
    { label: "Dashboard", href: "#", onClick: () => goToDashboard() },
    { label: "Agenda", href: "#", onClick: () => goToSchedule() },
    { label: "Pacientes", href: "#", onClick: () => goToPatients() },
    { label: "Relatórios", href: "#", onClick: () => alert("Funcionalidade em desenvolvimento") }
  ];

  const handleRevalidateLogin = () => {
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');
    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const handleNotificationClick = () => {
    alert("Sistema de notificações - 27 notificações pendentes");
  };

  const handleUserClick = () => {
    alert("Configurações do usuário - funcionalidade em desenvolvimento");
  };

  const handleLogoClick = () => {
    goToDashboard();
  };

  return (
    <div className="professional-schedule">
      <HeaderInternal
        menuItems={[]}
        loggedMenuItems={loggedMenuItems}
        showCTAButton={false}
        className="login-header"
        isLoggedIn={true}
        userEmail={userSession.email}
        userProfile={userSession.role}
        clinicName={userSession.clinicName}
        notificationCount={27}
        onRevalidateLogin={handleRevalidateLogin}
        onNotificationClick={handleNotificationClick}
        onUserClick={handleUserClick}
        onLogoClick={handleLogoClick}
      />

      <main style={{
        padding: '1rem',
        paddingTop: '2rem',
        minHeight: 'calc(100vh - 120px)',
        background: '#f8f9fa',
        marginTop: '80px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          {/* Título da Lista de Pacientes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              margin: '0',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#6c757d'
            }}>
              Lista de Pacientes
            </h1>
            <button
              onClick={handleAddPatient}
              title="Adicionar novo paciente"
              style={{
                background: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#38a169'}
              onMouseOut={(e) => e.currentTarget.style.background = '#48bb78'}
            >
              +
            </button>
          </div>

          {/* Filtros da lista de pacientes */}
          <div className="schedule-filters" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <div className="schedule-filters-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              {/* Busca por nome */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Nome do Paciente</label>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Todos">Todos</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Gênero */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Gênero</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Todos">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Filtro por profissional */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  marginBottom: '0.5rem'
                }}>Filtro por profissional</label>
                <select
                  value={professionalFilter}
                  onChange={(e) => setProfessionalFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Selecione">Selecione</option>
                  {professionalsList.map((professional, index) => (
                    <option key={index} value={professional}>
                      {professional}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="schedule-filters-actions" style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem'
              }}>
                A pesquisa retornou <strong style={{
                  color: '#2d3748',
                  fontWeight: '600'
                }}>{filteredPatients.length}</strong> pacientes.
              </div>

              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.background = '#6c757d'}
              >
                Limpar filtros
              </button>
            </div>
          </div>

          {/* Lista de pacientes */}
          <div className="patients-list-container">
            <div className="patients-table">
              <div className="patients-table-header">
                <div className="patients-header-cell">Foto</div>
                <div className="patients-header-cell">Nome do Paciente</div>
                <div className="patients-header-cell">Documento</div>
                <div className="patients-header-cell">Nascimento</div>
                <div className="patients-header-cell">Idade</div>
                <div className="patients-header-cell">Responsável</div>
                <div className="patients-header-cell">Celular</div>
                <div className="patients-header-cell">Completo</div>
                <div className="patients-header-cell">Ações</div>
              </div>

              <div className="patients-table-body">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="patients-table-row"
                    onClick={() => handlePatientRowClick(patient.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="patients-cell patients-photo">
                      <div className="patient-avatar">
                        <span>👤</span>
                      </div>
                    </div>
                    <div className="patients-cell patients-name" data-label="Nome">
                      {patient.name}
                    </div>
                    <div className="patients-cell patients-document" data-label="Documento">
                      {patient.document}
                    </div>
                    <div className="patients-cell patients-birth" data-label="Nascimento">
                      {formatBirthDate(patient.birthDate)}
                    </div>
                    <div className="patients-cell patients-age" data-label="Idade">
                      {calculateAge(patient.birthDate)}
                    </div>
                    <div className="patients-cell patients-responsible" data-label="Responsável">
                      {patient.responsible}
                    </div>
                    <div className="patients-cell patients-phone" data-label="Telefone">
                      {patient.phone}
                    </div>
                    <div className="patients-cell patients-complete" data-label="Status">
                      <span className={`status-indicator ${patient.isComplete ? 'complete' : 'incomplete'}`}>
                        {patient.isComplete ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="patients-cell patients-actions" data-label="Ações">
                      <button
                        className="action-btn email-btn"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('email', patient.id); }}
                        title="Enviar email"
                      >
                        ✉
                      </button>
                      <button
                        className="action-btn whatsapp-btn"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('whatsapp', patient.id); }}
                        title="WhatsApp"
                      >
                        💬
                      </button>
                      <button
                        className="action-btn calendar-btn"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('calendar', patient.id); }}
                        title="Agendar consulta"
                      >
                        📅
                      </button>
                      <button
                        className="action-btn cadastro-btn"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('cadastro', patient.id); }}
                        title="Gerenciar cadastro"
                      >
                        📝
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('delete', patient.id); }}
                        title="Excluir paciente"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && patientToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmar Exclusão</h3>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir o paciente <strong>{patientToDelete.name}</strong>?
              </p>
              <p className="warning-text">
                ⚠️ Esta ação não poderá ser desfeita e não será possível recuperar o cadastro.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={handleDeleteCancel}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteConfirm}
              >
                Excluir Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsList;