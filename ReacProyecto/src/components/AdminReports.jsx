import React, { useState, useEffect } from 'react';
import services from '../services/services';

function AdminReports() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportes();
      setReportes(datos || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2>✉️ Reportes y Soporte</h2>
        <p style={{ color: '#66937a' }}>Mensajes y reportes enviados por los usuarios</p>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
          Cargando reportes...
        </div>
      ) : reportes.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📬</div>
          <p>La bandeja está vacía. No hay reportes nuevos.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          {reportes.slice().reverse().map((reporte) => (
            <div key={reporte.id} style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827', fontSize: '1.2rem' }}>{reporte.asunto}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    <span>👤 {reporte.userName}</span>
                    <span>📧 {reporte.userEmail}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '4px 10px', 
                    backgroundColor: '#fef3c7', 
                    color: '#92400e', 
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
              <p style={{ color: '#374151', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {reporte.mensaje}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReports;
