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

function BuzonTab({ refrescarNotificaciones }) {
  const [reportesVoluntario, setReportesVoluntario] = useState([]);
  const [reportesRobo, setReportesRobo] = useState([]);
  const [reportesSoporte, setReportesSoporte] = useState([]);
  const [solicitudesVol, setSolicitudesVol] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState('soporte');
  const [subPostulacion, setSubPostulacion] = useState('pendientes');
  const [subLabor, setSubLabor] = useState('nuevas');

  useEffect(() => { 
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000); 
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [volDatos, roboDatos, sopDatos, solDatos] = await Promise.all([
        services.getReportesVoluntariado(),
        services.getReportesRobados(),
        services.getReportes(),
        services.getSolicitudesVoluntariado()
      ]);
      setReportesVoluntario((volDatos || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha)));
      setReportesRobo((roboDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setReportesSoporte((sopDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setSolicitudesVol((solDatos || []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (err) {
      console.error('Error al cargar datos del buzón:', err);
    } finally {
      setCargando(false);
    }
  };

  /* ── Postulaciones: Aceptar/Rechazar ── */
  const handleAprobarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: '¿Aprobar nuevo voluntario?',
      text: `El usuario ${sol.userName} pasará a tener rango de voluntario oficialmente.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      // 1. Obtener datos del usuario completo
      const allUsers = await services.getUsuarios();
      const userObj = allUsers.find(u => u.id === sol.userId);
      
      if (userObj) {
          // 2. Actualizar el rol del usuario a voluntario
          await services.putUsuarios({ ...userObj, rol: 'voluntario' }, userObj.id);
          
          // 3. Crear ficha de voluntariado oficial
          const nuevaFicha = {
              nombre: sol.userName,
              email: sol.userEmail,
              area: 'Por asignar',
              fechaIngreso: new Date().toISOString().split('T')[0],
              rol: 'voluntario',
              fotoPerfil: userObj.fotoPerfil || ''
          };
          await services.postVoluntariados(nuevaFicha);
      }

      // 4. Marcar solicitud como aprobada
      await services.putSolicitudVoluntariado({ ...sol, estado: 'Aprobada' }, sol.id);
      
      // 5. Refrescar UI
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Aprobada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('¡Felicidades!', 'Nuevo voluntariado registrado con éxito.', 'success');
    } catch (err) {
      Swal.fire('Error', 'No se pudo procesar la aprobación.', 'error');
    }
  };

  const handleRechazarSolicitud = async (sol) => {
    const res = await Swal.fire({
      title: '¿Rechazar solicitud?',
      text: `Se notificará al usuario de la decisión.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    });
    if (!res.isConfirmed) return;

    try {
      await services.putSolicitudVoluntariado({ ...sol, estado: 'Rechazada' }, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? { ...s, estado: 'Rechazada' } : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire('Procesado', 'La solicitud ha sido rechazada.', 'info');
    } catch {
      Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
    }
  };

  /* ── Postulaciones: Marcar como visto ── */
  const handleVistoSolicitud = async (sol) => {
    if (sol.visto) return;
    try {
      const updated = { ...sol, visto: true };
      await services.putSolicitudVoluntariado(updated, sol.id);
      setSolicitudesVol(prev => prev.map(s => s.id === sol.id ? updated : s));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) {
      console.error("Error al marcar como visto:", err);
    }
  };

  /* ── Labores Voluntarios: Marcar como visto ── */
  const handleVistoReporteVoluntario = async (rep) => {
    if (rep.visto) return;
    try {
      const updated = { ...rep, visto: true };
      await services.putReporteVoluntariado(updated, rep.id);
      setReportesVoluntario(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
    } catch (err) {
      console.error("Error al marcar reporte de labor como visto:", err);
    }
  };

  /* ── Soporte: actualizar estado ── */
  const handleEstadoSoporte = async (rep, nuevoEstado) => {
    try {
      const updated = { ...rep, estado: nuevoEstado };
      await services.putReportes(updated, rep.id);
      setReportesSoporte(prev => prev.map(r => r.id === rep.id ? updated : r));
      if (refrescarNotificaciones) refrescarNotificaciones();
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
      if (refrescarNotificaciones) refrescarNotificaciones();
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
      if (refrescarNotificaciones) refrescarNotificaciones();
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
      if (refrescarNotificaciones) refrescarNotificaciones();
      Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el reporte.', 'error');
    }
  };

  /* ── Tabs ── */
  const tabs = [
    { id: 'soporte',      label: `Soporte (${reportesSoporte.length})`,     activeColor: 'var(--color-bosque-helecho)' },
    { id: 'robos',        label: `Robos (${reportesRobo.length})`,           activeColor: 'var(--color-bosque-helecho)' },
    { id: 'postulaciones', label: `Postulaciones (${solicitudesVol.length})`, activeColor: 'var(--color-bosque-helecho)' },
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
      onClick={(e) => {
        e.stopPropagation(); // Evitar que el click en borrar marque como leído
        onClick();
      }}
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
                  <div 
                    key={rep.id} 
                    className={`reporte-card card-soporte ${rep.estado === 'Pendiente' ? 'unread-card' : ''}`}
                    onClick={() => {
                        if (rep.estado === 'Pendiente') handleEstadoSoporte(rep, 'Leído');
                    }}
                  >
                    <div className="row-between">
                      <div className="title-with-badge">
                        {rep.estado === 'Pendiente' && <span className="unread-dot-mini" title="No visto"></span>}
                        <h3 className="card-title title-soporte">{rep.asunto}</h3>
                        <span className="meta-text">De: <strong>{rep.userName}</strong></span>
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
                  <div 
                    key={rep.id} 
                    className={`reporte-card card-robo ${rep.estado === 'Pendiente' ? 'unread-card' : ''}`}
                    onClick={() => {
                        if (rep.estado === 'Pendiente') handleEstadoRobo(rep, 'En Investigación');
                    }}
                  >
                    <div className="row-between">
                      <div className="title-with-badge">
                        {rep.estado === 'Pendiente' && <span className="unread-dot-mini" title="No visto"></span>}
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
                      <span className="meta-text">Reportado por: <strong>{rep.userName}</strong></span>
                      <BtnEliminar onClick={() => handleEliminarRobo(rep.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── SECCIÓN POSTULACIONES VOLUNTARIADO ── */}
          {seccion === 'postulaciones' && (
            <div className="sub-buzon-container">
              {/* Filtros Internos de Postulaciones */}
              <div className="sub-tabs-filtros">
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'pendientes' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('pendientes')}
                >
                  Pendientes ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'pendiente').length})
                </button>
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'aceptadas' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('aceptadas')}
                >
                  Aceptadas ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'aprobada').length})
                </button>
                <button 
                  className={`sub-tab-btn ${subPostulacion === 'rechazadas' ? 'active-green' : ''}`}
                  onClick={() => setSubPostulacion('rechazadas')}
                >
                  Rechazadas ({solicitudesVol.filter(s => (s.estado || '').toLowerCase() === 'rechazada').length})
                </button>
              </div>

              <div className="reportes-list">
                {solicitudesVol
                  .filter(sol => {
                    const est = (sol.estado || '').toLowerCase();
                    if (subPostulacion === 'pendientes') return est === 'pendiente';
                    if (subPostulacion === 'aceptadas') return est === 'aprobada';
                    if (subPostulacion === 'rechazadas') return est === 'rechazada';
                    return false;
                  })
                  .length === 0 ? (
                    <Vacia mensaje={`No hay solicitudes ${subPostulacion} en este momento.`} />
                  ) : (
                    solicitudesVol
                      .filter(sol => {
                        const est = (sol.estado || '').toLowerCase();
                        if (subPostulacion === 'pendientes') return est === 'pendiente';
                        if (subPostulacion === 'aceptadas') return est === 'aprobada';
                        if (subPostulacion === 'rechazadas') return est === 'rechazada';
                        return false;
                      })
                      .map(sol => (
                        <div 
                          key={sol.id} 
                          className={`reporte-card card-postulacion ${sol.estado === 'Pendiente' && !sol.visto ? 'unread-card' : ''} status-${(sol.estado || '').toLowerCase()}`}
                          onClick={() => {
                              if (sol.estado === 'Pendiente' && !sol.visto) handleVistoSolicitud(sol);
                          }}
                        >
                          <div className="row-between">
                            <div className="title-with-badge">
                              {sol.estado === 'Pendiente' && !sol.visto && <span className="unread-dot-mini" title="No visto"></span>}
                              <h3 className="card-title">
                                Postulación: {sol.userName}
                              </h3>
                              <span className="meta-text">{sol.userEmail}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                              <span className="status-date">{new Date(sol.fecha).toLocaleDateString()}</span>
                              {sol.estado !== 'Pendiente' && <StatusBadge estado={sol.estado} />}
                            </div>
                          </div>
                          <div className="message-box box-postulacion">
                            <strong className="box-title-inner">Motivación del usuario:</strong>
                            <p className={`message-text text-${(sol.estado || '').toLowerCase()}`}>
                              {sol.mensaje}
                            </p>
                          </div>
                          {sol.estado === 'Pendiente' && (
                          <div className="card-footer" style={{ gap: '10px' }}>
                            <button 
                              onClick={() => handleRechazarSolicitud(sol)} 
                              className="btn-delete-basic btn-rechazar-post"
                            >
                              Rechazar
                            </button>
                            <button 
                              onClick={() => handleAprobarSolicitud(sol)} 
                              className="admin-btn-user-submit btn-aprobar-post"
                            >
                              Aprobar Voluntario
                            </button>
                          </div>
                          )}
                        </div>
                      ))
                )}
              </div>
            </div>
          )}

          {/* ── SECCIÓN LABORES VOLUNTARIOS ── */}
          {seccion === 'actividades' && (
            <div className="sub-buzon-container">
              {/* Filtros Internos de Labores */}
              <div className="sub-tabs-filtros">
                <button 
                  className={`sub-tab-btn ${subLabor === 'nuevas' ? 'active-green' : ''}`}
                  onClick={() => setSubLabor('nuevas')}
                >
                  Sin revisar ({reportesVoluntario.filter(r => !r.visto).length})
                </button>
                <button 
                  className={`sub-tab-btn ${subLabor === 'revisadas' ? 'active-green' : ''}`}
                  onClick={() => setSubLabor('revisadas')}
                >
                  Revisadas ({reportesVoluntario.filter(r => r.visto).length})
                </button>
              </div>

              <div className="reportes-list">
                {reportesVoluntario
                  .filter(rep => {
                    if (subLabor === 'nuevas') return !rep.visto;
                    if (subLabor === 'revisadas') return rep.visto;
                    return false;
                  })
                  .length === 0 ? (
                    <Vacia mensaje={`No hay labores ${subLabor === 'nuevas' ? 'sin revisar' : 'revisadas'} en este momento.`} />
                  ) : (
                    reportesVoluntario
                      .filter(rep => {
                        if (subLabor === 'nuevas') return !rep.visto;
                        if (subLabor === 'revisadas') return rep.visto;
                        return false;
                      })
                      .map(rep => (
                        <div 
                          key={rep.id} 
                          className={`reporte-card card-voluntario ${!rep.visto ? 'unread-card' : ''}`}
                          onClick={() => {
                              if (!rep.visto) handleVistoReporteVoluntario(rep);
                          }}
                        >
                          <div className="row-between">
                            <div className="title-with-badge">
                              {!rep.visto && <span className="unread-dot-mini" title="No visto" style={{ backgroundColor: 'var(--color-bosque-helecho)' }}></span>}
                              <div>
                                <h3 className="card-title title-soporte" style={{ color: 'var(--color-bosque-helecho)' }}>{rep.voluntarioNombre}</h3>
                                <span className="meta-text">{rep.voluntarioEmail}</span>
                              </div>
                            </div>
                            <div className="voluntario-stats">
                              <span className="hours-tag">
                                {rep.horas} {rep.horas === 1 ? 'Hora' : 'Horas'}
                              </span>
                              <p className="voluntario-date-time">{rep.fecha} · {rep.horaInicio}–{rep.horaFin}</p>
                            </div>
                          </div>
                          <div className="message-box box-voluntario">
                            <strong className="box-title-inner inner-title-voluntario">Detalles de la labor ({rep.tipoTarea}):</strong>
                            <p className="message-text">{rep.tareas}</p>
                          </div>
                          {rep.pruebas && (
                            <div className="evidence-box">
                              <strong>Evidencia adjunta:</strong> 
                              {rep.pruebas.startsWith('data:image') ? (
                                  <img src={rep.pruebas} alt="Prueba de labor" style={{ display: 'block', maxWidth: '100%', borderRadius: '8px', marginTop: '8px', border: '1px solid #ddd' }} />
                              ) : (
                                  <p className="meta-text">{rep.pruebas}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                )}
              </div>
            </div>
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
