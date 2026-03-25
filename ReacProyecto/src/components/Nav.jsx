import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Nav.css';

function Nav() {
  const location = useLocation();

  const navigate = useNavigate();
  const [auth, setAuth] = useState(sessionStorage.getItem('isAuthenticated') === 'true');

  // Sincronizar el estado de autenticación cuando cambie la ruta
  useEffect(() => {
    setAuth(sessionStorage.getItem('isAuthenticated') === 'true');
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Deseas finalizar tu sesión actual?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#283618',
      cancelButtonColor: '#bc6c25',
      confirmButtonText: 'Sí, Salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        setAuth(false);
        navigate('/');
      }
    });
  };

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
                onClick={handleLogout}
                className="visitor-login-btn visitor-btn-logout"

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