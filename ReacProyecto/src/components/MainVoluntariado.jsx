import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Voluntariado.css';

function MainVoluntariado() {
  const navigate = useNavigate();

  return (
    <div className="voluntariado-main-container">
      {/* Hero Section */}
      <section className="voluntariado-hero" style={{ 
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '8rem 2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="voluntariado-hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Sé el Cambio que el Bosque Necesita</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Únete a nuestra Red Profesional de Voluntarios. Pon tus habilidades al servicio de la naturaleza y contribuye a restaurar el equilibrio de nuestro ecosistema forestal.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '15px 40px', backgroundColor: '#2e6b46', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              Postularme Ahora
            </button>
            <button style={{ padding: '15px 40px', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Ver Proyectos
            </button>
          </div>
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
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌱</div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Restauración Ecológica</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Participa en la selección, siembra y monitoreo de especies nativas bajo estándares científicos.</p>
          </div>
          <div className="voluntariado-info-card" style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '20px', borderBottom: '5px solid #166534' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Vigilancia y Protección</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Colabora con el equipo de patrullaje para prevenir la tala ilegal y asegurar la integridad de la reserva.</p>
          </div>
          <div className="voluntariado-info-card" style={{ padding: '2.5rem', backgroundColor: '#f9fafb', borderRadius: '20px', borderBottom: '5px solid #166534' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📚</div>
            <h3 style={{ color: '#1a4d2e', marginBottom: '1rem' }}>Gestión de Datos</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Asiste en el censo forestal y el registro digital de cada árbol en nuestra plataforma tecnológica.</p>
          </div>
        </div>
      </section>

      {/* Requirement Section */}
      <section style={{ backgroundColor: '#1a4d2e', padding: '5rem 2rem', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Requisitos del Voluntario</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>✅ Compromiso mínimo de 5 horas semanales.</li>
              <li style={{ display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>✅ Habilidades en botánica, logística o educación.</li>
              <li style={{ display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>✅ Vocación de servicio y trabajo en equipo.</li>
              <li style={{ display: 'flex', gap: '1rem', fontSize: '1.1rem' }}>✅ Residencia en áreas cercanas o movilidad propia.</li>
            </ul>
          </div>
          <div style={{ flex: '1 1 400px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2.5rem', borderRadius: '25px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Comienza tu camino hoy</h3>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Al registrarte, podrás completar tu perfil profesional y unirte a una brigada de trabajo.</p>
            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '18px', backgroundColor: 'white', color: '#1a4d2e', border: 'none', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              Acceder al Registro
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainVoluntariado;
