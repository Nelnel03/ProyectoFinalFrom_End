import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import '../styles/Login.css';

function MainPagesLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Llamada directa a la función importada
      const usuarios = await services.getUsuarios();
      
      const user = usuarios.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/user');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError('Hubo un problema al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="tu@correo.com"
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
            />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default MainPagesLogin;
