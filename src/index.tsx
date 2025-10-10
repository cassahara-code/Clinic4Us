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
import UserProfile from "./clients/UserProfile";
import Faq from "./clients/Faq";
import TherapyPlanPrint from "./components/TherapyPlanPrint";
import PeriodReportPrint from "./components/PeriodReportPrint";
import DetailedPeriodReportPrint from "./components/DetailedPeriodReportPrint";
import EvaluationPrint from "./components/EvaluationPrint";
import EvolutionsPrint from "./components/EvolutionsPrint";

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

// Função auxiliar para renderizar a página de impressão
const renderTherapyPlanPrint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const planData = urlParams.get("planData");
  const patientData = urlParams.get("patientData");

  if (planData && patientData) {
    return (
      <TherapyPlanPrint
        plan={JSON.parse(decodeURIComponent(planData))}
        patient={JSON.parse(decodeURIComponent(patientData))}
      />
    );
  }
  return <Login />;
};

// Função auxiliar para renderizar o relatório de período
const renderPeriodReportPrint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const patientData = urlParams.get("patientData");
  const periodData = urlParams.get("periodData");
  const plansData = urlParams.get("plansData");

  if (patientData && periodData && plansData) {
    return (
      <PeriodReportPrint
        patient={JSON.parse(decodeURIComponent(patientData))}
        period={JSON.parse(decodeURIComponent(periodData))}
        plans={JSON.parse(decodeURIComponent(plansData))}
      />
    );
  }
  return <Login />;
};

// Função auxiliar para renderizar o relatório detalhado de período
const renderDetailedPeriodReportPrint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const patientData = urlParams.get("patientData");
  const periodData = urlParams.get("periodData");
  const plansData = urlParams.get("plansData");

  if (patientData && periodData && plansData) {
    return (
      <DetailedPeriodReportPrint
        patient={JSON.parse(decodeURIComponent(patientData))}
        period={JSON.parse(decodeURIComponent(periodData))}
        plans={JSON.parse(decodeURIComponent(plansData))}
      />
    );
  }
  return <Login />;
};

// Função auxiliar para renderizar a impressão de avaliação
const renderEvaluationPrint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const patientData = urlParams.get("patientData");
  const evaluationData = urlParams.get("evaluationData");

  if (patientData && evaluationData) {
    return (
      <EvaluationPrint
        patient={JSON.parse(decodeURIComponent(patientData))}
        evaluation={JSON.parse(decodeURIComponent(evaluationData))}
      />
    );
  }
  return <Login />;
};

// Função auxiliar para renderizar a impressão de evoluções
const renderEvolutionsPrint = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const patientData = urlParams.get("patientData");
  const evolutionsData = urlParams.get("evolutionsData");

  if (patientData && evolutionsData) {
    return (
      <EvolutionsPrint
        patient={JSON.parse(decodeURIComponent(patientData))}
        evolutions={JSON.parse(decodeURIComponent(evolutionsData))}
      />
    );
  }
  return <Login />;
};

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
    "therapy-plan-print",
    "period-report-print",
    "detailed-period-report-print",
    "evaluation-print",
    "evolutions-print",
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
    case "therapy-plan-print":
      return isAuthenticated ? renderTherapyPlanPrint() : <Login />;
    case "period-report-print":
      return isAuthenticated ? renderPeriodReportPrint() : <Login />;
    case "detailed-period-report-print":
      return isAuthenticated ? renderDetailedPeriodReportPrint() : <Login />;
    case "evaluation-print":
      return isAuthenticated ? renderEvaluationPrint() : <Login />;
    case "evolutions-print":
      return isAuthenticated ? renderEvolutionsPrint() : <Login />;
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
