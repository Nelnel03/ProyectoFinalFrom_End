import React, { useState, useEffect } from 'react';
import services from '../services/services';
import Swal from 'sweetalert2';

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
    const confirm = await Swal.fire({
      title: '¿Eliminar reporte?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
      await services.deleteReportesRobados(id);
      cargarReportes();
      Swal.fire('Eliminado', 'El reporte ha sido borrado.', 'success');
    }
  };

  const handleCambiarEstado = async (reporte, nuevoEstado) => {
    try {
      const reporteActualizado = { ...reporte, estado: nuevoEstado };
      await services.putReportesRobados(reporteActualizado, reporte.id);
      
      // Actualizar estado local para feedback inmediato
      setReportes(prev => prev.map(r => r.id === reporte.id ? reporteActualizado : r));
      
      Swal.fire({
        title: 'Estado Actualizado',
        text: `El reporte ahora está en estado: ${nuevoEstado}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'resuelto': return { bg: '#dcfce7', text: '#166534' };
      case 'en investigacion': return { bg: '#fef9c3', text: '#854d0e' };
      case 'pendiente': default: return { bg: '#fee2e2', text: '#991b1b' };
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 style={{ color: '#ef4444' }}>🚨 Reportes de Árboles Robados</h2>
        <p style={{ color: '#66937a' }}>Control y seguimiento de incidentes reportados</p>
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
          {reportes.slice().reverse().map((reporte) => {
            const colors = getStatusColor(reporte.estado);
            return (
              <div key={reporte.id} style={{
                backgroundColor: '#ffffff',
                border: `1px solid ${colors.bg}`,
                borderLeft: `6px solid ${colors.text}`,
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: colors.text, fontSize: '1.25rem' }}>
                      🌳 {reporte.tipo_arbol}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', color: '#4b5563', fontSize: '0.9rem' }}>
                      <span>📍 {reporte.ubicacion}</span>
                      <span>📅 {new Date(reporte.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '4px 12px', 
                      backgroundColor: colors.bg, 
                      color: colors.text, 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {reporte.estado || 'Pendiente'}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <select 
                        value={reporte.estado || 'Pendiente'}
                        onChange={(e) => handleCambiarEstado(reporte, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.85rem',
                          outline: 'none',
                          cursor: 'pointer',
                          backgroundColor: '#f9fafb'
                        }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Investigacion">En Investigación</option>
                        <option value="Resuelto">Resuelto</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                  color: '#1e293b',
                  lineHeight: '1.6'
                }}>
                  <strong>Descripción del incidente:</strong><br/>
                  {reporte.descripcion}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    👤 Reportado por: <strong>{reporte.userName}</strong> ({reporte.userEmail})
                  </div>
                  <button 
                    onClick={() => handleEliminar(reporte.id)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#fecaca'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#fee2e2'}
                  >
                    🗑️ Eliminar Reporte
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminReportesRobo;
