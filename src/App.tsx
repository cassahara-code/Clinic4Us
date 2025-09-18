import React, { useState, useEffect } from 'react';
import { Login } from './clientes';
import LandingPage from './components/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login'>('landing');

  useEffect(() => {
    // Check URL parameter to determine which page to show
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

    if (page === 'login') {
      setCurrentPage('login');
    } else {
      setCurrentPage('landing');
    }
  }, []);

  if (currentPage === 'login') {
    return <Login />;
  }

  return <LandingPage />;
}

export default App;
