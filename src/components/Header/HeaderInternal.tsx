import React, { useState, useEffect } from "react";
import logo from "../../images/logo_clinic4us.png";
import {
  NotificationsOutlined,
  Person,
  Refresh,
  Logout,
  Settings,
  Schedule,
  Visibility,
  VisibilityOff,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material';
import SessionTimer from "../SessionTimer";
import { useAuth } from "../../contexts/AuthContext";

interface MenuItemProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface HeaderInternalProps {
  menuItems?: MenuItemProps[];
  showCTAButton?: boolean;
  ctaButtonText?: string;
  onCTAClick?: (e: React.MouseEvent) => void;
  onLogoClick?: () => void;
  className?: string;
  isLoggedIn?: boolean;
  userEmail?: string;
  userProfile?: string;
  clinicName?: string;
  notificationCount?: number;
  onRevalidateLogin?: () => void;
  onNotificationClick?: () => void;
  onUserClick?: () => void;
}

const HeaderInternal: React.FC<HeaderInternalProps> = ({
  menuItems,
  showCTAButton = false,
  ctaButtonText = "Ação",
  onCTAClick,
  onLogoClick,
  className = "",
  isLoggedIn = false,
  userEmail = "",
  userProfile = "",
  clinicName = "",
  notificationCount = 0,
  onRevalidateLogin,
  onNotificationClick,
  onUserClick,
}) => {
  const { user, renewSession: renewAuthSession, refreshSession, updateProfile } = useAuth();

  // Usar dados do contexto se não forem passados por props
  const actualMenuItems = menuItems || user?.menuItems || [];
  const actualUserEmail = userEmail || user?.email || '';
  const actualUserProfile = userProfile || user?.role || '';
  const actualClinicName = clinicName || user?.clinicName || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] = useState(false);
  const [isChangeProfileModalOpen, setIsChangeProfileModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [revalidatePassword, setRevalidatePassword] = useState('');
  const [revalidateError, setRevalidateError] = useState('');
  const [showRevalidatePassword, setShowRevalidatePassword] = useState(false);

  // Função chamada quando a sessão expira
  const handleSessionExpiredFromTimer = () => {
    setIsSessionExpiredModalOpen(true);
    setRevalidatePassword('');
    setRevalidateError('');
    setShowRevalidatePassword(false);
  };

  // Cleanup mobile menu state when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);


  const handleSessionExpiredRevalidate = async () => {
    setRevalidateError('');

    if (!revalidatePassword.trim()) {
      setRevalidateError('Por favor, insira sua senha.');
      return;
    }

    try {
      // Usar função de renovação do AuthContext
      const result = await renewAuthSession(revalidatePassword);

      if (result.success) {
        // Atualizar sessão no contexto
        refreshSession();

        // Fechar modal e limpar campos
        setIsSessionExpiredModalOpen(false);
        setRevalidatePassword('');
        setRevalidateError('');
        setShowRevalidatePassword(false);

        console.log('Session renewed successfully');
      } else {
        setRevalidateError(result.error || 'Erro ao renovar sessão.');
      }
    } catch (error) {
      console.error('Erro ao renovar sessão expirada:', error);
      setRevalidateError('Erro interno. Tente novamente.');
    }
  };

  const handleSessionExpiredLogout = () => {
    try {
      // Obter dados da sessão para pegar a clinic
      const sessionData = localStorage.getItem('clinic4us-user-session');
      let clinicParam = 'ninho'; // fallback padrão

      if (sessionData) {
        const session = JSON.parse(sessionData);
        clinicParam = session.clinic || session.alias || 'ninho';
      }

      // Fechar modal
      setIsSessionExpiredModalOpen(false);

      // Limpar dados da sessão
      localStorage.removeItem('clinic4us-user-session');
      localStorage.removeItem('clinic4us-remember-me');

      // Limpar estados do modal
      setRevalidatePassword('');
      setRevalidateError('');
      setShowRevalidatePassword(false);

      // Redirecionar para login com a clinic correta
      window.location.href = `${window.location.origin}/?page=login&clinic=${clinicParam}`;
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Fallback em caso de erro
      setIsSessionExpiredModalOpen(false);
      localStorage.removeItem('clinic4us-user-session');
      localStorage.removeItem('clinic4us-remember-me');
      setRevalidatePassword('');
      setRevalidateError('');
      setShowRevalidatePassword(false);
      window.location.href = `${window.location.origin}/?page=login&clinic=ninho`;
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Add/remove class to body to hide hamburger when menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
      console.log('Mobile menu opened - added class mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
      console.log('Mobile menu closed - removed class mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else if (isLoggedIn) {
      window.location.href = `${window.location.origin}/?page=dashboard`;
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleMenuItemClick = (item: MenuItemProps, e: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick(e);
    }
    closeMobileMenu();
  };

  const truncateEmail = (email: string, maxLength: number = 25): string => {
    if (email.length <= maxLength) {
      return email;
    }
    return email.substring(0, maxLength) + '...';
  };

  const handleOpenChangeProfileModal = () => {
    setIsChangeProfileModalOpen(true);
    setSelectedEntity('');
    setSelectedProfile('');
    closeMobileMenu();
  };

  const handleCloseChangeProfileModal = () => {
    setIsChangeProfileModalOpen(false);
    setSelectedEntity('');
    setSelectedProfile('');
  };

  const handleConfirmChangeProfile = () => {
    if (!selectedEntity || !selectedProfile) {
      alert('Por favor, selecione uma entidade e um perfil.');
      return;
    }

    try {
      // Usar função do AuthContext para atualizar perfil
      updateProfile(selectedEntity, selectedProfile);

      // Fechar modal - o updateProfile já recarrega a página
      handleCloseChangeProfileModal();
    } catch (error) {
      console.error('Erro ao mudar perfil:', error);
      alert('Erro ao alterar perfil. Tente novamente.');
    }
  };

  // Dados simulados para entidades e perfis
  const availableEntities = [
    'Clínica Demo',
    'Hospital Central',
    'Consultório Médico'
  ];

  const availableProfiles = [
    'Administrator',
    'Cliente admin',
    'Recepcionista',
    'Profissional'
  ];

  return (
    <AppBar
      position="fixed"
      className={`header-internal ${className} ${isLoggedIn ? 'logged-in' : ''}`}
      elevation={0}
      sx={{
        backgroundColor: isLoggedIn ? '#fff' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        height: '85px',
        zIndex: 1000,
        boxShadow: isLoggedIn ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <Toolbar sx={{ height: '85px', px: { xs: '6px', sm: '6px' }, justifyContent: 'space-between' }}>
        {/* Logo e Menu Mobile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isLoggedIn && (
            <IconButton
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              sx={{
                color: '#03B4C6',
                display: { xs: 'flex', md: 'flex' }
              }}
            >
              <MenuIcon sx={{ fontSize: '2.5rem' }} />
            </IconButton>
          )}

          <Box
            component="img"
            src={logo}
            alt="CLINIC4US"
            onClick={handleLogoClick}
            sx={{
              height: { xs: '28px', sm: '32px' },
              cursor: 'pointer',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Ações do Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {isLoggedIn ? (
            <>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <SessionTimer onSessionExpired={handleSessionExpiredFromTimer} />
              </Box>

              <IconButton
                onClick={onNotificationClick}
                aria-label="Ver notificações"
                sx={{ color: '#2D3748' }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>

              <IconButton
                onClick={() => window.location.href = '?page=user-profile'}
                aria-label="Meu perfil"
                title="Meu perfil"
                sx={{ color: '#2D3748' }}
              >
                <Person />
              </IconButton>
            </>
          ) : (
            <>
              {showCTAButton && (
                <Button
                  onClick={onCTAClick}
                  variant="contained"
                  sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    backgroundColor: '#03B4C6',
                    color: 'white',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#029AAB',
                    }
                  }}
                >
                  {ctaButtonText}
                </Button>
              )}

              <IconButton
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                sx={{ color: '#2D3748' }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Box>

      </Toolbar>

      {/* Menu Mobile usando Drawer */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: isLoggedIn ? '320px' : '280px',
            backgroundColor: '#fff',
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header do Menu Mobile */}
          {isLoggedIn && (
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <IconButton
                  onClick={() => {
                    window.location.href = '?page=user-profile';
                    closeMobileMenu();
                  }}
                  aria-label="Meu perfil"
                  sx={{
                    backgroundColor: '#03B4C6',
                    color: 'white',
                    '&:hover': { backgroundColor: '#029AAB' }
                  }}
                >
                  <Person />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D3748' }}>
                    {truncateEmail(actualUserEmail)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6c757d' }}>
                    {actualUserProfile}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6c757d' }}>
                    {truncateEmail(actualClinicName, 20)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<Refresh />}
                  onClick={handleOpenChangeProfileModal}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderColor: '#03B4C6',
                    color: '#03B4C6',
                    '&:hover': {
                      borderColor: '#029AAB',
                      backgroundColor: 'rgba(3, 180, 198, 0.04)',
                    }
                  }}
                >
                  Mudar perfil
                </Button>
                <Button
                  startIcon={<Logout />}
                  onClick={() => {
                    localStorage.removeItem('clinic4us-user-session');
                    localStorage.removeItem('clinic4us-remember-me');
                    window.location.href = `${window.location.origin}/?page=login&clinic=ninho`;
                  }}
                  size="small"
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.75rem',
                  }}
                >
                  Sair
                </Button>
              </Box>
            </Box>
          )}

          {/* Menu Items - Carregado dinamicamente do perfil do usuário */}
          <List sx={{ flex: 1, py: 1 }}>
            {actualMenuItems.map((item, index) => (
              <ListItem
                key={index}
                component="a"
                href={item.href || "#"}
                onClick={(e) => handleMenuItemClick(item, e)}
                sx={{
                  cursor: 'pointer',
                  color: '#2D3748',
                  '&:hover': {
                    backgroundColor: 'rgba(3, 180, 198, 0.08)',
                  }
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Mobile Actions for Logged Users */}
          {isLoggedIn && (
            <Box sx={{ p: 2, borderTop: '1px solid #e9ecef' }}>
              <Button
                startIcon={<NotificationsOutlined />}
                onClick={() => {
                  if (onNotificationClick) onNotificationClick();
                  closeMobileMenu();
                }}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: '#2D3748',
                  mb: 1
                }}
              >
                Notificações {notificationCount > 0 && `(${notificationCount})`}
              </Button>
              <Button
                startIcon={<Settings />}
                onClick={() => {
                  if (onUserClick) onUserClick();
                  closeMobileMenu();
                }}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  color: '#2D3748',
                }}
              >
                Configurações
              </Button>
            </Box>
          )}

          {/* CTA Button for Non-Logged Users */}
          {!isLoggedIn && showCTAButton && (
            <Box sx={{ p: 2, borderTop: '1px solid #e9ecef' }}>
              <Button
                onClick={(e) => {
                  if (onCTAClick) onCTAClick(e);
                  closeMobileMenu();
                }}
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#03B4C6',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#029AAB',
                  }
                }}
              >
                {ctaButtonText}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>


      {/* Modal de Sessão Expirada */}
      <Dialog
        open={isSessionExpiredModalOpen}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: '3px solid #dc3545'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Schedule sx={{ fontSize: '3rem', color: '#dc3545', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#dc3545', fontWeight: 600, mb: 0.5 }}>
              Sessão Expirada
            </Typography>
            <Typography variant="body2" sx={{ color: '#6c757d' }}>
              Sua sessão de 1 hora expirou. Revalide seu login para continuar ou saia do sistema.
            </Typography>
          </Box>

          <TextField
            label="E-mail"
            type="email"
            value={actualUserEmail}
            disabled
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: true,
              sx: { backgroundColor: '#f8f9fa', color: '#6c757d' }
            }}
          />

          <TextField
            label="Senha"
            type={showRevalidatePassword ? "text" : "password"}
            value={revalidatePassword}
            onChange={(e) => setRevalidatePassword(e.target.value)}
            placeholder="Digite sua senha para continuar"
            autoComplete="current-password"
            autoFocus
            fullWidth
            error={!!revalidateError}
            helperText={revalidateError}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSessionExpiredRevalidate();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowRevalidatePassword(!showRevalidatePassword)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showRevalidatePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              onClick={handleSessionExpiredLogout}
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              sx={{ textTransform: 'none' }}
            >
              Sair
            </Button>
            <Button
              onClick={handleSessionExpiredRevalidate}
              variant="contained"
              startIcon={<Refresh />}
              sx={{
                textTransform: 'none',
                backgroundColor: '#03B4C6',
                '&:hover': { backgroundColor: '#029AAB' }
              }}
            >
              Revalidar Login
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de Mudança de Perfil */}
      <Dialog
        open={isChangeProfileModalOpen}
        onClose={handleCloseChangeProfileModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Refresh sx={{ color: '#03B4C6', fontSize: '2rem' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Mudar Perfil
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>
                Selecione a entidade e o perfil para o qual deseja alterar.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            select
            label="Entidade"
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Selecione uma entidade</MenuItem>
            {availableEntities.map((entity, index) => (
              <MenuItem key={index} value={entity}>{entity}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Perfil"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Selecione um perfil</MenuItem>
            {availableProfiles.map((profile, index) => (
              <MenuItem key={index} value={profile}>{profile}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseChangeProfileModal}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmChangeProfile}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#03B4C6',
              '&:hover': { backgroundColor: '#029AAB' }
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Dialog>
    </AppBar>
  );
};

export default HeaderInternal;
