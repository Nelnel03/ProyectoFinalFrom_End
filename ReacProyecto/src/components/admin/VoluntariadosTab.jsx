import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  MoreVertical,
  Check,
  AlertCircle
} from 'lucide-react';
import services from '../../services/services';
import '../../styles/MainPagesInicoAdmin.css';
import '../../styles/VoluntariadoPremium.css';

function VoluntariadosTab({
  modoEdicionVoluntariado,
  handleVoluntariadoSubmit,
  formVoluntariado,
  setFormVoluntariado,
  resetFormVoluntariado,
  voluntariados,
  handleEditarVoluntariado,
  handleEliminarVoluntariado,
  handleConvertirVoluntariadoAUsuario
}) {
  const [subTab, setSubTab] = useState('lista'); // 'lista' o 'logs'
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (subTab === 'logs') {
      cargarLogs();
    }
  }, [subTab]);

  const cargarLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await services.getReportesVoluntariado();
      const sorted = (data || []).sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(sorted);
      if (sorted.length > 0) setSelectedLog(sorted[0]);
    } catch (error) {
      console.error("Error al cargar logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return 'bg-fauna';
    if (t.includes('suelo') || t.includes('siembra')) return 'bg-soil';
    return 'bg-trail';
  };

  return (
    <div className="premium-tab-container">
      {/* Sub-navigation inside Tab */}
      <div className="admin-subtab-nav" style={{ marginBottom: '2rem', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setSubTab('lista')}
          className={`admin-subtab-btn ${subTab === 'lista' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Users size={18} /> Personal Activo
        </button>
        <button 
          onClick={() => setSubTab('logs')}
          className={`admin-subtab-btn ${subTab === 'logs' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <ClipboardList size={18} /> Bitácora de Labores
        </button>
      </div>

      {subTab === 'lista' ? (
        <>
          <div className="admin-section-header">
            <h2 className="admin-section-title-white">Registro de Voluntariados</h2>
            <p className="admin-section-subtitle-green">Administrar la base de datos oficial de voluntarios y sus asignaciones</p>
          </div>

          <div id="voluntariado-form-container" className="admin-form-card admin-user-form-container">
            <h3 className="admin-user-form-title">
              {modoEdicionVoluntariado ? 'Editar Ficha de Voluntario' : 'Registrar Nuevo Voluntario'}
            </h3>
            
            <form onSubmit={handleVoluntariadoSubmit} className="admin-user-form">
              <div className="admin-form-group">
                <label className="admin-user-input-label">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formVoluntariado.nombre}
                  onChange={(e) => setFormVoluntariado({...formVoluntariado, nombre: e.target.value})}
                  placeholder="Ej: Carlos Rodríguez"
                  className="admin-user-input"
                />
              </div>
              
              <div className="admin-form-group">
                <label className="admin-user-input-label">Área de Interés / Cargo</label>
                <input
                  type="text"
                  required
                  value={formVoluntariado.area}
                  onChange={(e) => setFormVoluntariado({...formVoluntariado, area: e.target.value})}
                  placeholder="Ej: Siembra, Mantenimiento, Educación..."
                  className="admin-user-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-user-input-label">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formVoluntariado.email}
                  onChange={(e) => setFormVoluntariado({...formVoluntariado, email: e.target.value})}
                  placeholder="voluntario@bosque.com"
                  className="admin-user-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-user-input-label">Teléfono</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={formVoluntariado.telefono}
                  onChange={(e) => {
                     const value = e.target.value.replace(/\D/g, '');
                     setFormVoluntariado({...formVoluntariado, telefono: value});
                  }}
                  className="admin-user-input"
                />
              </div>
              
              <div className="admin-user-form-footer">
                <button type="submit" className="admin-btn-user-submit">
                  {modoEdicionVoluntariado ? 'Actualizar Ficha' : 'Registrar Voluntario'}
                </button>
                {modoEdicionVoluntariado && (
                  <button type="button" onClick={resetFormVoluntariado} className="admin-btn-user-cancel">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-arboles-lista admin-user-list">
            {voluntariados.filter(vol => vol.rol === 'voluntario').map(vol => (
              <div key={vol.id} className="admin-arbol-card admin-user-card">
                <div className="admin-user-card-header">
                  <div className="admin-user-avatar admin-vol-avatar">
                    {vol.fotoPerfil ? (
                      <img src={vol.fotoPerfil} alt={vol.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{vol.nombre?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="admin-user-info-text">
                    <h3>{vol.nombre}</h3>
                    <p className="admin-vol-area">{vol.area}</p>
                  </div>
                </div>
                
                <div className="admin-vol-contact-box">
                  <p><strong>Email:</strong> {vol.email}</p>
                  <p><strong>Tel:</strong> {vol.telefono}</p>
                </div>

                <div className="admin-user-card-footer">
                  <button onClick={() => handleEditarVoluntariado(vol)} className="admin-btn-user-edit">Editar</button>
                  <button onClick={() => handleEliminarVoluntariado(vol.id, vol.nombre)} className="admin-btn-user-delete">Baja</button>
                  <button onClick={() => handleConvertirVoluntariadoAUsuario(vol)} className="admin-vol-btn-convert">Convertir a Usuario</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="premium-logs-view-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          {/* Main List Column */}
          <div className="logs-main-column">
            <div className="premium-title-section" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Pending Logs</h1>
                <span className="premium-badge-pending" style={{ marginLeft: '15px' }}>
                  {logs.filter(l => l.estado === 'enviado').length} Pending
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>La Angostura Eco-Corridor Management</p>
            </div>

            <div className="premium-logs-list">
              <div className="premium-log-row-header" style={{ padding: '10px 20px', fontSize: '0.7rem' }}>
                <span>Volunteer Name</span>
                <span>Date</span>
                <span>Activity Type</span>
                <span>Hours</span>
                <span>Status</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loadingLogs ? (
                  <p>Cargando bitácora...</p>
                ) : logs.length > 0 ? (
                  logs.map(log => (
                    <div 
                      key={log.id} 
                      className={`premium-log-item ${selectedLog?.id === log.id ? 'active-border' : ''}`}
                      onClick={() => setSelectedLog(log)}
                      style={{ padding: '16px 20px' }}
                    >
                      <div className="premium-vol-profile">
                        <div className="premium-avatar" style={{ width: '35px', height: '35px' }}>
                          {log.voluntarioNombre?.charAt(0)}
                        </div>
                        <div className="premium-vol-name">
                          <h4 style={{ fontSize: '0.9rem' }}>{log.voluntarioNombre}</h4>
                          <span style={{ fontSize: '0.7rem' }}>Active Volunteer</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{log.fecha}</div>
                      <div>
                        <span className={`premium-task-badge ${getTaskColor(log.tipoTarea)}`}>{log.tipoTarea}</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.horas}h</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.estado === 'enviado' ? '#f59e0b' : '#10b981' }}></div>
                        {log.estado === 'enviado' ? 'Pending' : 'Approved'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay labores registradas.</p>
                )}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="logs-details-column">
            {selectedLog ? (
              <div className="premium-details-card" style={{ position: 'sticky', top: '20px' }}>
                <div className="premium-details-header" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Log Details</h3>
                  <button className="icon-btn-ghost"><MoreVertical size={18} /></button>
                </div>

                {selectedLog.pruebas && (
                  <img src={selectedLog.pruebas} alt="Evidence" className="premium-log-image" style={{ height: '160px', marginBottom: '1rem' }} />
                )}

                <div className="premium-details-info">
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Observation</span>
                  <h4 style={{ margin: '5px 0 15px 0', fontSize: '1rem', lineHeight: '1.3' }}>
                    {selectedLog.tareas?.substring(0, 80)}...
                  </h4>

                  <div className="premium-stat-grid-small" style={{ marginBottom: '1.5rem' }}>
                    <div className="premium-stat-box">
                      <label>Task Type</label>
                      <span style={{ fontSize: '0.8rem' }}>{selectedLog.tipoTarea}</span>
                    </div>
                    <div className="premium-stat-box">
                      <label>Time Spent</label>
                      <span style={{ fontSize: '0.8rem' }}>{selectedLog.horas}h</span>
                    </div>
                  </div>

                  <div className="premium-notes-section">
                    <label>GPS Metadata</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f4f2', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                      <MapPin size={14} color="#0a3622" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>41°01'S 71°21'W</span>
                    </div>

                    <label>Volunteer Notes</label>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4', fontStyle: 'italic' }}>
                      "{selectedLog.tareas}"
                    </p>
                  </div>

                  <div className="premium-actions" style={{ marginTop: '1.5rem' }}>
                    <button className="btn-premium-approve" style={{ width: '100%', gap: '8px' }}>
                      <Check size={18} /> Approve Hours
                    </button>
                    <button className="btn-premium-correction" style={{ width: '100%' }}>Request Correction</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="details-empty-state" style={{ textAlign: 'center', color: '#999', paddingTop: '100px' }}>
                <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                <p>Selecciona una labor para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoluntariadosTab;
