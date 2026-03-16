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
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('user');
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <h1>🌿 Panel de Usuario</h1>
        <p>Bienvenido de vuelta, <strong>{userName}</strong></p>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-intro"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <h2>Monitor Forestal</h2>
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