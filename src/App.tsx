import React, { useState, useEffect } from 'react';
import { Login, AliasRegister, Dashboard, ProfessionalSchedule, PatientsList } from './clients';
import LandingPage from './components/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'alias-register' | 'dashboard' | 'schedule' | 'patients'>('landing');

  useEffect(() => {
    // Check URL parameter to determine which page to show
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

    if (page === 'login') {
      setCurrentPage('login');
    } else if (page === 'alias-register') {
      setCurrentPage('alias-register');
    } else if (page === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (page === 'schedule') {
      setCurrentPage('schedule');
    } else if (page === 'patients') {
      setCurrentPage('patients');
    } else {
      setCurrentPage('landing');
    }
  }, []);

  if (currentPage === 'login') {
    return <Login />;
  }

  if (currentPage === 'alias-register') {
    return <AliasRegister />;
  }

  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  if (currentPage === 'schedule') {
    return <ProfessionalSchedule />;
  }

  if (currentPage === 'patients') {
    return <PatientsList />;
  }

  return <LandingPage />;
}

export default App;
