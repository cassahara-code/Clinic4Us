import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>
          CLINIC4US
        </h1>
        <p style={{ color: '#666', margin: '1rem 0' }}>
          Sistema de Gestão Clínica
        </p>
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '2px solid #667eea'
        }}>
          <p style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>
            ✅ Aplicação funcionando corretamente!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
