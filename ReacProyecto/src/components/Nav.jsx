import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
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
          <img src="/src/assets/logo.png" alt="Logo" className="visitor-logo-img" />
          <span className="visitor-logo-text">BioMon ADI</span>
        </NavLink>

        <div className="visitor-nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive && location.pathname === '/' ? 'visitor-link active' : 'visitor-link')}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/historia"
            className={({ isActive }) => (isActive ? 'visitor-link active' : 'visitor-link')}
          >
            Historia
          </NavLink>
          {!(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'voluntario') && (
            <NavLink
              to="/voluntariado"
              className={({ isActive }) => (isActive ? 'visitor-link active' : 'visitor-link')}
            >
              Voluntariado
            </NavLink>
          )}
          {!auth ? (
            <NavLink to="/login" className="visitor-login-btn">
              Iniciar Sesión / Registro
            </NavLink>
          ) : (
            <div className="visitor-auth-actions">
              {location.pathname !== '/user' && location.pathname !== '/admin' && (
                <NavLink
                  to={sessionStorage.getItem('user') ? (JSON.parse(sessionStorage.getItem('user')).rol === 'admin' ? '/admin' : '/user') : '/user'}
                  className="visitor-login-btn visitor-btn-panel"
                >
                  🚀 Panel
                </NavLink>
              )}
              <button
                onClick={() => {
                  sessionStorage.removeItem('isAuthenticated');
                  sessionStorage.removeItem('user');
                  setAuth(false);
                  navigate('/');
                }}
                className="visitor-login-btn visitor-btn-logout"
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