import React, { useState, useEffect } from 'react';
import { Login, AliasRegister } from './clients';
import LandingPage from './components/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'alias-register'>('landing');

  useEffect(() => {
    // Check URL parameter to determine which page to show
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

    if (page === 'login') {
      setCurrentPage('login');
    } else if (page === 'alias-register') {
      setCurrentPage('alias-register');
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

  return <LandingPage />;
}

export default App;
