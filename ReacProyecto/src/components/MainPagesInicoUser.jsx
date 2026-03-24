import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import '../styles/PremiumDashboard.css';

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
    <div className="dashboard-premium">
      <div className="premium-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.8rem', opacity: 0.8 }}>BioMon ADI</h2>
                <h1>🌳 ¡Hola! {userName}</h1>
                <p style={{ opacity: 0.9, fontSize: '1.25rem', marginTop: '1.5rem', maxWidth: '600px' }}>
                    Tu portal personal de monitoreo forestal. Explora y protege la biodiversidad local.
                </p>
                {sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).rol === 'voluntario' && (
                    <div className="badge">Voluntario Activo</div>
                )}
            </div>
            <button
                onClick={handleLogout}
                className="btn-logout-premium"
                style={{ marginLeft: 'auto' }}
            >
                🚪 Cerrar Sesión
            </button>
        </div>
      </div>

      <main className="glass-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ marginBottom: '3rem', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '2rem' }}>
          <h2 style={{ color: '#344E41', fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Tu Colección Forestal</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px' }}>
            Explora las especies registradas en el sistema. Puedes ver detalles técnicos, estados de salud y progresos de crecimiento.
          </p>
        </section>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div className="loading-spinner" style={{ border: '4px solid rgba(0,0,0,0.1)', borderTop: '4px solid #344E41', borderRadius: '50%', width: '50px', height: '50px' }}></div>
            <p style={{ color: '#666', fontWeight: '600' }}>Sincronizando datos del bosque...</p>
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoUser;
