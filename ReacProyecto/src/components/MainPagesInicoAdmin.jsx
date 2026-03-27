import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import '../styles/Arboles.css';
import '../styles/MainPagesInicoAdmin.css';
import '../styles/PremiumDashboard.css';
import ResumenTab from './admin/ResumenTab';
import ListaTab from './admin/ListaTab';
import BajasTab from './admin/BajasTab';
import UsuariosTab from './admin/UsuariosTab';
import VoluntariadosTab from './admin/VoluntariadosTab';
import AbonosTab from './admin/AbonosTab';
import ArbolFormTab from './admin/ArbolFormTab';
import BuzonTab from './admin/BuzonTab';

// Ya no hay tipos de árboles quemados (hardcoded) para permitir eliminación completa de categorías

const FORM_INICIAL = {
  nombre: '',
  nombreCientifico: '',
  tipo: '', // Campo para categorizar (ahora dinámico)
  progreso: '0%', // Nuevo campo para seguimiento
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
  rol: 'user'
};

const VOLUNTARIADO_FORM_INICIAL = {
  nombre: '',
  area: '', // Antes puesto
  email: '',
  telefono: '',
  fechaIngreso: new Date().toISOString().split('T')[0]
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
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tab, setTab] = useState('resumen'); // 'lista' | 'agregar' | 'seguimiento' | 'resumen' | 'bajas' | 'usuarios' | 'voluntariados'
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
  const [busqueda, setBusqueda] = useState(''); // Nuevo estado para búsqueda por texto
  const navigate = useNavigate();

  const tiposDisponibles = Array.from(new Set([
    ...arboles.map(a => a.tipo).filter(Boolean).map(t => t.toLowerCase()),
    ...statsTipos.map(s => s.tipo).filter(Boolean).map(t => t.toLowerCase())
  ]));

  // ── Autenticación y carga inicial ───────────────────────────────────────────
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

  // Efecto para asegurar que tipoFiltro tenga un valor si estamos en la pestaña de seguimiento
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

    // Validaciones básicas
    if (!trimmedNombre) {
      Swal.fire('Error', 'El nombre del usuario es obligatorio', 'error');
      return;
    }

    if (trimmedNombre.length < 4) {
      Swal.fire('Error', 'El nombre del usuario debe tener al menos 4 letras', 'error');
      return;
    }

    if (/\d/.test(trimmedNombre)) {
      Swal.fire('Error', 'El nombre del usuario no debe contener números', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }

    if (!modoEdicionUsuario && trimmedPassword.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (trimmedPassword.length > 15) {
      Swal.fire('Error', 'La contraseña no puede exceder los 15 caracteres', 'error');
      return;
    }

    // Verificar si el email ya existe en la lista local (excluyendo el actual si es edición)
    const emailDuplicado = usuarios.find(u => 
      u.email.toLowerCase() === trimmedEmail.toLowerCase() && 
      (!modoEdicionUsuario || u.id !== idEditandoUsuario)
    );

    if (emailDuplicado) {
      Swal.fire('Atención', 'Este correo electrónico ya está registrado por otro usuario', 'warning');
      return;
    }

    const action = modoEdicionUsuario ? 'actualizar' : 'crear';
    const confirm = await Swal.fire({
      title: `¿Confirmar ${action}?`,
      text: `¿Estás seguro de que quieres ${action} al usuario "${trimmedNombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const usuarioFinal = {
        ...formUsuario,
        nombre: trimmedNombre,
        email: trimmedEmail,
        password: trimmedPassword || formUsuario.password // Mantener si vacía en edición
      };

      if (modoEdicionUsuario) {
        await services.putUsuarios(usuarioFinal, idEditandoUsuario);
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      } else {
        await services.postUsuarios(usuarioFinal);
        Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
      }
      resetFormUsuario();
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo procesar el usuario', 'error');
    }
  };

  const handleEditarUsuario = (user) => {
    setFormUsuario(user);
    setModoEdicionUsuario(true);
    setIdEditandoUsuario(user.id);
    // Scroll al formulario para mejor visibilidad
    setTimeout(() => {
      document.getElementById('user-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBanUsuario = async (id, nombre) => {
    const { value: motivo } = await Swal.fire({
      title: '¿Cancelar cuenta de usuario?',
      text: `Ingresa el motivo de la cancelación para "${nombre}":`,
      input: 'textarea',
      inputPlaceholder: 'Escribe aquí el motivo...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Confirmar Cancelación',
      cancelButtonText: 'Volver',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes proporcionar un motivo para cancelar la cuenta';
        }
      }
    });

    if (motivo) {
      try {
        const user = usuarios.find(u => u.id === id);
        const userBaneado = { 
          ...user, 
          status: 'banned', 
          motivoBan: motivo 
        };
        await services.putUsuarios(userBaneado, id);
        Swal.fire('Cancelado', 'La cuenta del usuario ha sido cancelada', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo cancelar la cuenta', 'error');
      }
    }
  };

  const handleActivarUsuario = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Reactivar usuario?',
      text: `¿Estás seguro de reactivar la cuenta de "${nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const user = usuarios.find(u => u.id === id);
        const userActivo = { 
          ...user, 
          status: 'active'
        };
        delete userActivo.motivoBan;
        await services.putUsuarios(userActivo, id);
        Swal.fire('Reactivado', 'El usuario puede volver a ingresar', 'success');
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

  // ── Handlers de Voluntariados ──────────────────────────────────────────────
  const handleVoluntariadoSubmit = async (e) => {
    e.preventDefault();

    const trimmedNombre = formVoluntariado.nombre.trim();
    const trimmedArea = formVoluntariado.area.trim();
    const trimmedEmail = formVoluntariado.email.trim();
    const trimmedTelefono = formVoluntariado.telefono.trim();

    // Validaciones
    if (!trimmedNombre) {
      Swal.fire('Error', 'El nombre del voluntario es obligatorio', 'error');
      return;
    }

    if (trimmedNombre.length < 4) {
      Swal.fire('Error', 'El nombre del voluntario debe tener al menos 4 letras', 'error');
      return;
    }

    if (/\d/.test(trimmedNombre)) {
      Swal.fire('Error', 'El nombre del voluntario no debe contener números', 'error');
      return;
    }

    if (!trimmedArea) {
      Swal.fire('Error', 'El área/cargo es obligatoria', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }

    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(trimmedTelefono)) {
      Swal.fire('Error', 'El teléfono debe contener estrictamente 8 números', 'error');
      return;
    }

    // Verificar duplicados en la tabla de usuarios
    const emailDuplicado = usuarios.find(u => 
      u.email.toLowerCase() === trimmedEmail.toLowerCase() && 
      (!modoEdicionVoluntariado || u.id !== idEditandoVoluntariado)
    );

    if (emailDuplicado) {
      Swal.fire('Atención', 'Este correo ya está registrado en el sistema (como usuario o voluntario)', 'warning');
      return;
    }

    const action = modoEdicionVoluntariado ? 'actualizar' : 'registrar';
    
    const confirm = await Swal.fire({
      title: `¿Confirmar ${action}?`,
      text: `¿Deseas ${action} la ficha del voluntario "${trimmedNombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const voluntariadoFinal = {
        ...formVoluntariado,
        nombre: trimmedNombre,
        area: trimmedArea,
        email: trimmedEmail,
        telefono: trimmedTelefono,
        rol: 'voluntario'
      };

      if (modoEdicionVoluntariado) {
        await services.putVoluntariados(voluntariadoFinal, idEditandoVoluntariado);
        Swal.fire('Éxito', 'Voluntario actualizado con éxito', 'success');
      } else {
        // Al crear uno nuevo, asignar password por defecto y forzar cambio
        const nuevoVoluntarioUser = {
          ...voluntariadoFinal,
          password: 'Voluntario123', // Password por defecto
          debeCambiarPassword: true // Flag para forzar cambio en primer login
        };
        await services.postVoluntariados(nuevoVoluntarioUser);
        Swal.fire({
          title: 'Registrado',
          html: `Voluntario creado con éxito.<br><b>Contraseña temporal:</b> Voluntario123`,
          icon: 'success'
        });
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
    setTab('voluntariados'); // Asegurar que estamos en la pestaña
    // Scroll al formulario para mejor visibilidad
    setTimeout(() => {
      document.getElementById('voluntariado-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEliminarVoluntariado = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Dar de baja voluntario?',
      text: `¿Estás seguro de eliminar a "${nombre}" de la lista de voluntarios?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteVoluntariados(id);
        Swal.fire('Eliminado', 'Voluntario eliminado correctamente', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar al voluntario', 'error');
      }
    }
  };

  const resetFormVoluntariado = () => {
    setFormVoluntariado(VOLUNTARIADO_FORM_INICIAL);
    setModoEdicionVoluntariado(false);
    setIdEditandoVoluntariado(null);
  };

  // ── Conversiones ──────────────────────────────────────────────────────────
  const handleConvertirUsuarioAVoluntariado = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Convertir a Voluntario',
      html:
        `<div style="text-align: left; margin-bottom: 5px; font-weight: bold;">Cual será su área?</div>` +
        `<input id="swal-input1" class="swal2-input" placeholder="Área de Interés / Cargo" style="margin-top: 5px;">` +
        `<div style="text-align: left; margin-top: 15px; margin-bottom: 5px; font-weight: bold;">Teléfono de contacto:</div>` +
        `<input id="swal-input2" class="swal2-input" placeholder="8 números" maxlength="8" oninput="this.value = this.value.replace(/\\D/g, '')" style="margin-top: 5px;">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Conversión',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const area = document.getElementById('swal-input1').value;
        const telefono = document.getElementById('swal-input2').value;
        
        if (!area || !telefono) {
          Swal.showValidationMessage('Por favor llena todos los campos');
          return false;
        }

        const phoneRegex = /^\d{8}$/;
        if (!phoneRegex.test(telefono)) {
          Swal.showValidationMessage('El teléfono debe tener estrictamente 8 números');
          return false;
        }

        return { area, telefono };
      }
    });

    if (formValues) {
      try {
        const usuarioActualizado = {
          ...user,
          rol: 'voluntario',
          area: formValues.area,
          telefono: formValues.telefono,
          fechaIngreso: new Date().toISOString().split('T')[0]
        };
        
        await services.putUsuarios(usuarioActualizado, user.id);
        
        Swal.fire('¡Éxito!', `"${user.nombre}" ahora es voluntario.`, 'success');
        setTab('voluntariados');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'No se pudo realizar la conversión.', 'error');
      }
    }
  };

  const handleConvertirVoluntariadoAUsuario = async (vol) => {
    // Verificar si ya existe un usuario con ese correo
    const userExists = usuarios.find(u => u.email.toLowerCase() === vol.email.toLowerCase());
    if (userExists) {
      Swal.fire('Atención', `Ya existe un usuario con el correo ${vol.email}. No se puede duplicar.`, 'warning');
      return;
    }

    const { value: password } = await Swal.fire({
      title: 'Convertir a Usuario',
      text: `Ingresa una contraseña para la nueva cuenta de "${vol.nombre}":`,
      input: 'password',
      inputPlaceholder: 'Contraseña de acceso',
      showCancelButton: true,
      confirmButtonText: 'Crear Usuario',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes ingresar una contraseña';
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (value.length > 15) return 'La contraseña no puede exceder los 15 caracteres';
      }
    });

    if (password) {
      try {
        const usuarioActualizado = {
          ...vol,
          password: password,
          rol: 'user',
          debeCambiarPassword: false // Ya la está definiendo el admin aquí
        };
        // Limpiar campos de voluntario si se desea, o dejarlos
        delete usuarioActualizado.area;
        delete usuarioActualizado.telefono;
        delete usuarioActualizado.fechaIngreso;

        await services.putUsuarios(usuarioActualizado, vol.id);
        
        Swal.fire('¡Éxito!', `"${vol.nombre}" ahora tiene acceso como usuario normal.`, 'success');
        setTab('usuarios');
        await cargarArboles();
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar la cuenta del usuario.', 'error');
      }
    }
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
    Swal.fire({
      title: tipo === 'success' ? 'Éxito' : 'Error',
      text: texto,
      icon: tipo,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  // ── Handlers de Abonos ──────────────────────────────────────────────────────
  const resetFormAbono = () => {
    setFormAbono(ABONO_FORM_INICIAL);
    setModoEdicionAbono(false);
    setIdEditandoAbono(null);
  };

  const handleLimpiarHistorialAbono = async (arbol) => {
    const confirm = await Swal.fire({
      title: '¿Limpiar historial?',
      text: `Se borrará el registro de los ${arbol.historialAbono?.length} abonos aplicados a "${arbol.nombre}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'No'
    });

    if (confirm.isConfirmed) {
      try {
        const arbolActualizado = { ...arbol, historialAbono: [] };
        await services.putArboles(arbolActualizado, arbol.id);
        Swal.fire('Historial Limpiado', '', 'success');
        await cargarArboles();
      } catch (e) {
        Swal.fire('Error', 'No se pudo limpiar el historial.', 'error');
      }
    }
  };

  const handleAbonoSubmit = async (e) => {
    e.preventDefault();
    const trimmedNombre = formAbono.nombre.trim();
    if (!trimmedNombre) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return;
    }

    const stockFinal = parseInt(formAbono.stock) || 0;

    if (stockFinal < 0) {
      Swal.fire('Error', 'El stock no puede ser un número negativo', 'error');
      return;
    }

    try {
      const abonoFinal = { ...formAbono, stock: stockFinal };
      if (modoEdicionAbono) {
        await services.putAbonos(abonoFinal, idEditandoAbono);
        Swal.fire('Éxito', 'Abono actualizado', 'success');
      } else {
        await services.postAbonos(abonoFinal);
        Swal.fire('Éxito', 'Abono registrado', 'success');
      }
      resetFormAbono();
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el abono', 'error');
    }
  };

  const handleEditarAbono = (abono) => {
    setFormAbono(abono);
    setModoEdicionAbono(true);
    setIdEditandoAbono(abono.id);
    setTab('abonos');
  };

  const handleEliminarAbono = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Confirmar eliminación?',
      text: `Eliminarás "${nombre}" del inventario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteAbonos(id);
        Swal.fire('Eliminado', 'Abono borrado', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const handleAbonarArbol = async (arbol) => {
    if (abonos.length === 0) {
      Swal.fire('Inventario vacío', 'No hay abonos registrados para aplicar.', 'warning');
      return;
    }

    const { value: abonoSeleccionadoId } = await Swal.fire({
      title: 'Aplicar Abono/Fertilizante',
      text: `Selecciona el producto para el árbol "${arbol.nombre}":`,
      input: 'select',
      inputOptions: abonos.reduce((acc, curr) => {
        acc[curr.id] = `${curr.nombre} (Stock: ${curr.stock} ${curr.unidad})`;
        return acc;
      }, {}),
      inputPlaceholder: 'Selecciona un producto...',
      showCancelButton: true,
      confirmButtonText: 'Aplicar 1 unidad',
      inputValidator: (value) => {
        if (!value) return 'Debes seleccionar un producto';
        const ab = abonos.find(a => a.id === value);
        if (ab.stock <= 0) return 'No queda stock de este producto';
      }
    });

    if (abonoSeleccionadoId) {
      try {
        const abonoEncontrado = abonos.find(a => a.id === abonoSeleccionadoId);
        
        // 1. Restar stock
        const abonoActualizado = { ...abonoEncontrado, stock: abonoEncontrado.stock - 1 };
        await services.putAbonos(abonoActualizado, abonoSeleccionadoId);

        // 2. Registrar en historial del árbol
        const now = new Date();
        const nuevoRegistro = {
          abono: abonoEncontrado.nombre,
          fecha: now.toISOString().split('T')[0],
          hora: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          idAbono: abonoSeleccionadoId
        };
        
        const arbolActualizado = {
          ...arbol,
          historialAbono: [...(arbol.historialAbono || []), nuevoRegistro]
        };
        await services.putArboles(arbolActualizado, arbol.id);

        await Swal.fire('¡Árbol Abonado!', `Se aplicó "${abonoEncontrado.nombre}" correctamente.`, 'success');
        await cargarArboles();
      } catch (e) {
        Swal.fire('Error', 'No se pudo registrar la fertilización.', 'error');
      }
    }
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
      const existingArbol = arboles.find(a => (a.tipo || 'Sin clasificar').toLowerCase() === value.toLowerCase());
      if (existingArbol && !modoEdicion) {
         setForm({
            ...form,
            tipo: value,
            nombre: existingArbol.nombre || '',
            nombreCientifico: existingArbol.nombreCientifico || '',
            familia: existingArbol.familia || '',
            altura: existingArbol.altura || '',
            crecimiento: existingArbol.crecimiento || '',
            clima: existingArbol.clima || 'tropical',
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
    
    const trimmedNombre = form.nombre.trim();
    const trimmedNombreCientifico = form.nombreCientifico.trim();
    const trimmedTipo = form.tipo.trim();
    const trimmedProgreso = form.progreso.trim();
    const trimmedFamilia = form.familia.trim();
    const trimmedAltura = form.altura.trim();
    const trimmedCrecimiento = form.crecimiento.trim();
    const trimmedClima = form.clima.trim();
    const trimmedDescripcion = form.descripcion.trim();
    const trimmedCuidados = form.cuidados.trim();
    const trimmedImagenUrl = form.imagenUrl.trim();

    // Validaciones del árbol
    if (!trimmedNombre || !trimmedNombreCientifico || !trimmedTipo || !trimmedFamilia || 
        !trimmedAltura || !trimmedCrecimiento || !trimmedClima || !trimmedDescripcion || 
        !trimmedCuidados || !trimmedImagenUrl) {
      Swal.fire('Error', 'Todos los campos son obligatorios. Por favor, completa la información faltante.', 'error');
      return;
    }

    if (trimmedNombre.length < 4) {
      Swal.fire('Error', 'El nombre del árbol debe tener al menos 4 letras', 'error');
      return;
    }

    if (/\d/.test(trimmedNombre)) {
      Swal.fire('Error', 'El nombre común del árbol no debe contener números', 'error');
      return;
    }

    if (/\d/.test(trimmedNombreCientifico)) {
      Swal.fire('Error', 'El nombre científico del árbol no debe contener números', 'error');
      return;
    }

    if (trimmedImagenUrl && !trimmedImagenUrl.startsWith('http')) {
      Swal.fire('Error', 'La URL de la imagen debe ser válida (empezar con http/https).', 'error');
      return;
    }

    // El progreso debe ser un porcentaje (ej: 45%)
    const progressRegex = /^\d{1,3}%$/;
    if (!progressRegex.test(trimmedProgreso)) {
      Swal.fire('Error', 'El progreso debe estar en formato de porcentaje (ej: 10%).', 'error');
      return;
    }

    try {
      let savedTreeId = null;
      const formFinal = {
        ...form,
        nombre: trimmedNombre,
        nombreCientifico: trimmedNombreCientifico,
        tipo: trimmedTipo,
        progreso: trimmedProgreso,
        familia: trimmedFamilia,
        altura: trimmedAltura,
        crecimiento: trimmedCrecimiento,
        clima: trimmedClima,
        descripcion: trimmedDescripcion,
        cuidados: trimmedCuidados,
        imagenUrl: trimmedImagenUrl
      };

      if (modoEdicion) {
        const arbolOriginal = arboles.find(a => a.id === idEditando);
        const estadoAnterior = arbolOriginal?.estado;
        const nuevoEstado = formFinal.estado;
        const tipoKey = (formFinal.tipo || 'mimbro').toLowerCase();

        const arbolActualizado = { 
          ...formFinal, 
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
        
        Swal.fire('Éxito', `Árbol "${trimmedNombre}" actualizado correctamente.`, 'success');
      } else {
        const arbolConFecha = {
          ...formFinal,
          fechaMuerto: formFinal.estado === 'muerto' ? new Date().toISOString().split('T')[0] : null
        };
        const result = await services.postArboles(arbolConFecha);
        savedTreeId = result?.id; 

        // Si se agrega como muerto desde el principio, incrementamos estadística
        if (formFinal.estado === 'muerto') {
          const tipoKey = (formFinal.tipo || 'mimbro').toLowerCase();
          const currentStat = statsTipos.find(s => s.tipo === tipoKey);
          const newDeadCount = (currentStat?.muertos || 0) + 1;
          await handleUpdateStatTipo(tipoKey, 'muertos', newDeadCount);
        }

        Swal.fire('Éxito', `Árbol "${trimmedNombre}" agregado correctamente.`, 'success');
      }


      resetForm();
      setTab('lista');
      await cargarArboles();
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el árbol. Revise la conexión.', 'error');
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
     const arbolesDeEseTipo = arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipoDelete.toLowerCase());
     const statEntry = statsTipos.find(s => s.tipo.toLowerCase() === tipoDelete.toLowerCase());
     
     if (arbolesDeEseTipo.length === 0 && !statEntry) {
        Swal.fire('Información', 'No existe información de este tipo para eliminar.', 'info');
        return;
     }

     const mensajeConfirmacion = arbolesDeEseTipo.length > 0
        ? `Estás a punto de eliminar un total de ${arbolesDeEseTipo.length} árboles del tipo "${tipoDelete}" y sus estadísticas. ¡Esta acción es irreversible!`
        : `¿Deseas eliminar las estadísticas del tipo "${tipoDelete}"?`;

     const result = await Swal.fire({
        title: '¿Eliminar este tipo?',
        text: mensajeConfirmacion,
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
           if (arbolesDeEseTipo.length > 0) {
              await Promise.all(arbolesDeEseTipo.map(ar => services.deleteArboles(ar.id)));
           }

           // Borrar la entrada de estadísticas para este tipo si existe
           if (statEntry) {
              await services.deleteStatsTipos(statEntry.id);
           }

           Swal.fire('Eliminado', `Se han limpiado los datos de tipo "${tipoDelete}".`, 'success');
           
           // Cambiar de vista si no hay más
           setTipoFiltro(tiposDisponibles[0] || '');
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



  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-premium">
      <header className="premium-header">
        <div className="premium-header-flex">
          <div>
            <h2 className="premium-header-subtitle">BioMon ADI</h2>
            <h1>Panel de Control</h1>
            <p className="premium-header-welcome">
              Bienvenido, <strong>{adminName}</strong>. Gestionando la biodiversidad forestal de La Angostura.
            </p>
          </div>

        </div>
      </header>

      <main className="glass-card glass-card-container">
        {mensaje.texto && (
          <div className={`admin-msg ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        {/* Tabs de navegación Premium */}
        <div className="premium-tabs premium-tabs-container">
          {[
            { id: 'resumen', label: 'Resumen', reset: resetForm },
            { id: 'lista', label: `Árboles (${arboles.filter(a => a.estado !== 'muerto').length})`, reset: resetForm },
            { id: 'bajas', label: `Bajas (${arboles.filter(a => a.estado === 'muerto').length})`, reset: resetForm },
            { id: 'usuarios', label: 'Usuarios', reset: resetFormUsuario },
            { id: 'voluntariados', label: 'Voluntariados', reset: resetFormVoluntariado },
            { id: 'abonos', label: `Abonos (${abonos.length})`, reset: resetFormAbono },
            { id: 'buzon', label: 'Buzón', reset: resetForm },
            { id: 'agregar', label: modoEdicion ? 'Editar' : 'Agregar', reset: resetForm }
          ].map(t => (
            <button
              key={t.id}
              className={`premium-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => { setTab(t.id); t.reset(); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido Dinámico con Animación */}
        <div className="tab-content-premium" key={tab}>
            {tab === 'resumen' && <ResumenTab arboles={arboles} tiposDisponibles={tiposDisponibles} statsTipos={statsTipos} setTipoFiltro={setTipoFiltro} setTab={setTab} />}
            {tab === 'lista' && <ListaTab busqueda={busqueda} setBusqueda={setBusqueda} tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro} tiposDisponibles={tiposDisponibles} setTab={setTab} handleEliminarTipo={handleEliminarTipo} statsTipos={statsTipos} handleUpdateStatTipo={handleUpdateStatTipo} arboles={arboles} cargando={cargando} handleEditar={handleEditar} handleAbonarArbol={handleAbonarArbol} handleEliminar={handleEliminar} handleLimpiarHistorialAbono={handleLimpiarHistorialAbono} />}
            {tab === 'bajas' && <BajasTab arboles={arboles} handleEditar={handleEditar} />}
            {tab === 'usuarios' && <UsuariosTab
              modoEdicionUsuario={modoEdicionUsuario}
              handleUserSubmit={handleUserSubmit}
              formUsuario={formUsuario}
              setFormUsuario={setFormUsuario}
              resetFormUsuario={resetFormUsuario}
              usuarios={usuarios}
              handleEditarUsuario={handleEditarUsuario}
              handleBanUsuario={handleBanUsuario}
              handleActivarUsuario={handleActivarUsuario}
              handleConvertirUsuarioAVoluntariado={handleConvertirUsuarioAVoluntariado}
            />
}
            { tab === 'voluntariados' && <VoluntariadosTab modoEdicionVoluntariado={modoEdicionVoluntariado} handleVoluntariadoSubmit={handleVoluntariadoSubmit} formVoluntariado={formVoluntariado} setFormVoluntariado={setFormVoluntariado} resetFormVoluntariado={resetFormVoluntariado} voluntariados={voluntariados} handleEditarVoluntariado={handleEditarVoluntariado} handleEliminarVoluntariado={handleEliminarVoluntariado} handleConvertirVoluntariadoAUsuario={handleConvertirVoluntariadoAUsuario} /> }
            { tab === 'abonos' && <AbonosTab modoEdicionAbono={modoEdicionAbono} handleAbonoSubmit={handleAbonoSubmit} formAbono={formAbono} setFormAbono={setFormAbono} resetFormAbono={resetFormAbono} abonos={abonos} handleEditarAbono={handleEditarAbono} handleEliminarAbono={handleEliminarAbono} /> }
            { tab === 'buzon' && <BuzonTab /> }
            { tab === 'agregar' && <ArbolFormTab modoEdicion={modoEdicion} handleSubmit={handleSubmit} form={form} handleChange={handleChange} modoNuevoTipo={modoNuevoTipo} tiposDisponibles={tiposDisponibles} setModoNuevoTipo={setModoNuevoTipo} setForm={setForm} resetForm={resetForm} setTab={setTab} /> }
        </div>
      </main>
    </div>
  );
}

export default MainPagesInicoAdmin;