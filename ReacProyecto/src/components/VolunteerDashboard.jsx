import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import UserProfile from './UserProfile';
import ReporteForm from './ReporteForm';
import MisReportesTab from './MisReportesTab';
import '../styles/MainPagesInicoVisitante.css';

function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('gestion_tareas');
  const [stats, setStats] = useState({ totalHoras: 0, totalTareas: 0 });
  const navigate = useNavigate();

    const cargarEstadisticas = async (volId) => {
    try {
      const actividades = await services.getReportesVoluntariado();
      const misActividades = (actividades || []).filter(a => a.voluntarioId === volId);
      const totalH = misActividades.reduce((acc, curr) => acc + (curr.horas || 0), 0);
      setStats({
        totalHoras: totalH.toFixed(1),
        totalTareas: misActividades.length
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };



  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== 'voluntario') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
     cargarEstadisticas(parsedUser.id);
    }
  }, [navigate]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem', color: '#166534' }}>
        <h2 style={{ fontSize: '2rem' }}>⌛ Cargando sesión de voluntario...</h2>
        <p>Espera un momento mientras preparamos tu centro de servicio.</p>
      </div>
    );
  }



  return (
    <div className="visitante-container" style={{ backgroundColor: '#f0fdf4' }}>
      <header className="visitante-header" style={{ background: 'linear-gradient(135deg, #166534 0%, #1a4d2e 100%)', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>👷 Centro de Servicio</h1>
        <p style={{ opacity: 0.9, fontSize: '1.2rem' }}>¡Hola {user?.nombre}! Gestiona tus actividades y horas trabajadas.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2rem', maxWidth: '1100px', margin: '-2rem auto 2rem auto' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #166534' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#166534' }}>{stats.totalHoras}</span>
          <p style={{ margin: '5px 0', color: '#6b7280', fontWeight: 'bold' }}>Horas Totales</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #166534' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#166534' }}>{stats.totalTareas}</span>
          <p style={{ margin: '5px 0', color: '#6b7280', fontWeight: 'bold' }}>Labores Completadas</p>
        </div>
      </div>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-nav-pills" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setCurrentTab('gestion_tareas')}
            className={`nav-pill ${currentTab === 'gestion_tareas' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'gestion_tareas' ? '#166534' : '#f3f4f6', color: currentTab === 'gestion_tareas' ? 'white' : '#4b5563' }}
          >
            📋 Reportar Labor
          </button>
          <button 
            onClick={() => setCurrentTab('mis_reportes')}
            className={`nav-pill ${currentTab === 'mis_reportes' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'mis_reportes' ? '#166534' : '#f3f4f6', color: currentTab === 'mis_reportes' ? 'white' : '#4b5563' }}
          >
            📊 Mi Historial
          </button>
          <button 
            onClick={() => setCurrentTab('perfil')}
            className={`nav-pill ${currentTab === 'perfil' ? 'active' : ''}`}
            style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: currentTab === 'perfil' ? '#166534' : '#f3f4f6', color: currentTab === 'perfil' ? 'white' : '#4b5563' }}
          >
            🎓 Perfil Profesional
          </button>
        </section>

        <div className="dashboard-view-container" style={{ minHeight: '400px' }}>
          {currentTab === 'gestion_tareas' && (
            <ReporteForm user={user} onReportSubmitted={() => {
              setCurrentTab('mis_reportes');
              cargarEstadisticas(user.id);
            }} />
          )}
          {currentTab === 'mis_reportes' && <MisReportesTab user={user} />}
          {currentTab === 'perfil' && <UserProfile user={user} onUpdateUser={setUser} isProfessionalMode={true} />}
        </div>
      </main>
    </div>
  );
}

export default VolunteerDashboard;
