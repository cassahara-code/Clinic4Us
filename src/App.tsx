import React, { useState, useEffect } from 'react';
import { Login, AliasRegister, Dashboard, ProfessionalSchedule, PatientsList, PageModel } from './clients';
import Faq from './clients/Faq';
import LandingPage from './components/LandingPage';
import { AdminProfessionalTypes } from './admin';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'alias-register' | 'dashboard' | 'schedule' | 'patients' | 'page-model' | 'faq' | 'admin-professional-types'>('landing');

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
    } else if (page === 'page-model') {
      setCurrentPage('page-model');
    } else if (page === 'faq') {
      setCurrentPage('faq');
    } else if (page === 'admin-professional-types') {
      setCurrentPage('admin-professional-types');
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

  if (currentPage === 'page-model') {
    return <PageModel />;
  }

  if (currentPage === 'faq') {
    return <Faq />;
  }

  if (currentPage === 'admin-professional-types') {
    return <AdminProfessionalTypes />;
  }

  return <LandingPage />;
}

export default App;
