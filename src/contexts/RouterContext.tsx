import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PageType = 'landing' | 'login' | 'alias-register' | 'dashboard' | 'schedule' | 'patients' | 'patient-register' | 'page-model' | 'admin-plans' | 'admin-profiles' | 'admin-functionalities' | 'admin-entities' | 'admin-faq' | 'faq';

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

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');

  // Função para obter a página atual da URL
  const getCurrentPageFromURL = (): PageType => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') as PageType;

    const validPages: PageType[] = ['landing', 'login', 'alias-register', 'dashboard', 'schedule', 'patients', 'patient-register', 'page-model', 'admin-plans', 'admin-profiles', 'admin-functionalities', 'admin-entities', 'admin-faq', 'faq'];

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

  // Efeito para sincronizar com mudanças na URL (botão voltar/avançar do navegador)
  useEffect(() => {
    const handlePopState = () => {
      const newPage = getCurrentPageFromURL();
      setCurrentPage(newPage);
    };

    // Definir página inicial
    const initialPage = getCurrentPageFromURL();
    setCurrentPage(initialPage);

    // Escutar mudanças no histórico
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const contextValue: RouterContextType = {
    currentPage,
    navigateTo,
    getParam,
    getAllParams
  };

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
    goToAdminFaq: () => navigateTo('admin-faq')
  };
};