import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./global.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, useRouter } from "./contexts/RouterContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import Login from "./clients/Login";
import AliasRegister from "./clients/AliasRegister";
import Dashboard from "./clients/Dashboard";
import ProfessionalSchedule from "./clients/ProfessionalSchedule";
import PatientsList from "./clients/PatientsList";
import PatientRegister from "./clients/PatientRegister";
import PageModel from "./clients/PageModel";
import AdminPlans from "./admin/AdminPlans";
import AdminProfiles from "./admin/AdminProfiles";
import AdminFunctionalities from "./admin/AdminFunctionalities";
import AdminEntities from "./admin/AdminEntities";
import AdminFaq from "./admin/AdminFaq";
import AdminProfessionalTypes from "./admin/AdminProfessionalTypes";
import UserProfile from "./clients/UserProfile";
import Faq from "./clients/Faq";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Main app component with routing
const AppContent = () => {
  const { currentPage, navigateTo } = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Verificar se a página atual requer autenticação
  React.useEffect(() => {
    // Lista de páginas que requerem autenticação (admin e clients)
    const protectedPages: string[] = [
      'dashboard',
      'schedule',
      'patients',
      'patient-register',
      'page-model',
      'admin-plans',
      'admin-profiles',
      'admin-functionalities',
      'admin-entities',
      'admin-faq',
      'admin-professional-types',
      'user-profile'
    ];

    if (!isLoading && protectedPages.includes(currentPage) && !isAuthenticated) {
      // Obter parâmetro clinic da URL se existir
      const urlParams = new URLSearchParams(window.location.search);
      const clinic = urlParams.get('clinic') || 'ninho';

      // Redirecionar para login
      navigateTo('login', { clinic });
    }
  }, [currentPage, isAuthenticated, isLoading, navigateTo]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6c757d'
      }}>
        Carregando...
      </div>
    );
  }

  switch (currentPage) {
    case 'login':
      return <Login />;
    case 'alias-register':
      return <AliasRegister />;
    case 'dashboard':
      return isAuthenticated ? <Dashboard /> : <Login />;
    case 'schedule':
      return isAuthenticated ? <ProfessionalSchedule /> : <Login />;
    case 'patients':
      return isAuthenticated ? <PatientsList /> : <Login />;
    case 'patient-register':
      return isAuthenticated ? <PatientRegister /> : <Login />;
    case 'page-model':
      return isAuthenticated ? <PageModel /> : <Login />;
    case 'admin-plans':
      return isAuthenticated ? <AdminPlans /> : <Login />;
    case 'admin-profiles':
      return isAuthenticated ? <AdminProfiles /> : <Login />;
    case 'admin-functionalities':
      return isAuthenticated ? <AdminFunctionalities /> : <Login />;
    case 'admin-entities':
      return isAuthenticated ? <AdminEntities /> : <Login />;
    case 'admin-faq':
      return isAuthenticated ? <AdminFaq /> : <Login />;
    case 'admin-professional-types':
      return isAuthenticated ? <AdminProfessionalTypes /> : <Login />;
    case 'faq':
      return <Faq />;
    case 'user-profile':
      return isAuthenticated ? <UserProfile /> : <Login />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};

// Root component with providers
const App = () => {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
