import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import ReporteForm from './ReporteForm';
import '../styles/MainPagesInicoVisitante.css';

function MainPagesInicoUser() {
  const [userName, setUserName] = useState('');
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [activeTab, setActiveTab] = useState('perfil'); // 'perfil' | 'coleccion'
  const [showReportForm, setShowReportForm] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = sessionStorage.getItem('user');
    if (userData) {
      const userParsed = JSON.parse(userData);
      setUserName(userParsed.nombre);
      setUser(userParsed);
      // Si es un usuario normal, enviarlo a la colección por defecto
      if (userParsed.rol !== 'voluntario') {
        setActiveTab('coleccion');
      }
    }

    cargarArboles();
  }, [navigate]);

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

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="visitante-container" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <header className="visitante-header" style={{ 
        background: 'linear-gradient(135deg, #1a4d2e 0%, #2e6b46 100%)', 
        padding: '2.5rem 1rem',
        marginBottom: '0'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', margin: 0 }}>
            🌳 ¡Hola, {userName}! 
            {user?.rol === 'voluntario' && (
              <span style={{ 
                fontSize: '0.9rem', 
                backgroundColor: '#34d399', 
                color: '#064e3b', 
                padding: '6px 16px', 
                borderRadius: '20px', 
                marginLeft: '20px',
                verticalAlign: 'middle',
                fontWeight: '800',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                Voluntario Activo
              </span>
            )}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', color: 'white', marginTop: '10px' }}>
            Panel Personal de Control y Seguimiento Forestal
          </p>
        </div>
      </header>

      <main className="visitante-content" style={{ maxWidth: '1100px', padding: '0 1rem 3rem' }}>
        
        {/* Tabs de Navegación del Usuario */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'white', 
          marginTop: '-30px', 
          borderRadius: '15px', 
          padding: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          gap: '10px'
        }}>
          {user?.rol === 'voluntario' && (
            <button
              onClick={() => setActiveTab('perfil')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'perfil' ? '#1a4d2e' : 'transparent',
                color: activeTab === 'perfil' ? 'white' : '#4b5563',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              👤 Mi Perfil y Actividad
            </button>
          )}
          <button
            onClick={() => setActiveTab('coleccion')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'coleccion' ? '#1a4d2e' : 'transparent',
              color: activeTab === 'coleccion' ? 'white' : '#4b5563',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            🌳 Colección Forestal
          </button>
        </div>

        {/* CONTENIDO DE LA PESTAÑA PERFIL (Solo Voluntarios) */}
        {activeTab === 'perfil' && user?.rol === 'voluntario' && (
          <div className="animate-fade-in">
            <section 
              style={{ 
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                borderTop: '8px solid #1a4d2e'
              }}
            >
              <h2 style={{ color: '#1a4d2e', marginBottom: '1.5rem', fontSize: '1.8rem' }}>👤 Información del Voluntario</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre completo</p>
                  <p style={{ margin: '5px 0 0', fontWeight: '800', fontSize: '1.2rem', color: '#111827' }}>{user?.nombre}</p>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo electrónico</p>
                  <p style={{ margin: '5px 0 0', fontWeight: '800', fontSize: '1.1rem', color: '#111827' }}>{user?.email}</p>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Área asignada</p>
                  <p style={{ margin: '5px 0 0', fontWeight: '800', fontSize: '1.2rem', color: '#047857' }}>{user?.area}</p>
                </div>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Miembro desde</p>
                  <p style={{ margin: '5px 0 0', fontWeight: '800', fontSize: '1.2rem', color: '#111827' }}>{user?.fechaIngreso}</p>
                </div>
              </div>

              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button
                  onClick={() => setShowReportForm(!showReportForm)}
                  style={{
                    padding: '15px 40px',
                    backgroundColor: showReportForm ? '#ef4444' : '#1a4d2e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 15px -3px rgba(26, 77, 46, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {showReportForm ? '✕ Cancelar Registro' : '📝 Registrar Actividad Hoy'}
                </button>
              </div>
            </section>

            {showReportForm && (
              <div className="animate-slide-up">
                <ReporteForm 
                  user={user} 
                  onReportSubmitted={() => {
                    setTimeout(() => setShowReportForm(false), 2000);
                  }} 
                />
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO DE LA PESTAÑA COLECCIÓN */}
        {activeTab === 'coleccion' && (
          <div className="animate-fade-in">
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <h2 style={{ color: '#1a4d2e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🌳 Colección Forestal de La Angostura
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
                Consulta el estado de las especies forestales. Haz clic en las tarjetas para ver el historial de mantenimiento y progreso.
              </p>
              
              {cargando ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: '#44614d' }}>
                  <div className="loader"></div>
                  <p>Cargando especies forestales...</p>
                </div>
              ) : (
                <ArbolesSection arboles={arboles} />
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default MainPagesInicoUser;