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

          {/* Si es voluntario, mostrar acceso directo a reportes */}
          {auth && sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'voluntario' ? (
            <NavLink 
              to="/user" 
              className={({ isActive }) => (isActive ? "visitor-link active" : "visitor-link")}
            >
              📋 Reportar Trabajo
            </NavLink>
          ) : (
            <NavLink 
              to="/voluntariado" 
              className={({ isActive }) => (isActive ? "visitor-link active" : "visitor-link")}
            >
              Voluntariado
            </NavLink>
          )}

          {!auth ? (
            <NavLink 
              to="/login" 
              className="visitor-login-btn"
            >
              Iniciar Sesión / Registro
            </NavLink>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <NavLink 
                to={JSON.parse(sessionStorage.getItem('user')).rol === 'admin' ? '/admin' : '/user'}
                className={({ isActive }) => (isActive ? "visitor-link active" : "visitor-link")}
                style={{ fontWeight: '700' }}
              >
                👤 Mi Perfil
              </NavLink>

              <button 
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('user');
                  setAuth(false);
                  window.location.href = '/';
                }}
                className="visitor-login-btn"
                style={{ backgroundColor: '#ef4444', border: 'none', cursor: 'pointer', padding: '8px 15px' }}
              >
                🚪 Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;