import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard, 
  CheckCircle, 
  Activity, 
  Users, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  FileText,
  User,
  MoreVertical,
  ArrowRight,
  HelpCircle,
  MapPin,
  Clock,
  Check
} from 'lucide-react';
import services from '../services/services';
import '../styles/VoluntariadoPremium.css';


function MainVoluntariado() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchData = async () => {
      try {
        const data = await services.getReportesVoluntariado();
        // Ordenar por fecha descendente
        const sortedData = (data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedData);
        if (sortedData.length > 0) {
          setSelectedLog(sortedData[0]);
        }
      } catch (error) {
        console.error("Error fetching volunteer logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTaskColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return 'bg-fauna';
    if (t.includes('suelo') || t.includes('siembra')) return 'bg-soil';
    return 'bg-trail';
  };

  const pendingCount = logs.filter(log => log.estado === 'enviado').length;

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="spinner"></div>
        <p>Cargando panel de voluntariado...</p>
      </div>
    );
  }

  return (
    <div className="premium-vol-layout">
      {/* Sidebar */}
      <aside className="premium-sidebar">
        <div className="premium-sidebar-logo">
          <h2>Admin Control Center</h2>
          <span>RESOURCE MANAGER</span>
        </div>

        <nav className="premium-nav">
          <div className={`premium-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} />
            <span className="nav-label">Dashboard</span>
          </div>
          <div className={`premium-nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <CheckCircle size={20} />
            <span className="nav-label">Volunteer Logs</span>
          </div>
          <div className="premium-nav-item">
            <Clock size={20} />
            <span className="nav-label">Hours Validation</span>
          </div>
          <div className="premium-nav-item">
            <FileText size={20} />
            <span className="nav-label">Field Reports</span>
          </div>
          <div className="premium-nav-item">
            <Users size={20} />
            <span className="nav-label">User Access</span>
          </div>
        </nav>

        <div className="premium-sidebar-footer">
          <button className="premium-btn-export">Export Reports</button>
          <div className="premium-nav-item">
            <HelpCircle size={18} />
            <span className="nav-label">Help Center</span>
          </div>
          <div className="premium-nav-item" onClick={() => navigate('/login')}>
            <LogOut size={18} />
            <span className="nav-label">Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="premium-main">
        <header className="premium-header">
          <div className="premium-search-container">
            <Search size={18} color="#999" />
            <input type="text" placeholder="Search volunteer logs..." />
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Settings size={20} color="#333" className="admin-icon-btn" />
            <div className="premium-profile-pill">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.nombre || 'Visitante'}</span>
              <div className="premium-avatar" style={{ border: '2px solid #ddd', overflow: 'hidden' }}>
                {user?.fotoPerfil ? (
                  <img src={user.fotoPerfil} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={18} />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="premium-title-section">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1>Pending Logs</h1>
            {pendingCount > 0 && (
              <span className="premium-badge-pending">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', marginRight: 8 }}></div>
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p>La Angostura Eco-Corridor Management</p>
        </div>

        <div className="premium-logs-list">
          <div className="premium-log-row-header">
            <span>Volunteer Name</span>
            <span>Date</span>
            <span>Activity Type</span>
            <span>Hours Claimed</span>
            <span>Status</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`premium-log-item ${selectedLog?.id === log.id ? 'active-border' : ''}`}
                onClick={() => setSelectedLog(log)}
              >
                <div className="premium-vol-profile">
                  <div className="premium-avatar">
                    {log.voluntarioNombre?.charAt(0)}
                  </div>
                  <div className="premium-vol-name">
                    <h4>{log.voluntarioNombre}</h4>
                    <span>Voluntario Activo</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {log.fecha}
                </div>
                <div>
                  <span className={`premium-task-badge ${getTaskColor(log.tipoTarea)}`}>
                    {log.tipoTarea}
                  </span>
                </div>
                <div style={{ fontWeight: 600 }}>
                  {log.horas}h
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: log.estado === 'enviado' ? '#f59e0b' : '#10b981' }}></div>
                  {log.estado === 'enviado' ? 'Pending Review' : 'Approved'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Details Panel */}
      <aside className="premium-details-panel">
        <div className="premium-details-header">
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Log Details</h2>
          <MoreVertical size={20} color="#999" />
        </div>

        {selectedLog ? (
          <div className="premium-details-card">
            {selectedLog.pruebas && (
              <img src={selectedLog.pruebas} alt="Evidence" className="premium-log-image" />
            )}
            
            <div className="premium-details-info">
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Observation</span>
              <h3>{selectedLog.tareas || 'Actividad rutinaria de mantenimiento en el corredor biológico.'}</h3>
              
              <div className="premium-stat-grid-small">
                <div className="premium-stat-box">
                  <label>Species / Task</label>
                  <span>{selectedLog.tipoTarea}</span>
                </div>
                <div className="premium-stat-box">
                  <label>Time Spent</label>
                  <span>{selectedLog.horas}h 00m</span>
                </div>
              </div>

              <div className="premium-notes-section">
                <label>GPS Metadata</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f4f2', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ background: '#0a3622', color: 'white', padding: '6px', borderRadius: '50%' }}>
                    <MapPin size={16} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>41°01'S 71°21'W</span>
                </div>

                <label>Volunteer Notes</label>
                <p className="premium-notes-text">
                  "{selectedLog.tareas || 'Se realizó la labor según lo planeado en el cronograma semanal.'}"
                </p>
              </div>

              <div className="premium-actions">
                <button className="btn-premium-approve">
                  <Check size={18} /> Approve Hours
                </button>
                <button className="btn-premium-correction">Request Correction</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '100px' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', display: 'block' }} />
            <p>Selecciona un log para ver los detalles</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default MainVoluntariado;
