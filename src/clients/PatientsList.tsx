import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Person, WhatsApp, CalendarToday, Edit, Warning, Add, Email, Check, Close, Folder, FilterAltOff, FirstPage, ChevronLeft, ChevronRight, LastPage } from '@mui/icons-material';
import { FaqButton } from "../components/FaqButton";
import Pagination from "../components/Pagination";

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

  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'name' | 'document' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  // Dados de exemplo dos pacientes - expandido para testar paginação
  const [patients] = useState<Patient[]>(() => {
    const basePatients = [
      {
        id: '1',
        name: 'Abdul Aziz Walid Saada',
        document: '53095900805',
        responsible: 'Milena Hamed Abdouni',
        phone: '11 969315000',
        status: 'Ativo' as const,
        isComplete: true,
        gender: 'Masculino' as const,
        professional: 'Dr. João Silva - Cardiologista',
        birthDate: '2015-03-15'
      },
      {
        id: '2',
        name: 'Adam Feitosa Rebouças',
        document: '06760953800',
        responsible: 'Maria Helena Ap. Feitosa Silva',
        phone: '11 962983112',
        status: 'Ativo' as const,
        isComplete: false,
        gender: 'Masculino' as const,
        professional: 'Dra. Maria Santos - Pediatra',
        birthDate: '2018-07-22'
      },
      {
        id: '3',
        name: 'Alana De Souza Medeiros',
        document: '05042045805',
        responsible: 'Thales Alexandre Melo De Souza',
        phone: '11 990067750',
        status: 'Ativo' as const,
        isComplete: false,
        gender: 'Feminino' as const,
        professional: 'Dr. Pedro Oliveira - Ortopedista',
        birthDate: '2020-11-08'
      },
      {
        id: '4',
        name: 'Alice Barbosa Lobo Montoani',
        document: '01020405808',
        responsible: 'Maria Laura Barbosa Lobo',
        phone: '11 998887777',
        status: 'Inativo' as const,
        isComplete: false,
        gender: 'Feminino' as const,
        professional: 'Dra. Ana Costa - Dermatologista',
        birthDate: '2019-05-30'
      },
      {
        id: '5',
        name: 'Alice De Matos Poço',
        document: '56565657780',
        responsible: 'Luana Rosa De Matos Silva Poço',
        phone: '11 995489919',
        status: 'Ativo' as const,
        isComplete: true,
        gender: 'Feminino' as const,
        professional: 'Dr. Carlos Ferreira - Neurologista',
        birthDate: '2016-12-03'
      },
      {
        id: '6',
        name: 'Alice Hikari Kimoto Yasuoka',
        document: '47327423869',
        responsible: 'Elaine Yucari Kimoto Yasuoka',
        phone: '11 997158686',
        status: 'Ativo' as const,
        isComplete: true,
        gender: 'Feminino' as const,
        professional: 'Dra. Lucia Rodrigues - Ginecologista',
        birthDate: '2017-09-14'
      }
    ];

    // Gerar pacientes adicionais para testar paginação
    const additionalPatients = [];
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Rafael', 'Fernanda', 'Roberto', 'Patricia', 'André', 'Beatriz', 'Lucas', 'Camila', 'Gabriel', 'Juliana', 'Fernando', 'Amanda', 'Ricardo', 'Larissa'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Lima', 'Souza', 'Mendes', 'Castro', 'Rocha', 'Pereira', 'Carvalho', 'Barbosa', 'Ribeiro', 'Martins', 'Gomes', 'Fernandes', 'Araújo'];

    for (let i = 7; i <= 120; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[(i + 5) % lastNames.length];
      const lastName2 = lastNames[(i + 10) % lastNames.length];
      const isActive = Math.random() > 0.2; // 80% ativos
      const isComplete = Math.random() > 0.4; // 60% completos
      const gender = ['Masculino', 'Feminino', 'Outro'][Math.floor(Math.random() * 3)] as 'Masculino' | 'Feminino' | 'Outro';
      const professional = professionalsList[Math.floor(Math.random() * professionalsList.length)];

      // Gerar CPF fictício
      const cpf = String(Math.floor(Math.random() * 99999999999)).padStart(11, '0');

      // Gerar telefone fictício
      const phone = `11 9${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;

      // Gerar data de nascimento aleatória
      const year = 2010 + Math.floor(Math.random() * 14); // 2010-2023
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      additionalPatients.push({
        id: i.toString(),
        name: `${firstName} ${lastName} ${lastName2}`,
        document: cpf,
        responsible: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`,
        phone: phone,
        status: isActive ? 'Ativo' as const : 'Inativo' as const,
        isComplete: isComplete,
        gender: gender,
        professional: professional,
        birthDate: birthDate
      });
    }

    return [...basePatients, ...additionalPatients];
  });

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

  // Filtrar e ordenar pacientes
  const filteredAndSortedPatients = patients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.document.includes(searchTerm) ||
                           patient.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'Todos' || patient.status === statusFilter;
      const matchesGender = genderFilter === 'Todos' || patient.gender === genderFilter;
      const matchesProfessional = professionalFilter === 'Selecione' || patient.professional === professionalFilter;

      return matchesSearch && matchesStatus && matchesGender && matchesProfessional;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortField === 'name') {
        compareValue = a.name.localeCompare(b.name, 'pt-BR');
      } else if (sortField === 'document') {
        compareValue = a.document.localeCompare(b.document);
      } else if (sortField === 'age') {
        const ageA = calculateAge(a.birthDate);
        const ageB = calculateAge(b.birthDate);
        compareValue = ageA - ageB;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredAndSortedPatients.slice(startIndex, endIndex);

  // Função para rolar para o início da lista
  const scrollToTop = () => {
    const listContainer = document.querySelector('.patients-list-container');
    if (listContainer) {
      const containerRect = listContainer.getBoundingClientRect();
      const offset = 100; // Margem superior para não ficar escondido pelo header
      const targetPosition = window.pageYOffset + containerRect.top - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback: rolar para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTimeout(scrollToTop, 100);
  };

  const handleSort = (field: 'name' | 'document' | 'age') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Gerar opções para o seletor de itens por página
  const itemsPerPageOptions = [];
  for (let i = 50; i <= 200; i += 10) {
    itemsPerPageOptions.push(i);
  }

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

  // Reset página quando filtros ou ordenação mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, genderFilter, professionalFilter, sortOrder]);

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
    setSortOrder('asc');
    setCurrentPage(1);
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
    <div className="patients-list">
      <HeaderInternal
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

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            {/* Título da Lista de Pacientes */}
            <div className="page-header-container">
              <div className="page-header-content">
                <h1 className="page-header-title">Lista de Pacientes</h1>
                <p className="page-header-description">
                  Visualize, pesquise e gerencie todos os pacientes cadastrados no sistema.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaqButton />
                <button
                  onClick={handleAddPatient}
                  title="Adicionar novo paciente"
                  className="btn-add"
                >
                  <Add />
                </button>
              </div>
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
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
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
                    minWidth: '120px',
                    width: '100%',
                    paddingRight: '2rem',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
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
                    minWidth: '120px',
                    width: '100%',
                    paddingRight: '2rem',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
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
                    minWidth: '120px',
                    width: '100%',
                    paddingRight: '2rem',
                    padding: '0.375rem 0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: '#495057',
                    height: '40px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#03B4C6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 180, 198, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
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

              {/* Botão limpar filtros */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '2px'
              }}>
                <button
                  onClick={clearFilters}
                  title="Limpar todos os filtros"
                  className="btn-clear-filters"
                >
                  <FilterAltOff fontSize="small" />
                </button>
              </div>
            </div>
          </div>

          {/* Paginação superior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginBottom: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredAndSortedPatients.length}
              itemLabel="pacientes"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>

          {/* Lista de pacientes */}
          <div className="patients-list-container">
            <div className="patients-table">
              <div className="patients-table-header">
                <div className="patients-header-cell">Foto</div>
                <div
                  className="patients-header-cell"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                  title="Ordenar por nome"
                >
                  Nome do Paciente {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div
                  className="patients-header-cell"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('document')}
                  title="Ordenar por documento"
                >
                  Documento {sortField === 'document' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div className="patients-header-cell">Nascimento</div>
                <div
                  className="patients-header-cell"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('age')}
                  title="Ordenar por idade"
                >
                  Idade {sortField === 'age' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                </div>
                <div className="patients-header-cell">Responsável</div>
                <div className="patients-header-cell">Celular</div>
                <div className="patients-header-cell">Completo</div>
                <div className="patients-header-cell" style={{ justifyContent: 'flex-end' }}>Ações</div>
              </div>

              <div className="patients-table-body">
                {paginatedPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="patients-table-row"
                    onClick={() => handlePatientRowClick(patient.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="patients-cell patients-photo">
                      <div className="patient-avatar">
                        <Person />
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
                        {patient.isComplete ? <Check fontSize="small" /> : <Close fontSize="small" />}
                      </span>
                    </div>
                    <div className="patients-cell patients-actions" data-label="Ações">
                      <button
                        className="btn-action-email"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('email', patient.id); }}
                        title="Enviar email"
                      >
                        <Email fontSize="small" />
                      </button>
                      <button
                        className="btn-action-whatsapp"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('whatsapp', patient.id); }}
                        title="WhatsApp"
                      >
                        <WhatsApp fontSize="small" />
                      </button>
                      <button
                        className="btn-action-schedule"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('calendar', patient.id); }}
                        title="Agendar consulta"
                      >
                        <CalendarToday fontSize="small" />
                      </button>
                      <button
                        className="btn-action-manage"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('cadastro', patient.id); }}
                        title="Gerenciar cadastro"
                      >
                        <Folder fontSize="small" />
                      </button>
                      <button
                        className="btn-action-delete"
                        onClick={(e) => { e.stopPropagation(); handlePatientAction('delete', patient.id); }}
                        title="Excluir paciente"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Paginação inferior */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e9ecef',
            marginTop: '1rem'
          }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              itemsPerPageOptions={itemsPerPageOptions}
              totalItems={filteredAndSortedPatients.length}
              itemLabel="pacientes"
              onPageChange={(page) => {
                setCurrentPage(page);
                setTimeout(scrollToTop, 100);
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
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
                <Warning fontSize="small" style={{ marginRight: '0.5rem' }} />
                Esta ação não poderá ser desfeita e não será possível recuperar o cadastro.
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