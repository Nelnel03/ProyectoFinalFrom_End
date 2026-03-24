import React, { useEffect, useState } from 'react';



import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/MainPagesInicoUser.css';

function MainPagesInicoVisitante() {
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        ...formData,
        rol: 'user',
        telefono: 'N/A',
        direccion: 'N/A',
        fechaNacimiento: new Date().toISOString().split('T')[0]
      };
      await services.postUsuarios(newUser);
      setMensaje('¡Registro exitoso! Iniciando sesión...');
      // Simulamos inicio de sesión
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('user', JSON.stringify(newUser));
      window.location.href = '/user';
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Hubo un problema al crear tu cuenta.');
    }
  };


  return (
    <div className="visitante-container">
      <header className="visitante-header">

        <img src="/src/assets/logo.png" alt="Logo" className="visitante-logo" />

        <h1>BIOMON ADI</h1>
        <p>Monitoreo de árboles, especies y estado de vida</p>
      </header>

      <main className="visitante-content">
        <section className="visitante-intro">
          <h2>Bienvenido al Sistema</h2>
          <p>
            Explora nuestra base de datos de especies forestales. Haz click en cualquier
            tarjeta para ver información detallada de crecimiento, cuidados y más.
            Regístrate para acceder a funciones adicionales.
          </p>
        </section>

        {cargando ? (
          <div className="visitante-loading-state">
            Cargando especies forestales...
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}



        {sessionStorage.getItem('isAuthenticated') !== 'true' && (
          <>
            {/* Separador */}
            <div className="visitante-separator-line" />

            {/* Formulario de registro */}
            <div className="user-register-form-wrapper visitante-register-wrapper">
              <h3 className="visitante-register-title">
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