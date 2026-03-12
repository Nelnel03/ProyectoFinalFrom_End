import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/MainPagesInicoUser.css'; // Reutilizamos estilos del formulario

function MainPagesInicoVisitante() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'user'
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await services.postUsuarios(formData);
      setMensaje('¡Registro exitoso! Redirigiendo al login...');
      
      // Esperar un momento y redirigir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error("Error al registrar el usuario", error);
      setMensaje('Error al registrar. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <h1>Sistema de Control Forestal</h1>
        <p>Monitoreo de árboles, abonos y estado de vida</p>
      </header>
      
      <main className="visitante-content">
        <section className="visitante-intro">
          <h2>Bienvenido al Sistema</h2>
          <p>
            Únete a nuestra comunidad para el monitoreo forestal. 
            Registrate abajo para comenzar.
          </p>
        </section>

        {/* Sección de Registro añadida */}
        <div className="user-register-form-wrapper" style={{ margin: '2rem auto', boxShadow: 'none', border: '1px solid #eee' }}>
          <h3>Crea tu cuenta</h3>
          
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

            <button type="submit" className="user-register-btn">Registrarme ahora</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default MainPagesInicoVisitante;