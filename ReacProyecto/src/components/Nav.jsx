import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  const location = useLocation();

  const auth = localStorage.getItem('isAuthenticated') === 'true';
  const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

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

          {/* Navegación Condicional por Rol */}
          {auth && userData && (
            <>
              {userData.rol === 'voluntario' ? (
                <NavLink 
                  to="/dashboard-voluntario" 
                  className={({ isActive }) => (isActive ? "visitor-link active" : "visitor-link")}
                >
                  📋 Panel de Servicio
                </NavLink>
              ) : userData.rol === 'user' ? (
                <NavLink 
                  to="/dashboard-user" 
                  className={({ isActive }) => (isActive && !location.search ? "visitor-link active" : "visitor-link")}
                >
                  🌳 Mi Bosque
                </NavLink>
              ) : null}
            </>
          )}

          {!auth && (
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
                to={userData?.rol === 'admin' ? '/admin' : (userData?.rol === 'voluntario' ? '/dashboard-voluntario' : '/dashboard-user?tab=perfil')}
                className={({ isActive }) => (isActive && location.search.includes('tab=perfil') ? "visitor-link active" : "visitor-link")}
                style={{ fontWeight: '700' }}
              >
                👤 Mi Panel
              </NavLink>

              <button 
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  localStorage.removeItem('user');
                  // Redirigir al inicio después de cerrar sesión
                  window.location.href = '/';
                }}
                className="visitor-login-btn logout-btn"
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