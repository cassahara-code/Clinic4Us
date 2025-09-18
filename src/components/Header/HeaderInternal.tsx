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

  return (
    <header className={`header-internal ${className}`}>
      <nav className="navbar">
        <div className="nav-brand">
          <img
            src={logo}
            alt="CLINIC4US"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Desktop Menu */}
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

        <div className="nav-actions">
          {showCTAButton && (
            <button className="cta-button desktop-cta" onClick={onCTAClick}>
              {ctaButtonText}
            </button>
          )}

          {/* Hamburger Menu Button */}
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
              </div>
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
              {showCTAButton && (
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