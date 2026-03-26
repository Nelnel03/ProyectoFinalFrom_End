import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Voluntariado.css';

function MainVoluntariado() {
  const navigate = useNavigate();

  return (
    <div className="voluntariado-main-container">
      <section className="voluntariado-hero">
        <div className="voluntariado-hero-content">
          <h1>Únete como Voluntario</h1>
          <p>Forma parte de nuestra misión para proteger la biodiversidad y restaurar nuestros bosques.</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section">
        <h2 className="philosophy-title">Nuestra Filosofía de Servicio</h2>
        <p className="philosophy-text">
          No buscamos simples asistentes; buscamos guardianes comprometidos. Nuestro programa de voluntariado está diseñado para personas apasionadas que deseen profesionalizar su impacto ambiental.
        </p>
        
        <div className="info-grid-modern">
          <div className="info-card-modern">
            <h3 className="info-card-title">Restauración Ecológica</h3>
            <p className="info-card-text">Participa en la selección, siembra y monitoreo de especies nativas bajo estándares científicos.</p>
          </div>
          <div className="info-card-modern">
            <h3 className="info-card-title">Vigilancia y Protección</h3>
            <p className="info-card-text">Colabora con el equipo de patrullaje para prevenir la tala ilegal y asegurar la integridad de la reserva.</p>
          </div>
          <div className="info-card-modern">
            <h3 className="info-card-title">Gestión de Datos</h3>
            <p className="info-card-text">Asiste en el censo forestal y el registro digital de cada árbol en nuestra plataforma tecnológica.</p>
          </div>
        </div>
      </section>


      <section className="voluntariado-cta">
        <h2>¿Listo para marcar la diferencia?</h2>
        <p>Regístrate en nuestra plataforma y postúlate como voluntario hoy mismo.</p>
        <div className="vol-buttons">
          <button 
            className="vol-btn-primary btn-full" 
            onClick={() => navigate('/login')}
          >
            Registrarme Ahora
          </button>
        </div>
      </section>
    </div>
  );
}

export default MainVoluntariado;
