import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import UserProfile from './UserProfile';
import UserReports from './UserReports';
import UserReportesRobo from './UserReportesRobo';
import MisReportesTab from './MisReportesTab';
import '../styles/MainPagesInicoVisitante.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentTab, setCurrentTab] = useState('coleccion');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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


  useEffect(() => {
    // Sincronizar tab con la URL si existe
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setCurrentTab(tabFromUrl);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== 'user') {
        navigate('/login'); // Protection
        return;
      }
      setUser(parsedUser);
    }
    cargarArboles();
  }, [navigate, searchParams, setCurrentTab]);

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#1a4d2e' }}><h2>Cargando sesión...</h2></div>;
  }



  return (
    <div className="visitante-container">
      <header className="visitante-header" style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #2e6b46 100%)', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>🌳 Panel de Usuario</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>¡Hola {user?.nombre}! Explora nuestra colección forestal.</p>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-nav-pills" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setCurrentTab('coleccion')}
            className={`nav-pill ${currentTab === 'coleccion' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'coleccion' ? '#1a4d2e' : '#f3f4f6', color: currentTab === 'coleccion' ? 'white' : '#4b5563' }}
          >
            🌳 Colección
          </button>
          <button 
            onClick={() => setCurrentTab('mis_reportes')}
            className={`nav-pill ${currentTab === 'mis_reportes' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'mis_reportes' ? '#1a4d2e' : '#f3f4f6', color: currentTab === 'mis_reportes' ? 'white' : '#4b5563' }}
          >
            📝 Mis Solicitudes
          </button>
          <button 
            onClick={() => setCurrentTab('reporte_robo')}
            className={`nav-pill ${currentTab === 'reporte_robo' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'reporte_robo' ? '#ef4444' : '#fef2f2', color: currentTab === 'reporte_robo' ? 'white' : '#ef4444' }}
          >
            🚨 Reportar Robo
          </button>
          <button 
            onClick={() => setCurrentTab('reportes')}
            className={`nav-pill ${currentTab === 'reportes' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'reportes' ? '#1a4d2e' : '#f3f4f6', color: currentTab === 'reportes' ? 'white' : '#4b5563' }}
          >
            ✉️ Contacto/Soporte
          </button>
          <button 
            onClick={() => setCurrentTab('perfil')}
            className={`nav-pill ${currentTab === 'perfil' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'perfil' ? '#1a4d2e' : '#f3f4f6', color: currentTab === 'perfil' ? 'white' : '#4b5563' }}
          >
            👤 Mi Perfil
          </button>
        </section>

        <div className="dashboard-view-container">
          {currentTab === 'coleccion' && (
            <div>
              <h2 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Explorar el Bosque</h2>
              {cargando ? <p>Cargando especies...</p> : <ArbolesSection arboles={arboles} />}
            </div>
          )}
          {currentTab === 'mis_reportes' && <MisReportesTab user={user} />}
          {currentTab === 'reporte_robo' && <UserReportesRobo user={user} onDone={() => setCurrentTab('mis_reportes')} />}
          {currentTab === 'reportes' && <UserReports user={user} onDone={() => setCurrentTab('mis_reportes')} />}
          {currentTab === 'perfil' && <UserProfile user={user} onUpdateUser={setUser} />}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
