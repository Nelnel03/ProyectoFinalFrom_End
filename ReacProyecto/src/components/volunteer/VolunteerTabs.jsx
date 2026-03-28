import React from 'react';

const VolunteerTabs = ({ currentTab, setCurrentTab }) => {
  return (
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
  );
};

export default VolunteerTabs;
