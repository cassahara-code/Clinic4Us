import React, { useState, useEffect } from "react";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { FaqButton } from "../components/FaqButton";
import { CalendarToday, CheckCircle, Assignment, Cake, FirstPage, LastPage, ChevronLeft, ChevronRight, Delete, WhatsApp, Email, Folder } from '@mui/icons-material';

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

  // Estados para filtro de data
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  });

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
  const birthdayPeople = [
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

  const handleViewBirthdays = () => {
    // Scroll para a seção de aniversários
    const birthdaysSection = document.querySelector('.dashboard-birthdays-section');
    if (birthdaysSection) {
      birthdaysSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Funções de paginação para aniversários
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

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
      <div className="login-page">
        <div className="dashboard-loading">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
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

            {/* Título da Página */}
            <div className="dashboard-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="dashboard-page-title">Dashboard</h1>
              <FaqButton />
            </div>

              {/* Cards de Estatísticas */}
              <div className="dashboard-stats-grid">
                {/* Card Compromissos */}
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div className="dashboard-card-icon blue">
                      <CalendarToday />
                    </div>
                    <h3 className="dashboard-card-title">Compromissos 19/09/2025</h3>
                  </div>
                  <div className="dashboard-card-content">
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      {/* Gráfico de pizza animado para compromissos */}
                      <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0
                      }}>
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
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#2196f3'
                          }}>
                            16
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#6c757d'
                          }}>
                            Total
                          </div>
                        </div>
                      </div>

                      {/* Lista de estatísticas */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#28a745',
                              borderRadius: '50%'
                            }}></div>
                            <span>Confirmados</span>
                          </div>
                          <strong style={{ color: '#28a745' }}>6</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#dc3545',
                              borderRadius: '50%'
                            }}></div>
                            <span>Cancelados</span>
                          </div>
                          <strong style={{ color: '#dc3545' }}>4</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#ffc107',
                              borderRadius: '50%'
                            }}></div>
                            <span>Pendentes</span>
                          </div>
                          <strong style={{ color: '#ffc107' }}>6</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleViewSchedule}
                    className="dashboard-card-button"
                  >
                    VER AGENDA
                  </button>
                </div>

                {/* Card Atendimentos */}
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div className="dashboard-card-icon green">
                      <CheckCircle />
                    </div>
                    <h3 className="dashboard-card-title">Atendimentos (30 dias)</h3>
                  </div>
                  <div className="dashboard-card-content">
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      {/* Gráfico de pizza animado para atendimentos */}
                      <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0
                      }}>
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
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#2196f3'
                          }}>
                            100
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#6c757d'
                          }}>
                            Total
                          </div>
                        </div>
                      </div>

                      {/* Lista de estatísticas */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#03B4C6',
                              borderRadius: '50%'
                            }}></div>
                            <span>Com atendimento</span>
                          </div>
                          <strong style={{ color: '#03B4C6' }}>60</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#dc3545',
                              borderRadius: '50%'
                            }}></div>
                            <span>Pendentes</span>
                          </div>
                          <strong style={{ color: '#dc3545' }}>25</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#ffc107',
                              borderRadius: '50%'
                            }}></div>
                            <span>Sem atendimento</span>
                          </div>
                          <strong style={{ color: '#ffc107' }}>15</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="dashboard-card-button">
                    VER DADOS
                  </button>
                </div>

                {/* Card Registros de Pacientes */}
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div className="dashboard-card-icon orange">
                      <Assignment />
                    </div>
                    <h3 className="dashboard-card-title">Registros de pacientes</h3>
                  </div>
                  <div className="dashboard-card-content">
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      {/* Gráfico de pizza animado para registros */}
                      <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0
                      }}>
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
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#2196f3'
                          }}>
                            371
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#6c757d'
                          }}>
                            Total
                          </div>
                        </div>
                      </div>

                      {/* Lista de estatísticas */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#17a2b8',
                              borderRadius: '50%'
                            }}></div>
                            <span>Com evolução</span>
                          </div>
                          <strong style={{ color: '#17a2b8' }}>155</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#28a745',
                              borderRadius: '50%'
                            }}></div>
                            <span>Com agendamentos</span>
                          </div>
                          <strong style={{ color: '#28a745' }}>82</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#ffc107',
                              borderRadius: '50%'
                            }}></div>
                            <span>Cadastro completo</span>
                          </div>
                          <strong style={{ color: '#ffc107' }}>77</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#fd7e14',
                              borderRadius: '50%'
                            }}></div>
                            <span>Com plano de ação</span>
                          </div>
                          <strong style={{ color: '#fd7e14' }}>14</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#e83e8c',
                              borderRadius: '50%'
                            }}></div>
                            <span>Com CID</span>
                          </div>
                          <strong style={{ color: '#e83e8c' }}>12</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="dashboard-card-button">
                    VER PACIENTES
                  </button>
                </div>

                {/* Card Resumo de Aniversários */}
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <div className="dashboard-card-icon pink">
                      <Cake />
                    </div>
                    <h3 className="dashboard-card-title">Resumo de Aniversários</h3>
                  </div>

                  <div className="dashboard-card-content">
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      {/* Gráfico de pizza animado para aniversários */}
                      <div style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        flexShrink: 0
                      }}>
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
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#2196f3'
                          }}>
                            23
                          </div>
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#6c757d'
                          }}>
                            Total
                          </div>
                        </div>
                      </div>

                      {/* Lista de estatísticas */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#2196f3',
                              borderRadius: '50%'
                            }}></div>
                            <span>Mês</span>
                          </div>
                          <strong style={{ color: '#2196f3' }}>18</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#4caf50',
                              borderRadius: '50%'
                            }}></div>
                            <span>Semana</span>
                          </div>
                          <strong style={{ color: '#4caf50' }}>5</strong>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#ff9800',
                              borderRadius: '50%'
                            }}></div>
                            <span>Hoje</span>
                          </div>
                          <strong style={{ color: '#ff9800' }}>0</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleViewBirthdays}
                    className="dashboard-card-button"
                  >
                    VER ANIVERSÁRIOS
                  </button>
                </div>
              </div>

              {/* Seção de Aniversários */}
              <div className="dashboard-birthdays-section">
                <div className="dashboard-birthdays-header">
                  <div className="dashboard-birthdays-title-section">
                    <div className="dashboard-card-icon pink">
                      <Cake />
                    </div>
                    <div>
                      <h3 className="dashboard-birthdays-title">Aniversários - Data: {new Date().toLocaleDateString('pt-BR')}</h3>
                    </div>
                  </div>

                  <div className="dashboard-date-filter">
                    <div className="dashboard-date-input-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        color: '#6c757d',
                        marginBottom: '0.5rem'
                      }}>
                        Data Inicial
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
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

                    <div className="dashboard-date-input-group">
                      <label style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        color: '#6c757d',
                        marginBottom: '0.5rem'
                      }}>
                        Data Final
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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

                    <div className="dashboard-clear-filter">
                      <button
                        onClick={handleClearFilters}
                        style={{
                          padding: '0.4rem',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = '#5a6268'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = '#6c757d'}
                        title="Limpar filtros"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>


                {/* Navegador de páginas - Superior */}
                <div className="birthday-pagination-container" style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div className="birthday-pagination-info" style={{
                    color: '#4a5568',
                    fontSize: '0.9rem'
                  }}>
                    Mostrando {startIndex + 1}-{Math.min(endIndex, birthdayPeople.length)} de <strong style={{
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>{birthdayPeople.length}</strong> aniversariantes
                  </div>

                  <div className="birthday-pagination-controls" style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {/* Seletor de itens por página */}
                    <div className="birthday-pagination-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{
                        fontSize: '0.85rem',
                        color: '#6c757d',
                        whiteSpace: 'nowrap'
                      }}>
                        Itens por página:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          color: '#495057',
                          background: 'white'
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                    </div>

                    {/* Navegação de páginas */}
                    <div className="birthday-pagination-buttons" style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        title="Primeira página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === 1 ? '#e9ecef' : '#007bff',
                          color: currentPage === 1 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <FirstPage />
                      </button>

                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        title="Página anterior"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === 1 ? '#e9ecef' : '#007bff',
                          color: currentPage === 1 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <ChevronLeft />
                      </button>

                      <span style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        color: '#495057',
                        whiteSpace: 'nowrap'
                      }}>
                        {currentPage} de {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        title="Próxima página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                          color: currentPage === totalPages ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <ChevronRight />
                      </button>

                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        title="Última página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                          color: currentPage === totalPages ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <LastPage />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="dashboard-table-container">
                  <div className="dashboard-table-header">
                    <div>Nascimento</div>
                    <div>Idade</div>
                    <div>Nome</div>
                    <div>Ações</div>
                  </div>
                  {currentBirthdays.map((person, index) => {
                    const isCurrentWeek = isCurrentWeekBirthday(person.birth);
                    return (
                    <div key={index} className="dashboard-table-row" style={{
                      fontWeight: isCurrentWeek ? 'bold' : 'normal',
                      backgroundColor: isCurrentWeek ? '#fff3cd' : 'transparent'
                    }}>
                      <div>{person.birth}</div>
                      <div>{person.age}</div>
                      <div>{person.name}</div>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <a
                          href={`https://wa.me/55${person.phone.replace(/\D/g, '')}?text=Olá ${person.name}! Feliz aniversário! 🎉`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar mensagem no WhatsApp"
                          className="action-btn whatsapp-btn"
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <WhatsApp fontSize="small" />
                        </a>

                        <a
                          href={`mailto:${person.email}?subject=Feliz Aniversário!&body=Olá ${person.name}! Feliz aniversário! Desejamos um dia maravilhoso e cheio de alegrias! 🎂`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar email"
                          className="action-btn email-btn"
                          style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Email fontSize="small" />
                        </a>

                        <button
                          onClick={() => {
                            // Open patient registration page in new window
                            window.open(`/cadastro-paciente?id=${person.patient_id}`, '_blank');
                          }}
                          title="Gerenciar cadastro"
                          className="action-btn"
                          style={{
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(255, 193, 7, 0.3)',
                            minWidth: '32px',
                            height: '32px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e0a800';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffc107';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(255, 193, 7, 0.3)';
                          }}
                        >
                          <Folder fontSize="small" />
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Navegador de páginas - Inferior */}
                <div className="birthday-pagination-container" style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div className="birthday-pagination-info" style={{
                    color: '#4a5568',
                    fontSize: '0.9rem'
                  }}>
                    Mostrando {startIndex + 1}-{Math.min(endIndex, birthdayPeople.length)} de <strong style={{
                      color: '#2d3748',
                      fontWeight: '600'
                    }}>{birthdayPeople.length}</strong> aniversariantes
                  </div>

                  <div className="birthday-pagination-controls" style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {/* Seletor de itens por página */}
                    <div className="birthday-pagination-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{
                        fontSize: '0.85rem',
                        color: '#6c757d',
                        whiteSpace: 'nowrap'
                      }}>
                        Itens por página:
                      </label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          color: '#495057',
                          background: 'white'
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                    </div>

                    {/* Navegação de páginas */}
                    <div className="birthday-pagination-buttons" style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        title="Primeira página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === 1 ? '#e9ecef' : '#007bff',
                          color: currentPage === 1 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <FirstPage />
                      </button>

                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        title="Página anterior"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === 1 ? '#e9ecef' : '#007bff',
                          color: currentPage === 1 ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <ChevronLeft />
                      </button>

                      <span style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        color: '#495057',
                        whiteSpace: 'nowrap'
                      }}>
                        {currentPage} de {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        title="Próxima página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                          color: currentPage === totalPages ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <ChevronRight />
                      </button>

                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        title="Última página"
                        style={{
                          padding: '0.4rem 0.6rem',
                          background: currentPage === totalPages ? '#e9ecef' : '#007bff',
                          color: currentPage === totalPages ? '#6c757d' : 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <LastPage />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default Dashboard;