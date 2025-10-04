import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Divider,
  Pagination
} from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { FaqButton } from "../components/FaqButton";
import DateRangeFilter from "../components/DateRangeFilter";
import { CalendarToday, CheckCircle, Assignment, Cake, WhatsApp, Email, Folder } from '@mui/icons-material';

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

const Dashboard: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Estados para paginação dos aniversários
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Valores iniciais dos filtros
  const getInitialStartDate = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  };

  const getInitialEndDate = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  };

  const initialStartDate = getInitialStartDate();
  const initialEndDate = getInitialEndDate();

  // Estados para filtro de data
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Função para verificar se um aniversário está na semana atual
  const isCurrentWeekBirthday = (birthDate: string): boolean => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Converte a data de nascimento para o ano atual
    const [day, month] = birthDate.split('/').map(Number);
    const birthdayThisYear = new Date(currentYear, month - 1, day);

    // Início da semana (domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Fim da semana (sábado)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return birthdayThisYear >= startOfWeek && birthdayThisYear <= endOfWeek;
  };

  // Dados mock dos aniversariantes
  const allBirthdayPeople = [
    { birth: '01/09/2023', age: 2, name: 'Eloah Silveira Siqueira Prado Nascimento', phone: '11987654321', email: 'eloah@email.com', patient_id: '1' },
    { birth: '01/09/2024', age: 1, name: 'Antonella Di Franco Kitallah', phone: '11987654322', email: 'antonella@email.com', patient_id: '2' },
    { birth: '03/09/2022', age: 3, name: 'João Silva Santos', phone: '11987654323', email: 'joao@email.com', patient_id: '3' },
    { birth: '05/09/2021', age: 4, name: 'Maria Fernanda Oliveira', phone: '11987654324', email: 'maria@email.com', patient_id: '4' },
    { birth: '07/09/2020', age: 5, name: 'Pedro Henrique Costa', phone: '11987654325', email: 'pedro@email.com', patient_id: '5' },
    { birth: '09/09/2019', age: 6, name: 'Ana Beatriz Souza', phone: '11987654326', email: 'ana@email.com', patient_id: '6' },
    { birth: '11/09/2018', age: 7, name: 'Lucas Gabriel Lima', phone: '11987654327', email: 'lucas@email.com', patient_id: '7' },
    { birth: '13/09/2017', age: 8, name: 'Sophia Valentina Alves', phone: '11987654328', email: 'sophia@email.com', patient_id: '8' },
    { birth: '15/09/2016', age: 9, name: 'Miguel Eduardo Silva', phone: '11987654329', email: 'miguel@email.com', patient_id: '9' },
    { birth: '17/09/2015', age: 10, name: 'Isabella Cristina Santos', phone: '11987654330', email: 'isabella@email.com', patient_id: '10' },
    { birth: '19/09/2014', age: 11, name: 'Arthur Felipe Oliveira', phone: '11987654331', email: 'arthur@email.com', patient_id: '11' },
    { birth: '21/09/2013', age: 12, name: 'Helena Maria Costa', phone: '11987654332', email: 'helena@email.com', patient_id: '12' },
    { birth: '23/09/2012', age: 13, name: 'Davi Luiz Souza', phone: '11987654333', email: 'davi@email.com', patient_id: '13' },
    { birth: '25/09/2011', age: 14, name: 'Alice Fernanda Lima', phone: '11987654334', email: 'alice@email.com', patient_id: '14' },
    { birth: '27/09/2010', age: 15, name: 'Bernardo José Alves', phone: '11987654335', email: 'bernardo@email.com', patient_id: '15' },
    { birth: '29/09/2009', age: 16, name: 'Manuela Carolina Silva', phone: '11987654336', email: 'manuela@email.com', patient_id: '16' },
    { birth: '02/09/2008', age: 17, name: 'Enzo Gabriel Santos', phone: '11987654337', email: 'enzo@email.com', patient_id: '17' },
    { birth: '04/09/2007', age: 18, name: 'Valentina Sofia Oliveira', phone: '11987654338', email: 'valentina@email.com', patient_id: '18' }
  ];

  // Filtrar aniversariantes por data
  const birthdayPeople = allBirthdayPeople.filter((person) => {
    const [day, month] = person.birth.split('/').map(Number);
    const currentYear = new Date().getFullYear();
    const birthdayThisYear = new Date(currentYear, month - 1, day);

    const filterStartDate = new Date(startDate);
    const filterEndDate = new Date(endDate);

    // Ajustar para comparar apenas dia e mês
    const birthdayMonthDay = new Date(currentYear, birthdayThisYear.getMonth(), birthdayThisYear.getDate());
    const startMonthDay = new Date(currentYear, filterStartDate.getMonth(), filterStartDate.getDate());
    const endMonthDay = new Date(currentYear, filterEndDate.getMonth(), filterEndDate.getDate());

    return birthdayMonthDay >= startMonthDay && birthdayMonthDay <= endMonthDay;
  });

  // Cálculos de paginação
  const totalPages = Math.ceil(birthdayPeople.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBirthdays = birthdayPeople.slice(startIndex, endIndex);

  useEffect(() => {
    document.title = "Clinic4Us - Dashboard";

    // Verificar se há sessão ativa
    const sessionData = localStorage.getItem('clinic4us-user-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUserSession(session);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        // Redirecionar para login se sessão inválida
        window.location.href = window.location.origin + '/?page=login&clinic=ninho';
      }
    } else {
      // Redirecionar para login se não há sessão
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    }
  }, []);

  // Resetar para primeira página quando os filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  const handleRevalidateLogin = () => {
    // Limpar sessão
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');

    alert("Sessão encerrada. Redirecionando para login..");
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const handleNotificationClick = () => {
    alert("Sistema de notificações - 27 notificações pendentes");
  };

  const handleUserClick = () => {
    alert("Menu do usuário:\n- Perfil\n- Configurações\n- Trocar senha\n- Logout");
  };

  const handleLogoClick = () => {
    // Recarregar dashboard
    window.location.reload();
  };

  const handleViewSchedule = () => {
    // Redirecionar para página Schedule
    console.log('🚀 Redirecting to schedule page...');
    const scheduleUrl = `${window.location.origin}/?page=schedule`;
    console.log('🔗 Schedule URL:', scheduleUrl);
    window.location.href = scheduleUrl;
  };

  const handleViewPatients = () => {
    // Redirecionar para página de Lista de Pacientes
    const patientsUrl = `${window.location.origin}/?page=patients`;
    window.location.href = patientsUrl;
  };

  const handleViewBirthdays = () => {
    // Scroll para a seção de aniversários
    const birthdaysSection = document.querySelector('.dashboard-birthdays-section');
    if (birthdaysSection) {
      birthdaysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Função para mudar itens por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const handleClearFilters = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
    setCurrentPage(1); // Reset para primeira página
  };

  // Menu items dinâmicos baseados no perfil do usuário com navegação funcional
  const loggedMenuItems = userSession?.menuItems?.map(item => ({
    ...item,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      const clinic = new URLSearchParams(window.location.search).get('clinic') || 'ninho';

      switch (item.label) {
        case 'Dashboard':
          window.location.href = `${window.location.origin}/?page=dashboard&clinic=${clinic}`;
          break;
        case 'Agenda':
          window.location.href = `${window.location.origin}/?page=schedule&clinic=${clinic}`;
          break;
        case 'Pacientes':
          alert('Página de Pacientes em desenvolvimento');
          break;
        case 'Relatórios':
          alert('Página de Relatórios em desenvolvimento');
          break;
        case 'Financeiro':
          alert('Página Financeiro em desenvolvimento');
          break;
        case 'Usuários':
          alert('Página de Usuários em desenvolvimento');
          break;
        case 'Configurações':
          alert('Página de Configurações em desenvolvimento');
          break;
        default:
          console.log('Menu item clicked:', item.label);
      }
    }
  })) || [];

  if (!userSession) {
    return (
      <Box className="login-page">
        <Box className="dashboard-loading">
          Carregando...
        </Box>
      </Box>
    );
  }

  return (
    <Box className="login-page">
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

      <Box className="dashboard-main">
        <Container className="dashboard-container" maxWidth={false} disableGutters>
          <Box className="dashboard-content">

            {/* Título da Página */}
            <Box className="page-header-container">
              <Box className="page-header-content">
                <Typography variant="h4" className="page-header-title" sx={{ fontSize: '1.3rem', mb: 1 }}>Dashboard</Typography>
                <Typography variant="body2" className="page-header-description">
                  Visão geral dos principais indicadores e estatísticas da clínica.
                </Typography>
              </Box>
              <FaqButton />
            </Box>

            {/* Cards de Estatísticas */}
            <Box className="dashboard-stats-grid">
              {/* Card Compromissos */}
              <Box>
                <Paper
                  className="dashboard-card"
                  elevation={0}
                  sx={{
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08) !important',
                  }}
                >
                  <Box className="dashboard-card-header">
                    <Box className="dashboard-card-icon blue">
                      <CalendarToday />
                    </Box>
                    <Typography variant="h6" className="dashboard-card-title" sx={{ fontSize: '1.125rem' }}>
                      Compromissos 19/09
                    </Typography>
                  </Box>
                  <Box className="dashboard-card-content">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      {/* Gráfico de pizza animado para compromissos */}
                      <Box sx={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                          {/* Confirmados - 37.5% (6 de 16) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#28a745" strokeWidth="3"
                            strokeDasharray="37.5 62.5" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Cancelados - 25% (4 de 16) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#dc3545" strokeWidth="3"
                            strokeDasharray="25 75" strokeDashoffset="-37.5" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 0.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Pendentes - 37.5% (6 de 16) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ffc107" strokeWidth="3"
                            strokeDasharray="37.5 62.5" strokeDashoffset="-62.5" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1s forwards',
                              strokeDashoffset: '100'
                            }}/>
                        </svg>

                        {/* Total no centro */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                            16
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Lista de estatísticas */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#28a745', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Confirmados</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#28a745' }}>6</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#dc3545', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Cancelados</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#dc3545' }}>4</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ffc107', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Pendentes</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffc107' }}>6</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    onClick={handleViewSchedule}
                    className="dashboard-card-button"
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{
                      backgroundColor: '#03B4C6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#029AAB',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    VER AGENDA
                  </Button>
                </Paper>
              </Box>

              {/* Card Atendimentos */}
              <Box>
                <Paper
                  className="dashboard-card"
                  elevation={0}
                  sx={{
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08) !important',
                  }}
                >
                  <Box className="dashboard-card-header">
                    <Box className="dashboard-card-icon green">
                      <CheckCircle />
                    </Box>
                    <Typography variant="h6" className="dashboard-card-title" sx={{ fontSize: '1.125rem' }}>
                      Atendimentos (30d)
                    </Typography>
                  </Box>
                  <Box className="dashboard-card-content">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      {/* Gráfico de pizza animado para atendimentos */}
                      <Box sx={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                          {/* Com atendimento - 60% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#03B4C6" strokeWidth="3"
                            strokeDasharray="60 40" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Pendentes - 25% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#dc3545" strokeWidth="3"
                            strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 0.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Sem atendimento - 15% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ffc107" strokeWidth="3"
                            strokeDasharray="15 85" strokeDashoffset="-85" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1s forwards',
                              strokeDashoffset: '100'
                            }}/>
                        </svg>

                        {/* Total no centro */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                            100
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Lista de estatísticas */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#03B4C6', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Com atendimento</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#03B4C6' }}>60</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#dc3545', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Pendentes</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#dc3545' }}>25</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ffc107', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Sem atendimento</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ffc107' }}>15</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    className="dashboard-card-button"
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{
                      backgroundColor: '#03B4C6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#029AAB',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    VER DADOS
                  </Button>
                </Paper>
              </Box>

              {/* Card Registros de Pacientes */}
              <Box>
                <Paper
                  className="dashboard-card"
                  elevation={0}
                  sx={{
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08) !important',
                  }}
                >
                  <Box className="dashboard-card-header">
                    <Box className="dashboard-card-icon orange">
                      <Assignment />
                    </Box>
                    <Typography variant="h6" className="dashboard-card-title" sx={{ fontSize: '1.125rem' }}>
                      Registros de pacientes
                    </Typography>
                  </Box>
                  <Box className="dashboard-card-content">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      {/* Gráfico de pizza animado para registros */}
                      <Box sx={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                          {/* Com evolução - 42% (155 de 371) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#17a2b8" strokeWidth="3"
                            strokeDasharray="42 58" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Com agendamentos - 22% (82 de 371) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#28a745" strokeWidth="3"
                            strokeDasharray="22 78" strokeDashoffset="-42" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 0.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Com cadastro completo - 21% (77 de 371) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ffc107" strokeWidth="3"
                            strokeDasharray="21 79" strokeDashoffset="-64" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Sem registros - 15% (restante) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6c757d" strokeWidth="3"
                            strokeDasharray="15 85" strokeDashoffset="-85" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                        </svg>

                        {/* Total no centro */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                            371
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Lista de estatísticas */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#17a2b8', borderRadius: '50%' }}></Box>
                            <Typography variant="caption">Com evolução</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#17a2b8' }}>155</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#28a745', borderRadius: '50%' }}></Box>
                            <Typography variant="caption">Com agendamentos</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#28a745' }}>82</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#ffc107', borderRadius: '50%' }}></Box>
                            <Typography variant="caption">Cadastro completo</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#ffc107' }}>77</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#fd7e14', borderRadius: '50%' }}></Box>
                            <Typography variant="caption">Com plano de ação</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#fd7e14' }}>14</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#e83e8c', borderRadius: '50%' }}></Box>
                            <Typography variant="caption">Com CID</Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#e83e8c' }}>12</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    onClick={handleViewPatients}
                    className="dashboard-card-button"
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{
                      backgroundColor: '#03B4C6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#029AAB',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    VER PACIENTES
                  </Button>
                </Paper>
              </Box>

              {/* Card Resumo de Aniversários */}
              <Box>
                <Paper
                  className="dashboard-card"
                  elevation={0}
                  sx={{
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08) !important',
                  }}
                >
                  <Box className="dashboard-card-header">
                    <Box className="dashboard-card-icon pink">
                      <Cake />
                    </Box>
                    <Typography variant="h6" className="dashboard-card-title" sx={{ fontSize: '1.125rem' }}>
                      Aniversários
                    </Typography>
                  </Box>

                  <Box className="dashboard-card-content">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                      {/* Gráfico de pizza animado para aniversários */}
                      <Box sx={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                          {/* Background circle */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                          {/* Mês - 78% (18 de 23) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2196f3" strokeWidth="3"
                            strokeDasharray="78 22" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Semana - 22% (5 de 23) */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#4caf50" strokeWidth="3"
                            strokeDasharray="22 78" strokeDashoffset="-78" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 0.5s forwards',
                              strokeDashoffset: '100'
                            }}/>
                          {/* Hoje - 0% */}
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ff9800" strokeWidth="3"
                            strokeDasharray="0 100" strokeDashoffset="-100" strokeLinecap="round"
                            style={{
                              animation: 'drawCircle 2s ease-out 1s forwards',
                              strokeDashoffset: '100'
                            }}/>
                        </svg>

                        {/* Total no centro */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                            23
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {/* Lista de estatísticas */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#2196f3', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Mês</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196f3' }}>18</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Semana</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>5</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: '50%' }}></Box>
                            <Typography variant="body2">Hoje</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>0</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    onClick={handleViewBirthdays}
                    className="dashboard-card-button"
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{
                      backgroundColor: '#03B4C6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#029AAB',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    VER ANIVERSÁRIOS
                  </Button>
                </Paper>
              </Box>
            </Box>

            {/* Seção de Aniversários */}
            <Box className="dashboard-birthdays-section" sx={{ mt: 4 }}>
              <Box className="dashboard-birthdays-header" sx={{ mb: 3 }}>
                <Box className="dashboard-birthdays-title-section" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box className="dashboard-card-icon pink">
                    <Cake />
                  </Box>
                  <Box>
                    <Typography variant="h5" className="dashboard-birthdays-title" sx={{ fontSize: '1.25rem' }}>
                      Aniversários - Data: {new Date().toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                </Box>

                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onClear={handleClearFilters}
                  initialStartDate={initialStartDate}
                  initialEndDate={initialEndDate}
                />
              </Box>

              {/* Navegador de páginas - Superior */}
              <Paper
                className="birthday-pagination-container"
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: '#f8f9fa',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" className="birthday-pagination-info" sx={{ color: 'text.secondary' }}>
                    Mostrando {startIndex + 1}-{Math.min(endIndex, birthdayPeople.length)} de{' '}
                    <strong>{birthdayPeople.length}</strong> aniversariantes
                  </Typography>

                  <Box className="birthday-pagination-controls" sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
                      onChange={(event, page) => setCurrentPage(page)}
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

              <TableContainer
                component={Paper}
                className="dashboard-table-container"
                elevation={0}
                sx={{
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                <Table sx={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '120px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '180px' }} />
                  </colgroup>
                  <TableHead>
                    <TableRow className="dashboard-table-header">
                      <TableCell>Nascimento</TableCell>
                      <TableCell>Idade</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentBirthdays.map((person, index) => {
                      const isCurrentWeek = isCurrentWeekBirthday(person.birth);
                      return (
                        <TableRow
                          key={index}
                          className="dashboard-table-row"
                          sx={{
                            fontWeight: isCurrentWeek ? 'bold' : 'normal',
                            bgcolor: isCurrentWeek ? '#fff3cd' : 'transparent',
                          }}
                        >
                          <TableCell>{person.birth}</TableCell>
                          <TableCell>{person.age}</TableCell>
                          <TableCell>{person.name}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Tooltip title="Enviar email">
                                <IconButton
                                  component="a"
                                  href={`mailto:${person.email}?subject=Feliz Aniversário!&body=Olá ${person.name}! Feliz aniversário! Desejamos um dia maravilhoso e cheio de alegrias! 🎂`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="action-btn email-btn"
                                  size="small"
                                  sx={{
                                    bgcolor: '#ff9800',
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: '#f57c00',
                                    },
                                  }}
                                >
                                  <Email fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Enviar mensagem no WhatsApp">
                                <IconButton
                                  component="a"
                                  href={`https://wa.me/55${person.phone.replace(/\D/g, '')}?text=Olá ${person.name}! Feliz aniversário! 🎉`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="action-btn whatsapp-btn"
                                  size="small"
                                  sx={{
                                    bgcolor: '#25D366',
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: '#1da851',
                                    },
                                  }}
                                >
                                  <WhatsApp fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Gerenciar cadastro">
                                <IconButton
                                  onClick={() => {
                                    window.open(`/cadastro-paciente?id=${person.patient_id}`, '_blank');
                                  }}
                                  className="action-btn"
                                  size="small"
                                  sx={{
                                    bgcolor: '#03a9f4',
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: '#0288d1',
                                    },
                                  }}
                                >
                                  <Folder fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Navegador de páginas - Inferior */}
              <Paper
                className="birthday-pagination-container"
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
                  <Typography variant="body2" className="birthday-pagination-info" sx={{ color: 'text.secondary' }}>
                    Mostrando {startIndex + 1}-{Math.min(endIndex, birthdayPeople.length)} de{' '}
                    <strong>{birthdayPeople.length}</strong> aniversariantes
                  </Typography>

                  <Box className="birthday-pagination-controls" sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
                      onChange={(event, page) => setCurrentPage(page)}
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
            </Box>
          </Box>
        </Container>
      </Box>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </Box>
  );
};

export default Dashboard;
