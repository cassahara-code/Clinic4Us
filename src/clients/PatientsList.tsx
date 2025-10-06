import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { Delete, Person, WhatsApp, CalendarToday, Warning, Add, Email, Check, Close, Folder, FilterAltOff } from '@mui/icons-material';
import { FaqButton } from "../components/FaqButton";
import { TextField, MenuItem, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, Box, Pagination, FormControl, Select } from '@mui/material';
import StandardPagination from "../components/Pagination/StandardPagination";
import { colors, typography } from '../theme/designSystem';

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado da ordenação
  const [sortField, setSortField] = useState<'name' | 'document' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados do modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [hasFilterChanges, setHasFilterChanges] = useState(false);

  // Valores iniciais dos filtros
  const initialFilters = {
    searchTerm: '',
    statusFilter: 'Ativo' as 'Todos' | 'Ativo' | 'Inativo',
    genderFilter: 'Todos' as 'Todos' | 'Masculino' | 'Feminino' | 'Outro',
    professionalFilter: 'Selecione',
    sortOrder: 'asc' as 'asc' | 'desc'
  };

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

  // Detectar mudanças nos filtros
  useEffect(() => {
    const hasChanges =
      searchTerm !== initialFilters.searchTerm ||
      statusFilter !== initialFilters.statusFilter ||
      genderFilter !== initialFilters.genderFilter ||
      professionalFilter !== initialFilters.professionalFilter ||
      sortOrder !== initialFilters.sortOrder;

    setHasFilterChanges(hasChanges);
  }, [searchTerm, statusFilter, genderFilter, professionalFilter, sortOrder]);

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
    setSearchTerm(initialFilters.searchTerm);
    setStatusFilter(initialFilters.statusFilter);
    setGenderFilter(initialFilters.genderFilter);
    setProfessionalFilter(initialFilters.professionalFilter);
    setSortOrder(initialFilters.sortOrder);
    setCurrentPage(1);
    setHasFilterChanges(false);
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
                <Typography
                  variant="h4"
                  className="page-header-title"
                  sx={{
                    fontSize: '1.3rem',
                    mb: 1,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary
                  }}
                >
                  Lista de Pacientes
                </Typography>
                <Typography
                  variant="body2"
                  className="page-header-description"
                  sx={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textSecondary,
                    pb: '15px'
                  }}
                >
                  Visualize, pesquise e gerencie todos os pacientes cadastrados no sistema.
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaqButton />
                <IconButton
                  onClick={handleAddPatient}
                  title="Adicionar novo paciente"
                  sx={{
                    backgroundColor: '#48bb78',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: '#38a169',
                    }
                  }}
                >
                  <Add />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Container principal: Filtros + Paginação + Tabela */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
            }}
          >
            {/* Filtros da lista de pacientes */}
            <Box sx={{ mb: 1, borderBottom: 'none' }}>
            <div className="schedule-filters-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              {/* Busca por nome */}
              <TextField
                label="Nome do Paciente"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    '& fieldset': {
                      borderColor: '#ced4da',
                      legend: {
                        maxWidth: '100%',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#03B4C6',
                      boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    backgroundColor: 'white',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    '&.Mui-focused': {
                      color: '#03B4C6',
                    },
                  },
                }}
              />

              {/* Status */}
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#ced4da',
                      legend: {
                        maxWidth: '100%',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#03B4C6',
                      boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                    },
                  },
                  '& .MuiSelect-select': {
                    padding: '0.375rem 0.5rem',
                    color: '#495057',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    backgroundColor: 'white',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    '&.Mui-focused': {
                      color: '#03B4C6',
                    },
                  },
                }}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Inativo">Inativo</MenuItem>
              </TextField>

              {/* Gênero */}
              <TextField
                select
                label="Gênero"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#ced4da',
                      legend: {
                        maxWidth: '100%',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#03B4C6',
                      boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                    },
                  },
                  '& .MuiSelect-select': {
                    padding: '0.375rem 0.5rem',
                    color: '#495057',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    backgroundColor: 'white',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    '&.Mui-focused': {
                      color: '#03B4C6',
                    },
                  },
                }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </TextField>

              {/* Filtro por profissional */}
              <TextField
                select
                label="Filtro por profissional"
                value={professionalFilter}
                onChange={(e) => setProfessionalFilter(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: '#ced4da',
                      legend: {
                        maxWidth: '100%',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: '#ced4da',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#03B4C6',
                      boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                    },
                  },
                  '& .MuiSelect-select': {
                    padding: '0.375rem 0.5rem',
                    color: '#495057',
                    fontSize: '1rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                    color: '#6c757d',
                    backgroundColor: 'white',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    '&.Mui-focused': {
                      color: '#03B4C6',
                    },
                  },
                }}
              >
                <MenuItem value="Selecione">Selecione</MenuItem>
                {professionalsList.map((professional, index) => (
                  <MenuItem key={index} value={professional}>
                    {professional}
                  </MenuItem>
                ))}
              </TextField>

              {/* Botão limpar filtros */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '2px'
              }}>
                <IconButton
                  onClick={clearFilters}
                  disabled={!hasFilterChanges}
                  title="Limpar filtros"
                  sx={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#5a6268',
                    },
                    '&:disabled': {
                      backgroundColor: '#e9ecef',
                      color: '#adb5bd',
                      opacity: 0.6,
                    },
                  }}
                >
                  <FilterAltOff fontSize="small" />
                </IconButton>
              </div>
            </div>
          </Box>

          {/* Paginação + Tabela */}
            {/* Contador de registros */}
            <Box sx={{ mb: 2, px: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                <strong>{filteredAndSortedPatients.length}</strong> pacientes encontrados
              </Typography>
            </Box>

            {/* Lista de pacientes */}
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                boxShadow: 'none',
                border: 0
              }}
            >
            <Table
              sx={{
                tableLayout: 'fixed',
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e9ecef' }}>
                  <TableCell sx={{ width: '60px', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px' }}>
                    Foto
                  </TableCell>
                  <TableCell
                    sx={{
                      width: 'auto',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#495057',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                      }
                    }}
                    onClick={() => handleSort('name')}
                    title="Ordenar por nome"
                  >
                    Nome do Paciente {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '130px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#495057',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                      }
                    }}
                    onClick={() => handleSort('document')}
                    title="Ordenar por documento"
                  >
                    Documento {sortField === 'document' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </TableCell>
                  <TableCell sx={{ width: '120px', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px' }}>
                    Nascimento
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '80px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#495057',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                      }
                    }}
                    onClick={() => handleSort('age')}
                    title="Ordenar por idade"
                  >
                    Idade {sortField === 'age' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                  </TableCell>
                  <TableCell sx={{ width: 'auto', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px' }}>
                    Responsável
                  </TableCell>
                  <TableCell sx={{ width: '130px', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px' }}>
                    Celular
                  </TableCell>
                  <TableCell sx={{ width: '100px', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px', textAlign: 'center' }}>
                    Completo
                  </TableCell>
                  <TableCell sx={{ width: '240px', fontWeight: 600, fontSize: '0.875rem', color: '#495057', padding: '12px 16px', textAlign: 'right' }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPatients.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => handlePatientRowClick(patient.id)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc',
                      '&:hover': {
                        backgroundColor: '#f0f9fa',
                      }
                    }}
                  >
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#03B4C6',
                        }}
                      >
                        <Person />
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {patient.name}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {patient.document}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {formatBirthDate(patient.birthDate)}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {calculateAge(patient.birthDate)}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {patient.responsible}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#495057', padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      {patient.phone}
                    </TableCell>
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef', textAlign: 'center' }}>
                      <Chip
                        icon={patient.isComplete ? <Check fontSize="small" /> : <Close fontSize="small" />}
                        label={patient.isComplete ? 'Sim' : 'Não'}
                        size="small"
                        sx={{
                          backgroundColor: patient.isComplete ? '#28a745' : '#dc3545',
                          color: 'white',
                          fontWeight: 500,
                          '& .MuiChip-icon': {
                            color: 'white',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Tooltip title="Enviar email" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePatientAction('email', patient.id); }}
                            sx={{
                              backgroundColor: '#ff9800',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#f57c00',
                              }
                            }}
                          >
                            <Email sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="WhatsApp" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePatientAction('whatsapp', patient.id); }}
                            sx={{
                              backgroundColor: '#25D366',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#1da851',
                              }
                            }}
                          >
                            <WhatsApp sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Agendar consulta" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePatientAction('calendar', patient.id); }}
                            sx={{
                              backgroundColor: '#2196f3',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#1976d2',
                              }
                            }}
                          >
                            <CalendarToday sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Gerenciar cadastro" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePatientAction('cadastro', patient.id); }}
                            sx={{
                              backgroundColor: '#03a9f4',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#0288d1',
                              }
                            }}
                          >
                            <Folder sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir paciente" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePatientAction('delete', patient.id); }}
                            sx={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': {
                                backgroundColor: '#c82333',
                              }
                            }}
                          >
                            <Delete sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>

            {/* Navegador de páginas - Inferior */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 2,
                bgcolor: '#f8f9fa',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPatients.length)} de{' '}
                  <strong>{filteredAndSortedPatients.length}</strong> pacientes
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Seletor de itens por página */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      Itens por página:
                    </Typography>
                    <FormControl size="small">
                      <Select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        sx={{
                          minWidth: 80,
                          height: '40px',
                          fontSize: '1rem',
                          backgroundColor: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ced4da',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ced4da',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#03B4C6',
                            boxShadow: '0 0 0 3px rgba(3, 180, 198, 0.1)',
                          },
                          '& .MuiSelect-select': {
                            padding: '0.375rem 0.5rem',
                            color: '#495057',
                          },
                        }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Navegação de páginas com Pagination do MUI */}
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => {
                      setCurrentPage(page);
                      setTimeout(scrollToTop, 100);
                    }}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="small"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#495057',
                        '&.Mui-selected': {
                          backgroundColor: '#03B4C6',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#029AAB',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Paper>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={isDeleteModalOpen && patientToDelete !== null}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '1rem',
            maxWidth: '500px',
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#495057',
            padding: '1rem 1.5rem',
          }}
        >
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ padding: '1rem 1.5rem' }}>
          <Typography variant="body1" sx={{ marginBottom: '1rem', color: '#495057' }}>
            Tem certeza que deseja excluir o paciente <strong>{patientToDelete?.name}</strong>?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '4px',
              border: '1px solid #ffeaa7',
            }}
          >
            <Warning fontSize="small" />
            Esta ação não poderá ser desfeita e não será possível recuperar o cadastro.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem', gap: '0.5rem' }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              color: '#6c757d',
              borderColor: '#6c757d',
              textTransform: 'none',
              padding: '0.5rem 1.5rem',
              '&:hover': {
                borderColor: '#5a6268',
                backgroundColor: '#f8f9fa',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#dc3545',
              color: 'white',
              textTransform: 'none',
              padding: '0.5rem 1.5rem',
              '&:hover': {
                backgroundColor: '#c82333',
              }
            }}
          >
            Excluir Paciente
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientsList;