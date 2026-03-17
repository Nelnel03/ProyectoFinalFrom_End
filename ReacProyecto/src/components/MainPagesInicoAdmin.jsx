import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import '../styles/Arboles.css';

const TIPOS_ARBOLES = [
  'mimbro',
  'almendro de playa',
  'palmera',
  'poshote',
  'espabel',
  'palma de coyol'
];

const FORM_INICIAL = {
  nombre: '',
  nombreCientifico: '',
  tipo: 'mimbro', // Nuevo campo para categorizar
  progreso: '0%', // Nuevo campo para seguimiento
  familia: '',
  altura: '',
  crecimiento: '',
  clima: '',
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
  rol: 'user'
};

function MainPagesInicoAdmin() {
  const [adminName, setAdminName] = useState('Administrador');
  const [arboles, setArboles] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tab, setTab] = useState('resumen'); // 'lista' | 'agregar' | 'seguimiento' | 'resumen' | 'bajas' | 'usuarios'
  const [tipoFiltro, setTipoFiltro] = useState('mimbro');
  const [modoNuevoTipo, setModoNuevoTipo] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [statsTipos, setStatsTipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formUsuario, setFormUsuario] = useState(USER_FORM_INICIAL);
  const [modoEdicionUsuario, setModoEdicionUsuario] = useState(false);
  const [idEditandoUsuario, setIdEditandoUsuario] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  const tiposDisponibles = Array.from(new Set([
    ...TIPOS_ARBOLES,
    ...arboles.map(a => a.tipo).filter(Boolean).map(t => t.toLowerCase())
  ]));

  // ── Autenticación y carga inicial ───────────────────────────────────────────
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

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
      const [datosArboles, datosStats, datosUsuarios] = await Promise.all([
        services.getArboles(),
        services.getStatsTipos(),
        services.getUsuarios()
      ]);
      setArboles(datosArboles || []);
      setStatsTipos(datosStats || []);
      setUsuarios(datosUsuarios || []);
    } catch (err) {
      mostrarMensaje('Error al cargar la información.', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    const action = modoEdicionUsuario ? 'actualizar' : 'crear';
    const confirm = await Swal.fire({
      title: `¿Confirmar ${action}?`,
      text: `¿Estás seguro de que quieres ${action} al usuario "${formUsuario.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      if (modoEdicionUsuario) {
        await services.putUsuarios(formUsuario, idEditandoUsuario);
        mostrarMensaje('Usuario actualizado correctamente');
      } else {
        await services.postUsuarios(formUsuario);
        mostrarMensaje('Usuario creado correctamente');
      }
      resetFormUsuario();
      await cargarArboles();
    } catch (err) {
      mostrarMensaje('Error al procesar el usuario', 'error');
    }
  };

  const handleEditarUsuario = (user) => {
    setFormUsuario(user);
    setModoEdicionUsuario(true);
    setIdEditandoUsuario(user.id);
  };

  const handleEliminarUsuario = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Esta acción eliminará permanentemente al usuario "${nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteUsuarios(id);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  const resetFormUsuario = () => {
    setFormUsuario(USER_FORM_INICIAL);
    setModoEdicionUsuario(false);
    setIdEditandoUsuario(null);
  };

  const handleUpdateStatTipo = async (tipo, field, value) => {
    try {
      const tipoLower = tipo.toLowerCase();
      const existingStat = statsTipos.find(s => s.tipo.toLowerCase() === tipoLower);
      
      if (existingStat) {
        const updatedStat = { ...existingStat, [field]: parseInt(value) || 0 };
        await services.putStatsTipos(updatedStat, existingStat.id);
      } else {
        const newStat = {
          tipo: tipoLower,
          planificados: field === 'planificados' ? parseInt(value) || 0 : 0,
          muertos: field === 'muertos' ? parseInt(value) || 0 : 0
        };
        await services.postStatsTipos(newStat);
      }
      // Recargar para sincronizar
      const nuevosStats = await services.getStatsTipos();
      setStatsTipos(nuevosStats);
      mostrarMensaje(`Estadísticas de "${tipo}" actualizadas.`);
    } catch (e) {
      mostrarMensaje('Error al actualizar estadísticas del tipo.', 'error');
    }
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
  };

  // ── Handlers del formulario ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tipoSelector' && value === '___nuevo___') {
      setModoNuevoTipo(true);
      setForm({ ...form, tipo: '' });
      return;
    } else if (name === 'tipoSelector') {
      setModoNuevoTipo(false);
      // Rellenado automático si existe el tipo
      const existingArbol = arboles.find(a => (a.tipo || 'mimbro').toLowerCase() === value.toLowerCase());
      if (existingArbol && !modoEdicion) {
         setForm({
            ...form,
            tipo: value,
            nombre: existingArbol.nombre || '',
            nombreCientifico: existingArbol.nombreCientifico || '',
            familia: existingArbol.familia || '',
            altura: existingArbol.altura || '',
            crecimiento: existingArbol.crecimiento || '',
            clima: existingArbol.clima || '',
            descripcion: existingArbol.descripcion || '',
            cuidados: existingArbol.cuidados || '',
            imagenUrl: existingArbol.imagenUrl || '',
         });
         return;
      }
      setForm({ ...form, tipo: value });
      return;
    }
    
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      mostrarMensaje('El nombre del árbol es obligatorio.', 'error');
      return;
    }

    try {
      let savedTreeId = null;

      if (modoEdicion) {
        const arbolOriginal = arboles.find(a => a.id === idEditando);
        const estadoAnterior = arbolOriginal?.estado;
        const nuevoEstado = form.estado;
        const tipoKey = (form.tipo || 'mimbro').toLowerCase();

        const arbolActualizado = { 
          ...form, 
          fechaMuerto: nuevoEstado === 'muerto' ? (estadoAnterior === 'muerto' ? arbolOriginal.fechaMuerto : new Date().toISOString().split('T')[0]) : null
        };

        // Actualizar el árbol
        await services.putArboles(arbolActualizado, idEditando);
        savedTreeId = idEditando;

        // Lógica de estadísticas si el estado cambió hacia o desde "muerto"
        if (estadoAnterior !== nuevoEstado) {
          const currentStat = statsTipos.find(s => s.tipo === tipoKey);
          
          if (nuevoEstado === 'muerto' && estadoAnterior !== 'muerto') {
            const newDeadCount = (currentStat?.muertos || 0) + 1;
            await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
          } else if (nuevoEstado !== 'muerto' && estadoAnterior === 'muerto') {
            const newDeadCount = Math.max(0, (currentStat?.muertos || 0) - 1);
            await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
          }
        }
        
        mostrarMensaje(`✅ Árbol "${form.nombre}" actualizado correctamente.`);
      } else {
        const arbolConFecha = {
          ...form,
          fechaMuerto: form.estado === 'muerto' ? new Date().toISOString().split('T')[0] : null
        };
        const result = await services.postArboles(arbolConFecha);
        savedTreeId = result?.id; 

        // Si se agrega como muerto desde el principio, incrementamos estadística
        if (form.estado === 'muerto') {
          const tipoKey = (form.tipo || 'mimbro').toLowerCase();
          const currentStat = statsTipos.find(s => s.tipo === tipoKey);
          const newDeadCount = (currentStat?.muertos || 0) + 1;
          await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
        }

        mostrarMensaje(`✅ Árbol "${form.nombre}" agregado correctamente.`);
      }

      // Auto-guardar la info genérica para todos los árboles de este menú tipo
      const genericFieldsKeys = [
        'nombre', 'nombreCientifico', 'familia', 'altura', 
        'crecimiento', 'clima', 'descripcion', 'cuidados', 'imagenUrl'
      ];
      
      const tipoDelArbol = (form.tipo || 'mimbro').toLowerCase();
      // Buscamos a los demás árboles de este tipo para aplicarles los mismos datos genéricos
      const otrosArboles = arboles.filter(a => 
         (a.tipo || 'mimbro').toLowerCase() === tipoDelArbol && a.id !== savedTreeId
      );

      if (otrosArboles.length > 0) {
         // Hacemos el request Put por cada uno simultaneamente
         await Promise.all(otrosArboles.map(arbolViejto => {
            const arbolActualizado = { ...arbolViejto };
            genericFieldsKeys.forEach(key => {
               arbolActualizado[key] = form[key];
            });
            // Respetamos su estado, progreso, id y fechaRegistro per-se
            return services.putArboles(arbolActualizado, arbolViejto.id);
         }));
      }

      resetForm();
      setTab('lista');
      await cargarArboles();
    } catch (err) {
      mostrarMensaje('Error al guardar el árbol. Revise la conexión.', 'error');
    }
  };

  const handleEditar = (arbol) => {
    setForm({ ...FORM_INICIAL, ...arbol });
    setModoEdicion(true);
    setIdEditando(arbol.id);
    setTab('agregar');
  };

  const handleEliminar = async (arbol) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el árbol "${arbol.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await services.deleteArboles(arbol.id);
      Swal.fire('¡Eliminado!', `El árbol "${arbol.nombre}" ha sido eliminado.`, 'success');
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo eliminar el árbol.', 'error');
    }
  };

  const handleEliminarTipo = async (tipoDelete) => {
     const arbolesDeEseTipo = arboles.filter(a => (a.tipo || 'mimbro').toLowerCase() === tipoDelete.toLowerCase());
     
     if (arbolesDeEseTipo.length === 0) {
        Swal.fire('Información', 'No existen árboles de este tipo para eliminar.', 'info');
        return;
     }

     const result = await Swal.fire({
        title: '⚠️ ¿Eliminar todo un tipo?',
        text: `Estás a punto de eliminar un total de ${arbolesDeEseTipo.length} árboles del tipo "${tipoDelete}". ¡Esta acción es irreversible y borrará todo su historial!`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, arrasar con todo',
        cancelButtonText: 'Mejor no'
     });

     if (result.isConfirmed) {
        setCargando(true);
        try {
           // Borrar cada árbol de la lista
           await Promise.all(arbolesDeEseTipo.map(ar=> services.deleteArboles(ar.id)));
           Swal.fire('Destruido', `Se han eliminado los ${arbolesDeEseTipo.length} árboles de tipo "${tipoDelete}".`, 'success');
           
           // Cambiar de vista si no hay más
           setTipoFiltro('mimbro');
           setTab('lista');
           await cargarArboles();
        } catch(e) {
           Swal.fire('Error de red', 'No se pudieron eliminar todos los registros.', 'error');
        } finally {
           setCargando(false);
        }
     }
  };

  const resetForm = () => {
    setForm({
      ...FORM_INICIAL,
      fechaRegistro: new Date().toISOString().split('T')[0],
    });
    setModoEdicion(false);
    setIdEditando(null);
    setModoNuevoTipo(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1>🌳 Panel de Administración</h1>
          <p>Bienvenido, <strong>{adminName}</strong> — Gestión de especies forestales</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </header>

      <main className="admin-main">
        {/* Mensaje de feedback */}
        {mensaje.texto && (
          <div className={`admin-msg ${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        {/* Tabs de navegación */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'resumen' ? 'active' : ''}`}
            onClick={() => { setTab('resumen'); resetForm(); }}
          >
            📊 Resumen General
          </button>
          <button
            className={`admin-tab ${tab === 'lista' ? 'active' : ''}`}
            onClick={() => { setTab('lista'); resetForm(); }}
          >
            📋 Lista de Árboles ({arboles.filter(a => a.estado !== 'muerto').length})
          </button>
          <button
            className={`admin-tab ${tab === 'bajas' ? 'active' : ''}`}
            onClick={() => { setTab('bajas'); resetForm(); }}
          >
            🍂 Registro de Bajas ({arboles.filter(a => a.estado === 'muerto').length})
          </button>
          <button
            className={`admin-tab ${tab === 'usuarios' ? 'active' : ''}`}
            onClick={() => { setTab('usuarios'); resetFormUsuario(); }}
          >
            👥 Gestión Usuarios
          </button>
          <button
            className={`admin-tab ${tab === 'agregar' ? 'active' : ''}`}
            onClick={() => { setTab('agregar'); resetForm(); }}
          >
            {modoEdicion ? '✏️ Editar Árbol' : '➕ Agregar Árbol'}
          </button>
          <button
            className={`admin-tab ${tab === 'seguimiento' ? 'active' : ''}`}
            onClick={() => { setTab('seguimiento'); resetForm(); }}
          >
            🌱 Seguimiento por Tipo
          </button>
        </div>

        {/* ──── TAB: RESUMEN ──── */}
        {tab === 'resumen' && (
          <div className="admin-resumen-container">
            <div className="admin-section-header">
               <h2>Estadísticas de la Plantación</h2>
               <p style={{ color: '#66937a' }}>Distribución total de especies en el sistema</p>
            </div>

            <div className="admin-stats-grid">
               <div className="admin-stat-main-card">
                  <span className="admin-stat-icon">🌲</span>
                  <div className="admin-stat-info">
                     <h3>{arboles.length}</h3>
                     <p>Censo Total</p>
                  </div>
               </div>

               <div className="admin-stat-main-card" style={{ borderColor: '#60a5fa' }}>
                  <span className="admin-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>🌿</span>
                  <div className="admin-stat-info">
                     <h3>{tiposDisponibles.length}</h3>
                     <p>Especies/Tipos</p>
                  </div>
               </div>
            </div>

            <div className="admin-types-breakdown">
               <h3>Desglose por Tipo de Árbol</h3>
               <div className="admin-types-grid">
                  {tiposDisponibles.map(tipo => {
                     const aliveCount = arboles.filter(a => (a.tipo || 'mimbro').toLowerCase() === tipo.toLowerCase() && a.estado !== 'muerto').length;
                     const stat = statsTipos.find(s => s.tipo === tipo.toLowerCase());
                     return (
                        <div key={tipo} className="admin-type-stat-card">
                           <div className="admin-type-stat-header">
                              <span className="admin-type-name">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                              <span className="admin-type-count" title="Árboles vivos">{aliveCount}</span>
                           </div>
                           <div className="admin-type-progress-bar">
                              <div 
                                 className="admin-type-progress-fill" 
                                 style={{ width: `${arboles.length > 0 ? (aliveCount / arboles.length) * 100 : 0}%` }}
                              ></div>
                           </div>
                           <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', marginBottom: '1rem', color: '#86bfa4' }}>
                              <span>📋 Plan: {stat?.planificados || 0}</span>
                              <span style={{ color: '#fca5a5' }}>🍂 Muerto: {stat?.muertos || 0}</span>
                           </div>
                           <p className="admin-type-percentage">
                              {arboles.length > 0 ? ((aliveCount / arboles.length) * 100).toFixed(1) : 0}% de vitalidad global
                           </p>
                           <button 
                              className="admin-type-view-btn"
                              onClick={() => {
                                 setTipoFiltro(tipo);
                                 setTab('seguimiento');
                              }}
                           >
                              Ver detalles →
                           </button>
                        </div>
                     );
                  })}
               </div>
            </div>
          </div>
        )}

        {/* ──── TAB: LISTA ──── */}
        {tab === 'lista' && (
          <div>
            <div className="admin-section-header">
              <h2>Especies Registradas</h2>
              <button className="admin-add-btn" onClick={() => setTab('agregar')}>
                ➕ Nuevo Árbol
              </button>
            </div>

            {cargando ? (
              <div style={{ textAlign: 'center', color: '#86bfa4', padding: '3rem' }}>
                Cargando árboles...
              </div>
            ) : arboles.filter(a => a.estado !== 'muerto').length === 0 ? (
              <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem', fontSize: '1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌲</div>
                <p>No hay árboles activos registrados. ¡Agrega el primero!</p>
              </div>
            ) : (
              <div className="admin-arboles-lista">
                {arboles.filter(a => a.estado !== 'muerto').map((arbol) => (
                  <div key={arbol.id} className="admin-arbol-card">
                    {arbol.imagenUrl ? (
                      <img
                        src={arbol.imagenUrl}
                        alt={arbol.nombre}
                        className="admin-arbol-card-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="admin-arbol-card-img-placeholder"
                      style={{ display: arbol.imagenUrl ? 'none' : 'flex' }}
                    >
                      🌳
                    </div>

                    <div className="admin-arbol-card-body">
                      <p className="admin-arbol-card-nombre">{arbol.nombre}</p>
                      <p className="admin-arbol-card-cientifico">
                        {arbol.nombreCientifico || '—'}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#66937a', marginBottom: '0.8rem' }}>
                        {arbol.clima ? `🌍 ${arbol.clima}` : ''}{' '}
                        {arbol.altura ? `• 📏 ${arbol.altura}` : ''}
                      </p>
                      <div className="admin-arbol-card-actions">
                        <button
                          className="admin-btn-editar"
                          onClick={() => handleEditar(arbol)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="admin-btn-eliminar"
                          onClick={() => handleEliminar(arbol)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──── TAB: BAJAS ──── */}
        {tab === 'bajas' && (
          <div>
            <div className="admin-section-header">
              <h2>🍂 Registro de Bajas</h2>
              <p style={{ color: '#66937a' }}>Historial de piezas forestales declaradas como pérdida</p>
            </div>

            {arboles.filter(a => a.estado === 'muerto').length === 0 ? (
              <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem', fontSize: '1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍃</div>
                <p>No hay registros de bajas en el sistema.</p>
              </div>
            ) : (
              <div className="admin-arboles-lista" style={{ gridTemplateColumns: '1fr', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {arboles
                  .filter(a => a.estado === 'muerto')
                  .sort((a,b) => new Date(b.fechaMuerto || 0) - new Date(a.fechaMuerto || 0))
                  .map((arbol) => (
                  <div key={arbol.id} className="admin-arbol-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '1.2rem', gap: '1.5rem', width: '100%', maxWidth: '1000px', margin: '0 0' }}>
                     <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '2px solid #fecaca' }}>
                        {arbol.imagenUrl ? (
                           <img src={arbol.imagenUrl} alt={arbol.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        ) : <div style={{ background: '#fff1f2', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🍂</div>}
                     </div>
                     <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, color: '#450a0a', fontSize: '1.1rem' }}>{arbol.nombre}</h3>
                        <p style={{ margin: '4px 0', color: '#991b1b', textTransform: 'capitalize', fontSize: '0.9rem', fontWeight: '500' }}>
                           Especie: {arbol.tipo || 'mimbro'}
                        </p>
                        <p style={{ margin: 0, color: '#66937a', fontSize: '0.8rem' }}>
                           ID: #{arbol.id}
                        </p>
                     </div>
                     <div style={{ textAlign: 'right', padding: '0 1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de Defunción</p>
                        <p style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.2rem' }}>
                           {arbol.fechaMuerto ? arbol.fechaMuerto.split('-').reverse().join('/') : 'Sin fecha'}
                        </p>
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                           className="admin-edit-btn" 
                           onClick={() => handleEditar(arbol)}
                           style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                        >
                           ✏️ Restaurar/Editar
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──── TAB: SEGUIMIENTO ──── */}
        {tab === 'seguimiento' && (
          <div>
            <div className="admin-section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
                <h2>Seguimiento Específico</h2>
                <select 
                  value={tipoFiltro} 
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #c5d6cc', fontSize: '1rem', fontWeight: '500', color: '#1a402a', outline: 'none' }}
                >
                  {tiposDisponibles.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '5px' }}>
                <p style={{ fontWeight: 'bold', color: '#2e6b46', margin: 0 }}>
                  Total: {arboles.filter(a => a.tipo === tipoFiltro || a.nombre.toLowerCase().includes(tipoFiltro)).length} árboles de tipo "{tipoFiltro}"
                </p>
                <button 
                  onClick={() => handleEliminarTipo(tipoFiltro)}
                  style={{ backgroundColor: '#ef4444', color: 'white', padding: '6px 14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🧨 Eliminar este Tipo y sus Árboles
                </button>
              </div>

              {/* Nueva sección: Edición de estadísticas manuales */}
              <div style={{ 
                width: '100%', 
                background: 'rgba(52, 211, 153, 0.05)', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                marginTop: '1rem'
              }}>
                <h3 style={{ fontSize: '1rem', color: '#6ee7b7', marginBottom: '1rem' }}>📊 Control de Estadísticas para "{tipoFiltro}"</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div className="admin-form-group">
                    <label>🌳 Árboles Planificados</label>
                    <input 
                      type="number" 
                      placeholder="Cantidad a sembrar..."
                      value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.planificados || 0}
                      onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'planificados', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>🍂 Árboles Muertos</label>
                    <input 
                      type="number" 
                      placeholder="Cantidad de pérdidas..."
                      value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.muertos || 0}
                      onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'muertos', e.target.value)}
                    />
                  </div>
                  <div className="admin-form-group" style={{ opacity: 0.7 }}>
                    <label>✅ Sembrados Actuales</label>
                    <input 
                      type="text" 
                      disabled
                      value={arboles.filter(a => (a.tipo || 'mimbro').toLowerCase() === tipoFiltro.toLowerCase() && a.estado !== 'muerto').length}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-arboles-lista" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: '1.5rem' }}>
              {arboles
                .filter(a => (a.tipo === tipoFiltro || a.nombre.toLowerCase().includes(tipoFiltro)) && a.estado !== 'muerto')
                .map((arbol, index) => (
                <div key={arbol.id} className="admin-arbol-card" style={{ display: 'block', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#1a402a', fontSize: '1.2rem' }}>
                    #{index + 1} - {arbol.nombre}
                  </h3>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Estado Actual:</label>
                    <select 
                      value={arbol.estado} 
                      onChange={async (e) => {
                        const nuevoEstado = e.target.value;
                        const estadoAnterior = arbol.estado;

                        // Pedir confirmación si el cambio es hacia o desde "muerto"
                        if ((nuevoEstado === 'muerto' && estadoAnterior !== 'muerto') || 
                            (nuevoEstado !== 'muerto' && estadoAnterior === 'muerto')) {
                          
                          const result = await Swal.fire({
                            title: '¿Confirmar cambio de estado?',
                            text: nuevoEstado === 'muerto' 
                              ? `¿Estás seguro de marcar "${arbol.nombre}" como MUERTO? Se registrará como pérdida en las estadísticas.`
                              : `¿Deseas cambiar el estado de "${arbol.nombre}" a "${nuevoEstado}"?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#2e6b46',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, cambiar',
                            cancelButtonText: 'Cancelar'
                          });

                          if (!result.isConfirmed) {
                             e.target.value = estadoAnterior; 
                             return;
                          }
                        }

                        const arbolActual = { 
                          ...arbol, 
                          estado: nuevoEstado,
                          fechaMuerto: nuevoEstado === 'muerto' ? new Date().toISOString().split('T')[0] : null
                        };
                        
                        try {
                          await services.putArboles(arbolActual, arbol.id);
                          
                          const tipoKey = arbol.tipo || 'mimbro';
                          const currentStat = statsTipos.find(s => s.tipo === tipoKey.toLowerCase());
                          
                          // Lógica automática de estadísticas de muertos
                          if (nuevoEstado === 'muerto' && estadoAnterior !== 'muerto') {
                             const newDeadCount = (currentStat?.muertos || 0) + 1;
                             await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
                          } else if (nuevoEstado !== 'muerto' && estadoAnterior === 'muerto') {
                             const newDeadCount = Math.max(0, (currentStat?.muertos || 0) - 1);
                             await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
                          }

                          mostrarMensaje(`Estado de "${arbol.nombre}" actualizado.`);
                          cargarArboles();
                        } catch (err) {
                          mostrarMensaje('Error al actualizar estado', 'error');
                        }
                      }}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #c5d6cc', width: '100%', fontSize: '0.95rem' }}
                    >
                      <option value="vivo">Vivo</option>
                      <option value="en_riesgo">En riesgo</option>
                      <option value="muerto">Muerto</option>
                      <option value="protegido">Protegido</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Progreso en el tiempo:</label>
                    <input 
                      type="text" 
                      defaultValue={arbol.progreso || '0%'} 
                      onBlur={async (e) => {
                         if (e.target.value === (arbol.progreso || '0%')) return;
                         const updatedArbol = { ...arbol, progreso: e.target.value };
                         try {
                           await services.putArboles(updatedArbol, arbol.id);
                           mostrarMensaje(`Progreso actualizado para ${arbol.nombre}`);
                           cargarArboles();
                         } catch (err) {
                           mostrarMensaje('Error al actualizar progreso', 'error');
                         }
                      }}
                      placeholder="Ej: Creció 10cm, 50% de meta..."
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #c5d6cc', width: '100%', fontSize: '0.95rem' }}
                    />
                    <small style={{ color: '#66937a', display: 'block', marginTop: '6px' }}>
                      * Escribe el progreso y haz clic fuera del cuadro para guardar
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ──── TAB: USUARIOS ──── */}
        {tab === 'usuarios' && (
          <div>
            <div className="admin-section-header">
              <h2>👥 Gestión de Usuarios</h2>
              <p style={{ color: '#66937a' }}>Administrar accesos y cuentas del sistema</p>
            </div>

            <div className="admin-form-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1a402a' }}>{modoEdicionUsuario ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h3>
              <form onSubmit={handleUserSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #c5d6cc' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #c5d6cc' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
                  <input
                    type="password"
                    required={!modoEdicionUsuario}
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #c5d6cc' }}
                  />
                </div>
                <div style={{ flex: '0 0 150px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rol</label>
                  <select
                    value={formUsuario.rol}
                    onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #c5d6cc' }}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2e6b46', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {modoEdicionUsuario ? '💾 Guardar' : '➕ Agregar'}
                  </button>
                  {modoEdicionUsuario && (
                    <button type="button" onClick={resetFormUsuario} style={{ padding: '10px 20px', backgroundColor: '#9ca3af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-arboles-lista" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {usuarios.map(user => (
                <div key={user.id} className="admin-arbol-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: user.rol === 'admin' ? '#fee2e2' : '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {user.rol === 'admin' ? '👑' : '👤'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>{user.nombre}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{user.email} • {user.rol}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handleEditarUsuario(user)} style={{ flex: 1, padding: '8px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#374151' }}>
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarUsuario(user.id, user.nombre)} 
                      disabled={user.rol === 'admin'} 
                      style={{ flex: 1, padding: '8px', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: '#b91c1c', opacity: user.rol === 'admin' ? 0.5 : 1 }}
                      title={user.rol === 'admin' ? "No se puede eliminar administradores principales" : ""}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── TAB: FORMULARIO ──── */}
        {tab === 'agregar' && (
          <div className="admin-form-card">
            <h2>{modoEdicion ? '✏️ Editar árbol' : '➕ Registrar nuevo árbol'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">

                {/* Nombre */}
                <div className="admin-form-group">
                  <label htmlFor="nombre">Nombre común *</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Roble, Ceiba, Guanacaste..."
                    required
                  />
                </div>

                {/* Tipo de árbol */}
                <div className="admin-form-group">
                  <label htmlFor="tipo">Tipo de Árbol *</label>
                  {!modoNuevoTipo ? (
                    <select
                      id="tipoSelector"
                      name="tipoSelector"
                      value={form.tipo}
                      onChange={handleChange}
                      required
                    >
                      {tiposDisponibles.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                      ))}
                      <option value="___nuevo___" style={{ fontWeight: 'bold', color: '#2e6b46' }}>➕ Añadir otro tipo...</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        id="tipo"
                        name="tipo"
                        type="text"
                        value={form.tipo}
                        onChange={handleChange}
                        placeholder="Escribe el nuevo tipo..."
                        required
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={() => { setModoNuevoTipo(false); setForm({ ...form, tipo: 'mimbro' }); }}
                        style={{ padding: '0 15px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>

                {/* Nombre científico */}
                <div className="admin-form-group">
                  <label htmlFor="nombreCientifico">Nombre científico</label>
                  <input
                    id="nombreCientifico"
                    type="text"
                    name="nombreCientifico"
                    value={form.nombreCientifico}
                    onChange={handleChange}
                    placeholder="Ej: Quercus robur"
                  />
                </div>

                {/* Familia */}
                <div className="admin-form-group">
                  <label htmlFor="familia">Familia botánica</label>
                  <input
                    id="familia"
                    type="text"
                    name="familia"
                    value={form.familia}
                    onChange={handleChange}
                    placeholder="Ej: Fagaceae"
                  />
                </div>

                {/* Altura */}
                <div className="admin-form-group">
                  <label htmlFor="altura">Altura promedio</label>
                  <input
                    id="altura"
                    type="text"
                    name="altura"
                    value={form.altura}
                    onChange={handleChange}
                    placeholder="Ej: 20-40 metros"
                  />
                </div>

                {/* Crecimiento */}
                <div className="admin-form-group">
                  <label htmlFor="crecimiento">Velocidad de crecimiento</label>
                  <input
                    id="crecimiento"
                    type="text"
                    name="crecimiento"
                    value={form.crecimiento}
                    onChange={handleChange}
                    placeholder="Ej: Lento (30-60 cm por año)"
                  />
                </div>

                {/* Clima */}
                <div className="admin-form-group">
                  <label htmlFor="clima">Clima</label>
                  <input
                    id="clima"
                    type="text"
                    name="clima"
                    value={form.clima}
                    onChange={handleChange}
                    placeholder="Ej: Tropical húmedo"
                  />
                </div>

                {/* Estado */}
                <div className="admin-form-group">
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                  >
                    <option value="vivo">Vivo</option>
                    <option value="en_riesgo">En riesgo</option>
                    <option value="muerto">Muerto</option>
                    <option value="protegido">Protegido</option>
                  </select>
                </div>

                {/* Fecha de registro */}
                <div className="admin-form-group">
                  <label htmlFor="fechaRegistro">Fecha de registro</label>
                  <input
                    id="fechaRegistro"
                    type="date"
                    name="fechaRegistro"
                    value={form.fechaRegistro}
                    onChange={handleChange}
                  />
                </div>

                {/* URL de imagen - full width */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="imagenUrl">URL de la imagen</label>
                  <input
                    id="imagenUrl"
                    type="url"
                    name="imagenUrl"
                    value={form.imagenUrl}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen-del-arbol.jpg"
                  />
                  {/* Preview de imagen */}
                  <div className="admin-img-preview-wrap">
                    {form.imagenUrl ? (
                      <img
                        src={form.imagenUrl}
                        alt="Vista previa"
                        className="admin-img-preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="admin-img-preview-wrap"
                      style={{
                        display: form.imagenUrl ? 'none' : 'flex',
                        border: 'none',
                        height: '100%',
                      }}
                    >
                      <span className="admin-img-no-preview">🖼️</span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="descripcion">Descripción general</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Describe el árbol: historia, características destacadas, importancia ecológica..."
                  />
                </div>


                {/* Cuidados */}
                <div className="admin-form-group admin-form-full">
                  <label htmlFor="cuidados">Cuidados y cultivo</label>
                  <textarea
                    id="cuidados"
                    name="cuidados"
                    rows={2}
                    value={form.cuidados}
                    onChange={handleChange}
                    placeholder="Ej: Requiere suelo bien drenado, pleno sol, riego moderado..."
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn-cancelar"
                  onClick={() => { resetForm(); setTab('lista'); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-guardar">
                  {modoEdicion ? '💾 Guardar cambios' : '➕ Registrar árbol'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoAdmin;