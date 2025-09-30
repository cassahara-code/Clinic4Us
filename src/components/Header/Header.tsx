import React, { useState, useEffect } from "react";
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

  // Cleanup mobile menu state when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Add/remove class to body to hide hamburger when menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
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
        {showNavigation && (
          <button
            className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

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
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
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