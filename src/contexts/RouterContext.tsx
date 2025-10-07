import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Lock, ArrowForward } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { colors, typography } from '../theme/designSystem';

type PageType = 'landing' | 'login' | 'alias-register' | 'dashboard' | 'schedule' | 'patients' | 'patient-register' | 'page-model' | 'admin-plans' | 'admin-profiles' | 'admin-functionalities' | 'admin-entities' | 'admin-faq' | 'admin-professional-types' | 'faq' | 'user-profile' | 'therapy-plan-print' | 'period-report-print' | 'detailed-period-report-print' | 'evaluation-print' | 'evolutions-print';

interface RouterContextType {
  currentPage: PageType;
  navigateTo: (page: PageType, params?: Record<string, string>) => void;
  getParam: (key: string) => string | null;
  getAllParams: () => URLSearchParams;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

// Componente de Bloqueio de Acesso
const AccessDenied: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirecionar após countdown
      if (isAuthenticated) {
        window.location.href = '?page=dashboard';
      } else {
        window.location.href = '/';
      }
    }
  }, [countdown, isAuthenticated]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.background} 100%)`,
        padding: '2rem'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center',
            border: `2px solid ${colors.primary}`,
          }}
        >
          {/* Ícone */}
          <Box
            sx={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem',
              borderRadius: '50%',
              backgroundColor: colors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock sx={{ fontSize: '3rem', color: colors.primary }} />
          </Box>

          {/* Título */}
          <Typography
            variant="h4"
            sx={{
              fontSize: '1.75rem',
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              marginBottom: '1rem'
            }}
          >
            Acesso Restrito
          </Typography>

          {/* Mensagem */}
          <Typography
            variant="body1"
            sx={{
              fontSize: typography.fontSize.base,
              color: colors.textSecondary,
              marginBottom: '2rem',
              lineHeight: 1.6
            }}
          >
            {isAuthenticated ? (
              <>
                Esta funcionalidade não está disponível para o seu perfil atual.
                <br />
                Você será redirecionado para a página inicial.
              </>
            ) : (
              <>
                Você precisa estar logado para acessar esta funcionalidade.
                <br />
                Você será redirecionado para a página inicial.
              </>
            )}
          </Typography>

          {/* Countdown */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: colors.background,
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}
          >
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: typography.fontWeight.bold,
                color: colors.primary
              }}
            >
              {countdown}
            </Typography>
            <Typography
              sx={{
                fontSize: typography.fontSize.sm,
                color: colors.textSecondary
              }}
            >
              segundo{countdown !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Redirecionamento */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: colors.textMuted,
              fontSize: typography.fontSize.sm
            }}
          >
            <Typography>Redirecionando</Typography>
            <ArrowForward sx={{ fontSize: '1rem' }} />
            <Typography sx={{ fontWeight: typography.fontWeight.semibold }}>
              {isAuthenticated ? 'Dashboard' : 'Página Inicial'}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);

  // Função para obter a página atual da URL
  const getCurrentPageFromURL = (): PageType => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') as PageType;

    const validPages: PageType[] = ['landing', 'login', 'alias-register', 'dashboard', 'schedule', 'patients', 'patient-register', 'page-model', 'admin-plans', 'admin-profiles', 'admin-functionalities', 'admin-entities', 'admin-faq', 'admin-professional-types', 'faq', 'user-profile', 'therapy-plan-print', 'period-report-print', 'detailed-period-report-print', 'evaluation-print', 'evolutions-print'];

    if (page && validPages.includes(page)) {
      return page;
    }

    return 'landing';
  };

  // Função para navegar para uma página
  const navigateTo = (page: PageType, params?: Record<string, string>) => {
    const urlParams = new URLSearchParams();

    // Adicionar a página
    urlParams.set('page', page);

    // Adicionar parâmetros extras se fornecidos
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        urlParams.set(key, value);
      });
    }

    // Preservar parâmetros existentes que não conflitam
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
      if (key !== 'page' && (!params || !params[key])) {
        urlParams.set(key, value);
      }
    });

    // Atualizar a URL
    const newURL = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newURL);

    // Atualizar o estado
    setCurrentPage(page);
  };

  // Função para obter um parâmetro específico
  const getParam = (key: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  };

  // Função para obter todos os parâmetros
  const getAllParams = (): URLSearchParams => {
    return new URLSearchParams(window.location.search);
  };

  // Função para verificar se o usuário tem acesso à página
  const checkPageAccess = (page: PageType): boolean => {
    // Páginas públicas (sempre acessíveis)
    const publicPages: PageType[] = ['landing', 'login', 'alias-register'];
    if (publicPages.includes(page)) {
      return true;
    }

    // Se não está autenticado, negar acesso a páginas privadas
    if (!isAuthenticated || !user) {
      return false;
    }

    // Páginas especiais acessíveis por profissionais e admins
    const specialPages: PageType[] = ['therapy-plan-print', 'period-report-print', 'detailed-period-report-print', 'evaluation-print', 'evolutions-print'];
    if (specialPages.includes(page)) {
      // Permitir acesso para Administrator e Profissional
      const allowedRoles = ['Administrator', 'Profissional'];
      return allowedRoles.includes(user.role);
    }

    // Verificar se a página está no menu do usuário
    const hasPageAccess = user.menuItems.some(item => {
      const itemPage = item.href.replace('?page=', '');
      return itemPage === page;
    });

    return hasPageAccess;
  };

  // Efeito para sincronizar com mudanças na URL (botão voltar/avançar do navegador)
  useEffect(() => {
    // Aguardar até que o AuthContext termine de carregar
    if (isLoading) {
      return;
    }

    const handlePopState = () => {
      const newPage = getCurrentPageFromURL();
      const access = checkPageAccess(newPage);

      setCurrentPage(newPage);
      setHasAccess(access);
      setIsCheckingAccess(false);
    };

    // Definir página inicial
    const initialPage = getCurrentPageFromURL();
    const initialAccess = checkPageAccess(initialPage);

    setCurrentPage(initialPage);
    setHasAccess(initialAccess);
    setIsCheckingAccess(false);

    // Escutar mudanças no histórico
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, isAuthenticated, isLoading]);

  const contextValue: RouterContextType = {
    currentPage,
    navigateTo,
    getParam,
    getAllParams
  };

  // Aguardar carregamento inicial antes de verificar acesso
  if (isLoading || isCheckingAccess) {
    return (
      <RouterContext.Provider value={contextValue}>
        {children}
      </RouterContext.Provider>
    );
  }

  // Se não tem acesso, mostrar tela de bloqueio
  if (!hasAccess) {
    return (
      <RouterContext.Provider value={contextValue}>
        <AccessDenied isAuthenticated={isAuthenticated} />
      </RouterContext.Provider>
    );
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};

// Hook para usar o roteador
export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);

  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }

  return context;
};

// Hook para navegação rápida
export const useNavigation = () => {
  const { navigateTo } = useRouter();

  return {
    goToLanding: () => navigateTo('landing'),
    goToLogin: (clinic?: string) => navigateTo('login', clinic ? { clinic } : undefined),
    goToRegister: (clinic?: string) => navigateTo('alias-register', clinic ? { clinic } : undefined),
    goToDashboard: () => navigateTo('dashboard'),
    goToSchedule: (patientName?: string) => navigateTo('schedule', patientName ? { patient: patientName } : undefined),
    goToPatients: () => navigateTo('patients'),
    goToPatientRegister: (patientId?: string) => navigateTo('patient-register', patientId ? { id: patientId } : undefined),
    goToPageModel: () => navigateTo('page-model'),
    goToAdminPlans: () => navigateTo('admin-plans'),
    goToAdminProfiles: () => navigateTo('admin-profiles'),
    goToAdminFunctionalities: () => navigateTo('admin-functionalities'),
    goToAdminEntities: () => navigateTo('admin-entities'),
    goToAdminFaq: () => navigateTo('admin-faq'),
    goToAdminProfessionalTypes: () => navigateTo('admin-professional-types'),
    goToUserProfile: () => navigateTo('user-profile'),
  };
};