import React from 'react';
import { GiftcardList } from './components/GiftCard'; // Importando desde index.tsx que exporta GiftcardList

const fadeInApp = `
  @keyframes fadeInApp {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function App() {
  return (
    <>
      <style>{fadeInApp}</style>
      <div
        style={{
          backgroundColor: '#121212',
          color: 'white',
          height: '100vh', // altura completa
          boxSizing: 'border-box', // padding no aumenta tamaño
          padding: '2rem',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInApp 1s ease forwards',
        }}
      >
        <h1
          style={{
            fontWeight: 'bold',
            fontSize: '2.8rem',
            marginBottom: '2rem',
            color: '#BB86FC',
            textShadow: '0 0 8px #BB86FC',
            userSelect: 'none',
          }}
        >
          Bienvenido a Cardify
        </h1>

        <GiftcardList />
      </div>
    </>
  );
}

export default App;
