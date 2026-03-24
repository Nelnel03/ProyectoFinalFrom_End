import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/Login.css';

function MainPagesLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (emailValue) => {
    return String(emailValue)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!validateEmail(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electrónico válido', 'error');
      setLoading(false);
      return;
    }

    try {
      const usuarios = await services.getUsuarios();
      const user = usuarios.find(u => u.email === trimmedEmail && u.password === trimmedPassword);

      if (user) {
        if (user.debeCambiarPassword) {
          const { value: newPassword } = await Swal.fire({
            title: 'Primer Inicio de Sesión',
            text: 'Como nuevo voluntario, debes cambiar tu contraseña temporal.',
            input: 'password',
            inputPlaceholder: 'Ingresa tu nueva contraseña',
            showCancelButton: true,
            confirmButtonText: 'Cambiar y Entrar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
              if (!value) return 'La nueva contraseña es obligatoria';
              if (value.length < 6) return 'Mínimo 6 caracteres';
              if (value.length > 15) return 'Máximo 15 caracteres';
            }
          });

          if (newPassword) {
            const updatedUser = { ...user, password: newPassword, debeCambiarPassword: false };
            await services.putUsuarios(updatedUser, user.id);
            user.password = newPassword;
            user.debeCambiarPassword = false;
          } else {
            setLoading(false);
            return;
          }
        }

        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('user', JSON.stringify(user));

        Swal.fire({
          title: '¡Bienvenido!',
          text: `Sesión iniciada como ${user.nombre}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          if (user.rol === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }, 1500);
      } else {
        Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');
      }
    } catch (err) {
      console.error('Error en login:', err);
      Swal.fire('Error', 'Hubo un problema al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !email.trim() || !telefono.trim() || !password.trim() || !direccion.trim() || !fechaNacimiento) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (!validateEmail(email.trim())) {
      Swal.fire('Error', 'Correo electrónico no válido', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      const usuarios = await services.getUsuarios();
      if (usuarios.find(u => u.email === email.trim())) {
        Swal.fire('Error', 'El correo ya está registrado', 'error');
        return;
      }

      const newUser = {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        fechaNacimiento: fechaNacimiento,
        password: password.trim(),
        rol: 'user'
      };

      await services.postUsuarios(newUser);

      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Ahora puedes iniciar sesión con tus credenciales',
        icon: 'success',
        confirmButtonText: 'Genial'
      });

      setIsRegistering(false);
      setNombre('');
      setTelefono('');
      setDireccion('');
      setFechaNacimiento('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error en registro:', err);
      Swal.fire('Error', 'No se pudo completar el registro', 'error');
    }
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">

        <img src="/src/assets/logo.png" alt="Logo" className="visitante-logo" />

        <h1>BIOMON ADI</h1>
        <p>Monitoreo de árboles, especies y estado de vida</p>
      </header>

      <div className="login-card">
        <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>

        {error && (
          <div style={{ color: '#c0392b', background: '#fdecea', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="form-group">
                <label>Número de Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  placeholder="8888-8888"
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  placeholder="Calle, Ciudad, Provincia"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              maxLength="15"
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                maxLength="15"
              />
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer-container">
          <p className="login-footer-text">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}

              className="login-footer-link"

            >
              {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainPagesLogin;
