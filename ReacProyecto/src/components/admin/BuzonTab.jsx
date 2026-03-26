import React, { useState, useEffect } from 'react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import '../../styles/BuzonTab.css';

const ESTADOS_SOPORTE = ['Pendiente', 'En Proceso', 'Leído', 'Solucionado'];
const ESTADOS_ROBO    = ['Pendiente', 'En Investigación', 'Resuelto'];

const getStatusClass = (estado) => {
  switch (estado) {
    case 'Pendiente':        return 'status-pendiente';
    case 'En Proceso':       return 'status-proceso';
    case 'Leído':            return 'status-leido';
    case 'Solucionado':      return 'status-solucionado';
    case 'En Investigación': return 'status-investigacion';
    case 'Resuelto':         return 'status-resuelto';
    default:                 return 'status-pendiente';
  }
};

function StatusBadge({ estado }) {
  const statusClass = getStatusClass(estado);
  return (
    <span className={`status-badge ${statusClass}`}>
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
      className={`select-status-basic ${getStatusClass(value)}`}
    >
      {opciones.map(op => <option key={op} value={op}>{op}</option>)}
    </select>
  );

  /* ── Botón eliminar ── */
  const BtnEliminar = ({ onClick }) => (
    <button
      onClick={onClick}
      className="btn-delete-basic"
    >
      Eliminar
    </button>
  );

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="buzon-header">
        <div className="buzon-title-section">
          <h2>Buzón Interno</h2>
          <p className="buzon-subtitle">
            Gestión de mensajes, reportes y actividades de la comunidad
          </p>
        </div>
        <div className="buzon-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setSeccion(t.id)}
              className={`buzon-tab-btn ${seccion === t.id ? 'active' : ''}`}
              style={seccion === t.id ? { backgroundColor: t.activeColor, border: `1.5px solid ${t.activeColor}` } : { color: t.activeColor, border: `1.5px solid ${t.activeColor}` }}
            >
              {t.label}
            </button>
          ))}
          <button onClick={cargarDatos} title="Actualizar" className="refresh-btn">↺</button>
        </div>
      </div>

      {cargando ? (
        <div className="buzon-loading">Cargando mensajes...</div>
      ) : (
        <>
          {/* ── SECCIÓN SOPORTE ── */}
          {seccion === 'soporte' && (
            reportesSoporte.length === 0 ? (
              <Vacia mensaje="No hay mensajes de soporte recibidos." />
            ) : (
              <div className="reportes-list">
                {reportesSoporte.map(rep => (
                  <div key={rep.id} className="reporte-card card-soporte">
                    <div className="row-between">
                      <div>
                        <h3 className="card-title title-soporte">{rep.asunto}</h3>
                        <span className="meta-text">De: <strong>{rep.userName}</strong> · {rep.userEmail}</span>
                      </div>
                      <div className="card-actions-right">
                        <SelectEstado
                          value={rep.estado}
                          opciones={ESTADOS_SOPORTE}
                          onChange={(v) => handleEstadoSoporte(rep, v)}
                        />
                        <span className="status-date">
                          {new Date(rep.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="message-box box-soporte">
                      <p className="message-text">{rep.mensaje}</p>
                    </div>
                    <div className="card-footer">
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
              <div className="reportes-list">
                {reportesRobo.map(rep => (
                  <div key={rep.id} className="reporte-card card-robo">
                    <div className="row-between">
                      <div>
                        <h3 className="card-title title-robo">Árbol: {rep.tipo_arbol}</h3>
                        <span className="meta-text">{rep.ubicacion}</span>
                      </div>
                      <div className="card-actions-right">
                        <SelectEstado
                          value={rep.estado}
                          opciones={ESTADOS_ROBO}
                          onChange={(v) => handleEstadoRobo(rep, v)}
                        />
                        <span className="status-date">
                          {new Date(rep.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="message-box box-robo">
                      <strong className="box-title-inner inner-title-robo">Descripción:</strong>
                      <p className="message-text">{rep.descripcion}</p>
                    </div>
                    <div className="card-footer-between">
                      <span className="meta-text">Reportado por: <strong>{rep.userName}</strong> ({rep.userEmail})</span>
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
              <div className="reportes-list">
                {reportesVoluntario.map(rep => (
                  <div key={rep.id} className="reporte-card card-voluntario">
                    <div className="row-between">
                      <div>
                        <h3 className="card-title title-soporte">{rep.voluntarioNombre}</h3>
                        <span className="meta-text">{rep.voluntarioEmail}</span>
                      </div>
                      <div className="voluntario-stats">
                        <span className="hours-tag">
                          {rep.horas} Horas
                        </span>
                        <p className="voluntario-date-time">{rep.fecha} · {rep.horaInicio}–{rep.horaFin}</p>
                      </div>
                    </div>
                    <div className="message-box box-voluntario">
                      <strong className="box-title-inner inner-title-voluntario">Detalles de la labor:</strong>
                      <p className="message-text">{rep.tareas}</p>
                    </div>
                    {rep.pruebas && (
                      <div className="evidence-box">
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
    <div className="empty-message-container">
      <p className="empty-message-text">{mensaje}</p>
    </div>
  );
}

export default BuzonTab;
