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

      <main className="login-main">
        <div className="login-container">
          <div className="login-content">
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                  color: '#03B4C6',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  fontWeight: '700'
                }}>
                  🏥 Bem-vindo ao Dashboard
                </h1>
                <p style={{
                  color: '#4A5568',
                  fontSize: '1.2rem',
                  marginBottom: '2rem'
                }}>
                  Sistema de gestão para sua clínica
                </p>
              </div>

              <div style={{
                background: '#F7FAFC',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                width: '100%',
                maxWidth: '500px'
              }}>
                <h3 style={{
                  color: '#2D3748',
                  marginBottom: '1rem',
                  fontSize: '1.3rem'
                }}>
                  Informações da Sessão
                </h3>
                <div style={{ textAlign: 'left', color: '#4A5568' }}>
                  <p><strong>Email:</strong> {userSession.email}</p>
                  <p><strong>Clínica:</strong> {userSession.clinicName}</p>
                  <p><strong>Alias:</strong> {userSession.alias}</p>
                  <p><strong>Perfil:</strong> {userSession.role}</p>
                  <p><strong>Permissões:</strong> {userSession.permissions?.join(', ')}</p>
                  <p><strong>Login em:</strong> {userSession.loginTime}</p>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #03B4C6 0%, #029AAB 100%)',
                color: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '500px'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                  📋 Conteúdo do Dashboard em desenvolvimento
                </h4>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  Esta área será preenchida com widgets, gráficos e funcionalidades específicas do sistema de gestão da clínica.
                </p>
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