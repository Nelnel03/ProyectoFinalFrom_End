import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import services from '../services/services';
import Footer from '../components/Footer';
import '../styles/Login.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Validate token on load
    if (!token) {
      setError('Enlace inválido o incompleto.');
      return;
    }

    const verifyToken = async () => {
      try {
        const usuarios = await services.getUsuarios();
        const foundUser = usuarios.find(u => u.resetToken === token);
        
        if (!foundUser) {
          setError('El enlace de recuperación es inválido o ya ha sido utilizado.');
          return;
        }

        const now = new Date();
        const expiry = new Date(foundUser.resetTokenExpiry);

        if (now > expiry) {
          setError('El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.');
        } else {
          setUser(foundUser);
        }
      } catch (err) {
        console.error("Error al verificar token:", err);
        setError('Ocurrió un problema al verificar tu enlace.');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    
    // Password validation
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe contener al menos 1 letra mayúscula, 1 minúscula y 1 número.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // Backend mock hash
      const hashedPassword = btoa(password + "_SECURE_SALT");

      // Update password and invalidate token
      const updatedUser = { 
        ...user, 
        password: hashedPassword, 
        resetToken: null, 
        resetTokenExpiry: null 
      };
      
      await services.putUsuarios(updatedUser, user.id);
      setSuccess('Tu contraseña ha sido actualizada correctamente.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-card">
          <h2>Restablecer Contraseña</h2>
          
          {error ? (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
              {error}
              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => navigate('/login')}
                  style={{ background: 'none', border: 'none', color: '#1a4d2e', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </div>
          ) : success ? (
            <div className="success-message" style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>
              {success}
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
                Ingresa y confirma tu nueva contraseña.
              </p>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  minLength={8}
                />
                <small style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                  Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.
                </small>
              </div>

              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
