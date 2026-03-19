import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import '../styles/MainPagesInicoVisitante.css';

function MainPagesInicoUser() {
  const [userName, setUserName] = useState('');
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nombre);
    }

    cargarArboles();
  }, [navigate]);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const datos = await services.getArboles();
      setArboles(datos || []);
    } catch (err) {
      console.error('Error al cargar árboles:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header" style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #2e6b46 100%)', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
          🌳 ¡Hola, {userName}! 
          {sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'voluntario' && (
            <span style={{ 
              fontSize: '0.9rem', 
              backgroundColor: '#34d399', 
              color: '#064e3b', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              marginLeft: '15px',
              verticalAlign: 'middle',
              fontWeight: '700'
            }}>
              Voluntario Activo
            </span>
          )}
        </h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Explora y protege nuestra biodiversidad forestal</p>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-intro"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <h2 style={{ color: '#1a4d2e' }}>Tu Colección Forestal</h2>
            <p>
              Aquí puedes consultar todas las especies forestales registradas en el sistema.
              Haz click en cualquier tarjeta para conocer los detalles completos de cada árbol.
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 22px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </section>

        {/* Tarjetas de árboles */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
            Cargando especies forestales...
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoUser;