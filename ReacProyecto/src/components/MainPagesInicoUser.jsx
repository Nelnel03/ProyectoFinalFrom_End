import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import UserProfile from './UserProfile';
import UserReports from './UserReports';
import UserReportesRobo from './UserReportesRobo';
import ReporteForm from './ReporteForm';
import MisReportesTab from './MisReportesTab';
import '../styles/MainPagesInicoVisitante.css';

function MainPagesInicoUser() {
  const [user, setUser] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentTab, setCurrentTab] = useState('coleccion');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
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
      <header className="visitante-header" style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #2e6b46 100%)', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>🌳 ¡Hola, {user?.nombre}!</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Panel de Usuario - Gestiona tu información y explora</p>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-intro"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentTab('coleccion')}
              style={{
                padding: '10px 22px',
                backgroundColor: currentTab === 'coleccion' ? '#1a4d2e' : '#f3f4f6',
                color: currentTab === 'coleccion' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              🌳 Colección Forestal
            </button>
            <button
              onClick={() => setCurrentTab('perfil')}
              style={{
                padding: '10px 22px',
                backgroundColor: currentTab === 'perfil' ? '#1a4d2e' : '#f3f4f6',
                color: currentTab === 'perfil' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              👤 Mi Perfil
            </button>
            <button
              onClick={() => setCurrentTab('reportes')}
              style={{
                padding: '10px 22px',
                backgroundColor: currentTab === 'reportes' ? '#1a4d2e' : '#f3f4f6',
                color: currentTab === 'reportes' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              ✉️ Soporte/Reportes
            </button>
            {user?.rol === 'voluntario' && (
              <button
                onClick={() => setCurrentTab('reporte_voluntario')}
                style={{
                  padding: '10px 22px',
                  backgroundColor: currentTab === 'reporte_voluntario' ? '#1a4d2e' : '#f3f4f6',
                  color: currentTab === 'reporte_voluntario' ? 'white' : '#4b5563',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                👷 Reportar Actividad
              </button>
            )}
            <button
              onClick={() => setCurrentTab('mis_reportes')}
              style={{
                padding: '10px 22px',
                backgroundColor: currentTab === 'mis_reportes' ? '#1a4d2e' : '#f3f4f6',
                color: currentTab === 'mis_reportes' ? 'white' : '#4b5563',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              📝 Mis Reportes
            </button>
            <button
              onClick={() => setCurrentTab('reporte_robo')}
              style={{
                padding: '10px 22px',
                backgroundColor: currentTab === 'reporte_robo' ? '#ef4444' : '#fef2f2',
                color: currentTab === 'reporte_robo' ? 'white' : '#ef4444',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
            >
              🚨 Reportar Robo
            </button>
          </div>
        </section>

        <div style={{ marginTop: '2rem' }}>
          {currentTab === 'coleccion' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#1a4d2e', margin: 0 }}>Colección Forestal</h2>
                <p>
                  Consulta todas las especies forestales registradas. Como usuario, puedes ver toda la información de la página en tiempo real.
                </p>
              </div>
              {cargando ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
                  Cargando especies forestales...
                </div>
              ) : (
                <ArbolesSection arboles={arboles} />
              )}
            </div>
          )}
          
          {currentTab === 'perfil' && (
            <UserProfile user={user} onUpdateUser={setUser} />
          )}

          {currentTab === 'reportes' && (
            <UserReports user={user} onDone={() => setCurrentTab('mis_reportes')} />
          )}

          {currentTab === 'reporte_robo' && (
            <UserReportesRobo user={user} onDone={() => setCurrentTab('mis_reportes')} />
          )}

          {currentTab === 'mis_reportes' && (
            <MisReportesTab user={user} />
          )}

          {currentTab === 'reporte_voluntario' && user?.rol === 'voluntario' && (
            <ReporteForm user={user} onReportSubmitted={() => setCurrentTab('mis_reportes')} />
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPagesInicoUser;