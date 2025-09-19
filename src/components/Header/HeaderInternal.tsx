import React, { useState } from "react";
import "./HeaderInternal.css";
import logo from "../../images/logo_clinic4us.png";

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
  loggedMenuItems?: MenuItemProps[];
}

const HeaderInternal: React.FC<HeaderInternalProps> = ({
  menuItems = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "Agenda", href: "#agenda" },
    { label: "Pacientes", href: "#pacientes" },
    { label: "Relatórios", href: "#relatorios" },
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
  loggedMenuItems = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

        {!isLoggedIn && (
          <ul className="nav-menu desktop-menu">
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
        )}

        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="logged-actions">
              <div className="timer-section">
                <span className="timer-icon">🕐</span>
                <span className="timer-text">02:00:00</span>
                <button
                  className="revalidate-login"
                  onClick={onRevalidateLogin}
                >
                  Revalidar login
                </button>
              </div>

              <button
                className="notification-button"
                onClick={onNotificationClick}
              >
                <span className="notification-icon">🔔</span>
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>

              <button
                className="user-avatar"
                onClick={onUserClick}
              >
                <span className="avatar-icon">👤</span>
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
              <div className="mobile-menu-header">
                <button
                  className="close-menu-button"
                  onClick={closeMobileMenu}
                  aria-label="Fechar menu"
                >
                  ✕
                </button>

                {isLoggedIn && (
                  <div className="mobile-user-info">
                    <div className="mobile-user-email">{truncateEmail(userEmail || '')}</div>
                    <div className="mobile-user-details-row">
                      <div className="mobile-user-avatar">
                        <span className="avatar-icon">👤</span>
                      </div>
                      <div className="mobile-user-details">
                        <div className="mobile-user-role">{userProfile}</div>
                        <div className="mobile-clinic-name">{truncateEmail(clinicName || '', 20)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="profile-actions-row">
                    <button
                      className="mobile-action-button change-profile-button"
                      onClick={() => alert('Funcionalidade temporariamente indisponível')}
                    >
                      🔄 Mudar perfil
                    </button>
                    <button
                      className="mobile-action-button logout-button"
                      onClick={() => {
                        localStorage.removeItem('clinic4us-user-session');
                        localStorage.removeItem('clinic4us-remember-me');
                        window.location.href = `${window.location.origin}/?page=login&clinic=ninho`;
                      }}
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
              <ul className="mobile-nav-menu">
                {(isLoggedIn ? loggedMenuItems : menuItems).map((item, index) => (
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
                  >
                    🔔 Notificações {notificationCount > 0 && `(${notificationCount})`}
                  </button>
                  <button
                    className="mobile-action-button"
                    onClick={() => {
                      if (onUserClick) onUserClick();
                      closeMobileMenu();
                    }}
                  >
                    ⚙️ Configurações
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
    </header>
  );
};

export default HeaderInternal;