import React from "react";
import "./FooterInternal.css";
import logo from "../../images/logo_clinic4us.png";

interface FooterLinkProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface FooterSectionProps {
  title: string;
  links: FooterLinkProps[];
}

interface FooterInternalProps {
  sections?: FooterSectionProps[];
  showLogo?: boolean;
  logoText?: string;
  copyrightText?: string;
  onScrollToTop?: () => void;
  onLogoClick?: () => void;
  className?: string;
  simplified?: boolean;
}

const FooterInternal: React.FC<FooterInternalProps> = ({
  sections = [
    {
      title: "Sistema",
      links: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Configurações", href: "#settings" },
        { label: "Relatórios", href: "#reports" },
      ],
    },
    {
      title: "Suporte",
      links: [
        { label: "Central de Ajuda", href: "#help" },
        { label: "Contato", href: "#contact" },
        { label: "Documentação", href: "#docs" },
      ],
    },
    {
      title: "Conta",
      links: [
        { label: "Perfil", href: "#profile" },
        { label: "Privacidade", href: "#privacy" },
        { label: "Termos de Uso", href: "#terms" },
      ],
    },
  ],
  showLogo = true,
  logoText = "A plataforma completa para gestão de clínicas multidisciplinares.",
  copyrightText = "© 2024 CLINIC4US. Todos os direitos reservados.",
  onScrollToTop,
  onLogoClick,
  className = "",
  simplified = false,
}) => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (onScrollToTop) {
      onScrollToTop();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      handleScrollToTop();
    }
  };

  const handleLinkClick = (link: FooterLinkProps, e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick(e);
    }
  };

  if (simplified) {
    return (
      <footer className={`footer-internal simplified ${className}`}>
        <div className="container">
          <div className="footer-bottom">
            <p>{copyrightText}</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`footer-internal ${className}`}>
      <div className="container">
        <div className="footer-content">
          {showLogo && (
            <div className="footer-section logo-section">
              <img
                src={logo}
                alt="CLINIC4US"
                className="footer-logo"
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
              />
              <p>{logoText}</p>
            </div>
          )}

          {sections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href || "#"}
                      onClick={(e) => handleLinkClick(link, e)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterInternal;