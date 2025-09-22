import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, useRouter } from "./contexts/RouterContext";
import LandingPage from "./components/LandingPage";
import Login from "./clients/Login";
import AliasRegister from "./clients/AliasRegister";
import Dashboard from "./clients/Dashboard";
import ProfessionalSchedule from "./clients/ProfessionalSchedule";
import PatientsList from "./clients/PatientsList";
import PatientRegister from "./clients/PatientRegister";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Main app component with routing
const AppContent = () => {
  const { currentPage } = useRouter();

  switch (currentPage) {
    case 'login':
      return <Login />;
    case 'alias-register':
      return <AliasRegister />;
    case 'dashboard':
      return <Dashboard />;
    case 'schedule':
      return <ProfessionalSchedule />;
    case 'patients':
      return <PatientsList />;
    case 'patient-register':
      return <PatientRegister />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};

// Root component with router provider
const App = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
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
