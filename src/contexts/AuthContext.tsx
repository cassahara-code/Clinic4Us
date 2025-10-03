import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Credenciais válidas (simulação - em produção viria de API)
  const validCredentials: { [key: string]: { password: string; role: string; alias: string } } = {
    'admin@clinic4us.com': { password: '123456', role: 'Administrator', alias: 'Admin Demo' },
    'diretoria@ninhoinstituto.com.br': { password: '123456', role: 'Cliente admin', alias: 'Ninho Instituto' },
    'recepcao@clinic4us.com': { password: '123456', role: 'Recepcionista', alias: 'Recepção' }
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
        sessionDuration: 3600
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
        loginTime: new Date().toISOString(),
        loginTimestamp: newTimestamp,
        sessionDuration: 3600
      };

      // Salvar no localStorage
      localStorage.setItem('clinic4us-user-session', JSON.stringify(updatedSession));

      // Atualizar estado
      setUser(updatedSession);

      // Recarregar página para aplicar mudanças
      window.location.reload();
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

  // Verificar se está autenticado
  const isAuthenticated = !!user && getTimeRemaining() > 0;

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    renewSession,
    updateProfile,
    getTimeRemaining
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
