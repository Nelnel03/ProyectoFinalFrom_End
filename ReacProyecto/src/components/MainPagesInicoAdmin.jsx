import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';

// Icons from lucide-react
import { 
  LayoutDashboard, 
  CheckCircle, 
  Activity, 
  Users, 
  BarChart, 
  Settings, 
  Search, 
  Bell, 
  Monitor, 
  Plus, 
  HelpCircle, 
  LogOut,
  FileText,
  Droplet,
  History,
  List,
  ChevronRight,
  Map as MapIcon,
  ShieldCheck,
  AlertTriangle,
  Leaf
} from 'lucide-react';

import '../styles/Arboles.css';
import '../styles/MainPagesInicoAdmin.css';
import '../styles/PremiumDashboard.css';
import '../styles/AdminControlCenter.css';

import ResumenTab from './admin/ResumenTab';
import ListaTab from './admin/ListaTab';
import BajasTab from './admin/BajasTab';
import UsuariosTab from './admin/UsuariosTab';
import VoluntariadosTab from './admin/VoluntariadosTab';
import DarkModeToggle from './DarkModeToggle';
import ArbolFormTab from './admin/ArbolFormTab';
import BuzonTab from './admin/BuzonTab';
import AyudaTab from './admin/AyudaTab';

const FORM_INICIAL = {
  nombre: '',
  nombreCientifico: '',
  tipo: '', 
  progreso: '0%', 
  familia: '',
  altura: '',
  crecimiento: '',
  clima: 'tropical',
  descripcion: '',
  cuidados: '',
  imagenUrl: '',
  estado: 'vivo',
  fechaRegistro: new Date().toISOString().split('T')[0],
};

const USER_FORM_INICIAL = {
  nombre: '',
  email: '',
  password: '',
  rol: 'user',
  fotoPerfil: ''
};

const VOLUNTARIADO_FORM_INICIAL = {
  nombre: '',
  area: '', 
  email: '',
  telefono: '',
  fechaIngreso: new Date().toISOString().split('T')[0],
  fotoPerfil: ''
};

const ABONO_FORM_INICIAL = {
  nombre: '',
  stock: '',
  unidad: 'kg',
  imagenUrl: ''
};

