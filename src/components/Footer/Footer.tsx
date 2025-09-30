import React from "react";
import "./Footer.css";
import logo from "../../images/logo_clinic4us.png";

interface FooterProps {
  onScrollToTop?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (onScrollToTop) {
      onScrollToTop();
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img
              src={logo}
              alt="CLINIC4US"
              className="footer-logo"
              onClick={scrollToTop}
              style={{ cursor: "pointer" }}
            />
            <p>
              A plataforma completa para gestão de clínicas
              multidisciplinares.
            </p>
          </div>
          <div className="footer-section">
            <h4>Produto</h4>
            <ul>
              <li>
                <a href="#funcionalidades">Funcionalidades</a>
              </li>
              <li>
                <a href="#planos">Planos</a>
              </li>
              <li>
                <a href="#comparacao">Comparação</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li>
                <a href="#help">Central de Ajuda</a>
              </li>
              <li>
                <a href="#contact">Contato</a>
              </li>
              <li>
                <a href="#docs">Documentação</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Empresa</h4>
            <ul>
              <li>
                <a href="#about">Sobre</a>
              </li>
              <li>
                <a href="#privacy">Privacidade</a>
              </li>
              <li>
                <a href="#terms">Termos de Uso</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CLINIC4US. Todos os direitos reservados.</p>
          <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
            Imagens by <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer" style={{ color: '#03B4C6', textDecoration: 'none' }}>Freepik</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;