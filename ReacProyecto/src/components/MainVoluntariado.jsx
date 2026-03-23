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

      <section className="voluntariado-info-grid">
        <div className="voluntariado-info-card">
          <div className="vol-icon">🌱</div>
          <h3>Siembra Directa</h3>
          <p>Participa en jornadas de reforestación plantando especies nativas en áreas protegidas.</p>
        </div>
        <div className="voluntariado-info-card">
          <div className="vol-icon">💧</div>
          <h3>Mantenimiento</h3>
          <p>Ayuda en el riego, limpieza y cuidado de los árboles más jóvenes para asegurar su supervivencia.</p>
        </div>
        <div className="voluntariado-info-card">
          <div className="vol-icon">📚</div>
          <h3>Educación</h3>
          <p>Colabora en talleres educativos sobre la importancia del ecosistema forestal.</p>
        </div>
      </section>

      <section className="voluntariado-cta">
        <h2>¿Listo para marcar la diferencia?</h2>
        <p>Regístrate en nuestra plataforma y postúlate como voluntario hoy mismo.</p>
        <div className="vol-buttons">
          <button 
            className="vol-btn-primary" 
            onClick={() => navigate('/login')}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Registrarme Ahora
          </button>
        </div>
      </section>
    </div>
  );
}

export default MainVoluntariado;
