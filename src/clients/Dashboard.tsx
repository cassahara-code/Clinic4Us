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
import { CalendarToday, CheckCircle, Assignment, Cake, WhatsApp, Email, Folder, BarChart } from '@mui/icons-material';
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

  const handleViewAttendanceChart = () => {
    // Scroll para o gráfico de status de presença
    const attendanceChart = document.querySelector('.dashboard-attendance-chart');
    if (attendanceChart) {
      attendanceChart.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                  Dashboard
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
                    onClick={handleViewAttendanceChart}
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
                    {/* Gráfico de barras */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/* Barra: Com evolução */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, minWidth: '110px', textAlign: 'right' }}>
                            Com evolução
                          </Typography>
                          <Box sx={{ flex: 1, position: 'relative' }}>
                            <Box sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: '42%',
                                height: '100%',
                                backgroundColor: '#17a2b8',
                                animation: 'expandBar 1s ease-out forwards',
                                '@keyframes expandBar': {
                                  from: { width: 0 },
                                  to: { width: '42%' }
                                }
                              }} />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#17a2b8', minWidth: '30px' }}>
                            155
                          </Typography>
                        </Box>

                        {/* Barra: Com agendamentos */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, minWidth: '110px', textAlign: 'right' }}>
                            Com agendamentos
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: '22%',
                                height: '100%',
                                backgroundColor: '#28a745',
                                animation: 'expandBar2 1s ease-out 0.2s forwards',
                                '@keyframes expandBar2': {
                                  from: { width: 0 },
                                  to: { width: '22%' }
                                }
                              }} />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#28a745', minWidth: '30px' }}>
                            82
                          </Typography>
                        </Box>

                        {/* Barra: Cadastro completo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, minWidth: '110px', textAlign: 'right' }}>
                            Cadastro completo
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: '21%',
                                height: '100%',
                                backgroundColor: '#ffc107',
                                animation: 'expandBar3 1s ease-out 0.4s forwards',
                                '@keyframes expandBar3': {
                                  from: { width: 0 },
                                  to: { width: '21%' }
                                }
                              }} />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#ffc107', minWidth: '30px' }}>
                            77
                          </Typography>
                        </Box>

                        {/* Barra: Com plano de ação */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, minWidth: '110px', textAlign: 'right' }}>
                            Com plano de ação
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: '4%',
                                height: '100%',
                                backgroundColor: '#fd7e14',
                                animation: 'expandBar4 1s ease-out 0.6s forwards',
                                '@keyframes expandBar4': {
                                  from: { width: 0 },
                                  to: { width: '4%' }
                                }
                              }} />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fd7e14', minWidth: '30px' }}>
                            14
                          </Typography>
                        </Box>

                        {/* Barra: Com CID */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, minWidth: '110px', textAlign: 'right' }}>
                            Com CID
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: '3%',
                                height: '100%',
                                backgroundColor: '#e83e8c',
                                animation: 'expandBar5 1s ease-out 0.8s forwards',
                                '@keyframes expandBar5': {
                                  from: { width: 0 },
                                  to: { width: '3%' }
                                }
                              }} />
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#e83e8c', minWidth: '30px' }}>
                            12
                          </Typography>
                        </Box>
                      </Box>

                      {/* Total */}
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Total de Registros
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                          371
                        </Typography>
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

            {/* Gráfico de Status de Presença por Dia */}
            <Box className="dashboard-attendance-chart" sx={{ mt: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08) !important',
                  p: 3,
                  borderRadius: '12px'
                }}
              >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box className="dashboard-card-icon blue">
                      <BarChart />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontSize: '1.25rem' }}>
                        Status de Presença por Dia
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

                <Box sx={{ mb: 3 }}>

                  {/* Gráfico de Barras Verticais */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    height: '300px',
                    borderBottom: '2px solid #e9ecef',
                    borderLeft: '2px solid #e9ecef',
                    pl: 2,
                    pb: 2,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' }
                  }}>
                    {/* Barras para os últimos 30 dias */}
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (29 - i));
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');

                      // Dados mock de presença
                      const presente = Math.floor(Math.random() * 15);
                      const ausente = Math.floor(Math.random() * 8);
                      const justificado = Math.floor(Math.random() * 5);
                      const total = presente + ausente + justificado;
                      const maxHeight = 280;

                      return (
                        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px', gap: 0.5 }}>
                          {/* Stack de barras */}
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            height: `${maxHeight}px`,
                            justifyContent: 'flex-start',
                            gap: 0.5
                          }}>
                            {/* Presente */}
                            {presente > 0 && (
                              <Tooltip title={`Presente: ${presente}`} arrow>
                                <Box sx={{
                                  width: '35px',
                                  height: `${(presente / 20) * maxHeight}px`,
                                  backgroundColor: '#28a745',
                                  borderRadius: '4px 4px 0 0',
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s',
                                  animation: `growBar${i} 1s ease-out forwards`,
                                  [`@keyframes growBar${i}`]: {
                                    from: { height: 0 },
                                    to: { height: `${(presente / 20) * maxHeight}px` }
                                  },
                                  '&:hover': { opacity: 0.8 }
                                }} />
                              </Tooltip>
                            )}

                            {/* Ausente */}
                            {ausente > 0 && (
                              <Tooltip title={`Ausente: ${ausente}`} arrow>
                                <Box sx={{
                                  width: '35px',
                                  height: `${(ausente / 20) * maxHeight}px`,
                                  backgroundColor: '#dc3545',
                                  borderRadius: justificado > 0 ? '0' : '4px 4px 0 0',
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s',
                                  animation: `growBar${i}a 1s ease-out 0.2s forwards`,
                                  [`@keyframes growBar${i}a`]: {
                                    from: { height: 0 },
                                    to: { height: `${(ausente / 20) * maxHeight}px` }
                                  },
                                  '&:hover': { opacity: 0.8 }
                                }} />
                              </Tooltip>
                            )}

                            {/* Justificado */}
                            {justificado > 0 && (
                              <Tooltip title={`Justificado: ${justificado}`} arrow>
                                <Box sx={{
                                  width: '35px',
                                  height: `${(justificado / 20) * maxHeight}px`,
                                  backgroundColor: '#ffc107',
                                  borderRadius: '4px 4px 0 0',
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s',
                                  animation: `growBar${i}j 1s ease-out 0.4s forwards`,
                                  [`@keyframes growBar${i}j`]: {
                                    from: { height: 0 },
                                    to: { height: `${(justificado / 20) * maxHeight}px` }
                                  },
                                  '&:hover': { opacity: 0.8 }
                                }} />
                              </Tooltip>
                            )}
                          </Box>

                          {/* Data */}
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                            {day}/{month}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Legenda */}
                  <Box sx={{ display: 'flex', gap: 3, mt: 3, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#28a745', borderRadius: '4px' }} />
                      <Typography variant="body2">Presente</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#dc3545', borderRadius: '4px' }} />
                      <Typography variant="body2">Ausente</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#ffc107', borderRadius: '4px' }} />
                      <Typography variant="body2">Justificado</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
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

              {/* Contador de registros */}
              <Box sx={{ mb: 2, px: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  <strong>{birthdayPeople.length}</strong> aniversariantes encontrados
                </Typography>
              </Box>

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
