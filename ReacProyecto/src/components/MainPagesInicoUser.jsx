import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPagesInicoVisitante.css';

function MainPagesInicoUser() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Obtener nombre del usuario guardado
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nombre);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <h1>Panel de Usuario</h1>
        <p>Bienvenido de vuelta, <strong>{userName}</strong></p>
      </header>
      
      <main className="visitante-content">
        <section className="visitante-intro">
          <h2>Monitor Forestal - Mi Perfil</h2>
          <p>
            Esta es tu área privada. Aquí podrás gestionar tus árboles, 
            ver estadísticas avanzadas y controlar tus abonos.
          </p>
          <button 
            onClick={handleLogout}
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </section>
        
        {/* Aquí agregaremos más funcionalidades de usuario luego */}
      </main>
    </div>
  );
}

export default MainPagesInicoUser;