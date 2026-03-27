import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('modoOscuro') === 'activado';
  });

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('modoOscuro', 'activado');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('modoOscuro', 'desactivado');
    }
  }, [isDark]);

  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: isDark ? '#fbbf24' : 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px',
        marginRight: '8px'
      }}
      title="Alternar Tema"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}

export default DarkModeToggle;
