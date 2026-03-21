import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/MainPagesInicoUser.css';

function MainPagesInicoVisitante() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'user',
  });
  const [mensaje, setMensaje] = useState('');
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarArboles();
  }, []);

  const cargarArboles = async () => {
    setCargando(true);
    try {
      const datos = await services.getArboles();
      setArboles(datos || []);
    } catch (err) {
      console.error('Error al cargar árboles:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNombre = formData.nombre.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    // Validaciones
    if (!trimmedNombre) {
      Swal.fire('Error', 'El nombre no puede estar vacío', 'error');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      return;
    }

    if (trimmedPassword.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (trimmedPassword.length > 15) {
      Swal.fire('Error', 'La contraseña no puede exceder los 15 caracteres', 'error');
      return;
    }

    try {
      // Verificar si el email ya existe
      const usuarios = await services.getUsuarios();
      const userExists = usuarios.find(u => u.email === trimmedEmail);
      
      if (userExists) {
        Swal.fire('Atención', 'El correo electrónico ya está registrado', 'warning');
        return;
      }

      await services.postUsuarios({
        ...formData,
        nombre: trimmedNombre,
        email: trimmedEmail,
        password: trimmedPassword
      });

      Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Redirigiendo al login...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error al registrar el usuario', error);
      Swal.fire('Error', 'No se pudo completar el registro. Intente de nuevo.', 'error');
    }
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <img src="/src/assets/logo.png" alt="Logo" style={{ width: '120px', height: '120px', marginBottom: '1rem', borderRadius: '50%', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }} />
        <h1>BIOMON ADI</h1>
        <p>Monitoreo de árboles, especies y estado de vida</p>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px' }}>
        <section className="visitante-intro">
          <h2>Bienvenido al Sistema</h2>
          <p>
            Explora nuestra base de datos de especies forestales. Haz click en cualquier
            tarjeta para ver información detallada de crecimiento, cuidados y más.
            Regístrate para acceder a funciones adicionales.
          </p>
        </section>

        {/* Tarjetas de árboles visibles para visitantes */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
            Cargando especies forestales...
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}

        {sessionStorage.getItem('isAuthenticated') !== 'true' && (
          <>
            {/* Separador */}
            <div style={{
              borderTop: '1px solid rgba(46, 107, 70, 0.15)',
              margin: '2.5rem 0',
            }} />

            {/* Formulario de registro */}
            <div className="user-register-form-wrapper"
              style={{ margin: '0 auto', boxShadow: 'none', border: '1px solid #eee' }}
            >
              <h3 style={{ textAlign: 'center', color: '#0b532d', marginBottom: '1.5rem' }}>
                 🔐 Crea tu cuenta
              </h3>

              {mensaje && <div className="registro-exito-msg">{mensaje}</div>}

              <form onSubmit={handleSubmit}>
                <div className="user-form-group">
                  <label htmlFor="nombre">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="user-form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                    maxLength="15"
                  />
                </div>

                <button type="submit" className="user-register-btn">
                  Registrarme ahora
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoVisitante;