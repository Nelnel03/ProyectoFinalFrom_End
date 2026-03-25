import React, { useState, useEffect, useCallback } from 'react';
import services from '../services/services';

// Paleta de colores de estado compartida con el admin
const STATUS_STYLES = {
  'Pendiente':        { bg: '#fef9c3', text: '#92400e', border: '#fde68a', icon: '⏳' },
  'En Proceso':       { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', icon: '🔄' },
  'Leído':            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '👁️' },
  'Solucionado':      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7', icon: '✅' },
  'En Investigación': { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: '🔍' },
  'Resuelto':         { bg: '#dcfce7', text: '#166534', border: '#86efac', icon: '✅' },
};

function StatusBadge({ estado }) {
  const s = STATUS_STYLES[estado] || STATUS_STYLES['Pendiente'];
  return (
    <span style={{
      padding: '4px 14px',
      borderRadius: '999px',
      fontSize: '0.8rem',
      fontWeight: '700',
      backgroundColor: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
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
    <div className="mis-reportes-container" style={{ padding: '1rem' }}>
      {/* Header con botón de refresco */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-bosque-helecho)', margin: 0 }}>📑 Mis Solicitudes y Reportes</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {ultimaActualizacion && (
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={cargarTodo}
            disabled={cargando}
            style={{
              padding: '7px 14px',
              backgroundColor: 'var(--color-bosque-helecho)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              opacity: cargando ? 0.7 : 1,
            }}
          >
            {cargando ? '...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {cargando && mensajesSoporte.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-texto)' }}>Cargando tus datos...</p>
      ) : (
        <div style={{ display: 'grid', gap: '3rem' }}>

          {/* ── SOPORTE ── */}
          <section>
            <h3 style={{ color: 'var(--color-mar-profundo)', borderBottom: '2px solid #e0f2fe', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              ✉️ Mensajes de Soporte
            </h3>
            {mensajesSoporte.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No has enviado mensajes de soporte.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {mensajesSoporte.map(m => (
                  <div key={m.id} style={{
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    borderLeft: `5px solid ${STATUS_STYLES[m.estado]?.border || '#e5e7eb'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ color: 'var(--color-mar-profundo)', fontSize: '1rem' }}>{m.asunto}</strong>
                      <StatusBadge estado={m.estado} />
                    </div>
                    <p style={{ marginTop: '0.75rem', fontSize: '0.92rem', color: '#374151', lineHeight: '1.5' }}>{m.mensaje}</p>
                    <small style={{ color: '#9ca3af' }}>Enviado: {new Date(m.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── ROBOS ── */}
          <section>
            <h3 style={{ color: '#bc6c25', borderBottom: '2px solid #ffedd5', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              🚨 Reportes de Robo
            </h3>
            {reportesRobo.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No tienes reportes de robo.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reportesRobo.map(r => (
                  <div key={r.id} style={{
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    borderLeft: `5px solid ${STATUS_STYLES[r.estado]?.border || '#e5e7eb'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ color: '#bc6c25', fontSize: '1rem' }}>{r.tipo_arbol}</strong>
                      <StatusBadge estado={r.estado} />
                    </div>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#6b7280' }}>📍 {r.ubicacion}</p>
                    <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#374151' }}>{r.descripcion}</p>
                    <small style={{ color: '#9ca3af' }}>Enviado: {new Date(r.fecha).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── ACTIVIDADES (solo voluntarios) ── */}
          {user.rol === 'voluntario' && (
            <section>
              <h3 style={{ color: 'var(--color-bosque-helecho)', borderBottom: '2px solid #dcfce7', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                👷 Mis Reportes de Actividad
              </h3>
              {actividades.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No tienes registros de actividad.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {actividades.map(a => (
                    <div key={a.id} style={{ padding: '1.25rem 1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <strong style={{ color: 'var(--color-bosque-helecho)' }}>{a.tipoTarea}</strong>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          ✓ Registrado
                        </span>
                      </div>
                      <p style={{ margin: '6px 0', fontSize: '0.9rem', color: '#374151' }}>⏱️ {a.horas} horas — {a.fecha}</p>
                      <p style={{ margin: '6px 0', fontSize: '0.88rem', color: '#6b7280', fontStyle: 'italic' }}>{a.tareas}</p>
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
