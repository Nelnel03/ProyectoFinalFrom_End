import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import * as emailjs from '@emailjs/browser';
import '../styles/Login.css';

function MainPagesLogin() {
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [rol, setRol] = useState('user'); // Default to user
  const [habilidades, setHabilidades] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [necesidades, setNecesidades] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    setError('');
    setLoading(true);

    try {
      if (!emailTrimmed || emailTrimmed === '') {
        setError('El correo es obligatorio');
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        setError('Formato de correo inválido');
        setLoading(false);
        return;
      }

      const usuarios = await services.getUsuarios();

      if (viewMode === 'forgot') {
        const user = usuarios.find(u => u.email.toLowerCase() === emailTrimmed.toLowerCase());
        if (!user) {
          // Por seguridad, mostrar mensaje genérico
          setSuccessMsg('Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña. Revisa la consola o alertas (modo simulación).');
        } else {
          // Generar token
          const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          const expiry = new Date(new Date().getTime() + 15 * 60000); // 15 mins
          
          const updatedUser = { ...user, resetToken: token, resetTokenExpiry: expiry.toISOString() };
          await services.putUsuarios(updatedUser, user.id);
          
          setSuccessMsg('Enviando enlace de recuperación a tu correo...');
          
          const resetLink = `${window.location.origin}/reset-password?token=${token}`;
          const templateParams = {
            to_email: email,
            reset_link: resetLink,
            user_name: user.nombre || 'Usuario'
          };

          try {
            await emailjs.send(
              'YOUR_SERVICE_ID', // Reemplaza con tu Service ID de EmailJS
              'YOUR_TEMPLATE_ID', // Reemplaza con tu Template ID de EmailJS
              templateParams,
              {
                publicKey: 'YOUR_PUBLIC_KEY' // Reemplaza con tu Public Key de EmailJS
              }
            );

            setSuccessMsg('¡Correo enviado exitosamente! Revisa tu bandeja de entrada o carpeta de spam.');
            Swal.fire({
              title: '¡Correo Enviado!',
              text: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
              icon: 'success',
              confirmButtonColor: '#2e6b46',
              confirmButtonText: 'Entendido'
            });
          } catch (emailError) {
            console.error('Error al enviar el correo con EmailJS:', emailError);
            setError('No se pudo enviar el correo de recuperación. Por favor, verifica tu configuración de EmailJS o intenta más tarde.');
            setSuccessMsg('');
          }
        }
        return;
      }

      if (viewMode === 'register') {
        // Validación de correo existente
        const emailExiste = usuarios.find(u => u.email.toLowerCase() === emailTrimmed.toLowerCase());
        if (emailExiste) {
          setError('El correo electrónico ya está registrado.');
          return;
        }

        if (password.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres.');
          return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
          setError('La contraseña debe contener al menos 1 letra mayúscula, 1 minúscula y 1 número.');
          return;
        }

        // Crear nuevo usuario con contraseña simuladamente "segura"
        // En producción se usa bcrypt en el Backend
        const hashedPassword = btoa(password + "_SECURE_SALT");
        const nuevoUsuario = {
          nombre,
          email,
          password: hashedPassword,
          rol: rol,
          // Campos específicos segun el rol
          habilidades: rol === 'voluntario' ? habilidades : null,
          disponibilidad: rol === 'voluntario' ? disponibilidad : null,
          necesidades: rol === 'user' ? necesidades : null,
          fechaRegistro: new Date().toISOString()
        };

        const result = await services.postUsuarios(nuevoUsuario);
        
        if (result) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(result));
          
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: 'Tu cuenta ha sido creada correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            if (rol === 'voluntario') {
                navigate('/dashboard-voluntario');
            } else {
                navigate('/dashboard-user');
            }
          }, 1500);
        } else {
          setError('Ocurrió un error al registrarse. Intenta nuevamente.');
        }

      } else if (viewMode === 'login') {
        const hashedPassword = btoa(password + "_SECURE_SALT");
        // Lógica de inicio de sesión: compatible con contraseñas del db.json y nuevas encriptadas
        const user = usuarios.find(u => u.email.toLowerCase() === emailTrimmed.toLowerCase() && (u.password === password || u.password === hashedPassword));

        if (user) {
          // Lógica de primer login para voluntarios (debe cambiar contraseña)
          if (user.rol === 'voluntario' && user.debeCambiarPassword) {
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
                if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
                const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
                if (!passRegex.test(value)) return 'Debe contener al menos 1 mayúscula, 1 minúscula y 1 número';
              }
            });

            if (newPassword) {
              const updatedHashedPassword = btoa(newPassword + "_SECURE_SALT");
              const updatedUser = { ...user, password: updatedHashedPassword, debeCambiarPassword: false };
              await services.putUsuarios(updatedUser, user.id);
              // Actualizamos el objeto user para el resto del flujo
              user.password = updatedHashedPassword;
              user.debeCambiarPassword = false;
            } else {
              setLoading(false);
              return; // Canceló el cambio, no entra
            }
          }

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          
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
            } else if (user.rol === 'voluntario') {
              navigate('/dashboard-voluntario');
            } else {
              navigate('/dashboard-user');
            }
          }, 1500);
        } else {
          setError('Correo o contraseña incorrectos');
        }
      }
    } catch (err) {
      console.error("Error en auth:", err);
      setError('Hubo un problema al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setViewMode(mode);
    setError('');
    setSuccessMsg('');
    setPassword('');
    if (mode === 'register') {
      setNombre('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          {viewMode === 'register' ? 'Crear una cuenta' : 
           viewMode === 'forgot' ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
        </h2>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {successMsg && <div className="success-message" style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>{successMsg}</div>}

        <form onSubmit={handleAuth}>
          {viewMode === 'register' && (
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
                <label>Tipo de Cuenta</label>
                <select 
                  value={rol} 
                  onChange={(e) => setRol(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="user">Usuario (Consumo/Apoyo)</option>
                  <option value="voluntario">Voluntario (Servicio/Profesional)</option>
                </select>
              </div>

              {rol === 'voluntario' ? (
                <>
                  <div className="form-group">
                    <label>Habilidades (Separadas por comas)</label>
                    <input 
                      type="text" 
                      value={habilidades} 
                      onChange={(e) => setHabilidades(e.target.value)} 
                      placeholder="Ej: Botánica, Logística, Educación"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Disponibilidad</label>
                    <input 
                      type="text" 
                      value={disponibilidad} 
                      onChange={(e) => setDisponibilidad(e.target.value)} 
                      placeholder="Ej: Fines de semana, 10am-4pm"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>¿Qué buscas en nuestra plataforma? (Necesidades)</label>
                  <textarea 
                    value={necesidades} 
                    onChange={(e) => setNecesidades(e.target.value)} 
                    placeholder="Ej: Quiero adoptar un árbol, me interesa la educación ambiental..."
                    rows="2"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@correo.com"
            />
          </div>

          {(viewMode === 'login' || viewMode === 'register') && (
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
              {viewMode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => toggleMode('forgot')}
                  style={{ 
                    background: 'none', border: 'none', 
                    color: '#2e6b46', fontSize: '0.85rem', cursor: 'pointer',
                    textDecoration: 'underline', marginTop: '8px', display: 'block', width: '100%', textAlign: 'right'
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Cargando...' : 
             viewMode === 'register' ? 'Registrarse' : 
             viewMode === 'forgot' ? 'Enviar enlace de recuperación' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }}>
          <span style={{ color: '#4b5563' }}>
            {viewMode === 'register' ? '¿Ya tienes una cuenta? ' : 
             viewMode === 'login' ? '¿No tienes cuenta? ' : 
             '¿Recordaste tu contraseña? '}
          </span>
          <button 
            type="button" 
            onClick={() => toggleMode(viewMode === 'register' || viewMode === 'forgot' ? 'login' : 'register')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1a4d2e', 
              fontWeight: '700', 
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              fontSize: '0.95rem'
            }}
          >
            {viewMode === 'register' || viewMode === 'forgot' ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPagesLogin;
