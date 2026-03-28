import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  FileText,
  User,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Settings,
  Check,
  XCircle,
  CalendarDays,
  Download,
  Hourglass,
  CheckCircle2,
  PlayCircle,
  StopCircle
} from 'lucide-react';
import services from '../../services/services';
import Swal from 'sweetalert2';
import UserProfile from '../user/UserProfile';
import ReporteForm from './ReporteForm';
import DarkModeToggle from '../DarkModeToggle';
import '../../styles/VoluntariadoPremium.css';

const SIDEBAR = '#283618';
const SIDEBAR_ACTIVE = '#344e41';
const ACCENT = '#a3b18a';

function VolunteerDashboard() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.rol !== 'voluntario') { navigate('/login'); return; }
      setUser(parsed);
      cargarLogs(parsed.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const cargarLogs = async (volId) => {
    setLoading(true);
    try {
      const all = await services.getReportesVoluntariado();
      const mis = (all || [])
        .filter(r => r.voluntarioId === volId)
        .sort((a, b) => new Date(b.timestamp || b.fecha) - new Date(a.timestamp || a.fecha));
      setLogs(mis);
      if (mis.length > 0) setSelectedLog(mis[0]);
    } catch (err) {
      console.error('Error al cargar logs:', err);
    } finally {
      setLoading(false);
    }
  };



  const getTaskBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('fauna') || t.includes('animal')) return { color: '#e65100', bg: '#fff3e0' };
    if (t.includes('suelo') || t.includes('siembra') || t.includes('plant')) return { color: '#2e7d32', bg: '#e8f5e9' };
    return { color: '#0277bd', bg: '#e3f2fd' };
  };

  const aprobados = logs.filter(l => l.estado === 'aprobado');
  const rechazados = logs.filter(l => l.estado.startsWith('rechazado'));
  const pendientes = logs.filter(l => ['enviado', 'solicitado', 'asignado', 'en_curso'].includes(l.estado));
  const horasAprobadas = aprobados.reduce((acc, l) => acc + (Number(l.horas) || 0), 0);
  const logsFiltrados = busqueda
    ? logs.filter(l => l.tipoTarea?.toLowerCase().includes(busqueda.toLowerCase()) || l.fecha?.includes(busqueda))
    : logs;

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { key: 'logs', icon: <ClipboardList size={17} />, label: 'Mis Labores', badge: pendientes.length },
    { key: 'nueva_tarea', icon: <PlayCircle size={17} />, label: 'Nueva Tarea' },
    { key: 'ayuda', icon: <HelpCircle size={17} />, label: 'Centro de Ayuda' },
    { key: 'perfil', icon: <User size={17} />, label: 'Mi Perfil' },
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f5f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666' }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100vh', fontFamily: 'var(--fuente-principal)', background: 'var(--color-arena)', overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ background: SIDEBAR, color: '#fff', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        {/* Logo + title */}
        <div style={{ padding: '1.5rem 1.5rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 900, margin: 0, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Centro de Control
          </h2>
          <span style={{ fontSize: '0.62rem', color: ACCENT, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Panel de Voluntario
          </span>
        </div>

        {/* Stats rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: ACCENT }}>{horasAprobadas}h</div>
            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Aprobadas</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: pendientes.length > 0 ? '#f59e0b' : rechazados.length > 0 ? '#ef4444' : ACCENT }}>
              {pendientes.length}
            </div>
            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              En Revisión
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 0.5rem' }}>
          {navItems.map(item => (
            <div
              key={item.key}
              onClick={() => setCurrentTab(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                marginBottom: '2px', cursor: 'pointer', transition: 'all 0.2s',
                background: currentTab === item.key ? SIDEBAR_ACTIVE : 'transparent',
                color: currentTab === item.key ? '#fff' : 'rgba(255,255,255,0.6)',
                borderLeft: currentTab === item.key ? `3px solid ${ACCENT}` : '3px solid transparent',
                fontWeight: currentTab === item.key ? 700 : 400, fontSize: '0.85rem'
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{ background: ACCENT, color: SIDEBAR, borderRadius: '10px', padding: '1px 7px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => currentTab === 'logs' && cargarLogs(user.id)}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: SIDEBAR_ACTIVE, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}
          >
            <Download size={14} /> Exportar Reporte
          </button>
          <div
            onClick={() => {
              Swal.fire({
                title: '¿Cerrar sesión?',
                text: 'Tendrás que volver a ingresar tus credenciales.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: SIDEBAR_ACTIVE,
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  sessionStorage.clear();
                  navigate('/login');
                }
              });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px' }}
          >
            <LogOut size={15} /> Cerrar Sesión
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ overflowY: 'auto', background: 'var(--color-arena)' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-ocre-silvestre)', background: 'var(--color-caracola)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-arena)', borderRadius: '50px', padding: '7px 16px', border: '1px solid var(--color-ocre-silvestre)', maxWidth: '340px', flex: 1 }}>
            <Search size={14} color="#999" />
            <input
              type="text"
              placeholder="Buscar en mis labores..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--color-texto)', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <DarkModeToggle />
            <Bell size={19} color="var(--color-texto)" style={{ cursor: 'pointer', opacity: 0.6 }} />
            <Settings size={19} color="var(--color-texto)" style={{ cursor: 'pointer', opacity: 0.6 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-arena)', borderRadius: '30px', padding: '5px 12px 5px 8px', border: '1px solid var(--color-ocre-silvestre)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: SIDEBAR, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800, overflow: 'hidden', flexShrink: 0 }}>
                {user?.fotoPerfil ? <img src={user.fotoPerfil} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.nombre?.charAt(0) || 'V'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-texto)' }}>{user?.nombre}</span>
            </div>
          </div>
        </div>

        {/* ── TAB: DASHBOARD ── */}
        {currentTab === 'dashboard' && (
          <div style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.4rem', color: 'var(--color-texto)', textTransform: 'none' }}>
              ¡Bienvenido, {user?.nombre?.split(' ')[0]}!
            </h1>
            <p style={{ color: 'var(--color-tierra-sombra)', fontSize: '0.9rem', margin: '0 0 2rem' }}>
              Aquí está el resumen de tus actividades en el Eco-Corredor La Angostura.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: <Hourglass size={20} color="#059669" />, val: `${horasAprobadas}h`, label: 'Horas Aprobadas', bg: '#064e3b', border: '#065f46', valColor: '#6ee7b7', labelColor: '#a7f3d0' },
                { icon: <CheckCircle2 size={20} color="#6ee7b7" />, val: aprobados.length, label: 'Labores Validadas', bg: '#064e3b', border: '#065f46', valColor: '#6ee7b7', labelColor: '#a7f3d0' },
                { icon: <Clock size={20} color="#fbbf24" />, val: pendientes.length, label: 'En Revisión', bg: '#78350f', border: '#92400e', valColor: '#fcd34d', labelColor: '#fde68a' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '1.4rem', border: `1px solid ${s.border}` }}>
                  <div style={{ marginBottom: '10px' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: s.valColor, marginBottom: '4px', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: s.labelColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setCurrentTab('nueva_tarea')} style={{ padding: '12px 24px', borderRadius: '30px', border: 'none', background: SIDEBAR, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlayCircle size={16} /> Registrar Nueva Labor
              </button>
              <button onClick={() => setCurrentTab('logs')} style={{ padding: '12px 24px', borderRadius: '30px', border: `1px solid var(--color-ocre-silvestre)`, background: 'transparent', color: 'var(--color-texto)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={16} /> Ver Mis Labores
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: LOGS (3 columnas) ── */}
        {currentTab === 'logs' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', height: 'calc(100vh - 60px)' }}>
            {/* Lista */}
            <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--color-texto)', textTransform: 'none' }}>Mis Labores</h1>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--color-tierra-sombra)' }}>Historial de tus actividades registradas</p>
                </div>
                {pendientes.length > 0 && (
                  <span style={{ padding: '4px 14px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #fde68a' }}>
                    ⏳ {pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Columnas header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 70px 110px', padding: '7px 12px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--color-ocre-silvestre)', marginBottom: '6px' }}>
                <span>Actividad</span><span>Fecha</span><span>Tipo</span><span>Horas</span><span>Estado</span>
              </div>

              {/* Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-tierra-sombra)' }}>
                    <div style={{ width: '32px', height: '32px', border: `3px solid ${ACCENT}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 10px', animation: 'spin 0.8s linear infinite' }} />
                    Cargando...
                  </div>
                ) : logsFiltrados.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-tierra-sombra)' }}>
                    <ClipboardList size={36} style={{ opacity: 0.25, display: 'block', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: '0.88rem' }}>{busqueda ? 'Sin resultados.' : 'Aún no tienes labores registradas.'}</p>
                    {!busqueda && <button onClick={() => setCurrentTab('nueva_tarea')} style={{ marginTop: '10px', padding: '8px 20px', borderRadius: '20px', border: 'none', background: SIDEBAR, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>Registrar mi primera labor</button>}
                  </div>
                ) : logsFiltrados.map(log => {
                  const badge = getTaskBadge(log.tipoTarea);
                  const isSelected = selectedLog?.id === log.id;
                  const aprobado = log.estado === 'aprobado';
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      style={{
                        display: 'grid', gridTemplateColumns: '1fr 100px 130px 70px 110px', alignItems: 'center',
                        padding: '11px 12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s',
                        background: isSelected ? '#f0f7f4' : 'var(--color-caracola)',
                        border: isSelected ? `2px solid ${SIDEBAR}` : '1px solid var(--color-ocre-silvestre)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--color-texto)', marginBottom: '2px' }}>{log.tipoTarea}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-tierra-sombra)' }}>{log.tareas?.substring(0, 35) || '—'}...</div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-tierra-sombra)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CalendarDays size={11} /> {log.fecha}
                      </div>
                      <div>
                        <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '0.66rem', fontWeight: 800, background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                          {log.tipoTarea?.split(' ')[0]}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-texto)' }}>{log.horas}h</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', color: log.estado === 'aprobado' ? '#10b981' : log.estado.startsWith('rechazado') ? '#ef4444' : log.estado === 'en_curso' ? '#8b5cf6' : log.estado === 'asignado' ? '#3b82f6' : '#f59e0b' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: log.estado === 'aprobado' ? '#10b981' : log.estado.startsWith('rechazado') ? '#ef4444' : log.estado === 'en_curso' ? '#8b5cf6' : log.estado === 'asignado' ? '#3b82f6' : '#f59e0b', flexShrink: 0 }} />
                        {log.estado === 'aprobado' ? 'Aprobado' : log.estado === 'rechazado' ? 'Rechazado' : log.estado === 'rechazado_pre' ? 'Rechazado' : log.estado === 'solicitado' ? 'Solicitado' : log.estado === 'en_curso' ? 'En Curso' : log.estado === 'asignado' ? 'Asignado' : 'Enviado'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details panel */}
            <div style={{ background: 'var(--color-caracola)', borderLeft: '1px solid var(--color-ocre-silvestre)', overflowY: 'auto', padding: '1.2rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 1rem', color: 'var(--color-texto)' }}>Detalles</h3>
              {selectedLog ? (
                <>
                  {selectedLog.pruebas && (
                    <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                      <img src={selectedLog.pruebas} alt="Evidencia" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Observación</div>
                    <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--color-texto)', fontWeight: 600 }}>
                      {selectedLog.tareas || '—'}
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--color-arena)', borderRadius: '9px', padding: '9px 11px', border: '1px solid var(--color-ocre-silvestre)' }}>
                      <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', marginBottom: '3px' }}>Tipo</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{selectedLog.tipoTarea}</div>
                    </div>
                    <div style={{ background: 'var(--color-arena)', borderRadius: '9px', padding: '9px 11px', border: '1px solid var(--color-ocre-silvestre)' }}>
                      <div style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', textTransform: 'uppercase', marginBottom: '3px' }}>Horas</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{selectedLog.horas}h</div>
                    </div>
                  </div>
                  {selectedLog.estado === 'asignado' ? (
                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlayCircle size={15} color="#3b82f6" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e40af' }}>Labor Asignada. Puedes reportarla al finalizar.</span>
                      </div>
                      <button onClick={() => setCurrentTab('subir_evidencia')} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                        Reportar Tarea Completada
                      </button>
                    </div>
                  ) : selectedLog.estado === 'solicitado' ? (
                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#fefce8', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={15} color="#f59e0b" /> <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>⏳ Solicitud enviada. Esperando asignación...</span>
                    </div>
                  ) : selectedLog.estado === 'rechazado_pre' ? (
                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <XCircle size={15} color="#ef4444" /> <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>Asignación rechazada por el administrador.</span>
                    </div>
                  ) : selectedLog.estado === 'enviado' ? (
                    <div style={{ padding: '15px 12px', borderRadius: '10px', background: '#f0fdfa', border: '1px solid #5eead4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                      <CheckCircle2 size={24} color="#0f766e" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#115e59' }}>Esperando respuesta del administrador</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f766e' }}>Tu evidencia ha sido entregada. El administrador validará tus horas pronto.</span>
                    </div>
                  ) : (
                    <div style={{ padding: '10px 12px', borderRadius: '10px', background: selectedLog.estado === 'aprobado' ? '#f0fdf4' : selectedLog.estado === 'rechazado' ? '#fef2f2' : '#fefce8', border: `1px solid ${selectedLog.estado === 'aprobado' ? '#6ee7b7' : selectedLog.estado === 'rechazado' ? '#fca5a5' : '#fde68a'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {selectedLog.estado === 'aprobado'
                        ? <><Check size={15} color="#10b981" /> <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065f46' }}>✓ Horas validadas por el admin</span></>
                        : selectedLog.estado === 'rechazado'
                        ? <><XCircle size={15} color="#ef4444" /> <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b' }}>Reporte rechazado: {selectedLog.motivoRechazo || 'Revisa con el admin'}</span></>
                        : <><Clock size={15} color="#f59e0b" /> <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>⏳ Evidencia en revisión por el admin</span></>
                      }
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-tierra-sombra)', paddingTop: '60px' }}>
                  <ClipboardList size={36} style={{ opacity: 0.2, display: 'block', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '0.85rem' }}>Selecciona una labor para ver detalles</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: NUEVA TAREA ── */}
        {currentTab === 'nueva_tarea' && (
          <div style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.3rem', color: 'var(--color-texto)', textTransform: 'none' }}>Solicitar Tarea</h1>
            <p style={{ color: 'var(--color-tierra-sombra)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              Selecciona una labor en el catálogo para solicitarla. El administrador validará tu solicitud.
            </p>
            <ReporteForm
              user={user}
              busqueda={busqueda}
              onReportSubmitted={() => {
                setCurrentTab('logs');
                cargarLogs(user.id);
              }}
            />
          </div>
        )}

        {/* ── TAB: AYUDA Y SOPORTE ── */}
        {currentTab === 'ayuda' && (
          <div style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.3rem', color: 'var(--color-texto)', textTransform: 'none' }}>Centro de Ayuda</h1>
            <p style={{ color: 'var(--color-tierra-sombra)', fontSize: '0.85rem', margin: '0 0 2rem' }}>Aprende cómo funciona el voluntariado o contacta con el administrador.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-tierra-sombra)', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mini Guía de Uso</h2>
                {[
                  { t: '1. Elige una Tarea', d: 'Ve a "Nueva Tarea", busca en el catálogo y envía tu solicitud al administrador.' },
                  { t: '2. Espera Asignación', d: 'El admin revisará y te dará una fecha. La verás en "Mis Labores" como "Asignada".' },
                  { t: '3. Realiza el Trabajo', d: 'Completa la labor físicamente en el Eco-Corredor según lo acordado.' },
                  { t: '4. Sube tu Evidencia', d: 'Pega el enlace (URL) de la foto de tu trabajo finalizado para que el admin lo valide.' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '1.2rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: SIDEBAR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>{i+1}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-texto)', marginBottom: '4px' }}>{step.t}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-tierra-sombra)', lineHeight: 1.4 }}>{step.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--color-caracola)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-ocre-silvestre)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-texto)', marginBottom: '1rem' }}>Mensaje de Soporte</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-tierra-sombra)', marginBottom: '1.2rem' }}>¿Necesitas ayuda técnica o tienes una duda sobre tu tarea? Escribe aquí al administrador.</p>
                <textarea 
                  placeholder="Escribe tu duda o problema técnico aquí..."
                  style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-ocre-silvestre)', background: 'var(--color-arena)', fontSize: '0.85rem', marginBottom: '1rem' }}
                  id="soporte-msg"
                />
                <button 
                  onClick={async () => {
                    const msg = document.getElementById('soporte-msg').value;
                    if (!msg) return Swal.fire('Error', 'Escribe un mensaje primero', 'warning');
                    try {
                      await services.postReportes({
                        tipo: 'soporte',
                        usuarioId: `vol-${user.id}`,
                        usuarioNombre: user.nombre,
                        asunto: 'Soporte de Voluntariado',
                        contenido: msg,
                        fecha: new Date().toLocaleDateString(),
                        visto: false
                      });
                      Swal.fire('¡Enviado!', 'Tu mensaje ha sido enviado al administrador.', 'success');
                      document.getElementById('soporte-msg').value = '';
                    } catch (e) {
                      Swal.fire('Error', 'No se pudo enviar el mensaje.', 'error');
                    }
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: SIDEBAR_ACTIVE, color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Enviar Mensaje de Soporte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SUBIR EVIDENCIA ── */}
        {currentTab === 'subir_evidencia' && selectedLog && (
          <div style={{ padding: '2rem 1.5rem', overflowY: 'auto' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.3rem', color: 'var(--color-texto)', textTransform: 'none' }}>Entregar Evidencia</h1>
            <p style={{ color: 'var(--color-tierra-sombra)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
              Sube la fotografía de tu labor completada para que se te validen las horas.
            </p>
            <ReporteForm
              user={user}
              tareaAsignada={selectedLog}
              onCancel={() => setCurrentTab('logs')}
              onReportSubmitted={() => {
                setCurrentTab('logs');
                cargarLogs(user.id);
                setSelectedLog(null); // Limpiar selección para forzar refresco visual
              }}
            />
          </div>
        )}

        {/* ── TAB: PERFIL ── */}
        {currentTab === 'perfil' && (
          <div style={{ padding: '2rem 1.5rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.3rem', color: 'var(--color-texto)', textTransform: 'none' }}>Mi Perfil</h1>
            <p style={{ color: 'var(--color-tierra-sombra)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>Administra tu información personal.</p>
            <UserProfile user={user} onUpdateUser={setUser} isProfessionalMode={true} />
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default VolunteerDashboard;
