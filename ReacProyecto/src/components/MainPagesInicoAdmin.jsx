import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import AdminReports from './AdminReports';
import AdminReportesRobo from './AdminReportesRobo';
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
  const [tab, setTab] = useState('resumen'); // 'lista' | 'agregar' | 'seguimiento' | 'resumen' | 'bajas' | 'usuarios'
  const [tipoFiltro, setTipoFiltro] = useState('mimbro');
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
  const mostrarMensaje = useCallback((texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3500);
  }, []);

  const cargarArboles = useCallback(async () => {
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
      console.error(err);
      mostrarMensaje('Error al cargar la información.', 'error');
    } finally {
      setCargando(false);
    }
  }, [mostrarMensaje]);

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
      mostrarMensaje('Error al procesar el usuario', 'error');
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
        console.error(err);
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
      console.error(e);
      mostrarMensaje('Error al actualizar estadísticas del tipo.', 'error');
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
      console.error(err);
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
           console.error(e);
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
                  style={{  
                    backgroundColor: '#10b981', /* Esmeralda vibrante */
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    transition: 'transform 0.2s, background-color 0.2s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
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
              <h2 style={{ color: '#ffffff' }}>👥 Gestión de Usuarios</h2>
              <p style={{ color: '#10b981', fontWeight: '600' }}>Administrar accesos y cuentas del sistema</p>
            </div>

            <div className="admin-form-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{modoEdicionUsuario ? '✏️' : '👤'}</span>
                {modoEdicionUsuario ? 'Editar Cuenta de Usuario' : 'Crear Nueva Cuenta'}
              </h3>
              
              <form onSubmit={handleUserSubmit} style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', 
                padding: '1.5rem', 
                borderRadius: '12px',
                border: '2px solid #10b981'
              }}>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', marginBottom: '8px', display: 'block' }}>Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                    placeholder="Ej: Juan Pérez"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #c5d6cc', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', marginBottom: '8px', display: 'block' }}>Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
                    placeholder="usuario@ejemplo.com"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #c5d6cc', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', marginBottom: '8px', display: 'block' }}>Contraseña</label>
                  <input
                    type="password"
                    required={!modoEdicionUsuario}
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
                    placeholder={modoEdicionUsuario ? "Dejar en blanco para no cambiar..." : "••••••••"}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #c5d6cc', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
                
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem', marginBottom: '8px', display: 'block' }}>Rol de Acceso</label>
                  <select
                    value={formUsuario.rol}
                    onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #c5d6cc', fontSize: '1rem', cursor: 'pointer', appearance: 'auto', outline: 'none' }}
                  >
                    <option value="user">Usuario (Solo visualista)</option>
                    <option value="admin">Administrador (Control total)</option>
                  </select>
                </div>
                
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" style={{ 
                    flex: 1, 
                    padding: '12px 24px', 
                    backgroundColor: '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontWeight: '800', 
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}>
                    {modoEdicionUsuario ? '💾 Guardar Cambios' : '➕ Crear Usuario'}
                  </button>
                  {modoEdicionUsuario && (
                    <button type="button" onClick={resetFormUsuario} style={{ 
                      padding: '12px 24px', 
                      backgroundColor: '#9ca3af', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: '800'
                    }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-arboles-lista" style={{ 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {usuarios.map(user => (
                <div key={user.id} className="admin-arbol-card" style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.2rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      backgroundColor: user.rol === 'admin' ? '#fee2e2' : '#e0f2fe', 
                      borderRadius: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1.8rem',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      {user.rol === 'admin' ? '👑' : '👤'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#000000', fontWeight: '900' }}>{user.nombre}</h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.95rem', color: '#000000', fontWeight: '700', opacity: 0.8 }}>{user.email}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#e0f2f1', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#000000' }}>#{user.id}</span>
                  </div>

                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    width: 'fit-content',
                    backgroundColor: user.rol === 'admin' ? '#fee2e2' : '#bae6fd',
                    color: user.rol === 'admin' ? '#ef4444' : '#0284c7',
                    border: user.rol === 'admin' ? '1px solid #fca5a5' : '1px solid #7dd3fc'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                    {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleEditarUsuario(user)} 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        backgroundColor: '#e5e7eb', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: '700', 
                        color: '#374151'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarUsuario(user.id, user.nombre)} 
                      disabled={user.rol === 'admin'} 
                      style={{ 
                        flex: 1, 
                        padding: '10px', 
                        backgroundColor: '#fee2e2', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: user.rol === 'admin' ? 'not-allowed' : 'pointer', 
                        fontWeight: '700', 
                        color: '#b91c1c',
                        opacity: user.rol === 'admin' ? 0.6 : 1
                      }}
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