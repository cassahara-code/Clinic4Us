import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import logo from "../../images/logo_clinic4us.png";
import { NotificationsOutlined, Person, Refresh, Logout, Settings, Schedule, Visibility, VisibilityOff } from '@mui/icons-material';
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
  menuItems = [
    { label: "Agenda", href: "?page=schedule" },
    { label: "Cadastro Paciente", href: "?page=patient-register" },
    { label: "Dashboard", href: "?page=dashboard" },
    { label: "Entidades", href: "?page=admin-entities" },
    { label: "FAQ", href: "?page=faq" },
    { label: "Funcionalidades", href: "?page=admin-functionalities" },
    { label: "Gestão FAQ", href: "?page=admin-faq" },
    { label: "Pacientes", href: "?page=patients" },
    { label: "Perfis", href: "?page=admin-profiles" },
    { label: "Planos", href: "?page=admin-plans" },
    { label: "Meu Perfil", href: "?page=user-profile" },
    { label: "Tipos de Profissionais", href: "?page=admin-professional-types" },
  ],
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
  const { renewSession: renewAuthSession, refreshSession } = useAuth();
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
      const { updateProfile } = useAuth();
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
    'Cliente admin',
    'Profissional',
    'Secretário',
    'Recepcionista'
  ];

  return (
    <header className={`header-internal ${className} ${isLoggedIn ? 'logged-in' : ''}`}>
      <nav className="navbar">
        <div className="nav-brand">
          {isLoggedIn && (
            <button
              className={`hamburger hamburger-left ${isMobileMenuOpen ? "active" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}

          <img
            src={logo}
            alt="CLINIC4US"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="logged-actions">
              <div className="timer-section">
                <SessionTimer onSessionExpired={handleSessionExpiredFromTimer} />
              </div>

              <button
                className="notification-button"
                onClick={onNotificationClick}
                aria-label="Ver notificações"
              >
                <NotificationsOutlined className="notification-icon" />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>

              <button
                className="user-avatar"
                onClick={() => window.location.href = '?page=user-profile'}
                aria-label="Meu perfil"
                title="Meu perfil"
              >
                <Person className="avatar-icon" />
              </button>
            </div>
          ) : (
            <>
              {showCTAButton && (
                <button className="cta-button desktop-cta" onClick={onCTAClick}>
                  {ctaButtonText}
                </button>
              )}

              <button
                className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </>
          )}
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              {isLoggedIn && (
                <div className="mobile-menu-header">
                  <div className="mobile-user-info">
                    <div className="mobile-user-email">{truncateEmail(userEmail || '')}</div>
                    <div className="mobile-user-details-row">
                      <button
                        className="mobile-user-avatar"
                        onClick={() => {
                          window.location.href = '?page=user-profile';
                          closeMobileMenu();
                        }}
                        aria-label="Meu perfil"
                        title="Meu perfil"
                      >
                        <Person className="avatar-icon" />
                      </button>
                      <div className="mobile-user-details">
                        <div className="mobile-user-role">{userProfile}</div>
                        <div className="mobile-clinic-name">{truncateEmail(clinicName || '', 20)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions-row">
                    <button
                      className="mobile-action-button change-profile-button"
                      onClick={handleOpenChangeProfileModal}
                      aria-label="Mudar perfil do usuário"
                    >
                      <Refresh /> Mudar perfil
                    </button>
                    <button
                      className="mobile-action-button logout-button"
                      onClick={() => {
                        localStorage.removeItem('clinic4us-user-session');
                        localStorage.removeItem('clinic4us-remember-me');
                        window.location.href = `${window.location.origin}/?page=login&clinic=ninho`;
                      }}
                      aria-label="Sair do sistema"
                    >
                      <Logout /> Sair
                    </button>
                  </div>
                </div>
              )}
              <ul className="mobile-nav-menu">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href || "#"}
                      onClick={(e) => handleMenuItemClick(item, e)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {isLoggedIn && (
                <div className="mobile-logged-actions">
                  <button
                    className="mobile-action-button"
                    onClick={() => {
                      if (onNotificationClick) onNotificationClick();
                      closeMobileMenu();
                    }}
                    aria-label="Ver notificações"
                  >
                    <NotificationsOutlined /> Notificações {notificationCount > 0 && `(${notificationCount})`}
                  </button>
                  <button
                    className="mobile-action-button"
                    onClick={() => {
                      if (onUserClick) onUserClick();
                      closeMobileMenu();
                    }}
                    aria-label="Acessar configurações"
                  >
                    <Settings /> Configurações
                  </button>
                </div>
              )}

              {!isLoggedIn && showCTAButton && (
                <button
                  className="cta-button mobile-cta"
                  onClick={(e) => {
                    if (onCTAClick) onCTAClick(e);
                    closeMobileMenu();
                  }}
                >
                  {ctaButtonText}
                </button>
              )}
            </div>
          </div>
        )}

      </nav>


      {/* Modal de Sessão Expirada */}
      {isSessionExpiredModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            minWidth: '400px',
            maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '3px solid #dc3545'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '3rem',
                color: '#dc3545',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Schedule style={{ fontSize: '3rem' }} />
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: '#dc3545',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Sessão Expirada
              </h3>
              <p style={{
                margin: '0',
                color: '#6c757d',
                fontSize: '0.9rem'
              }}>
                Sua sessão de 1 hora expirou. Revalide seu login para continuar ou saia do sistema.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#495057',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                E-mail:
              </label>
              <input
                type="email"
                value={userEmail}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#495057',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Senha:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRevalidatePassword ? "text" : "password"}
                  value={revalidatePassword}
                  onChange={(e) => setRevalidatePassword(e.target.value)}
                  placeholder="Digite sua senha para continuar"
                  autoComplete="off"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSessionExpiredRevalidate();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '3rem',
                    border: '1px solid #ced4da',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    borderColor: revalidateError ? '#dc3545' : '#ced4da'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRevalidatePassword(!showRevalidatePassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0',
                    fontSize: '1.1rem'
                  }}
                  aria-label={showRevalidatePassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showRevalidatePassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {revalidateError && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginTop: '0.25rem'
                }}>
                  {revalidateError}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleSessionExpiredLogout}
                aria-label="Sair do sistema"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #dc3545',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#dc3545',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#dc3545';
                }}
              >
                <Logout /> Sair
              </button>
              <button
                onClick={handleSessionExpiredRevalidate}
                aria-label="Revalidar login do usuário"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#03B4C6',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#029AAB'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#03B4C6'}
              >
                <Refresh /> Revalidar Login
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Mudança de Perfil */}
      {isChangeProfileModalOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            minWidth: '450px',
            maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '3rem',
                color: '#03B4C6',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Refresh style={{ fontSize: '3rem' }} />
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: '#2D3748',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                Mudar Perfil
              </h3>
              <p style={{
                margin: '0',
                color: '#6c757d',
                fontSize: '0.9rem'
              }}>
                Selecione a entidade e o perfil para o qual deseja alterar.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#495057',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Entidade:
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer'
                }}
              >
                <option value="">Selecione uma entidade</option>
                {availableEntities.map((entity, index) => (
                  <option key={index} value={entity}>{entity}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#495057',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Perfil:
              </label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer'
                }}
              >
                <option value="">Selecione um perfil</option>
                {availableProfiles.map((profile, index) => (
                  <option key={index} value={profile}>{profile}</option>
                ))}
              </select>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCloseChangeProfileModal}
                aria-label="Cancelar mudança de perfil"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmChangeProfile}
                aria-label="Confirmar mudança de perfil"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#03B4C6',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#029AAB'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#03B4C6'}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default HeaderInternal;