function MainPagesInicoAdmin() {
  const [adminName, setAdminName] = useState('Administrador');
  const [arboles, setArboles] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [tab, setTab] = useState('resumen'); 
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [modoNuevoTipo, setModoNuevoTipo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [statsTipos, setStatsTipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState(USER_FORM_INICIAL);
  const [modoEdicionUsuario, setModoEdicionUsuario] = useState(false);
  const [idEditandoUsuario, setIdEditandoUsuario] = useState(null);

  const [voluntariados, setVoluntariados] = useState([]);
  const [formVoluntariado, setFormVoluntariado] = useState(VOLUNTARIADO_FORM_INICIAL);
  const [modoEdicionVoluntariado, setModoEdicionVoluntariado] = useState(false);
  const [idEditandoVoluntariado, setIdEditandoVoluntariado] = useState(null);

  const [abonos, setAbonos] = useState([]);
  const [formAbono, setFormAbono] = useState(ABONO_FORM_INICIAL);
  const [modoEdicionAbono, setModoEdicionAbono] = useState(false);
  const [idEditandoAbono, setIdEditandoAbono] = useState(null);

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [busqueda, setBusqueda] = useState(''); 
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('Satellite'); // For the map toggle

  const tiposDisponibles = Array.from(new Set([
    ...arboles.map(a => a.tipo).filter(Boolean).map(t => t.toLowerCase()),
    ...statsTipos.map(s => s.tipo).filter(Boolean).map(t => t.toLowerCase())
  ]));

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    const userData = sessionStorage.getItem('user');

    if (!isAuthenticated || !userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.rol !== 'admin') {
      navigate('/user');
      return;
    }

    setAdminName(user.nombre);
    cargarArboles();
  }, [navigate]);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const [datosArboles, datosStats, datosUsuarios, datosEmpleados, datosAbonos] = await Promise.all([
        services.getArboles(),
        services.getStatsTipos(),
        services.getUsuarios(),
        services.getVoluntariados(),
        services.getAbonos()
      ]);
      setArboles(datosArboles || []);
      setStatsTipos(datosStats || []);
      setUsuarios(datosUsuarios || []);
      setVoluntariados(datosEmpleados || []);
      setAbonos(datosAbonos || []);
    } catch (err) {
      mostrarMensaje('Error al cargar la información.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que deseas salir del panel de administración?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, Salir',
      cancelButtonText: 'Cancelar',
      background: document.body.getAttribute('data-theme') === 'dark' ? '#161b22' : '#fff',
      color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (tab === 'seguimiento' && !tipoFiltro && tiposDisponibles.length > 0) {
      setTipoFiltro(tiposDisponibles[0]);
    }
  }, [tab, tiposDisponibles, tipoFiltro]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const trimmedNombre = formUsuario.nombre.trim();
    const trimmedEmail = formUsuario.email.trim();
    const trimmedPassword = formUsuario.password.trim();

    if (!trimmedNombre || !trimmedEmail || (!modoEdicionUsuario && !trimmedPassword)) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (trimmedNombre.length < 3) {
      Swal.fire('Error', 'El nombre es demasiado corto', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire('Error', 'El formato del correo es incorrecto', 'error');
      return;
    }
    
    try {
      if (modoEdicionUsuario) {
        await services.putUsuarios({ ...formUsuario, nombre: trimmedNombre, email: trimmedEmail }, idEditandoUsuario);
        Swal.fire('Éxito', 'Usuario actualizado', 'success');
      } else {
        await services.postUsuarios({ ...formUsuario, nombre: trimmedNombre, email: trimmedEmail, status: 'active' });
        Swal.fire('Éxito', 'Usuario creado', 'success');
      }
      resetFormUsuario();
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
    }
  };

  const handleEditarUsuario = (user) => {
    setFormUsuario(user);
    setModoEdicionUsuario(true);
    setIdEditandoUsuario(user.id);
    setTab('usuarios');
    setTimeout(() => {
      document.getElementById('user-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBanUsuario = async (id, nombre) => {
    const { value: motivo } = await Swal.fire({
      title: '¿Confirmar cancelación?',
      text: `Ingresa el motivo para cancelar la cuenta de "${nombre}":`,
      input: 'textarea',
      inputPlaceholder: 'Indica por qué se cancela...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      inputValidator: (value) => {
        if (!value) return 'Debes proporcionar un motivo';
      }
    });

    if (motivo) {
      try {
        const user = usuarios.find(u => u.id === id);
        await services.putUsuarios({ ...user, status: 'banned', motivoBan: motivo }, id);
        Swal.fire('Cancelado', 'La cuenta ha sido cancelada', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo cancelar la cuenta', 'error');
      }
    }
  };

  const handleActivarUsuario = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Reactivar usuario?',
      text: `¿Deseas reactivar la cuenta de "${nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar'
    });

    if (confirm.isConfirmed) {
      try {
        const user = usuarios.find(u => u.id === id);
        const userActivo = { ...user, status: 'active' };
        delete userActivo.motivoBan;
        await services.putUsuarios(userActivo, id);
        Swal.fire('Reactivado', 'Usuario activado', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo reactivar la cuenta', 'error');
      }
    }
  };

  const resetFormUsuario = () => {
    setFormUsuario(USER_FORM_INICIAL);
    setModoEdicionUsuario(false);
    setIdEditandoUsuario(null);
  };

  const handleVoluntariadoSubmit = async (e) => {
    e.preventDefault();
    
    if (!formVoluntariado.nombre.trim() || !formVoluntariado.email.trim() || !formVoluntariado.telefono.trim()) {
      Swal.fire('Validación', 'Por favor completa los campos obligatorios', 'warning');
      return;
    }

    if (formVoluntariado.telefono.length < 8) {
      Swal.fire('Error', 'El número de teléfono debe tener al menos 8 dígitos', 'error');
      return;
    }

    try {
      if (modoEdicionVoluntariado) {
        await services.putVoluntariados(formVoluntariado, idEditandoVoluntariado);
        Swal.fire('Éxito', 'Voluntario actualizado', 'success');
      } else {
        await services.postVoluntariados({ ...formVoluntariado, rol: 'voluntario', password: 'Voluntario123', debeCambiarPassword: true });
        Swal.fire('Registrado', 'Voluntario creado. Pwd temporal: Voluntario123', 'success');
      }
      resetFormVoluntariado();
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo gestionar el voluntariado', 'error');
    }
  };

  const handleEditarVoluntariado = (vol) => {
    setFormVoluntariado(vol);
    setModoEdicionVoluntariado(true);
    setIdEditandoVoluntariado(vol.id);
    setTab('voluntariados');
    setTimeout(() => {
      document.getElementById('voluntariado-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEliminarVoluntariado = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Dar de baja?',
      text: `¿Eliminar a "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteVoluntariados(id);
        Swal.fire('Eliminado', 'Voluntario eliminado', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const resetFormVoluntariado = () => {
    setFormVoluntariado(VOLUNTARIADO_FORM_INICIAL);
    setModoEdicionVoluntariado(false);
    setIdEditandoVoluntariado(null);
  };

  const handleConvertirUsuarioAVoluntariado = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Convertir a Voluntario',
      html: `<input id="swal-input1" class="swal2-input" placeholder="Área">
             <input id="swal-input2" class="swal2-input" placeholder="Teléfono" maxlength="8">`,
      preConfirm: () => ({ 
        area: document.getElementById('swal-input1').value, 
        telefono: document.getElementById('swal-input2').value 
      })
    });

    if (formValues && formValues.area && formValues.telefono) {
      try {
        await services.putUsuarios({ 
          ...user, 
          rol: 'voluntario', 
          area: formValues.area, 
          telefono: formValues.telefono, 
          fechaIngreso: new Date().toISOString().split('T')[0] 
        }, user.id);
        Swal.fire('Éxito', `${user.nombre} ahora es voluntario`, 'success');
        setTab('voluntariados');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'Conversión fallida', 'error');
      }
    }
  };

  const handleConvertirVoluntariadoAUsuario = async (vol) => {
    const { value: password } = await Swal.fire({
      title: 'Convertir a Usuario',
      input: 'password',
      inputPlaceholder: 'Contraseña nueva',
      inputValidator: (v) => !v && 'Debes ingresar una contraseña'
    });

    if (password) {
      try {
        const updated = { ...vol, password, rol: 'user' };
        delete updated.area; delete updated.telefono; delete updated.fechaIngreso;
        await services.putUsuarios(updated, vol.id);
        Swal.fire('Éxito', `${vol.nombre} ahora es usuario normal`, 'success');
        setTab('usuarios');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'Conversión fallida', 'error');
      }
    }
  };

  const handleUpdateStatTipo = async (tipo, field, value) => {
    try {
      const tipoLower = tipo.toLowerCase();
      const existingStat = statsTipos.find(s => s.tipo.toLowerCase() === tipoLower);
      if (existingStat) {
        await services.putStatsTipos({ ...existingStat, [field]: parseInt(value) || 0 }, existingStat.id);
      } else {
        await services.postStatsTipos({ tipo: tipoLower, planificados: field === 'planificados' ? parseInt(value) : 0, muertos: field === 'muertos' ? parseInt(value) : 0 });
      }
      const nuevosStats = await services.getStatsTipos();
      setStatsTipos(nuevosStats);
    } catch (e) {
      mostrarMensaje('Error al actualizar estadísticas.', 'error');
    }
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    Swal.fire({ title: texto, icon: tipo, timer: 3000, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const resetFormAbono = () => { setFormAbono(ABONO_FORM_INICIAL); setModoEdicionAbono(false); setIdEditandoAbono(null); };

  const handleLimpiarHistorialAbono = async (arbol) => {
    if ((await Swal.fire({ title: '¿Limpiar historial?', showCancelButton: true })).isConfirmed) {
      try {
        await services.putArboles({ ...arbol, historialAbono: [] }, arbol.id);
        await cargarArboles();
      } catch (e) { Swal.fire('Error', 'No se pudo limpiar historial', 'error'); }
    }
  };

  const handleAbonoSubmit = async (e) => {
    e.preventDefault();
    if (!formAbono.nombre.trim() || !formAbono.stock) {
      Swal.fire('Error', 'Nombre y Stock son requeridos', 'error');
      return;
    }
    try {
      if (modoEdicionAbono) await services.putAbonos(formAbono, idEditandoAbono);
      else await services.postAbonos(formAbono);
      resetFormAbono(); await cargarArboles();
    } catch (err) { Swal.fire('Error', 'No se pudo guardar abono', 'error'); }
  };

  const handleEditarAbono = (abono) => { setFormAbono(abono); setModoEdicionAbono(true); setIdEditandoAbono(abono.id); setTab('abonos'); };

  const handleEliminarAbono = async (id, nombre) => {
    if ((await Swal.fire({ title: `¿Eliminar "${nombre}"?`, showCancelButton: true })).isConfirmed) {
      try { await services.deleteAbonos(id); await cargarArboles(); }
      catch (err) { Swal.fire('Error', 'Error al eliminar', 'error'); }
    }
  };

  const handleAbonarArbol = async (arbol) => {
    if (abonos.length === 0) return;
    const { value: abonoId } = await Swal.fire({
      title: 'Aplicar Abono',
      input: 'select',
      inputOptions: abonos.reduce((a, c) => { a[c.id] = `${c.nombre} (${c.stock} ${c.unidad})`; return a; }, {}),
      showCancelButton: true
    });
    if (abonoId) {
      try {
        const abono = abonos.find(a => a.id === abonoId);
        await services.putAbonos({ ...abono, stock: abono.stock - 1 }, abonoId);
        const nuevoHist = { abono: abono.nombre, fecha: new Date().toISOString().split('T')[0], idAbono: abonoId };
        await services.putArboles({ ...arbol, historialAbono: [...(arbol.historialAbono || []), nuevoHist] }, arbol.id);
        await cargarArboles();
      } catch (e) { Swal.fire('Error', 'Error al abonar', 'error'); }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipoSelector' && value === '___nuevo___') { setModoNuevoTipo(true); setForm({ ...form, tipo: '' }); return; }
    if (name === 'tipoSelector') { setModoNuevoTipo(false); setForm({ ...form, tipo: value }); return; }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.tipo) {
      Swal.fire('Atención', 'Nombre y Tipo son obligatorios', 'warning');
      return;
    }
    try {
      if (modoEdicion) await services.putArboles(form, idEditando);
      else await services.postArboles(form);
      resetForm(); setTab('lista'); await cargarArboles();
    } catch (err) { Swal.fire('Error', 'Error al guardar árbol', 'error'); }
  };

  const handleEditar = (arbol) => { setForm({ ...FORM_INICIAL, ...arbol }); setModoEdicion(true); setIdEditando(arbol.id); setTab('agregar'); };

  const handleEliminar = async (arbol) => {
    if ((await Swal.fire({ title: `¿Eliminar "${arbol.nombre}"?`, showCancelButton: true, icon: 'warning' })).isConfirmed) {
      try { await services.deleteArboles(arbol.id); await cargarArboles(); }
      catch (err) { Swal.fire('Error', 'Error al eliminar', 'error'); }
    }
  };

  const handleEliminarTipo = async (tipoDelete) => {
    if ((await Swal.fire({ title: `¿Eliminar tipo "${tipoDelete}"?`, showCancelButton: true })).isConfirmed) {
      try {
        const aBorrar = arboles.filter(a => (a.tipo || '').toLowerCase() === tipoDelete.toLowerCase());
        await Promise.all(aBorrar.map(a => services.deleteArboles(a.id)));
        const stat = statsTipos.find(s => s.tipo.toLowerCase() === tipoDelete.toLowerCase());
        if (stat) await services.deleteStatsTipos(stat.id);
        await cargarArboles(); setTab('lista');
      } catch(e) { Swal.fire('Error', 'Error al eliminar registros', 'error'); }
    }
  };

  const resetForm = () => { setForm({ ...FORM_INICIAL, fechaRegistro: new Date().toISOString().split('T')[0] }); setModoEdicion(false); setIdEditando(null); setModoNuevoTipo(false); };

  const sidebarLinks = [
    { id: 'resumen', label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users },
    { id: 'lista', label: 'Catálogo de Especies', icon: List },
    { id: 'bajas', label: 'Historial de Bajas', icon: History },
    { id: 'voluntariados', label: 'Validación de Especies', icon: CheckCircle },
    { id: 'abonos', label: 'Salud del Hábitat', icon: Activity },
    { id: 'buzon', label: 'Buzón / Reportes', icon: FileText },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Section */}
      <aside className="admin-sidebar">
        <div className="admin-logo-section">
          <div className="admin-logo-icon">
            <Leaf size={20} />
          </div>
          <div className="admin-logo-text">
            <h2>BioMon ADI</h2>
            <span>Plano de Control Administrativo</span>
          </div>
        </div>

        <nav className="admin-nav">
          {sidebarLinks.map(link => (
            <button 
              key={link.id}
              className={`admin-nav-item ${tab === link.id ? 'active' : ''}`}
              onClick={() => { setTab(link.id); resetForm(); resetFormUsuario(); }}
            >
              <link.icon size={18} />
              <span className="nav-label">{link.label}</span>
            </button>
          ))}
          
          <button 
            className={`admin-nav-item ${tab === 'agregar' ? 'active' : ''}`}
            onClick={() => { setTab('agregar'); resetForm(); }}
          >
            <Settings size={18} />
            <span className="nav-label">Configuración General</span>
          </button>
        </nav>

        <button className="admin-new-obs-btn" onClick={() => setTab('agregar')}>
          <Plus size={18} />
          <span>Nueva Observación</span>
        </button>

        <div className="admin-sidebar-footer">
          <div className={`admin-footer-link ${tab === 'ayuda' ? 'active-text' : ''}`} onClick={() => setTab('ayuda')}>
            <HelpCircle size={16} />
            <span>Centro de Ayuda</span>
          </div>
          <div className="admin-footer-link" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1>Centro de Control Administrativo</h1>
          </div>
          
          <div className="admin-topbar-right">
            <div className="admin-search-container">
              <Search className="admin-search-icon" size={16} />
              <input 
                type="text" 
                placeholder="Buscar datos, observadores o especies..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="admin-topbar-icons">
               <DarkModeToggle />
               <Bell size={20} className="admin-icon-btn" />
               <Monitor size={20} className="admin-icon-btn" />
            </div>

            <div className="admin-profile-pill">
              <span>Perfil Admin</span>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=32&q=80" 
                alt="Perfil" 
                className="admin-avatar-small"
              />
            </div>
          </div>
        </header>

        {/* Tab Specific Rendering */}
        <section className="admin-content-view">
          {tab === 'resumen' && (
            <div className="overview-dashboard">
              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon-box green"><Activity size={20} /></div>
                    <div className="admin-stat-badge green">Óptimo</div>
                  </div>
                  <div className="admin-stat-label">Sensores Activos</div>
                  <div className="admin-stat-value">94%</div>
                  <div className="admin-stat-subtitle">112 de 120 nodos operativos</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon-box green"><MapIcon size={20} /></div>
                  </div>
                  <div className="admin-stat-label">Hectáreas Protegidas</div>
                  <div className="admin-stat-value">{(arboles.length * 0.5).toFixed(2)} <span>ha</span></div>
                  <div className="admin-stat-subtitle">+12ha desde el último mes</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon-box blue"><FileText size={20} /></div>
                  </div>
                  <div className="admin-stat-label">Peticiones Pendientes</div>
                  <div className="admin-stat-value">{usuarios.filter(u => u.status === 'banned').length}</div>
                  <div className="admin-stat-subtitle">Reportes que requieren atención</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-header">
                    <div className="admin-stat-icon-box red"><AlertTriangle size={20} /></div>
                  </div>
                  <div className="admin-stat-label">Alertas de Hábitat</div>
                  <div className="admin-stat-value">{arboles.filter(a => a.estado === 'muerto').length} <span>activas</span></div>
                  <div className="admin-stat-subtitle">Zonas críticas identificadas</div>
                </div>
              </div>

              {/* Middle Section GRID */}
              <div className="admin-middle-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Monitoreo Espacial</h3>
                    <div className="admin-header-actions">
                      <button className={`admin-toggle-btn ${viewMode === 'Satellite' ? 'active' : ''}`} onClick={() => setViewMode('Satellite')}>Vista Satelital</button>
                      <button className={`admin-toggle-btn ${viewMode === 'Sensors' ? 'active' : ''}`} onClick={() => setViewMode('Sensors')}>Capa de Sensores</button>
                    </div>
                  </div>
                  <div className="admin-map-container">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Vista del Mapa" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="admin-map-overlay-info">
                       <div><span className="admin-map-dot" style={{ backgroundColor: '#22c55e' }}></span> Sector Norte: Estable</div>
                       <div><span className="admin-map-dot" style={{ backgroundColor: '#ef4444' }}></span> Cuenca del Río: Emergencia</div>
                    </div>
                    <div className="admin-map-zoom">
                      <button className="admin-zoom-btn">+</button>
                      <button className="admin-zoom-btn">-</button>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Por Validar</h3>
                  </div>
                  <div className="admin-v-list">
                    {arboles.slice(0, 4).map((arbol, idx) => (
                      <div className="admin-v-item" key={idx}>
                        <img src={arbol.imagenUrl || 'https://via.placeholder.com/50'} className="admin-v-img" alt="Specimen" />
                        <div className="admin-v-info">
                          <p className="admin-v-name">{arbol.nombre}</p>
                          <p className="admin-v-meta">Por {arbol.tipo || 'Sistema'} • hace {idx + 1}h</p>
                        </div>
                        <span className={`admin-v-badge ${idx % 2 === 0 ? 'pending' : 'verified'}`}>
                          {idx % 2 === 0 ? 'PENDIENTE' : 'VERIFICADO'}
                        </span>
                      </div>
                    ))}
                    <button className="admin-v-all-btn" onClick={() => setTab('lista')}>Ver cola de validaciones</button>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="admin-bottom-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Tendencia de Diversidad de Especies</h3>
                  </div>
                  <div className="admin-chart-placeholder">
                    <div className="admin-chart-bar" style={{ height: '40%' }} data-month="Ene"></div>
                    <div className="admin-chart-bar" style={{ height: '55%' }} data-month="Feb"></div>
                    <div className="admin-chart-bar" style={{ height: '45%' }} data-month="Mar"></div>
                    <div className="admin-chart-bar" style={{ height: '70%' }} data-month="Abr"></div>
                    <div className="admin-chart-bar" style={{ height: '85%' }} data-month="May"></div>
                    <div className="admin-chart-bar" style={{ height: '100%' }} data-month="Jun"></div>
                  </div>
                </div>

                <div className="admin-card admin-health-card">
                  <div>
                    <h3>Índice de Salud Hábitat</h3>
                    <p>La conectividad biológica está en su punto más alto en 3 años.</p>
                  </div>
                  <div className="admin-health-value">8.4 <span>/ 10</span></div>
                </div>

                <div className="admin-card admin-carbon-card">
                  <div>
                    <h3>Secuestro de Carbono</h3>
                    <p>Compensación anual estimada para el área actual.</p>
                  </div>
                  <div className="admin-carbon-value">14.2k <span className="admin-carbon-unit">Tons / Año</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="tab-render-area">
            {tab === 'lista' && <ListaTab busqueda={busqueda} setBusqueda={setBusqueda} tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro} tiposDisponibles={tiposDisponibles} setTab={setTab} handleEliminarTipo={handleEliminarTipo} statsTipos={statsTipos} handleUpdateStatTipo={handleUpdateStatTipo} arboles={arboles} cargando={cargando} handleEditar={handleEditar} handleAbonarArbol={handleAbonarArbol} handleEliminar={handleEliminar} handleLimpiarHistorialAbono={handleLimpiarHistorialAbono} />}
            {tab === 'bajas' && <BajasTab arboles={arboles} handleEditar={handleEditar} />}
            {tab === 'usuarios' && <UsuariosTab modoEdicionUsuario={modoEdicionUsuario} handleUserSubmit={handleUserSubmit} formUsuario={formUsuario} setFormUsuario={setFormUsuario} resetFormUsuario={resetFormUsuario} usuarios={usuarios} handleEditarUsuario={handleEditarUsuario} handleBanUsuario={handleBanUsuario} handleActivarUsuario={handleActivarUsuario} handleConvertirUsuarioAVoluntariado={handleConvertirUsuarioAVoluntariado} />}
            {tab === 'voluntariados' && <VoluntariadosTab modoEdicionVoluntariado={modoEdicionVoluntariado} handleVoluntariadoSubmit={handleVoluntariadoSubmit} formVoluntariado={formVoluntariado} setFormVoluntariado={setFormVoluntariado} resetFormVoluntariado={resetFormVoluntariado} voluntariados={voluntariados} handleEditarVoluntariado={handleEditarVoluntariado} handleEliminarVoluntariado={handleEliminarVoluntariado} handleConvertirVoluntariadoAUsuario={handleConvertirVoluntariadoAUsuario} />}
            {tab === 'abonos' && <AbonosTab modoEdicionAbono={modoEdicionAbono} handleAbonoSubmit={handleAbonoSubmit} formAbono={formAbono} setFormAbono={setFormAbono} resetFormAbono={resetFormAbono} abonos={abonos} handleEditarAbono={handleEditarAbono} handleEliminarAbono={handleEliminarAbono} />}
            {tab === 'buzon' && <BuzonTab /> }
            {tab === 'agregar' && <ArbolFormTab modoEdicion={modoEdicion} handleSubmit={handleSubmit} form={form} handleChange={handleChange} modoNuevoTipo={modoNuevoTipo} tiposDisponibles={tiposDisponibles} setModoNuevoTipo={setModoNuevoTipo} setForm={setForm} resetForm={resetForm} setTab={setTab} /> }
            {tab === 'ayuda' && <AyudaTab /> }
          </div>
        </section>

        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--admin-border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af' }}>
           <div>© 2026 BioMon ADI | Administración • Última actualización: hace 1 minuto</div>
           <div style={{ display: 'flex', gap: '20px' }}>
             <span>Protocolo de Privacidad</span>
             <span>Estado de Red de Sensores</span>
             <span>Documentación API</span>
           </div>
        </footer>
      </div>
    </div>
  );
}

export default MainPagesInicoAdmin;