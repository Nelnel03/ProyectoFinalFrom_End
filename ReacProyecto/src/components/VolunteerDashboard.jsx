import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import UserProfile from './UserProfile';
import ReporteForm from './ReporteForm';
import MisReportesTab from './MisReportesTab';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/VolunteerDashboard.css';

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
      <div className="volunteer-loading">
        <h2>Cargando sesión de voluntario...</h2>
        <p>Espera un momento mientras preparamos tu centro de servicio.</p>
      </div>
    );
  }

  return (
    <div className="visitante-container volunteer-container">
      <header className="visitante-header volunteer-header">
        <h1 className="volunteer-header-title">Centro de Servicio</h1>
        <p className="volunteer-header-subtitle">¡Hola {user?.nombre}! Gestiona tus actividades y horas trabajadas.</p>
      </header>

      <div className="volunteer-stats-grid">
        <div className="volunteer-stat-card">
          <span className="volunteer-stat-value">{stats.totalHoras}</span>
          <p className="volunteer-stat-label">Horas Totales</p>
        </div>
        <div className="volunteer-stat-card">
          <span className="volunteer-stat-value">{stats.totalTareas}</span>
          <p className="volunteer-stat-label">Labores Completadas</p>
        </div>
      </div>

      <main className="visitante-content volunteer-content">
        <section className="visitante-nav-pills volunteer-nav-pills">
          <button 
            onClick={() => setCurrentTab('gestion_tareas')}
            className={`volunteer-nav-pill ${currentTab === 'gestion_tareas' ? 'active' : ''}`}
          >
            Reportar Labor
          </button>
          <button 
            onClick={() => setCurrentTab('mis_reportes')}
            className={`volunteer-nav-pill ${currentTab === 'mis_reportes' ? 'active' : ''}`}
          >
            Mi Historial
          </button>
          <button 
            onClick={() => setCurrentTab('perfil')}
            className={`volunteer-nav-pill ${currentTab === 'perfil' ? 'active' : ''}`}
          >
            Perfil Profesional
          </button>
        </section>

        <div className="volunteer-view-container">
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
