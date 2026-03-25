import React from 'react';
import '../../styles/MainPagesInicoAdmin.css';

function ResumenTab({ arboles, tiposDisponibles, statsTipos, setTipoFiltro, setTab }) {
  return (
    <div className="admin-resumen-container">
      <div className="admin-section-header">
        <h2>Estadísticas de la Plantación</h2>
        <p>Distribución total de especies en el sistema</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-main-card">
          <span className="admin-stat-icon"></span>
          <div className="admin-stat-info">
            <h3>{arboles.length}</h3>
            <p>Censo Total</p>
          </div>
        </div>

        <div className="admin-stat-main-card blue-border">
          <span className="admin-stat-icon blue"></span>
          <div className="admin-stat-info">
            <h3>{tiposDisponibles.length}</h3>
            <p>Especies/Tipos</p>
          </div>
        </div>
      </div>

      <div className="admin-types-breakdown">
        <h3>Desglose por Tipo de Árbol</h3>
        <div className="admin-types-grid">
          {tiposDisponibles.map(tipo => {
            const aliveCount = arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipo.toLowerCase() && a.estado !== 'muerto').length;
            const stat = statsTipos.find(s => s.tipo === tipo.toLowerCase());
            return (
              <div key={tipo} className="admin-type-stat-card">
                <div className="admin-type-stat-header">
                  <span className="admin-type-name">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                  <span className="admin-type-count" title="Árboles vivos">{aliveCount}</span>
                </div>
                <div className="admin-type-progress-bar">
                  <div 
                    className="admin-type-progress-fill" 
                    style={{ '--progress-width': `${arboles.length > 0 ? (aliveCount / arboles.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="admin-type-stat-footer">
                  <span>Plan: {stat?.planificados || 0}</span>
                  <span className="muerto">Muerto: {stat?.muertos || 0}</span>
                </div>
                <p className="admin-type-percentage">
                  {arboles.length > 0 ? ((aliveCount / arboles.length) * 100).toFixed(1) : 0}% de vitalidad global
                </p>
                <button 
                  className="admin-type-view-btn"
                  onClick={() => {
                    setTipoFiltro(tipo);
                    setTab('lista');
                  }}
                >
                  Ver detalles →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResumenTab;
