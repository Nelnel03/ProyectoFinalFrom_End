import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';

const ESTADOS_SOPORTE = ['Pendiente', 'En Proceso', 'Leído', 'Solucionado'];
const ESTADOS_ROBO    = ['Pendiente', 'En Investigación', 'Resuelto'];

const statusColors = {
  'Pendiente':        { bg: '#fef9c3', text: '#92400e', border: '#fde68a' },
  'En Proceso':       { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  'Leído':            { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  'Solucionado':      { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'En Investigación': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'Resuelto':         { bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

function StatusBadge({ estado }) {
  const c = statusColors[estado] || statusColors['Pendiente'];
  return (
    <span style={{
      padding: '3px 12px',
      borderRadius: '999px',
      fontSize: '0.78rem',
      fontWeight: '700',
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {estado || 'Pendiente'}
    </span>
  );
}

function BuzonTab() {
  const [reportesVoluntario, setReportesVoluntario] = useState([]);
  const [reportesRobo, setReportesRobo] = useState([]);
  const [reportesSoporte, setReportesSoporte] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState('soporte');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [volDatos, roboDatos, sopDatos] = await Promise.all([
        services.getReportesVoluntariado(),
        services.getReportesRobados(),
        services.getReportes()
      ]);
      setReportesVoluntario((volDatos || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha)));
      setReportesRobo((roboDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setReportesSoporte((sopDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (err) {
      console.error('Error al cargar datos del buzón:', err);
    } finally {
      setCargando(false);
    }
  };

  /* ── Soporte: actualizar estado ── */
  const handleEstadoSoporte = async (rep, nuevoEstado) => {
    try {
      const updated = { ...rep, estado: nuevoEstado };
      await services.putReportes(updated, rep.id);
      setReportesSoporte(prev => prev.map(r => r.id === rep.id ? updated : r));
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  /* ── Soporte: eliminar ── */
  const handleEliminarSoporte = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar mensaje?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;
    try {
      await services.deleteReportes(id);
      setReportesSoporte(prev => prev.filter(r => r.id !== id));
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error');
    }
  };

  /* ── Robos: actualizar estado ── */
  const handleEstadoRobo = async (rep, nuevoEstado) => {
    try {
      const updated = { ...rep, estado: nuevoEstado };
      await services.putReportesRobados(updated, rep.id);
      setReportesRobo(prev => prev.map(r => r.id === rep.id ? updated : r));
    } catch {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
    }
  };

  /* ── Robos: eliminar ── */
  const handleEliminarRobo = async (id) => {
    const res = await Swal.fire({
      title: '¿Eliminar reporte de robo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bc6c25',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;
    try {
      await services.deleteReportesRobados(id);
      setReportesRobo(prev => prev.filter(r => r.id !== id));
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el reporte.', 'error');
    }
  };

  /* ── Tabs ── */
  const tabs = [
    { id: 'soporte',      label: `Soporte (${reportesSoporte.length})`,     activeColor: 'var(--color-mar-profundo)' },
    { id: 'robos',        label: `Robos (${reportesRobo.length})`,           activeColor: '#bc6c25' },
    { id: 'actividades',  label: `Labores (${reportesVoluntario.length})`,   activeColor: 'var(--color-bosque-helecho)' },
  ];

  /* ── Selectores de estado inline ── */
  const SelectEstado = ({ value, opciones, onChange }) => (
    <select
      value={value || opciones[0]}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '4px 10px',
        borderRadius: '8px',
        border: `1px solid ${(statusColors[value] || statusColors['Pendiente']).border}`,
        backgroundColor: (statusColors[value] || statusColors['Pendiente']).bg,
        color: (statusColors[value] || statusColors['Pendiente']).text,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.82rem',
      }}
    >
      {opciones.map(op => <option key={op} value={op}>{op}</option>)}
    </select>
  );

  /* ── Botón eliminar ── */
  const BtnEliminar = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#fee2e2', color: '#991b1b',
        border: 'none', padding: '5px 12px',
        borderRadius: '8px', cursor: 'pointer',
        fontSize: '0.8rem', fontWeight: 'bold',
      }}
    >
      Eliminar
    </button>
  );

  return (
    <div className="tab-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--color-bosque-helecho)', margin: 0 }}>Buzón Interno</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--color-texto)', opacity: 0.8, fontSize: '0.9rem' }}>
            Gestión de mensajes, reportes y actividades de la comunidad
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setSeccion(t.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: seccion === t.id ? t.activeColor : 'var(--color-crema-organico)',
                color: seccion === t.id ? 'white' : t.activeColor,
                border: `1.5px solid ${t.activeColor}`,
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.83rem',
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
          <button onClick={cargarDatos} title="Actualizar" style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--color-texto)', fontWeight: 'bold' }}>↺</button>
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-texto)' }}>Cargando mensajes...</div>
      ) : (
        <>
          {/* ── SECCIÓN SOPORTE ── */}
          {seccion === 'soporte' && (
            reportesSoporte.length === 0 ? (
              <Vacia mensaje="No hay mensajes de soporte recibidos." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportesSoporte.map(rep => (
                  <div key={rep.id} style={cardStyle('#0369a1')}>
                    <div style={rowBetween}>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-mar-profundo)', fontSize: '1.05rem' }}>{rep.asunto}</h3>
                        <span style={metaText}>De: <strong>{rep.userName}</strong> · {rep.userEmail}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <SelectEstado
                          value={rep.estado}
                          opciones={ESTADOS_SOPORTE}
                          onChange={(v) => handleEstadoSoporte(rep, v)}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-texto)', opacity: 0.7 }}>
                          {new Date(rep.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '10px', border: '1px solid #e0f2fe', margin: '0.8rem 0 0' }}>
                      <p style={{ margin: 0, lineHeight: '1.6', color: '#334155' }}>{rep.mensaje}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.7rem' }}>
                      <BtnEliminar onClick={() => handleEliminarSoporte(rep.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── SECCIÓN ROBOS ── */}
          {seccion === 'robos' && (
            reportesRobo.length === 0 ? (
              <Vacia mensaje="No hay alertas de robo actualmente." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportesRobo.map(rep => (
                  <div key={rep.id} style={cardStyle('#bc6c25')}>
                    <div style={rowBetween}>
                      <div>
                        <h3 style={{ margin: 0, color: '#bc6c25', fontSize: '1.05rem' }}>Árbol: {rep.tipo_arbol}</h3>
                        <span style={metaText}>{rep.ubicacion}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <SelectEstado
                          value={rep.estado}
                          opciones={ESTADOS_ROBO}
                          onChange={(v) => handleEstadoRobo(rep, v)}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-texto)', opacity: 0.7 }}>
                          {new Date(rep.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#fff7ed', padding: '1rem', borderRadius: '10px', border: '1px solid #ffedd5', margin: '0.8rem 0 0' }}>
                      <strong style={{ display: 'block', color: '#9a3412', marginBottom: '4px' }}>Descripción:</strong>
                      <p style={{ margin: 0, lineHeight: '1.5' }}>{rep.descripcion}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.7rem' }}>
                      <span style={metaText}>Reportado por: <strong>{rep.userName}</strong> ({rep.userEmail})</span>
                      <BtnEliminar onClick={() => handleEliminarRobo(rep.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── SECCIÓN LABORES VOLUNTARIOS ── */}
          {seccion === 'actividades' && (
            reportesVoluntario.length === 0 ? (
              <Vacia mensaje="No hay reportes de actividades registrados." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportesVoluntario.map(rep => (
                  <div key={rep.id} style={cardStyle('var(--color-bosque-helecho)')}>
                    <div style={rowBetween}>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--color-mar-profundo)', fontSize: '1.05rem' }}>{rep.voluntarioNombre}</h3>
                        <span style={metaText}>{rep.voluntarioEmail}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: 'var(--color-bosque-helecho)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {rep.horas} Horas
                        </span>
                        <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: 'var(--color-texto)', opacity: 0.7 }}>{rep.fecha} · {rep.horaInicio}–{rep.horaFin}</p>
                      </div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-crema-organico)', padding: '1rem', borderRadius: '10px', margin: '0.8rem 0 0' }}>
                      <strong style={{ display: 'block', color: 'var(--color-bosque-helecho)', marginBottom: '4px' }}>Detalles de la labor:</strong>
                      <p style={{ margin: 0, lineHeight: '1.5' }}>{rep.tareas}</p>
                    </div>
                    {rep.pruebas && (
                      <div style={{ marginTop: '0.7rem', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '0.85rem' }}>
                        <strong>Pruebas:</strong> {rep.pruebas}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

/* ── Helpers ── */
function Vacia({ mensaje }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-crema-organico)', borderRadius: '15px' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}></div>
      <p style={{ margin: 0, color: 'var(--color-texto)', fontWeight: '500' }}>{mensaje}</p>
    </div>
  );
}

const cardStyle = (borderColor) => ({
  backgroundColor: 'white',
  padding: '1.25rem 1.5rem',
  borderRadius: '15px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  borderLeft: `6px solid ${borderColor}`,
});

const rowBetween = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' };
const metaText   = { fontSize: '0.83rem', color: 'var(--color-texto)', display: 'block', marginTop: '3px' };

export default BuzonTab;
