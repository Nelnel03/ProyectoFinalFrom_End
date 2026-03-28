import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../../services/services';
import UserProfile from '../user/UserProfile';
import ReporteForm from './ReporteForm';
import MisReportesTab from '../user/MisReportesTab';

import VolunteerHeader from './VolunteerHeader';
import VolunteerStats from './VolunteerStats';
import VolunteerTabs from './VolunteerTabs';

import '../../styles/MainPagesInicoVisitante.css';
import '../../styles/VolunteerDashboard.css';

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
      <VolunteerHeader user={user} />
      
      <VolunteerStats stats={stats} />

      <main className="visitante-content volunteer-content">
        <VolunteerTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

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
