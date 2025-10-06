import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./global.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, useRouter } from "./contexts/RouterContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material";
import { inputs } from "./theme/designSystem";
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
import Faq from "./clients/Faq";
import UserProfile from "./clients/UserProfile";

// Tema global do Material-UI
const globalTheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: inputs.default.textColor,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:not(.MuiInputBase-multiline)": {
            height: inputs.default.height,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: inputs.default.focus.borderColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: inputs.default.focus.borderColor,
            boxShadow: inputs.default.focus.boxShadow,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: inputs.default.focus.labelColor,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
          "&.Mui-disabled": {
            WebkitTextFillColor: inputs.default.textColor,
            opacity: 0.6,
            "& + .MuiSelect-nativeInput": {
              display: "none",
            },
          },
        },
        nativeInput: {
          "&:disabled": {
            display: "none",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected.Mui-disabled": {
            opacity: 1,
          },
        },
      },
    },
  },
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Main app component with routing
const AppContent = () => {
  const { currentPage, navigateTo } = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isInitializing, setIsInitializing] = React.useState(true);

  // Lista de páginas que requerem autenticação (admin e clients)
  const protectedPages: string[] = [
    "dashboard",
    "schedule",
    "patients",
    "patient-register",
    "page-model",
    "admin-plans",
    "admin-profiles",
    "admin-functionalities",
    "admin-entities",
    "admin-faq",
    "admin-professional-types",
    "user-profile",
  ];

  // Verificar se a página atual requer autenticação
  React.useEffect(() => {
    if (
      !isLoading &&
      protectedPages.includes(currentPage) &&
      !isAuthenticated
    ) {
      // Obter parâmetro clinic da URL se existir
      const urlParams = new URLSearchParams(window.location.search);
      const clinic = urlParams.get("clinic") || "ninho";

      // Redirecionar para login
      navigateTo("login", { clinic });
    }

    // Marcar inicialização como completa após processar a primeira vez
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [currentPage, isAuthenticated, isLoading]);

  // Mostrar loading enquanto verifica autenticação ou inicializa
  if (isLoading || isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#6c757d",
        }}
      >
        Carregando...
      </div>
    );
  }

  switch (currentPage) {
    case "login":
      return <Login />;
    case "alias-register":
      return <AliasRegister />;
    case "dashboard":
      return isAuthenticated ? <Dashboard /> : <Login />;
    case "schedule":
      return isAuthenticated ? <ProfessionalSchedule /> : <Login />;
    case "patients":
      return isAuthenticated ? <PatientsList /> : <Login />;
    case "patient-register":
      return isAuthenticated ? <PatientRegister /> : <Login />;
    case "page-model":
      return isAuthenticated ? <PageModel /> : <Login />;
    case "admin-plans":
      return isAuthenticated ? <AdminPlans /> : <Login />;
    case "admin-profiles":
      return isAuthenticated ? <AdminProfiles /> : <Login />;
    case "admin-functionalities":
      return isAuthenticated ? <AdminFunctionalities /> : <Login />;
    case "admin-entities":
      return isAuthenticated ? <AdminEntities /> : <Login />;
    case "admin-faq":
      return isAuthenticated ? <AdminFaq /> : <Login />;
    case "admin-professional-types":
      return isAuthenticated ? <AdminProfessionalTypes /> : <Login />;
    case "faq":
      return <Faq />;
    case "user-profile":
      return isAuthenticated ? <UserProfile /> : <Login />;
    case "landing":
    default:
      return <LandingPage />;
  }
};

// Root component with providers
const App = () => {
  return (
    <ThemeProvider theme={globalTheme}>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
