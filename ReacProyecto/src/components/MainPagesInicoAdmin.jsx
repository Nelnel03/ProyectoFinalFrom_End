import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import '../styles/Arboles.css';
import '../styles/MainPagesInicoAdmin.css';

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
  unidad: 'kg'
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
      title: '🤝 Convertir a Voluntario',
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
      title: '👤 Convertir a Usuario',
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
      title: '🌿 Aplicar Abono/Fertilizante',
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
        const nuevoRegistro = {
          abono: abonoEncontrado.nombre,
          fecha: new Date().toISOString().split('T')[0],
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
        title: '⚠️ ¿Eliminar este tipo?',
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

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
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
            👥 Usuarios
          </button>
          <button
            className={`admin-tab ${tab === 'voluntariados' ? 'active' : ''}`}
            onClick={() => { setTab('voluntariados'); resetFormVoluntariado(); }}
          >
            🤝 Voluntariados
          </button>
          <button
            className={`admin-tab ${tab === 'abonos' ? 'active' : ''}`}
            onClick={() => { setTab('abonos'); resetFormAbono(); }}
          >
            🦴 Abonos / Stock ({abonos.length})
          </button>
          <button
            className={`admin-tab ${tab === 'agregar' ? 'active' : ''}`}
            onClick={() => { setTab('agregar'); resetForm(); }}
          >
            {modoEdicion ? '✏️ Editar Árbol' : '➕ Agregar Árbol'}
          </button>
        </div>

        {/* ──── TAB: RESUMEN ──── */}
        {tab === 'resumen' && (
          <div className="admin-resumen-container">
            <div className="admin-section-header">
               <h2>Estadísticas de la Plantación</h2>
               <p>Distribución total de especies en el sistema</p>
            </div>

            <div className="admin-stats-grid">
               <div className="admin-stat-main-card">
                  <span className="admin-stat-icon">🌲</span>
                  <div className="admin-stat-info">
                     <h3>{arboles.length}</h3>
                     <p>Censo Total</p>
                  </div>
               </div>

               <div className="admin-stat-main-card blue-border">
                  <span className="admin-stat-icon blue">🌿</span>
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
                     const aliveCount = arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipo.toLowerCase() && a.estado !== 'muerto').length;
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
                           <div className="admin-type-stat-footer">
                              <span>📋 Plan: {stat?.planificados || 0}</span>
                              <span className="muerto">🍂 Muerto: {stat?.muertos || 0}</span>
                           </div>
                           <p className="admin-type-percentage">
                              {arboles.length > 0 ? ((aliveCount / arboles.length) * 100).toFixed(1) : 0}% de vitalidad global
                           </p>
                           <button 
                              className="admin-type-view-btn"
                               onClick={() => {
                                  setTipoFiltro(tipo);
                                  setTab('lista');
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
            <div className="admin-section-header admin-section-header-flex">
              <div className="admin-header-row">
                <h2>Especies Registradas</h2>
                <div className="admin-controls-row">
                  <div className="admin-search-box">
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre..." 
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>

                  <select 
                    value={tipoFiltro} 
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="admin-filter-select"
                  >
                    <option value="">🍀 Todos los Tipos</option>
                    {tiposDisponibles.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>
                    ))}
                  </select>

                  <button className="admin-add-btn" onClick={() => setTab('agregar')}>
                    ➕ Nuevo Árbol
                  </button>
                </div>
              </div>

              {/* Estadísticas rápidas por tipo (Solo si hay un tipo seleccionado) */}
              {tipoFiltro && (
                <div className="admin-tracking-panel">
                  <div className="admin-tracking-header">
                    <h3>📊 Seguimiento: "{tipoFiltro.toUpperCase()}"</h3>
                    <button 
                      onClick={() => handleEliminarTipo(tipoFiltro)}
                      className="admin-btn-delete-type"
                    >
                      🗑️ Eliminar Tipo
                    </button>
                  </div>
                  
                  <div className="admin-tracking-stats">
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label className="admin-tracking-label-plan">📅 Planificados</label>
                      <input 
                        type="number" 
                        value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.planificados || 0}
                        onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'planificados', e.target.value)}
                        className="admin-tracking-input"
                      />
                    </div>
                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <label className="admin-tracking-label-dead">🍂 Bajas de este tipo</label>
                      <input 
                        type="number" 
                        value={statsTipos.find(s => s.tipo === tipoFiltro.toLowerCase())?.muertos || 0}
                        onChange={(e) => handleUpdateStatTipo(tipoFiltro, 'muertos', e.target.value)}
                        className="admin-tracking-input"
                      />
                    </div>
                    <div className="admin-form-group" style={{ margin: 0, opacity: 0.8 }}>
                      <label className="admin-tracking-label-alive">🌲 Vivos en sistema</label>
                      <input 
                        type="text" 
                        disabled
                        value={arboles.filter(a => (a.tipo || 'Sin clasificar').toLowerCase() === tipoFiltro.toLowerCase() && a.estado !== 'muerto').length}
                        className="admin-tracking-input-disabled"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cargando ? (
              <div className="admin-loading-msg">
                Cargando árboles...
              </div>
            ) : arboles.filter(a => a.estado !== 'muerto').length === 0 ? (
              <div className="admin-empty-msg">
                <div className="admin-empty-icon">🌲</div>
                <p>No hay árboles activos registrados. ¡Agrega el primero!</p>
              </div>
            ) : (
              <>
                {arboles
                  .filter(a => a.estado !== 'muerto')
                  .filter(a => {
                    const matchesSearch = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                        (a.tipo || '').toLowerCase().includes(busqueda.toLowerCase());
                    const matchesType = !tipoFiltro || (a.tipo || '').toLowerCase() === tipoFiltro.toLowerCase();
                    return matchesSearch && matchesType;
                  }).length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#4d7a63', padding: '3rem', fontSize: '1rem' }}>
                    <p>No se encontraron árboles con los filtros aplicados.</p>
                  </div>
                ) : (
                  <div className="admin-arboles-lista">
                    {arboles
                      .filter(a => a.estado !== 'muerto')
                      .filter(a => {
                        const matchesSearch = a.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                            (a.tipo || '').toLowerCase().includes(busqueda.toLowerCase());
                        const matchesType = !tipoFiltro || (a.tipo || '').toLowerCase() === tipoFiltro.toLowerCase();
                        return matchesSearch && matchesType;
                      })
                      .map((arbol) => (
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
                          <p className="admin-card-clima-altura">
                            {arbol.clima ? `🌍 ${arbol.clima}` : ''}{' '}
                            {arbol.altura ? `• 📏 ${arbol.altura}` : ''}
                          </p>

                          {/* Info de Abono */}
                          <div className="admin-arbol-status-abono">
                            <div className="admin-abono-count-wrap">
                               <span className="admin-abono-badge">
                                 🦴 {arbol.historialAbono?.length || 0} Abonos
                               </span>
                               {arbol.historialAbono?.length > 0 && (
                                 <button 
                                   className="admin-btn-clear-history"
                                   onClick={() => handleLimpiarHistorialAbono(arbol)}
                                   title="Limpiar historial de abonos"
                                 >
                                   ×
                                 </button>
                               )}
                            </div>
                            {arbol.historialAbono?.length > 0 && (
                              <p className="admin-abono-last-date">
                                Último: {arbol.historialAbono[arbol.historialAbono.length - 1].fecha.split('-').reverse().join('/')}
                              </p>
                            )}
                          </div>
                          <div className="admin-arbol-card-actions">
                            <button
                              className="admin-btn-editar"
                              onClick={() => handleEditar(arbol)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="admin-btn-abonar"
                              onClick={() => handleAbonarArbol(arbol)}
                              title="Aplicar abono/fertilizante"
                            >
                              🍽️ Abonar
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
              </>
            )}
          </div>
        )}

        {/* ──── TAB: BAJAS ──── */}
        {tab === 'bajas' && (
          <div>
            <div className="admin-section-header">
              <h2>🍂 Registro de Bajas</h2>
              <p>Historial de piezas forestales declaradas como pérdida</p>
            </div>

            {arboles.filter(a => a.estado === 'muerto').length === 0 ? (
              <div className="admin-empty-msg">
                <div className="admin-empty-icon">🍃</div>
                <p>No hay registros de bajas en el sistema.</p>
              </div>
            ) : (
              <div className="admin-arboles-lista" style={{ gridTemplateColumns: '1fr', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {arboles
                  .filter(a => a.estado === 'muerto')
                  .sort((a,b) => new Date(b.fechaMuerto || 0) - new Date(a.fechaMuerto || 0))
                  .map((arbol) => (
                  <div key={arbol.id} className="admin-arbol-card admin-baja-card">
                     <div className="admin-baja-img-wrap">
                        {arbol.imagenUrl ? (
                           <img src={arbol.imagenUrl} alt={arbol.nombre} className="admin-baja-img" />
                        ) : <div className="admin-baja-placeholder">🍂</div>}
                     </div>
                     <div className="admin-baja-info">
                        <h3 className="admin-baja-title">{arbol.nombre}</h3>
                        <p className="admin-baja-type">
                           Especie: {arbol.tipo || 'mimbro'}
                        </p>
                        <p className="admin-baja-id">
                           ID: #{arbol.id}
                        </p>
                     </div>
                     <div className="admin-baja-date-wrap">
                        <p className="admin-baja-date-label">Fecha de Defunción</p>
                        <p className="admin-baja-date-value">
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

        {/* ──── TAB: USUARIOS ──── */}
        {tab === 'usuarios' && (
          <div>
            <div className="admin-section-header">
              <h2 style={{ color: '#ffffff' }}>👥 Gestión de Usuarios</h2>
              <p style={{ color: '#10b981', fontWeight: '600' }}>Administrar accesos y cuentas del sistema</p>
            </div>

            <div id="user-form-container" className="admin-form-card admin-user-form-container">
              <h3 className="admin-user-form-title">
                <span className="admin-user-form-title-icon">{modoEdicionUsuario ? '✏️' : '👤'}</span>
                {modoEdicionUsuario ? 'Editar Usuario' : 'Crear Usuarios'}
              </h3>
              
              <form onSubmit={handleUserSubmit} className="admin-user-form">
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-user-input-label">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                    placeholder="Ej: Juan Pérez"
                    className="admin-user-input"
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-user-input-label">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
                    placeholder="usuario@ejemplo.com"
                    className="admin-user-input"
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-user-input-label">Contraseña</label>
                  <input
                    type="password"
                    required={!modoEdicionUsuario}
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
                    placeholder={modoEdicionUsuario ? "Dejar en blanco para no cambiar..." : "••••••••"}
                    className="admin-user-input"
                    maxLength="15"
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-user-input-label">Rol de Acceso</label>
                  <select
                    value={formUsuario.rol}
                    onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
                    disabled={formUsuario.rol === 'admin'} // Un admin no puede bajarse el rango ni a otros
                    className="admin-user-select"
                  >
                    <option value="user">Usuario (Solo visualista)</option>
                    {formUsuario.rol === 'admin' && (
                       <option value="admin">Administrador (Control total)</option>
                    )}
                  </select>
                </div>
                
                <div className="admin-user-form-footer">
                  <button type="submit" className="admin-btn-user-submit">
                    {modoEdicionUsuario ? '💾 Guardar Cambios' : '➕ Crear Usuario'}
                  </button>
                  {modoEdicionUsuario && (
                    <button type="button" onClick={resetFormUsuario} className="admin-btn-user-cancel">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-arboles-lista admin-user-list">
              {usuarios.filter(user => user.rol !== 'voluntario').map(user => (
                <div key={user.id} className="admin-arbol-card admin-user-card">
                  <div className="admin-user-card-header">
                    <div className={`admin-user-avatar ${user.rol}`}>
                      {user.rol === 'admin' ? '👑' : '👤'}
                    </div>
                    <div className="admin-user-info-text">
                      <h3>{user.nombre}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="admin-user-id-badge">
                    <span className="admin-user-id-label">ID</span>
                    <span className="admin-user-id-value">#{user.id}</span>
                  </div>

                  <div className={`admin-user-role-badge ${user.rol}`}>
                    <span className="admin-user-role-dot"></span>
                    {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                  </div>

                  <div className="admin-user-card-footer">
                    <button 
                      onClick={() => handleEditarUsuario(user)} 
                      className="admin-btn-user-edit"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarUsuario(user.id, user.nombre)} 
                      disabled={user.rol === 'admin'} 
                      className="admin-btn-user-delete"
                      title={user.rol === 'admin' ? "No se puede eliminar administradores principales" : ""}
                    >
                      🗑️ Borrar
                    </button>
                    {user.rol !== 'admin' && (
                      <button 
                        onClick={() => handleConvertirUsuarioAVoluntariado(user)} 
                        className="admin-btn-user-convert"
                      >
                        🤝 Convertir a Voluntario
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── TAB: VOLUNTARIADOS ──── */}
        {tab === 'voluntariados' && (
          <div>
            <div className="admin-section-header">
              <h2 style={{ color: '#ffffff' }}>🤝 Gestión de Voluntarios</h2>
              <p style={{ color: '#10b981', fontWeight: '600' }}>Administrar la base de datos de voluntarios y sus áreas</p>
            </div>

            <div id="voluntariado-form-container" className="admin-form-card admin-user-form-container">
              <h3 className="admin-user-form-title">
                <span className="admin-user-form-title-icon">{modoEdicionVoluntariado ? '✏️' : '🤝'}</span>
                {modoEdicionVoluntariado ? 'Editar Ficha de Voluntario' : 'Registrar Nuevo Voluntario'}
              </h3>
              
              <form onSubmit={handleVoluntariadoSubmit} className="admin-user-form">
                <div className="admin-form-group" style={{ margin: 0 }}>
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
                
                <div className="admin-form-group" style={{ margin: 0 }}>
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

                <div className="admin-form-group" style={{ margin: 0 }}>
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

                <div className="admin-form-group" style={{ margin: 0 }}>
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
                    placeholder="Solo 8 números (ej: 88880000)"
                    className="admin-user-input"
                  />
                </div>
                
                <div className="admin-user-form-footer">
                  <button type="submit" className="admin-btn-user-submit">
                    {modoEdicionVoluntariado ? '💾 Actualizar Ficha' : '➕ Registrar Voluntario'}
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
                      🤝
                    </div>
                    <div className="admin-user-info-text">
                      <h3>{vol.nombre}</h3>
                      <p className="admin-vol-area">{vol.area}</p>
                    </div>
                  </div>
                  
                  <div className="admin-vol-contact-box">
                    <p>📧 <strong>Email:</strong> {vol.email}</p>
                    <p>📞 <strong>Tel:</strong> {vol.telefono}</p>
                  </div>

                  <div className="admin-vol-date">
                    Ingreso: {vol.fechaIngreso}
                  </div>

                  <div className="admin-user-card-footer">
                    <button 
                      onClick={() => handleEditarVoluntariado(vol)} 
                      className="admin-btn-user-edit"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarVoluntariado(vol.id, vol.nombre)} 
                      className="admin-btn-user-delete"
                    >
                      🗑️ Baja
                    </button>
                    <button 
                      onClick={() => handleConvertirVoluntariadoAUsuario(vol)} 
                      className="admin-vol-btn-convert"
                    >
                      👤 Convertir a Usuario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ──── TAB: ABONOS ──── */}
        {tab === 'abonos' && (
          <div className="admin-abonos-container">
            <div className="admin-section-header">
              <h2>🌿 Gestión de Abonos y Fertilizantes</h2>
              <p>Control de inventario y reposición de insumos</p>
            </div>

            <div className="admin-abono-form-card">
              <h3>{modoEdicionAbono ? '✏️ Reponer / Editar Stock' : '➕ Registrar Nuevo Producto'}</h3>
              <form onSubmit={handleAbonoSubmit} className="admin-abono-form">
                <div className="admin-form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={formAbono.nombre}
                    onChange={(e) => setFormAbono({...formAbono, nombre: e.target.value})}
                    placeholder="Ej: Compost Orgánico"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Cantidad en Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formAbono.stock}
                    onChange={(e) => setFormAbono({...formAbono, stock: e.target.value})}
                    className="admin-input-no-spinner"
                    placeholder="Ingresa cantidad..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Unidad (kg, L, sacos...)</label>
                  <input
                    type="text"
                    required
                    value={formAbono.unidad}
                    onChange={(e) => setFormAbono({...formAbono, unidad: e.target.value})}
                    placeholder="Ej: kg"
                  />
                </div>
                <div className="admin-abono-form-actions">
                  <button type="submit" className="admin-btn-save-abono">
                    {modoEdicionAbono ? '💾 Guardar Inventario' : '➕ Agregar al Sistema'}
                  </button>
                  {modoEdicionAbono && (
                    <button type="button" onClick={resetFormAbono} className="admin-btn-cancel-abono">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-abonos-grid">
              {abonos.map(abono => (
                <div key={abono.id} className="admin-abono-stat-card">
                  <div className="admin-abono-card-body">
                    <div className="admin-abono-icon">🔋</div>
                    <div className="admin-abono-info">
                      <h4>{abono.nombre}</h4>
                      <div className="admin-abono-stock-badge">
                        <span className="stock-number">{abono.stock}</span>
                        <span className="stock-unit">{abono.unidad} disponibles</span>
                      </div>
                    </div>
                  </div>
                  <div className="admin-abono-card-footer">
                    <button onClick={() => handleEditarAbono(abono)} className="btn-edit-stock">✏️ Editar Stock</button>
                    <button onClick={() => handleEliminarAbono(abono.id, abono.nombre)} className="btn-delete-abono">🗑️ Eliminar</button>
                  </div>
                </div>
              ))}
              {abonos.length === 0 && <p className="admin-no-data">No hay productos registrados en el inventario.</p>}
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
                    <div className="admin-type-input-group">
                      <input
                        id="tipo"
                        name="tipo"
                        type="text"
                        value={form.tipo}
                        onChange={handleChange}
                        placeholder="Escribe el nuevo tipo..."
                        required
                        className="admin-type-input"
                      />
                      <button 
                        type="button" 
                        onClick={() => { setModoNuevoTipo(false); setForm({ ...form, tipo: tiposDisponibles[0] || '' }); }}
                        className="admin-btn-cancel-type"
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
                      className="admin-img-preview-placeholder"
                      style={{
                        display: form.imagenUrl ? 'none' : 'flex',
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