import React, { useState, useEffect } from "react";
import "./Login.css";
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";

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

interface CalendarEvent {
  id: string;
  title: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'attended';
  time: string;
  patient: string;
}

interface CalendarDay {
  date: number;
  events: CalendarEvent[];
  isToday: boolean;
  isOtherMonth: boolean;
}

const Schedule: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filters, setFilters] = useState({
    team: '',
    startDate: '01/08/2025',
    endDate: '01/12/2025',
    professional: '',
    patientSearch: ''
  });

  useEffect(() => {
    document.title = "Clinic4Us - Agenda";

    // Verificar se há sessão ativa
    const sessionData = localStorage.getItem('clinic4us-user-session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUserSession(session);
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        window.location.href = window.location.origin + '/?page=login&clinic=ninho';
      }
    } else {
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    }
  }, []);

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
    alert("Menu do usuário:\n- Perfil\n- Configurações\n- Trocar senha\n- Logout");
  };

  const handleLogoClick = () => {
    window.location.href = window.location.origin + '/?page=dashboard';
  };

  // Dados mockados para demonstração
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isToday = date.toDateString() === today.toDateString();
      const isOtherMonth = date.getMonth() !== month;

      // Mock events
      const events: CalendarEvent[] = [];
      if (!isOtherMonth && date.getDate() % 3 === 0) {
        events.push({
          id: `event-${i}-1`,
          title: 'Pendente confirmação',
          status: 'pending',
          time: '09:00',
          patient: 'AGENDA R'
        });
      }
      if (!isOtherMonth && date.getDate() % 5 === 0) {
        events.push({
          id: `event-${i}-2`,
          title: 'Compareceu',
          status: 'attended',
          time: '14:00',
          patient: 'Melissa Rodrigues Ba'
        });
      }
      if (!isOtherMonth && date.getDate() % 7 === 0) {
        events.push({
          id: `event-${i}-3`,
          title: 'Cancelado profissional',
          status: 'cancelled',
          time: '16:00',
          patient: 'AGENDA P'
        });
      }

      days.push({
        date: date.getDate(),
        events,
        isToday,
        isOtherMonth
      });
    }

    return days;
  };

  const getMonthYear = () => {
    return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const clearFilters = () => {
    setFilters({
      team: '',
      startDate: '01/08/2025',
      endDate: '01/12/2025',
      professional: '',
      patientSearch: ''
    });
  };

  const getEventColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'confirmed': return '#4263eb';
      case 'pending': return '#868e96';
      case 'cancelled': return '#fa5252';
      case 'attended': return '#51cf66';
      default: return '#868e96';
    }
  };

  const loggedMenuItems = userSession?.menuItems || [];

  if (!userSession) {
    return (
      <div className="login-page">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#03B4C6',
          fontSize: '1.2rem'
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
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
        marginTop: '85px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          {/* Header da Agenda */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                margin: '0',
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#4263eb'
              }}>Agenda Profissional</h1>
              <p style={{
                margin: '0.5rem 0 0 0',
                color: '#6c757d',
                fontSize: '0.9rem'
              }}>
                Administre a agenda profissional. <span style={{ color: '#fa5252' }}>As informações iniciais abrangem o último mês e os próximos dois. Para visualizar outros períodos, ajuste os filtros de data.</span>
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#03B4C6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}>?</div>
          </div>

          {/* Filtros */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#495057' }}>Equipe</label>
                <select
                  value={filters.team}
                  onChange={(e) => setFilters({...filters, team: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="equipe1">Equipe 1</option>
                  <option value="equipe2">Equipe 2</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#495057' }}>Data inicial</label>
                <input
                  type="text"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#495057' }}>Data final</label>
                <input
                  type="text"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#495057' }}>Nome do Profissional</label>
                <select
                  value={filters.professional}
                  onChange={(e) => setFilters({...filters, professional: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">Selecione</option>
                  <option value="dr1">Dr. João Silva</option>
                  <option value="dr2">Dra. Maria Santos</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#495057' }}>Busca paciente cadastrado (Nome, E-mail, Telefone)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={filters.patientSearch}
                    onChange={(e) => setFilters({...filters, patientSearch: e.target.value})}
                    placeholder="Busca"
                    style={{
                      width: '100%',
                      padding: '0.5rem 3rem 0.5rem 0.5rem',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: '#03B4C6', cursor: 'pointer', fontSize: '1.2rem' }}>🔍</span>
                    <span style={{ color: '#03B4C6', cursor: 'pointer', fontSize: '1.2rem' }}>📅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'white',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: '#495057'
                }}
              >
                Limpar filtros
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                background: '#03B4C6',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: 'white'
              }}>
                Agenda Paciente
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: '#495057'
              }}>
                Cadastro do Paciente
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: '#495057'
              }}>
                Novo Paciente
              </button>
            </div>
          </div>

          {/* Navegação do Calendário */}
          <div style={{
            background: 'white',
            borderRadius: '8px 8px 0 0',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={goToToday}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6c757d',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Hoje
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => navigateMonth('prev')}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </button>
              </div>
            </div>

            <h2 style={{
              margin: '0',
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#495057',
              textTransform: 'lowercase'
            }}>
              {getMonthYear()}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: viewMode === mode ? '#495057' : 'white',
                    border: '1px solid #495057',
                    borderRadius: '4px',
                    color: viewMode === mode ? 'white' : '#495057',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
                </button>
              ))}
            </div>
          </div>

          {/* Calendário */}
          {viewMode === 'month' && (
            <div style={{
              background: 'white',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Header dos dias da semana */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                background: '#f8f9fa',
                borderBottom: '1px solid #dee2e6'
              }}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                  <div
                    key={day}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      color: '#495057',
                      borderRight: '1px solid #dee2e6'
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do calendário */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridAutoRows: 'minmax(120px, auto)'
              }}>
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #dee2e6',
                      borderTop: 'none',
                      borderLeft: index % 7 === 0 ? '1px solid #dee2e6' : 'none',
                      padding: '0.5rem',
                      background: day.isOtherMonth ? '#f8f9fa' : 'white',
                      position: 'relative',
                      minHeight: '120px'
                    }}
                  >
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: day.isToday ? '600' : '400',
                      color: day.isOtherMonth ? '#adb5bd' : day.isToday ? '#03B4C6' : '#495057',
                      marginBottom: '0.25rem'
                    }}>
                      {day.date}
                    </div>

                    {day.events.map((event, eventIndex) => (
                      <div
                        key={event.id}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.125rem 0.25rem',
                          marginBottom: '0.125rem',
                          borderRadius: '2px',
                          background: getEventColor(event.status),
                          color: 'white',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={`${event.time} - ${event.title} - ${event.patient}`}
                      >
                        {event.title} - {event.patient}
                      </div>
                    ))}

                    {day.events.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '0.25rem',
                        right: '0.25rem',
                        fontSize: '0.7rem',
                        color: '#6c757d'
                      }}>
                        +{day.events.length} mais
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Views de Semana e Dia (placeholder) */}
          {(viewMode === 'week' || viewMode === 'day') && (
            <div style={{
              background: 'white',
              borderRadius: '0 0 8px 8px',
              padding: '2rem',
              textAlign: 'center',
              color: '#6c757d',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3>Visualização de {viewMode === 'week' ? 'Semana' : 'Dia'}</h3>
              <p>Esta funcionalidade será implementada em breve.</p>
            </div>
          )}
        </div>
      </main>

      <FooterInternal
        simplified={true}
        className="login-footer-component"
      />
    </div>
  );
};

export default Schedule;