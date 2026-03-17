import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await services.postUsuarios(formData);
      setMensaje('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error al registrar el usuario', error);
      setMensaje('Error al registrar. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <h1>🌳 Sistema de Control Forestal</h1>
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

        {localStorage.getItem('isAuthenticated') !== 'true' && (
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