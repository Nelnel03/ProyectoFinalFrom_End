import React from 'react';

const VolunteerStats = ({ stats }) => {
  return (
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
  );
};

export default VolunteerStats;
