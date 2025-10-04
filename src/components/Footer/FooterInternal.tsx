import React from "react";
import logo from "../../images/logo_clinic4us.png";
import { Box, Container, Typography, Link } from '@mui/material';

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
      <Box
        component="footer"
        className={`footer-internal simplified ${className}`}
        sx={{
          backgroundColor: '#2D3748',
          color: 'white',
          py: 3,
          mt: 'auto'
        }}
      >
        <Container>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">{copyrightText}</Typography>
            <Typography variant="caption" sx={{ color: '#999', mt: 0.5, display: 'block' }}>
              Imagens by{' '}
              <Link
                href="http://www.freepik.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#03B4C6', textDecoration: 'none' }}
              >
                Freepik
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      className={`footer-internal ${className}`}
      sx={{
        backgroundColor: '#2D3748',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
          {showLogo && (
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <Box
                component="img"
                src={logo}
                alt="CLINIC4US"
                onClick={handleLogoClick}
                sx={{
                  height: '40px',
                  cursor: 'pointer',
                  mb: 2,
                  objectFit: 'contain'
                }}
              />
              <Typography variant="body2" sx={{ color: '#CBD5E0', lineHeight: 1.7 }}>
                {logoText}
              </Typography>
            </Box>
          )}

          {sections.map((section, index) => (
            <Box key={index} sx={{ flex: '1 1 200px', minWidth: '150px' }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      href={link.href || "#"}
                      onClick={(e) => handleLinkClick(link, e)}
                      sx={{
                        color: '#CBD5E0',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: '#03B4C6',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 4,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: '#CBD5E0' }}>
            {copyrightText}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterInternal;
