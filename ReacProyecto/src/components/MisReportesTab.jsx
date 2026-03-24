import React, { useState, useEffect } from 'react';
import services from '../services/services';

function MisReportesTab({ user }) {
  const [reportesRobo, setReportesRobo] = useState([]);
  const [mensajesSoporte, setMensajesSoporte] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user?.id) {
      cargarTodo();
    }
  }, [user?.id]);

  const cargarTodo = async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const [todosRobos, todosSoporte, todasActividades] = await Promise.all([
        services.getReportesRobados(),
        services.getReportes(),
        services.getReportesVoluntariado()
      ]);

      setReportesRobo((todosRobos || []).filter(r => r.userId === user?.id).reverse());
      setMensajesSoporte((todosSoporte || []).filter(m => m.userId === user?.id).reverse());
      setActividades((todasActividades || []).filter(a => a.voluntarioId === user?.id).reverse());
    } catch (error) {
      console.error("Error al cargar mis reportes:", error);
    } finally {
      setCargando(false);
    }
  };

  const getStatusColor = (estado) => {
    const e = estado?.trim().toLowerCase();
    switch (e) {
      case 'resuelto': return { bg: '#dcfce7', text: '#166534' };
      case 'en investigacion': return { bg: '#fef9c3', text: '#854d0e' };
      case 'enviado': case 'pendiente': default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div className="mis-reportes-container" style={{ padding: '1rem' }}>
      <h2 style={{ color: '#1a4d2e', marginBottom: '2rem' }}>📑 Mi Historial de Reportes</h2>

      {cargando ? (
        <p>Cargando tus datos...</p>
      ) : (
        <div style={{ display: 'grid', gap: '3rem' }}>
          
          {/* SECCIÓN: ROBOS */}
          <section>
            <h3 style={{ color: '#ef4444', borderBottom: '2px solid #fee2e2', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              🚨 Reportes de Robo
            </h3>
            {reportesRobo.length === 0 ? <p style={{ color: '#6b7280' }}>No tienes reportes de robo.</p> : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reportesRobo.map(r => {
                  const colors = getStatusColor(r.estado);
                  return (
                    <div key={r.id} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{r.tipo_arbol}</strong>
                        <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {r.estado || 'Pendiente'}
                        </span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>📍 {r.ubicacion}</p>
                      <small style={{ color: '#9ca3af' }}>Enviado: {new Date(r.fecha).toLocaleDateString()}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* SECCIÓN: SOPORTE */}
          <section>
            <h3 style={{ color: '#1a4d2e', borderBottom: '2px solid #f0fdf4', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              ✉️ Mensajes de Soporte
            </h3>
            {mensajesSoporte.length === 0 ? <p style={{ color: '#6b7280' }}>No has enviado mensajes de soporte.</p> : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {mensajesSoporte.map(m => (
                  <div key={m.id} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{m.asunto}</strong>
                      <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {m.estado || 'Pendiente'}
                      </span>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '0.95rem', color: '#374151' }}>{m.mensaje}</p>
                    <small style={{ color: '#9ca3af' }}>Enviado: {new Date(m.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECCIÓN: ACTIVIDAD (Solo Voluntarios) */}
          {user.rol === 'voluntario' && (
            <section>
              <h3 style={{ color: '#2e6b46', borderBottom: '2px solid #dcfce7', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                👷 Reportes de Actividad
              </h3>
              {actividades.length === 0 ? <p style={{ color: '#6b7280' }}>No tienes registros de actividad.</p> : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {actividades.map(a => (
                    <div key={a.id} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{a.tipoTarea}</strong>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          ✓ Completado
                        </span>
                      </div>
                      <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#374151' }}>⏱️ {a.horas} horas trabajadas</p>
                      <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#6b7280' }}><em>{a.tareas}</em></p>
                      <small style={{ color: '#9ca3af' }}>Fecha: {a.fecha}</small>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      )}
    </div>
  );
}

export default MisReportesTab;
