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
      const [datosArboles, datosStats, datosUsuarios, datosAbonos, datosVoluntariados] = await Promise.all([
        services.getArboles(),
        services.getStatsTipos(),
        services.getUsuarios(),
        services.getAbonos(),
        services.getVoluntariados()
      ]);
      setArboles(datosArboles || []);
      setStatsTipos(datosStats || []);
      setUsuarios(datosUsuarios || []);
      setAbonos(datosAbonos || []);
      setVoluntariados(datosVoluntariados || []);
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
  }, [navigate, cargarArboles]);

  const handleAbonoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicionAbono) {
        await services.putAbonos(formAbono, idEditandoAbono);
        Swal.fire('Actualizado', 'Insumo actualizado correctamente', 'success');
      } else {
        await services.postAbonos(formAbono);
        Swal.fire('Registrado', 'Nuevo abono agregado al sistema', 'success');
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
  };

  const handleEliminarAbono = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de quitar "${nombre}" del inventario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonColor: '#d33'
    });

    if (confirm.isConfirmed) {
      try {
        await services.deleteAbonos(id);
        Swal.fire('Eliminado', 'Producto removido', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    }
  };

  const resetFormAbono = () => {
    setFormAbono(ABONO_FORM_INICIAL);
    setModoEdicionAbono(false);
    setIdEditandoAbono(null);
  };

  const handleAbonarArbol = async (arbol) => {
    if (abonos.length === 0) {
      Swal.fire('Atención', 'No hay abonos registrados en el inventario. Agrega uno primero.', 'warning');
      setTab('abonos');
      return;
    }

    const { value: abonoId } = await Swal.fire({
      title: `Abonar "${arbol.nombre}"`,
      text: 'Selecciona el producto a aplicar:',
      input: 'select',
      inputOptions: abonos.reduce((acc, ab) => {
        acc[ab.id] = `${ab.nombre} (${ab.stock} ${ab.unidad})`;
        return acc;
      }, {}),
      inputPlaceholder: 'Selecciona un abono...',
      showCancelButton: true,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Cancelar'
    });

    if (abonoId) {
      const abonoSelected = abonos.find(a => a.id === abonoId);
      if (!abonoSelected || parseInt(abonoSelected.stock) <= 0) {
        Swal.fire('Error', 'No hay suficiente stock de este producto.', 'error');
        return;
      }

      try {
        // Actualizar stock del abono
        const newStock = parseInt(abonoSelected.stock) - 1;
        await services.putAbonos({ ...abonoSelected, stock: newStock }, abonoId);

        // Actualizar historial del árbol
        const nuevoHistorial = [...(arbol.historialAbono || [])];
        nuevoHistorial.push({
          idAbono: abonoId,
          nombreAbono: abonoSelected.nombre,
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        await services.putArboles({ ...arbol, historialAbono: nuevoHistorial }, arbol.id);
        
        Swal.fire('Éxito', `Has aplicado ${abonoSelected.nombre} a ${arbol.nombre}.`, 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo completar la operación.', 'error');
      }
    }
  };

  const handleLimpiarHistorialAbono = async (arbol) => {
    const confirm = await Swal.fire({
      title: '¿Limpiar historial?',
      text: `Se borrará el registro de abonos para "${arbol.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await services.putArboles({ ...arbol, historialAbono: [] }, arbol.id);
        Swal.fire('Limpio', 'Historial reiniciado.', 'success');
        await cargarArboles();
      } catch (err) {
        Swal.fire('Error', 'No se pudo limpiar el historial.', 'error');
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
    } catch (e) {
      console.error(e);
      mostrarMensaje('Error al actualizar estadísticas del tipo.', 'error');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedNombre = formUsuario.nombre.trim();
    const trimmedEmail = formUsuario.email.trim();
    const trimmedPassword = formUsuario.password.trim();

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
        password: trimmedPassword || formUsuario.password
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

  const handleVoluntariadoSubmit = async (e) => {
    e.preventDefault();
    const trimmedNombre = formVoluntariado.nombre.trim();
    const trimmedArea = formVoluntariado.area.trim();
    const trimmedEmail = formVoluntariado.email.trim();
    const trimmedTelefono = formVoluntariado.telefono.trim();

    if (!trimmedNombre || trimmedNombre.length < 4 || !trimmedArea) {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const emailDuplicado = usuarios.find(u => 
      u.email.toLowerCase() === trimmedEmail.toLowerCase() && 
      (!modoEdicionVoluntariado || u.id !== idEditandoVoluntariado)
    );
    if (emailDuplicado) {
      Swal.fire('Atención', 'Este correo ya está registrado.', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Confirmar registro?',
      text: `¿Deseas guardar la ficha del voluntario "${trimmedNombre}"?`,
      icon: 'question',
      showCancelButton: true
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
        Swal.fire('Éxito', 'Voluntario actualizado', 'success');
      } else {
        const nuevoVoluntarioUser = {
          ...voluntariadoFinal,
          password: 'Voluntario123',
          debeCambiarPassword: true
        };
        await services.postVoluntariados(nuevoVoluntarioUser);
        Swal.fire('Registrado', 'Voluntario creado. Password: Voluntario123', 'success');
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
    setTimeout(() => {
      document.getElementById('voluntariado-form-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEliminarVoluntariado = async (id, nombre) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar voluntario?',
      text: `¿Estás seguro de quitar a "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true
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
      title: '🤝 Convertir a Voluntario',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Área de Interés">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Teléfono" maxlength="8">`,
      showCancelButton: true,
      preConfirm: () => {
        const area = document.getElementById('swal-input1').value;
        const telefono = document.getElementById('swal-input2').value;
        if (!area || !telefono) {
          Swal.showValidationMessage('Llena todos los campos');
          return false;
        }
        return { area, telefono };
      }
    });

    if (formValues) {
      try {
        const updated = { ...user, rol: 'voluntario', ...formValues, fechaIngreso: new Date().toISOString().split('T')[0] };
        await services.putUsuarios(updated, user.id);
        Swal.fire('Éxito', `${user.nombre} ahora es voluntario.`, 'success');
        setTab('voluntariados');
        await cargarArboles();
      } catch (e) {
        Swal.fire('Error', 'No se pudo convertir.', 'error');
      }
    }
  };

  const handleConvertirVoluntariadoAUsuario = async (vol) => {
    const { value: password } = await Swal.fire({
      title: '👤 Convertir a Usuario',
      input: 'password',
      inputPlaceholder: 'Contraseña nueva',
      showCancelButton: true,
      inputValidator: (v) => !v && 'Debes ingresar una contraseña'
    });

    if (password) {
      try {
        const updated = { ...vol, password, rol: 'user' };
        delete updated.area;
        delete updated.telefono;
        delete updated.fechaIngreso;
        await services.putUsuarios(updated, vol.id);
        Swal.fire('Éxito', `${vol.nombre} ahora es usuario normal.`, 'success');
        setTab('usuarios');
        await cargarArboles();
      } catch (e) {
        Swal.fire('Error', 'No se pudo convertir.', 'error');
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
    <div className="dashboard-premium">
      <header className="premium-header">
        <div className="premium-header-flex">
          <div>
            <h2 className="premium-header-subtitle">BioMon ADI</h2>
            <h1>🌳 Panel de Control</h1>
            <p className="premium-header-welcome">
              Bienvenido, <strong>{adminName}</strong>. Gestionando la biodiversidad forestal de La Angostura.
            </p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-logout-premium" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="glass-card glass-card-container">
        {mensaje.texto && (
          <div className={`admin-msg ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="premium-tabs premium-tabs-container">
          {[
            { id: 'resumen', label: '📊 Resumen', reset: resetForm },
            { id: 'lista', label: `📋 Árboles (${arboles.filter(a => a.estado !== 'muerto').length})`, reset: resetForm },
            { id: 'bajas', label: `🍂 Bajas (${arboles.filter(a => a.estado === 'muerto').length})`, reset: resetForm },
            { id: 'usuarios', label: '👥 Usuarios', reset: resetFormUsuario },
            { id: 'voluntariados', label: '🤝 Voluntariados', reset: resetFormVoluntariado },
            { id: 'abonos', label: `🦴 Abonos (${abonos.length})`, reset: resetFormAbono },
            { id: 'agregar', label: modoEdicion ? '✏️ Editar' : '➕ Agregar', reset: resetForm }
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

        {cargando ? (
          <div className="admin-loading-container">
            <div className="admin-loader"></div>
            <p>Sincronizando con el bosque...</p>
          </div>
        ) : (
          <div className="admin-tab-content">
            {tab === 'resumen' && (
              <ResumenTab 
                arboles={arboles} 
                tiposDisponibles={tiposDisponibles}
                statsTipos={statsTipos} 
                setTipoFiltro={setTipoFiltro}
                setTab={setTab}
              />
            )}

            {tab === 'lista' && (
              <ListaTab 
                arboles={arboles} 
                busqueda={busqueda} 
                setBusqueda={setBusqueda} 
                tipoFiltro={tipoFiltro}
                setTipoFiltro={setTipoFiltro}
                tiposDisponibles={tiposDisponibles}
                setTab={setTab}
                handleEliminarTipo={handleEliminarTipo}
                statsTipos={statsTipos}
                handleUpdateStatTipo={handleUpdateStatTipo}
                cargando={false}
                handleEditar={handleEditar} 
                handleAbonarArbol={handleAbonarArbol}
                handleEliminar={handleEliminar}
                handleLimpiarHistorialAbono={handleLimpiarHistorialAbono}
              />
            )}

            {tab === 'bajas' && (
              <BajasTab 
                arboles={arboles} 
                handleEditar={handleEditar} 
              />
            )}

            {tab === 'usuarios' && (
              <UsuariosTab 
                modoEdicionUsuario={modoEdicionUsuario}
                handleUserSubmit={handleUserSubmit}
                formUsuario={formUsuario}
                setFormUsuario={setFormUsuario}
                resetFormUsuario={resetFormUsuario}
                usuarios={usuarios}
                handleEditarUsuario={handleEditarUsuario}
                handleEliminarUsuario={handleEliminarUsuario}
                handleConvertirUsuarioAVoluntariado={handleConvertirUsuarioAVoluntariado}
              />
            )}

            {tab === 'voluntariados' && (
              <VoluntariadosTab 
                modoEdicionVoluntariado={modoEdicionVoluntariado}
                handleVoluntariadoSubmit={handleVoluntariadoSubmit}
                formVoluntariado={formVoluntariado}
                setFormVoluntariado={setFormVoluntariado}
                resetFormVoluntariado={resetFormVoluntariado}
                voluntariados={voluntariados}
                handleEditarVoluntariado={handleEditarVoluntariado}
                handleEliminarVoluntariado={handleEliminarVoluntariado}
                handleConvertirVoluntariadoAUsuario={handleConvertirVoluntariadoAUsuario}
              />
            )}

            {tab === 'abonos' && (
              <AbonosTab 
                modoEdicionAbono={modoEdicionAbono}
                handleAbonoSubmit={handleAbonoSubmit}
                formAbono={formAbono}
                setFormAbono={setFormAbono}
                resetFormAbono={resetFormAbono}
                abonos={abonos}
                handleEditarAbono={handleEditarAbono}
                handleEliminarAbono={handleEliminarAbono}
              />
            )}

            {tab === 'agregar' && (
              <ArbolFormTab 
                modoEdicion={modoEdicion}
                handleSubmit={handleSubmit}
                form={form}
                handleChange={handleChange}
                modoNuevoTipo={modoNuevoTipo}
                setModoNuevoTipo={setModoNuevoTipo}
                tiposDisponibles={tiposDisponibles}
                resetForm={resetForm}
                setTab={setTab}
                setForm={setForm}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoAdmin;