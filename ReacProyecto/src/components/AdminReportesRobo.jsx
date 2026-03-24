import React, { useState, useEffect } from 'react';
import services from '../services/services';
import '../styles/AdminReports.css';

function AdminReportesRobo() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportesRobados();
      setReportes(datos || []);
    } catch (error) {
      console.error("Error al cargar reportes de robos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este reporte de robo?")) {
      await services.deleteReportesRobados(id);
      cargarReportes();
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-reports-robo-header">🚨 Reportes de Árboles Robados</h2>
        <p className="admin-reports-header-subtitle">Alertas de sustracción o tala ilegal reportadas por los usuarios</p>
      </div>

      {cargando ? (
        <div className="admin-reports-loading">
          Cargando reportes de robos...
        </div>
      ) : reportes.length === 0 ? (
        <div className="admin-reports-empty">
          <div className="admin-reports-empty-icon">🛡️</div>
          <p>La bandeja está vacía. No hay reportes de árboles robados actualmente.</p>
        </div>
      ) : (
        <div className="admin-reports-list">
          {reportes.slice().reverse().map((reporte) => (
            <div key={reporte.id} className="admin-report-card admin-report-card-robo">
              <div className="admin-report-card-header admin-report-card-header-robo">
                <div>
                  <h3 className="admin-report-card-title admin-report-card-title-robo">Tipo: {reporte.tipo_arbol}</h3>
                  <div className="admin-report-card-meta admin-report-card-meta-robo">
                    <span>📍 {reporte.ubicacion}</span>
                  </div>
                </div>
                <div className="admin-report-card-status-wrap">
                  <span className="admin-report-card-status admin-report-card-status-robo">
                    {reporte.estado || 'Recibido'}
                  </span>
                  <div className="admin-report-card-date">
                    {new Date(reporte.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="admin-report-card-message-robo">
                <strong>Descripción:</strong><br/>
                {reporte.descripcion}
              </p>
              <div className="admin-report-card-footer">
                <div className="admin-report-card-reporter">
                  Reportado por: <strong>{reporte.userName}</strong> ({reporte.userEmail})
                </div>
                <button 
                  onClick={() => handleEliminar(reporte.id)}
                  className="admin-report-btn-delete"
                >
                  🗑️ Eliminar Reporte
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReportesRobo;
