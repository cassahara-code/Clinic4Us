import React, { useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      window.location.href = window.location.origin + '/?page=login&clinic=ninho';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#03B4C6',
        fontSize: '1.2rem'
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Não renderizar nada enquanto redireciona
  }

  return <>{children}</>;
};

export default ProtectedRoute;