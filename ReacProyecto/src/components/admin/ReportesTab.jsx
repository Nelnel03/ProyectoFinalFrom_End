import React, { useState, useEffect } from 'react';
import services from '../../services/services';

function ReportesTab() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const datos = await services.getReportesVoluntariado();
      // Sort by date/timestamp descending
      const sorted = (datos || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReportes(sorted);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="tab-content" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#1a4d2e', margin: 0 }}>Reportes de Actividad de Voluntarios</h2>
        <button 
          onClick={cargarReportes}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2e6b46',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Actualizar
        </button>
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando reportes...</p>
      ) : reportes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No hay reportes de voluntariado registrados aún.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {reportes.map((reporte) => (
            <div key={reporte.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderLeft: '5px solid #1a4d2e'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#111827', fontSize: '1.2rem' }}>{reporte.voluntarioNombre}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '5px' }}>
                    <span style={{ 
                      backgroundColor: '#f3f4f6', 
                      color: '#374151', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {reporte.tipoTarea || 'Tarea General'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>ID: {reporte.voluntarioId}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    backgroundColor: '#ecfdf5', 
                    color: '#065f46', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'inline-block'
                  }}>
                    {reporte.horas} Horas
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                     {reporte.horaInicio} - {reporte.horaFin}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
                     {reporte.fecha}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '8px',
                fontSize: '1rem',
                color: '#374151',
                lineHeight: '1.5'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1a4d2e' }}>Observaciones:</strong>
                {reporte.tareas}
              </div>

              {reporte.pruebas && (
                <div style={{ 
                  marginTop: '1rem',
                  backgroundColor: '#ecfdf5', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: '#065f46',
                  lineHeight: '1.5',
                  border: '1px solid #34d399'
                }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1a4d2e' }}>Evidencia / Pruebas:</strong>
                  {reporte.pruebas.startsWith('http') ? (
                    <a href={reporte.pruebas} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 'bold' }}>
                      Ver Evidencia Adjunta
                    </a>
                  ) : (
                    reporte.pruebas
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportesTab;
