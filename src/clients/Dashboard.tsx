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

const Dashboard: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

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

  // Menu items dinâmicos baseados no perfil do usuário
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
        marginTop: '80px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '100%'
          }}>

              {/* Cards de Estatísticas */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
                width: '100%'
              }}>
                {/* Card Compromissos */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#4263eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '20px' }}>📅</span>
                    </div>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#212529'
                    }}>Compromissos 19/09/2025</h3>
                  </div>
                  <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Agendamentos de hoje: <strong>16</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Confirmados: <strong>6</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Cancelados: <strong>4</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Provisório: <strong>0</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Pendente Confirmação: <strong>0</strong></p>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#03B4C6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onMouseOver={(e) => e.currentTarget.style.background = '#029AAB'} onMouseOut={(e) => e.currentTarget.style.background = '#03B4C6'}>
                    VER AGENDA
                  </button>
                </div>

                {/* Card Atendimentos */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#28a745',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '20px' }}>✓</span>
                    </div>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#212529'
                    }}>Atendimentos (30 dias)</h3>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    flex: 1
                  }}>
                    <svg width="120" height="120" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e9ecef" strokeWidth="3"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#03B4C6" strokeWidth="3"
                        strokeDasharray="60 40" strokeLinecap="round"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#dc3545" strokeWidth="3"
                        strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round"/>
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ffc107" strokeWidth="3"
                        strokeDasharray="15 85" strokeDashoffset="-85" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#03B4C6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onMouseOver={(e) => e.currentTarget.style.background = '#029AAB'} onMouseOut={(e) => e.currentTarget.style.background = '#03B4C6'}>
                    VER DADOS
                  </button>
                </div>

                {/* Card Registros de Pacientes */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#fd7e14',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '20px' }}>📝</span>
                    </div>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#212529'
                    }}>Registros de pacientes</h3>
                  </div>
                  <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Com CID: <strong>12 de 371</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Com plano de ação: <strong>14 de 371</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Com registro de atendimentos: <strong>155 de 371</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Com cadastro completo: <strong>77 de 371</strong></p>
                    <p style={{ margin: '0.5rem 0', color: '#6c757d' }}>Com agendamentos: <strong>82 de 371</strong></p>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#03B4C6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onMouseOver={(e) => e.currentTarget.style.background = '#029AAB'} onMouseOut={(e) => e.currentTarget.style.background = '#03B4C6'}>
                    VER PACIENTES
                  </button>
                </div>
              </div>

              {/* Seção de Aniversários */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e9ecef',
                marginBottom: '2rem',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#e91e63',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px' }}>🎂</span>
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#212529'
                    }}>Data: 19/09/2025 | Aniversário deste mês: 18 | Aniversários desta semana: 5 | Aniversários de hoje: 0</h3>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <select style={{
                    padding: '0.5rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    color: '#495057',
                    width: '150px'
                  }}>
                    <option>Mês</option>
                    <option>Janeiro</option>
                    <option>Fevereiro</option>
                    <option>Março</option>
                    <option>Abril</option>
                    <option>Maio</option>
                    <option>Junho</option>
                    <option>Julho</option>
                    <option>Agosto</option>
                    <option selected>Setembro</option>
                    <option>Outubro</option>
                    <option>Novembro</option>
                    <option>Dezembro</option>
                  </select>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  overflowX: 'auto'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    background: '#e9ecef',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#495057',
                    minWidth: '400px'
                  }}>
                    <div>Nascimento</div>
                    <div>Idade</div>
                    <div>Nome</div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #dee2e6',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    fontSize: '0.9rem',
                    color: '#495057',
                    minWidth: '400px'
                  }}>
                    <div>01/09/2023</div>
                    <div>2</div>
                    <div>Eloah Silveira Siqueira Prado Nascimento</div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    fontSize: '0.9rem',
                    color: '#495057',
                    minWidth: '400px'
                  }}>
                    <div>01/09/2024</div>
                    <div>1</div>
                    <div>Antonella Di Franco Kitallah</div>
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