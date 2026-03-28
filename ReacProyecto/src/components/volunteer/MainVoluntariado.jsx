import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  FileText,
  Users,
  HelpCircle,
  LogOut,
  Search,
  Settings,
  Bell,
  Check,
  XCircle,
  CalendarDays,
  Download,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import services from '../../services/services';
import '../../styles/VoluntariadoPremium.css';

function MainVoluntariado() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState('logs');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await services.getReportesVoluntariado();
      const sorted = (data || []).sort((a, b) =>
        new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha)
      );
      setLogs(sorted);
      if (sorted.length > 0) setSelectedLog(sorted[0]);
    } catch (err) {
      console.error('Error al cargar bitácora:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (log) => {
    const result = await Swal.fire({
      title: '¿Aprobar horas?',
      html: `<b>${log.voluntarioNombre}</b> — <b>${log.horas}h</b> de <b>${log.tipoTarea}</b>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#344e41',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      try {
        await services.putReporteVoluntariado({ ...log, estado: 'aprobado' }, log.id);
        const updated = logs.map(l => l.id === log.id ? { ...l, estado: 'aprobado' } : l);
        setLogs(updated);
        setSelectedLog({ ...log, estado: 'aprobado' });
        Swal.fire({ icon: 'success', title: '¡Horas aprobadas!', timer: 1800, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error al guardar' });
      }
    }
  };

  const handleSolicitarCorreccion = async (log) => {
    const result = await Swal.fire({
      title: 'Solicitar corrección',
      input: 'textarea',
      inputPlaceholder: 'Describe qué debe corregir el voluntario...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed && result.value) {
      Swal.fire({ icon: 'success', title: 'Solicitud enviada', timer: 1800, showConfirmButton: false });
    }
  };

  const getTaskBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return { label: type, color: '#ff9e00', bg: '#fff3e0' };
    if (t.includes('suelo') || t.includes('siembra')) return { label: type, color: '#4caf50', bg: '#e8f5e9' };
    return { label: type, color: '#118ab2', bg: '#e3f2fd' };
  };

  const pendientes = logs.filter(l => l.estado !== 'aprobado').length;
  const logsFiltrados = logs.filter(l =>
    !busqueda || l.voluntarioNombre?.toLowerCase().includes(busqueda.toLowerCase()) || l.tipoTarea?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const SIDEBAR_COL = '#283618';
  const SIDEBAR_HOVER = '#344e41';
  const ACCENT = '#a3b18a';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 340px', height: '100vh', fontFamily: 'var(--fuente-principal)', background: 'var(--color-arena)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{ background: SIDEBAR_COL, color: '#fff', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', height: '100vh', position: 'sticky', top: 0 }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 900, margin: 0, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Centro de Control
          </h2>
          <span style={{ fontSize: '0.65rem', color: ACCENT, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Gestión de Recursos</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.5rem' }}>
          {[
            { key: 'dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
            { key: 'logs', icon: <ClipboardList size={17} />, label: 'Volunteer Logs' },
            { key: 'horas', icon: <Clock size={17} />, label: 'Hours Validation' },
            { key: 'reportes', icon: <FileText size={17} />, label: 'Field Reports' },
            { key: 'acceso', icon: <Users size={17} />, label: 'User Access' },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                marginBottom: '2px', cursor: 'pointer', transition: 'all 0.2s',
                background: activeNav === item.key ? SIDEBAR_HOVER : 'transparent',
                color: activeNav === item.key ? '#fff' : 'rgba(255,255,255,0.65)',
                borderLeft: activeNav === item.key ? `3px solid ${ACCENT}` : '3px solid transparent',
                fontWeight: activeNav === item.key ? 700 : 400, fontSize: '0.85rem'
              }}
            >
              {item.icon} {item.label}
              {item.key === 'logs' && pendientes > 0 && (
                <span style={{ marginLeft: 'auto', background: ACCENT, color: SIDEBAR_COL, borderRadius: '10px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
                  {pendientes}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: '#344e41', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Download size={15} /> Export Reports
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', cursor: 'pointer', borderRadius: '8px' }}>
            <HelpCircle size={16} /> Help Center
          </div>
          <div
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', cursor: 'pointer', borderRadius: '8px' }}
          >
            <LogOut size={16} /> Logout
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ overflowY: 'auto', padding: '1.5rem 1.5rem 2rem', background: 'var(--color-arena)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-caracola)', borderRadius: '50px', padding: '8px 18px', border: '1px solid var(--color-ocre-silvestre)', flex: 1, maxWidth: '400px' }}>
            <Search size={15} color="#999" />
            <input
              type="text"
              placeholder="Search volunteer logs..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', color: 'var(--color-texto)', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={20} color="var(--color-texto)" style={{ cursor: 'pointer' }} />
            <Settings size={20} color="var(--color-texto)" style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-caracola)', borderRadius: '30px', padding: '6px 14px 6px 10px', border: '1px solid var(--color-ocre-silvestre)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: SIDEBAR_COL, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800, overflow: 'hidden' }}>
                {user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.nombre?.charAt(0) || 'A'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-texto)' }}>{user?.nombre || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, color: 'var(--color-texto)', textTransform: 'none' }}>
              Pending Logs
            </h1>
            {pendientes > 0 && (
              <span style={{ padding: '4px 14px', borderRadius: '20px', background: '#e8f5e9', color: '#2e7d32', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                {pendientes} Pending
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--color-tierra-sombra)', fontSize: '0.88rem' }}>
            La Angostura Eco-Corridor Management
          </p>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 120px 150px 90px 110px', padding: '8px 14px', fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--color-ocre-silvestre)', marginBottom: '8px' }}>
          <span>Volunteer Name</span>
          <span>Date</span>
          <span>Activity Type</span>
          <span>Hours Claimed</span>
          <span>Status</span>
        </div>

        {/* Table rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-tierra-sombra)' }}>
              <div style={{ width: '36px', height: '36px', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
              Cargando bitácora...
            </div>
          ) : logsFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-tierra-sombra)' }}>
              <ClipboardList size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
              <p>No hay registros que coincidan.</p>
            </div>
          ) : logsFiltrados.map(log => {
            const badge = getTaskBadge(log.tipoTarea);
            const isSelected = selectedLog?.id === log.id;
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 120px 150px 90px 110px',
                  alignItems: 'center', padding: '12px 14px', borderRadius: '12px',
                  background: isSelected ? '#f0f7f4' : 'var(--color-caracola)',
                  border: isSelected ? '2px solid #344e41' : '1px solid var(--color-ocre-silvestre)',
                  cursor: 'pointer', transition: 'all 0.18s'
                }}
              >
                {/* Name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: SIDEBAR_COL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0, overflow: 'hidden' }}>
                    {log.fotoPerfil ? <img src={log.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : log.voluntarioNombre?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-texto)', lineHeight: 1.2 }}>{log.voluntarioNombre}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-tierra-sombra)' }}>
                      {log.area || 'Voluntario Activo'}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div style={{ fontSize: '0.82rem', color: 'var(--color-tierra-sombra)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarDays size={12} /> {log.fecha}
                </div>

                {/* Badge */}
                <div>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                    {badge.label}
                  </span>
                </div>

                {/* Hours */}
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-texto)' }}>{log.horas}h</div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: log.estado === 'aprobado' ? '#10b981' : '#f59e0b' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: log.estado === 'aprobado' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                  {log.estado === 'aprobado' ? 'Approved' : 'Pending Review'}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Details Panel ── */}
      <aside style={{ background: 'var(--color-caracola)', borderLeft: '1px solid var(--color-ocre-silvestre)', overflowY: 'auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'none', color: 'var(--color-texto)' }}>Log Details</h3>
          <button
            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-ocre-silvestre)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-tierra-sombra)' }}
            onClick={() => setSelectedLog(null)}
          >✕</button>
        </div>

        {selectedLog ? (
          <>
            {/* Evidence image */}
            {selectedLog.pruebas && (
              <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: '14px', overflow: 'hidden' }}>
                <img
                  src={selectedLog.pruebas}
                  alt="Evidencia"
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
                {selectedLog.fecha && (
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📍 {selectedLog.fecha}
                  </div>
                )}
              </div>
            )}

            {/* Observation */}
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Observation</span>
              <h4 style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--color-texto)', textTransform: 'none' }}>
                {selectedLog.tareas || '—'}
              </h4>
            </div>

            {/* Species / Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.2rem' }}>
              <div style={{ background: 'var(--color-arena)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--color-ocre-silvestre)' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Activity Type</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-texto)' }}>{selectedLog.tipoTarea}</div>
              </div>
              <div style={{ background: 'var(--color-arena)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--color-ocre-silvestre)' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Time Spent</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-texto)' }}>
                  {selectedLog.horas > 0 ? `${selectedLog.horas}h` : `${selectedLog.horaInicio || '—'} – ${selectedLog.horaFin || '—'}`}
                </div>
              </div>
            </div>

            {/* Volunteer notes */}
            {selectedLog.tareas && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Volunteer Notes</span>
                <p style={{ margin: '6px 0 0', fontSize: '0.83rem', fontStyle: 'italic', color: 'var(--color-tierra-sombra)', lineHeight: 1.5 }}>
                  "{selectedLog.tareas}"
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleAprobar(selectedLog)}
                disabled={selectedLog.estado === 'aprobado'}
                style={{
                  padding: '13px', borderRadius: '10px', border: 'none',
                  background: selectedLog.estado === 'aprobado' ? '#a3b18a' : SIDEBAR_COL,
                  color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: selectedLog.estado === 'aprobado' ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                }}
              >
                <Check size={16} /> {selectedLog.estado === 'aprobado' ? '✓ Already Approved' : 'Approve Hours'}
              </button>

              {selectedLog.estado !== 'aprobado' && (
                <button
                  onClick={() => handleSolicitarCorreccion(selectedLog)}
                  style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--color-ocre-silvestre)', background: 'transparent', color: 'var(--color-texto)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <XCircle size={15} /> Request Correction
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-tierra-sombra)', paddingTop: '80px' }}>
            <ClipboardList size={40} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.88rem' }}>Select a log to view details</p>
          </div>
        )}
      </aside>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        [data-theme='dark'] aside:first-child { background: #0d1117 !important; }
        [data-theme='dark'] .log-row-dark { background: #161b22 !important; border-color: #30363d !important; }
        [data-theme='dark'] aside:last-child { background: #161b22 !important; border-color: #30363d !important; }
      `}</style>
    </div>
  );
}

export default MainVoluntariado;
