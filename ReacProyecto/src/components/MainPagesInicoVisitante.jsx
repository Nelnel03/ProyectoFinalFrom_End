import React, { useEffect, useState } from 'react';
import services from '../services/services';
import ArbolesSection from './ArbolesSection';
import '../styles/MainPagesInicoVisitante.css';
import '../styles/MainPagesInicoUser.css';

function MainPagesInicoVisitante() {
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          style={{ width: '120px', height: '120px', marginBottom: '1rem', borderRadius: '50%', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
        />
        <h1>BIOMON ADI</h1>
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

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#44614d' }}>
            Cargando especies forestales...
          </div>
        ) : (
          <ArbolesSection arboles={arboles} />
        )}
      </main>
    </div>
  );
}

export default MainPagesInicoVisitante;