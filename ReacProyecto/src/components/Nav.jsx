import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  const location = useLocation();
  const [auth, setAuth] = useState(sessionStorage.getItem('isAuthenticated') === 'true');

  // Sincronizar el estado de autenticación cuando cambie la ruta
  useEffect(() => {
    setAuth(sessionStorage.getItem('isAuthenticated') === 'true');
  }, [location]);

  // Ocultamos el Nav global SÓLO para el admin, ya que usuario y visitante sí lo usan.
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute && auth) {
    return null;
  }

  return (
    <nav className="visitor-nav">
      <div className="visitor-nav-container">
        <NavLink to="/" className="visitor-logo">
          🌳 EcoControl
        </NavLink>
        
        <div className="visitor-nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive && location.pathname === '/' ? "visitor-link active" : "visitor-link")}
          >
            Inicio
          </NavLink>
          {!auth ? (
            <NavLink 
              to="/login" 
              className="visitor-login-btn"
            >
              Iniciar Sesión / Registro
            </NavLink>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              {location.pathname !== '/user' && location.pathname !== '/admin' && (
                <NavLink 
                  to={sessionStorage.getItem('user') ? (JSON.parse(sessionStorage.getItem('user')).rol === 'admin' ? '/admin' : '/user') : '/user'}
                  className="visitor-login-btn"
                  style={{ backgroundColor: '#1a4d2e' }}
                >
                  🚀 Ir a mi Panel
                </NavLink>
              )}
              <button 
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('user');
                  setAuth(false);
                  window.location.href = '/';
                }}
                className="visitor-login-btn"
                style={{ backgroundColor: '#ef4444', border: 'none', cursor: 'pointer' }}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;