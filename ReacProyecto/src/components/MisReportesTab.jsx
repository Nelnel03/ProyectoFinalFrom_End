import React, { useState, useEffect, useCallback } from 'react';
import services from '../services/services';
import '../styles/MisReportesTab.css';

// Paleta de colores de estado compartida con el admin
const STATUS_STYLES = {
  'Pendiente':        { bg: '#fef9c3', text: '#92400e', border: '#fde68a', icon: '' },
  'En Proceso':       { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', icon: '' },
  'Leído':            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '' },
  'Solucionado':      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', icon: '' },
  'En Investigación': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: '' },
  'Resuelto':         { bg: '#dcfce7', text: '#166534', border: '#86efac', icon: '' },
};

function StatusBadge({ estado }) {
  const s = STATUS_STYLES[estado] || STATUS_STYLES['Pendiente'];
  return (
    <span
      className="status-badge-pill"
      style={{
        backgroundColor: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.icon} {estado || 'Pendiente'}
    </span>
  );
}

function MisReportesTab({ user }) {
  const [reportesRobo, setReportesRobo] = useState([]);
  const [mensajesSoporte, setMensajesSoporte] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargarTodo = useCallback(async () => {
    if (!user?.id) return;
    setCargando(true);
    try {
      const [todosRobos, todosSoporte, todasActividades] = await Promise.all([
        services.getReportesRobados(),
        services.getReportes(),
        services.getReportesVoluntariado()
      ]);
      setReportesRobo((todosRobos || []).filter(r => r.userId === user.id).reverse());
      setMensajesSoporte((todosSoporte || []).filter(m => m.userId === user.id).reverse());
      setActividades((todasActividades || []).filter(a => a.voluntarioId === user.id).reverse());
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error('Error al cargar mis reportes:', err);
    } finally {
      setCargando(false);
    }
  }, [user?.id]);

  useEffect(() => {
    cargarTodo();
    // Refresco automático cada 30 segundos para ver cambios del admin en tiempo real
    const interval = setInterval(cargarTodo, 30000);
    return () => clearInterval(interval);
  }, [cargarTodo]);

  return (
    <div className="mis-reportes-container">
      {/* Header con botón de refresco */}
      <div className="mis-reportes-header">
        <h2 className="mis-reportes-title">Mis Solicitudes y Reportes</h2>
        <div className="mis-reportes-actions">
          {ultimaActualizacion && (
            <span className="last-updated-text">
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={cargarTodo}
            disabled={cargando}
            className="refresh-reportes-btn"
          >
            {cargando ? '...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {cargando && mensajesSoporte.length === 0 ? (
        <p className="mis-reportes-loading">Cargando tus datos...</p>
      ) : (
        <div className="mis-reportes-grid">

          {/* ── SOPORTE ── */}
          <section>
            <h3 className="section-title-soporte">
              Mensajes de Soporte
            </h3>
            {mensajesSoporte.length === 0 ? (
              <p className="empty-section-text">No has enviado mensajes de soporte.</p>
            ) : (
              <div className="cards-grid">
                {mensajesSoporte.map(m => (
                  <div
                    key={m.id}
                    className="reporte-item-card"
                    style={{ borderLeft: `5px solid ${STATUS_STYLES[m.estado]?.border || '#e5e7eb'}` }}
                  >
                    <div className="card-top-row">
                      <strong className="card-title-soporte">{m.asunto}</strong>
                      <StatusBadge estado={m.estado} />
                    </div>
                    <p className="card-message">{m.mensaje}</p>
                    <small className="card-date">Enviado: {new Date(m.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── ROBOS ── */}
          <section>
            <h3 className="section-title-robo">
              Reportes de Robo
            </h3>
            {reportesRobo.length === 0 ? (
              <p className="empty-section-text">No tienes reportes de robo.</p>
            ) : (
              <div className="cards-grid">
                {reportesRobo.map(r => (
                  <div
                    key={r.id}
                    className="reporte-item-card"
                    style={{ borderLeft: `5px solid ${STATUS_STYLES[r.estado]?.border || '#e5e7eb'}` }}
                  >
                    <div className="card-top-row">
                      <strong className="card-title-robo">{r.tipo_arbol}</strong>
                      <StatusBadge estado={r.estado} />
                    </div>
                    <p className="card-detail card-detail-gray">{r.ubicacion}</p>
                    <p className="card-detail card-detail-dark">{r.descripcion}</p>
                    <small className="card-date">Enviado: {new Date(r.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── ACTIVIDADES (solo voluntarios) ── */}
          {user.rol === 'voluntario' && (
            <section>
              <h3 className="section-title-actividad">
                Mis Reportes de Actividad
              </h3>
              {actividades.length === 0 ? (
                <p className="empty-section-text">No tienes registros de actividad.</p>
              ) : (
                <div className="cards-grid">
                  {actividades.map(a => (
                    <div key={a.id} className="reporte-item-card">
                      <div className="card-top-row">
                        <strong className="card-title-actividad">{a.tipoTarea}</strong>
                        <span className="badge-registered">
                          ✓ Registrado
                        </span>
                      </div>
                      <p className="card-detail card-detail-dark">{a.horas} horas — {a.fecha}</p>
                      <p className="card-detail card-detail-italic">{a.tareas}</p>
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
