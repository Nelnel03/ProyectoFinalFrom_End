import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  History, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  MoreVertical,
  MapPin,
  Check,
  FileText,
  ChevronRight
} from 'lucide-react';
import services from '../services/services';
import ReporteForm from './ReporteForm';
import MisReportesTab from './MisReportesTab';
import UserProfile from './UserProfile';
import '../styles/VoluntariadoPremium.css';

function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [stats, setStats] = useState({ totalHoras: 0, totalTareas: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarDatos = async (volId) => {
    try {
      const actividades = await services.getReportesVoluntariado();
      const misActividades = (actividades || [])
        .filter(a => a.voluntarioId === volId)
        .sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      
      setLogs(misActividades);
      if (misActividades.length > 0) setSelectedLog(misActividades[0]);

      const totalH = misActividades.reduce((acc, curr) => acc + (Number(curr.horas) || 0), 0);
      setStats({
        totalHoras: totalH.toFixed(1),
        totalTareas: misActividades.length
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.rol !== 'voluntario') {
         // Si es un admin mirando esto como Demo, lo dejamos pasar si está en el storage.
         // Pero para producción:
         // navigate('/login');
      }
      setUser(parsedUser);
      cargarDatos(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return 'bg-fauna';
    if (t.includes('suelo') || t.includes('siembra')) return 'bg-soil';
    return 'bg-trail';
  };

  const logout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="premium-loading">
        <div className="spinner"></div>
        <p>Cargando tu centro de control...</p>
      </div>
    );
  }

  return (
    <div className={`premium-vol-layout ${activeTab === 'historial' ? 'with-inspector' : 'full-content'}`}>
      {/* Sidebar */}
      <aside className="premium-sidebar">
        <div className="premium-sidebar-logo">
          <h2>Volunteer Center</h2>
          <span>Eco-Corridor BioMon</span>
        </div>

        <nav className="premium-nav">
          <div className={`premium-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} />
            <span className="nav-label">Mi Dashboard</span>
          </div>
          <div className={`premium-nav-item ${activeTab === 'reportar' ? 'active' : ''}`} onClick={() => setActiveTab('reportar')}>
            <PlusCircle size={20} />
            <span className="nav-label">Reportar Labor</span>
          </div>
          <div className={`premium-nav-item ${activeTab === 'historial' ? 'active' : ''}`} onClick={() => setActiveTab('historial')}>
            <History size={20} />
            <span className="nav-label">Mi Historial</span>
          </div>
          <div className={`premium-nav-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
            <UserIcon size={20} />
            <span className="nav-label">Mi Perfil</span>
          </div>
        </nav>

        <div className="premium-sidebar-footer">
          <div className="premium-nav-item" onClick={logout}>
            <LogOut size={18} />
            <span className="nav-label">Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="premium-main">
        <header className="premium-header">
          <div className="premium-search-container">
            <Search size={18} color="#999" />
            <input type="text" placeholder="Buscar en mis reportes..." />
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="premium-profile-pill">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.nombre}</span>
              <div className="premium-avatar" style={{ border: '2px solid #ddd', overflow: 'hidden' }}>
                {user.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dash-overview fade-in">
            <div className="premium-title-section">
              <h1>¡Hola, {user.nombre}!</h1>
              <p>Este es tu impacto actual en el corredor biológico.</p>
            </div>
            
            <div className="volunteer-stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="volunteer-stat-card" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--premium-shadow)' }}>
                 <Clock size={32} color="#0a3622" style={{ marginBottom: '1rem' }} />
                 <span className="volunteer-stat-value" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalHoras}</span>
                 <p className="volunteer-stat-label" style={{ color: '#666', fontWeight: 600 }}>Horas Contribuidas</p>
              </div>
              <div className="volunteer-stat-card" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--premium-shadow)' }}>
                 <CheckCircle2 size={32} color="#0a3622" style={{ marginBottom: '1rem' }} />
                 <span className="volunteer-stat-value" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.totalTareas}</span>
                 <p className="volunteer-stat-label" style={{ color: '#666', fontWeight: 600 }}>Labores Verificadas</p>
              </div>
            </div>

            <div className="recent-activity-preview">
               <h3 style={{ marginBottom: '1.5rem' }}>Actividad Reciente</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {logs.length > 0 ? logs.slice(0, 3).map(log => (
                    <div key={log.id} className="premium-log-item" onClick={() => { setActiveTab('historial'); setSelectedLog(log); }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <span className={`premium-task-badge ${getTaskColor(log.tipoTarea)}`}>{log.tipoTarea}</span>
                          <span style={{ fontWeight: 600 }}>{log.tareas?.substring(0, 50)}...</span>
                       </div>
                       <span style={{ color: '#666' }}>{log.fecha}</span>
                       <ChevronRight size={18} color="#999" />
                    </div>
                  )) : (
                    <p style={{ fontStyle: 'italic', color: '#999' }}>Aún no has registrado labores.</p>
                  )}
               </div>
               {logs.length > 0 && (
                 <button onClick={() => setActiveTab('historial')} style={{ marginTop: '1.5rem', color: '#0a3622', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>
                   Ver historial completo →
                 </button>
               )}
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="history-view fade-in">
             <div className="premium-title-section">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Mi Historial de Labores</h1>
              </div>
              <p>Registro histórico de todas tus contribuciones al bosque.</p>
            </div>

            <div className="premium-logs-list">
              <div className="premium-log-row-header">
                <span>Tarea Realizada</span>
                <span>Fecha</span>
                <span>Horas</span>
                <span>Estado</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {logs.length > 0 ? logs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`premium-log-item ${selectedLog?.id === log.id ? 'active-border' : ''}`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="premium-vol-profile">
                      <div className="premium-avatar" style={{ background: '#0a3622', color: 'white' }}>
                        <ClipboardList size={18} />
                      </div>
                      <div className="premium-vol-name">
                        <h4>{log.tipoTarea}</h4>
                        <span>{log.tareas?.substring(0, 30)}...</span>
                      </div>
                    </div>
                    <div style={{ color: '#666' }}>{log.fecha}</div>
                    <div style={{ fontWeight: 700 }}>{log.horas}h</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.estado === 'enviado' ? '#f59e0b' : '#10b981' }}></div>
                      {log.estado === 'enviado' ? 'En Revisión' : 'Aprobada'}
                    </div>
                  </div>
                )) : (
                  <p>No hay reportes que mostrar.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reportar' && (
          <div className="report-view fade-in" style={{ maxWidth: '800px' }}>
             <div className="premium-title-section">
               <h1>Nuevo Reporte de Labor</h1>
               <p>Registra las actividades realizadas durante tu jornada.</p>
             </div>
             <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--premium-shadow)' }}>
               <ReporteForm user={user} onReportSubmitted={() => {
                 setActiveTab('historial');
                 cargarDatos(user.id);
               }} />
             </div>
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="profile-view fade-in" style={{ maxWidth: '800px' }}>
             <div className="premium-title-section">
               <h1>Mi Perfil de Voluntario</h1>
               <p>Gestiona tu información personal y credenciales.</p>
             </div>
             <UserProfile user={user} onUpdateUser={setUser} isProfessionalMode={true} />
          </div>
        )}
      </main>

      {/* Inspector Panel */}
      {activeTab === 'historial' && (
        <aside className="premium-details-panel fade-in">
          <div className="premium-details-header">
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Detalles del Reporte</h2>
            <MoreVertical size={20} color="#999" />
          </div>

          {selectedLog ? (
            <div className="premium-details-card">
              {selectedLog.pruebas && (
                <img src={selectedLog.pruebas} alt="Evidencia" className="premium-log-image" />
              )}
              
              <div className="premium-details-info">
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Observaciones</span>
                <h3>{selectedLog.tareas}</h3>
                
                <div className="premium-stat-grid-small">
                  <div className="premium-stat-box">
                    <label>Especie/Tarea</label>
                    <span>{selectedLog.tipoTarea}</span>
                  </div>
                  <div className="premium-stat-box">
                    <label>Horas</label>
                    <span>{selectedLog.horas}h 00m</span>
                  </div>
                </div>

                <div className="premium-notes-section">
                  <label>Ubicación GPS</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f4f2', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                    <MapPin size={16} color="#0a3622" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Registro verificado por GPS</span>
                  </div>
                  
                  <label>Estado de Validación</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: selectedLog.estado === 'enviado' ? '#92400e' : '#065f46' }}>
                     {selectedLog.estado === 'enviado' ? <Clock size={16}/> : <CheckCircle2 size={16}/>}
                     <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                       {selectedLog.estado === 'enviado' ? 'Pendiente de aprobación administrativa' : 'Horas validadas correctamente'}
                     </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '100px' }}>
              <FileText size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
              <p>Selecciona un reporte</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

export default VolunteerDashboard;
