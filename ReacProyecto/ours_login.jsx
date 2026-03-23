import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import services from '../services/services';
import '../styles/Login.css';

function MainPagesLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validations
    if (!validateEmail(trimmedEmail)) {
      Swal.fire('Error', 'Por favor, ingresa un correo electr├│nico v├ílido', 'error');
      return;
    }

    if (trimmedPassword.length < 6) {
      Swal.fire('Error', 'La contrase├▒a debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (trimmedPassword.length > 15) {
      Swal.fire('Error', 'La contrase├▒a no puede exceder los 15 caracteres', 'error');
      return;
    }

    try {
      // Llamada directa a la funci├│n importada
      const usuarios = await services.getUsuarios();
      
      const user = usuarios.find(u => u.email === trimmedEmail && u.password === trimmedPassword);

      if (user) {
        // ┬┐Debe cambiar la contrase├▒a (primer login de voluntario)?
        if (user.debeCambiarPassword) {
            const { value: newPassword } = await Swal.fire({
                title: 'Primer Inicio de Sesi├│n',
                text: 'Como nuevo voluntario, debes cambiar tu contrase├▒a temporal.',
                input: 'password',
                inputPlaceholder: 'Ingresa tu nueva contrase├▒a',
                showCancelButton: true,
                confirmButtonText: 'Cambiar y Entrar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) return 'La nueva contrase├▒a es obligatoria';
                    if (value.length < 6) return 'M├¡nimo 6 caracteres';
                    if (value.length > 15) return 'M├íximo 15 caracteres';
                }
            });

            if (newPassword) {
                const updatedUser = { ...user, password: newPassword, debeCambiarPassword: false };
                await services.putUsuarios(updatedUser, user.id);
                // Actualizamos la referencia local
                user.password = newPassword;
                user.debeCambiarPassword = false;
            } else {
                return; // Cancel├│ el cambio, no entra
            }
        }

        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('user', JSON.stringify(user));
        
        Swal.fire({
          title: '┬íBienvenido!',
          text: `Sesi├│n iniciada como ${user.nombre}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir seg├║n rol
        setTimeout(() => {
          if (user.rol === 'admin') {
            navigate('/admin');
          } else if (user.rol === 'voluntario') {
            navigate('/user'); // O a una p├ígina espec├¡fica de voluntario si existe
          } else {
            navigate('/user');
          }
        }, 1500);
      } else {
        Swal.fire('Error', 'Correo o contrase├▒a incorrectos', 'error');
      }
    } catch (err) {
      console.error("Error en login:", err);
      Swal.fire('Error', 'Hubo un problema al conectar con el servidor', 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesi├│n</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electr├│nico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="tu@correo.com"
            />
          </div>

          <div className="form-group">
            <label>Contrase├▒a</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
              maxLength="15"
            />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default MainPagesLogin;
