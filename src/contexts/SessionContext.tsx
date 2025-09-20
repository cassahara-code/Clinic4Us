import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MenuItemProps {
  label: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: MenuItemProps[];
  loginTime: string;
}

interface SessionContextType {
  userSession: UserSession | null;
  isLoading: boolean;
  login: (sessionData: UserSession) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão ativa ao carregar a aplicação
    const loadSession = () => {
      try {
        const sessionData = localStorage.getItem('clinic4us-user-session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          setUserSession(session);
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        // Limpar sessão inválida
        localStorage.removeItem('clinic4us-user-session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = (sessionData: UserSession) => {
    try {
      localStorage.setItem('clinic4us-user-session', JSON.stringify(sessionData));
      setUserSession(sessionData);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('clinic4us-user-session');
    localStorage.removeItem('clinic4us-remember-me');
    setUserSession(null);

    // Redirecionar para login
    window.location.href = window.location.origin + '/?page=login&clinic=ninho';
  };

  const isAuthenticated = userSession !== null;

  const value: SessionContextType = {
    userSession,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default SessionContext;