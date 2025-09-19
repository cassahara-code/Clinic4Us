import React, { useState } from "react";
import "./Header.css";
import logo from "../../images/logo_clinic4us.png";

interface HeaderProps {
  onContactClick?: (e?: React.MouseEvent, subject?: string) => void;
  onTrialClick?: (e?: React.MouseEvent) => void;
  showNavigation?: boolean;
  variant?: 'landing' | 'dashboard';
}

const Header: React.FC<HeaderProps> = ({
  onContactClick,
  onTrialClick,
  showNavigation = true,
  variant = 'landing'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleContactClick = (e: React.MouseEvent) => {
    if (onContactClick) {
      onContactClick(e);
    }
  };

  const handleTrialClick = (e: React.MouseEvent) => {
    if (onTrialClick) {
      onTrialClick(e);
    }
  };

  return (
    <header className={`header header--${variant}`}>
      <nav className="navbar">
        <div className="nav-brand">
          <img
            src={logo}
            alt="CLINIC4US"
            className="logo"
            onClick={scrollToTop}
            style={{ cursor: "pointer" }}
          />
        </div>

        {showNavigation && (
          <>
            {/* Desktop Menu */}
            <ul className="nav-menu desktop-menu">
              <li>
                <a href="#funcionalidades">Funcionalidades</a>
              </li>
              <li>
                <a href="#planos">Planos</a>
              </li>
              <li>
                <a href="#comparacao">Comparação</a>
              </li>
              <li>
                <a href="#contato" onClick={handleContactClick}>
                  Contato
                </a>
              </li>
            </ul>

            <div className="nav-actions">
              <button className="cta-button desktop-cta" onClick={handleTrialClick}>
                Teste Grátis
              </button>

              {/* Hamburger Menu Button - only for mobile */}
              <button
                className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>

            {/* Mobile Menu Overlay */}
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
                  </div>
                  <ul className="mobile-nav-menu">
                    <li>
                      <a href="#funcionalidades" onClick={closeMobileMenu}>
                        Funcionalidades
                      </a>
                    </li>
                    <li>
                      <a href="#planos" onClick={closeMobileMenu}>
                        Planos
                      </a>
                    </li>
                    <li>
                      <a href="#comparacao" onClick={closeMobileMenu}>
                        Comparação
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contato"
                        onClick={(e) => {
                          handleContactClick(e);
                          closeMobileMenu();
                        }}
                      >
                        Contato
                      </a>
                    </li>
                  </ul>
                  <button
                    className="cta-button mobile-cta"
                    onClick={(e) => {
                      handleTrialClick(e);
                      closeMobileMenu();
                    }}
                  >
                    Teste Grátis
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;