import React from 'react';
import './MainPagesInicoVisitante.css'; // Importaremos los estilos luego

function MainPagesInicoVisitante() {
  return (
    <div className="visitante-container">
      <header className="visitante-header">
        <h1>Sistema de Control Forestal</h1>
        <p>Monitoreo de árboles, abonos y estado de vida</p>
      </header>
      
      <main className="visitante-content">
        <section className="visitante-intro">
          <h2>Panel de Inicio - Visitante</h2>
          <p>
            Bienvenido. Desde aquí comenzaremos a construir la visualización 
            para el registro de árboles, contabilización de abonos y estadísticas.
          </p>
          {/* Aquí iremos agregando las tarjetas e información paso a paso */}
        </section>
      </main>
    </div>
  );
}

export default MainPagesInicoVisitante;