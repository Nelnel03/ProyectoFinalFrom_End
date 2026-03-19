import React, { useState, useEffect } from 'react';
import services from '../services/services';

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
        <h2 style={{ color: '#ef4444' }}>🚨 Reportes de Árboles Robados</h2>
        <p style={{ color: '#66937a' }}>Alertas de sustracción o tala ilegal reportadas por los usuarios</p>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
          Cargando reportes de robos...
        </div>
      ) : reportes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
          <p>La bandeja está vacía. No hay reportes de árboles robados actualmente.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {reportes.slice().reverse().map((reporte) => (
            <div key={reporte.id} style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #fecaca', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontSize: '1.2rem' }}>Tipo: {reporte.tipo_arbol}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: '#7f1d1d', fontSize: '0.9rem' }}>
                    <span>📍 {reporte.ubicacion}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '4px 10px', 
                    backgroundColor: '#fee2e2', 
                    color: '#991b1b', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem', 
                    fontWeight: '600'
                  }}>
                    {reporte.estado || 'Recibido'}
                  </span>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {new Date(reporte.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
              <p style={{ color: '#450a0a', margin: '0 0 1rem 0', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                <strong>Descripción:</strong><br/>
                {reporte.descripcion}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>
                  Reportado por: <strong>{reporte.userName}</strong> ({reporte.userEmail})
                </div>
                <button 
                  onClick={() => handleEliminar(reporte.id)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
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
