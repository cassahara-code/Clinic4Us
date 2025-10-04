import React, { useState, useEffect } from "react";
import { Box, Container, Typography } from '@mui/material';
import HeaderInternal from "../components/Header/HeaderInternal";
import { FooterInternal } from "../components/Footer";
import { useNavigation } from "../contexts/RouterContext";
import { FaqButton } from "../components/FaqButton";
import { colors, typography } from "../theme/designSystem";

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

const PageModel: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const { goToDashboard } = useNavigation();

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

  if (!userSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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

      <Box
        component="main"
        sx={{
          padding: '1rem',
          minHeight: 'calc(100vh - 120px)',
          background: colors.background,
          marginTop: '85px',
          flex: 1
        }}
      >
        <Container maxWidth={false} disableGutters>
          {/* Título da Página */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '1.3rem',
                  mb: 1,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textPrimary
                }}
              >
                Título da Página
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary
                }}
              >
                Descrição breve da funcionalidade da página.
              </Typography>
            </Box>
            <FaqButton />
          </Box>

          {/* Conteúdo da página vai aqui */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            fontSize: '1.2rem',
            color: colors.textSecondary
          }}>
            Conteúdo da página será adicionado aqui
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

export default PageModel;