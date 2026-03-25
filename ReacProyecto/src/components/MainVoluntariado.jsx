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
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#1a4d2e', fontSize: '2.4rem', marginBottom: '1.5rem' }}>Nuestra Filosofía de Servicio</h2>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: '1.8' }}>
          No buscamos simples asistentes; buscamos guardianes comprometidos. Nuestro programa de voluntariado está diseñado para personas apasionadas que deseen profesionalizar su impacto ambiental.
        </p>
        
        <div className="voluntariado-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          <div className="voluntariado-info-card" style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '20px', borderBottom: '5px solid #166534' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}></div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Restauración Ecológica</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Participa en la selección, siembra y monitoreo de especies nativas bajo estándares científicos.</p>
          </div>
          <div className="voluntariado-info-card" style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '20px', borderBottom: '5px solid #166534' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}></div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Vigilancia y Protección</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Colabora con el equipo de patrullaje para prevenir la tala ilegal y asegurar la integridad de la reserva.</p>
          </div>
          <div className="voluntariado-info-card" style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '20px', borderBottom: '5px solid #166534' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}></div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Gestión de Datos</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Asiste en el censo forestal y el registro digital de cada árbol en nuestra plataforma tecnológica.</p>
          </div>
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
