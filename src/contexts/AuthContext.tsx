import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: MenuItem[]; // Funcionalidades habilitadas para o perfil
  loginTime: string;
  loginTimestamp: number;
  sessionDuration: number;
  clinic?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean, clinic: string) => Promise<{ success: boolean; error?: string }>;
  logout: (redirectToLogin?: boolean) => void;
  renewSession: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (entity: string, profile: string) => void;
  getTimeRemaining: () => number;
  refreshSession: () => void;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock de funcionalidades disponíveis por perfil (em produção viria de API)
  const getMenuItemsForRole = (role: string): MenuItem[] => {
    const allMenuItems: { [key: string]: MenuItem } = {
      // Páginas principais
      dashboard: { id: 'dashboard', label: 'Dashboard', href: '?page=dashboard' },
      schedule: { id: 'schedule', label: 'Agenda Profissional', href: '?page=schedule' },
      patients: { id: 'patients', label: 'Lista de Pacientes', href: '?page=patients' },
      patientRegister: { id: 'patientRegister', label: 'Cadastro de Paciente', href: '?page=patient-register' },

      // Administração
      adminEntities: { id: 'adminEntities', label: 'Gestão de Entidades', href: '?page=admin-entities' },
      adminFunctionalities: { id: 'adminFunctionalities', label: 'Gestão de Funcionalidades', href: '?page=admin-functionalities' },
      adminProfiles: { id: 'adminProfiles', label: 'Gestão de Perfis', href: '?page=admin-profiles' },
      adminPlans: { id: 'adminPlans', label: 'Gestão de Planos', href: '?page=admin-plans' },
      adminProfessionalTypes: { id: 'adminProfessionalTypes', label: 'Tipos de Profissionais', href: '?page=admin-professional-types' },
      adminFaq: { id: 'adminFaq', label: 'Gestão de FAQ', href: '?page=admin-faq' },

      // Usuário
      faq: { id: 'faq', label: 'FAQ', href: '?page=faq' },
      userProfile: { id: 'userProfile', label: 'Meu Perfil', href: '?page=user-profile' },

      // Outras páginas disponíveis (não inclusas no menu por padrão)
      aliasRegister: { id: 'aliasRegister', label: 'Cadastro de Apelido', href: '?page=alias-register' },
      pageModel: { id: 'pageModel', label: 'Modelo de Página', href: '?page=page-model' },
    };

    // Definir funcionalidades por perfil
    const roleMenuItems: { [key: string]: MenuItem[] } = {
      'Administrator': [
        // Sistema
        allMenuItems.dashboard,
        allMenuItems.schedule,
        allMenuItems.patients,
        allMenuItems.patientRegister,

        // Gestão Administrativa (Sistema)
        allMenuItems.adminEntities,
        allMenuItems.adminFunctionalities,
        allMenuItems.adminProfiles,
        allMenuItems.adminPlans,
        allMenuItems.adminProfessionalTypes,
        allMenuItems.adminFaq,

        // Usuário
        allMenuItems.faq,
        allMenuItems.userProfile,
      ],
      'Cliente admin': [
        // Operacional
        allMenuItems.dashboard,
        allMenuItems.schedule,
        allMenuItems.patients,
        allMenuItems.patientRegister,

        // Gestão (Cliente)
        allMenuItems.adminProfessionalTypes,

        // Usuário
        allMenuItems.faq,
        allMenuItems.userProfile,
      ],
      'Recepcionista': [
        // Operacional
        allMenuItems.dashboard,
        allMenuItems.schedule,
        allMenuItems.patients,
        allMenuItems.patientRegister,

        // Usuário
        allMenuItems.faq,
        allMenuItems.userProfile,
      ],
      'Profissional': [
        // Operacional
        allMenuItems.schedule,
        allMenuItems.patients,

        // Usuário
        allMenuItems.faq,
        allMenuItems.userProfile,
      ],
    };

    return roleMenuItems[role] || [allMenuItems.dashboard, allMenuItems.userProfile];
  };

  // Credenciais válidas (simulação - em produção viria de API)
  const validCredentials: { [key: string]: { password: string; role: string; alias: string } } = {
    'admin@clinic4us.com': { password: '123456', role: 'Administrator', alias: 'Admin Demo' },
    'diretoria@ninhoinstituto.com.br': { password: '123456', role: 'Cliente admin', alias: 'Ninho Instituto' },
    'recepcao@clinic4us.com': { password: '123456', role: 'Recepcionista', alias: 'Recepção' },
    'profissional@clinic4us.com': { password: '123456', role: 'Profissional', alias: 'Dr. João Silva' }
  };

  // Carregar sessão do localStorage ao inicializar
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = localStorage.getItem('clinic4us-user-session');
        if (sessionData) {
          const session = JSON.parse(sessionData);

          // Verificar se a sessão ainda é válida
          const loginTimestamp = session.loginTimestamp || new Date(session.loginTime).getTime();
          const sessionDuration = session.sessionDuration || 3600;
          const currentTime = Date.now();
          const elapsedSeconds = Math.floor((currentTime - loginTimestamp) / 1000);

          if (elapsedSeconds < sessionDuration) {
            setUser(session);
          } else {
            // Sessão expirada, limpar
            localStorage.removeItem('clinic4us-user-session');
            localStorage.removeItem('clinic4us-remember-me');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Função de login
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
    clinic: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validar credenciais
      const validUser = validCredentials[email];

      if (!validUser || validUser.password !== password) {
        return { success: false, error: 'Credenciais inválidas. Tente novamente.' };
      }

      // Criar sessão do usuário
      const loginTimestamp = Date.now();
      const userSession: UserSession = {
        email,
        alias: validUser.alias,
        clinicName: clinic || 'Clinic4Us',
        role: validUser.role,
        permissions: ['dashboard_access', 'schedule_access', 'patient_access'],
        menuItems: getMenuItemsForRole(validUser.role), // Carregar funcionalidades do perfil
        loginTime: new Date().toISOString(),
        loginTimestamp,
        sessionDuration: 3600, // 1 hora em segundos
        clinic
      };

      // Salvar no localStorage
      localStorage.setItem('clinic4us-user-session', JSON.stringify(userSession));

      if (rememberMe) {
        localStorage.setItem('clinic4us-remember-me', 'true');
      }

      // Atualizar estado
      setUser(userSession);

      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Erro ao processar login. Tente novamente.' };
    }
  };

  // Função de logout
  const logout = (redirectToLogin: boolean = true) => {
    try {
      const clinic = user?.clinic || 'ninho';

      // Limpar dados
      localStorage.removeItem('clinic4us-user-session');
      localStorage.removeItem('clinic4us-remember-me');
      setUser(null);

      // Redirecionar se solicitado
      if (redirectToLogin) {
        window.location.href = `${window.location.origin}/?page=login&clinic=${clinic}`;
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para renovar sessão
  const renewSession = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Sessão não encontrada.' };
      }

      // Validar senha
      const validUser = validCredentials[user.email];
      if (!validUser || validUser.password !== password) {
        return { success: false, error: 'Senha incorreta.' };
      }

      // Renovar sessão
      const newTimestamp = Date.now();
      const updatedSession: UserSession = {
        ...user,
        loginTime: new Date().toISOString(),
        loginTimestamp: newTimestamp,
        sessionDuration: 3600,
        menuItems: user.menuItems || getMenuItemsForRole(user.role) // Garantir que menuItems existe
      };

      // Salvar no localStorage
      localStorage.setItem('clinic4us-user-session', JSON.stringify(updatedSession));

      // Atualizar estado
      setUser(updatedSession);

      return { success: true };
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
      return { success: false, error: 'Erro ao renovar sessão. Tente novamente.' };
    }
  };

  // Função para atualizar perfil/entidade
  const updateProfile = (entity: string, profile: string) => {
    try {
      if (!user) return;

      const newTimestamp = Date.now();
      const updatedSession: UserSession = {
        ...user,
        role: profile,
        clinicName: entity,
        alias: entity,
        menuItems: getMenuItemsForRole(profile), // Atualizar menu quando perfil muda
        loginTime: new Date().toISOString(),
        loginTimestamp: newTimestamp,
        sessionDuration: 3600
      };

      // Salvar no localStorage
      localStorage.setItem('clinic4us-user-session', JSON.stringify(updatedSession));

      // Atualizar estado (isso vai recarregar o menu automaticamente)
      setUser(updatedSession);

      // NÃO recarregar página - deixar o React atualizar
      // window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  // Função para obter tempo restante da sessão
  const getTimeRemaining = (): number => {
    if (!user) return 0;

    try {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - user.loginTimestamp) / 1000);
      return Math.max(0, user.sessionDuration - elapsedSeconds);
    } catch (error) {
      console.error('Erro ao calcular tempo restante:', error);
      return 0;
    }
  };

  // Função para forçar atualização da sessão do state
  const refreshSession = () => {
    try {
      const sessionData = localStorage.getItem('clinic4us-user-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        setUser(session);
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  };

  // Verificar se está autenticado
  const isAuthenticated = !!user && getTimeRemaining() > 0;

  // Função para revalidar permissões do usuário
  const refreshPermissions = async (): Promise<void> => {
    try {
      if (!user) {
        console.log('Nenhum usuário logado para revalidar permissões');
        return;
      }

      console.log('Revalidando permissões do usuário:', user.email);

      // TODO: Em produção, substituir por chamada real à API
      // const response = await fetch(`/api/users/${user.email}/permissions`);
      // const data = await response.json();
      // const newMenuItems = data.menuItems;

      // Mock: buscar permissões atualizadas baseado no role atual
      const newMenuItems = getMenuItemsForRole(user.role);

      // Atualizar sessão com novas permissões
      const updatedSession: UserSession = {
        ...user,
        menuItems: newMenuItems
      };

      // Salvar no localStorage
      localStorage.setItem('clinic4us-user-session', JSON.stringify(updatedSession));

      // Atualizar estado
      setUser(updatedSession);

      console.log('Permissões revalidadas com sucesso');
    } catch (error) {
      console.error('Erro ao revalidar permissões:', error);
    }
  };

  // Revalidar permissões automaticamente a cada 5 minutos
  useEffect(() => {
    if (!user || !isAuthenticated) {
      return;
    }

    // Revalidar imediatamente ao montar (se usuário logado)
    refreshPermissions();

    // Configurar intervalo de 5 minutos (300000ms)
    const intervalId = setInterval(() => {
      refreshPermissions();
    }, 300000); // 5 minutos

    // Limpar intervalo ao desmontar
    return () => {
      clearInterval(intervalId);
    };
  }, [user?.email, isAuthenticated]); // Executar quando usuário logar/deslogar

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    renewSession,
    updateProfile,
    getTimeRemaining,
    refreshSession,
    refreshPermissions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
