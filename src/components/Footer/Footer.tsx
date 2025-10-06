import React from "react";
import "./Footer.css";
import logo from "../../images/logo_clinic4us.png";
import { Box, Container, Typography, Link } from '@mui/material';

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
    <Box
      component="footer"
      className="footer"
      sx={{
        backgroundColor: '#2D3748',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
            <Box
              component="img"
              src={logo}
              alt="CLINIC4US"
              className="footer-logo"
              onClick={scrollToTop}
              sx={{
                height: '40px',
                cursor: 'pointer',
                mb: 2,
                objectFit: 'contain'
              }}
            />
            <Typography variant="body2" sx={{ color: '#CBD5E0', lineHeight: 1.7 }}>
              A plataforma completa para gestão de clínicas multidisciplinares.
            </Typography>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
              Produto
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#funcionalidades" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Funcionalidades
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#planos" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Planos
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#comparacao" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Comparação
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
              Suporte
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#help" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Central de Ajuda
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#contact" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Contato
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#docs" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Documentação
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
              Empresa
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#about" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Sobre
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#privacy" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Privacidade
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#terms" sx={{ color: '#CBD5E0', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: '#03B4C6', textDecoration: 'underline' } }}>
                  Termos de Uso
                </Link>
              </Box>
            </Box>
          </Box>
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
            &copy; 2024 CLINIC4US. Todos os direitos reservados.
          </Typography>
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
};

export default Footer;
