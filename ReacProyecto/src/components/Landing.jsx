import React from 'react';
import { Leaf, ArrowRight, Shield, Map as MapIcon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: 'var(--fuente-principal)', color: 'var(--color-texto)' }}>
            {/* Cabecera / Sección Hero */}
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(rgba(0, 119, 182, 0.7), rgba(0, 180, 216, 0.8)), url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
                color: 'white',
                padding: '2rem'
            }}>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: 'var(--color-caracola)', lineHeight: 1.1, fontWeight: '800', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase' }}>
                        Descubre y Protege La Angostura
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#e0e0e0', lineHeight: 1.6 }}>
                        Explora la asombrosa variedad de flora y fauna en Puntarenas. Únete a nuestra comunidad de voluntarios para registrar, monitorear y asegurar la conservación de nuestro ecosistema forestal.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{ background: 'var(--color-coral)', color: 'white', border: 'none', padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s', fontFamily: 'var(--fuente-principal)' }}
                    >
                        Comenzar Ahora <ArrowRight size={22} />
                    </button>
                </div>
            </div>

            {/* Sección de Localidades */}
            <div style={{ padding: '5rem 2rem', background: 'var(--color-arena)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-mar-profundo)', marginBottom: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase' }}>Localidades del Corredor</h2>
                <p style={{ color: 'var(--color-texto)', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                    Trabajamos en la recuperación de tres sectores estratégicos que conectan el ecosistema costero de Puntarenas.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Chacarita */}
                    <div 
                        onClick={() => navigate('/mapa')}
                        style={{ padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ background: '#e9f5ed', width: '70px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <MapIcon size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 style={{ color: 'var(--color-mar-profundo)', marginBottom: '1rem', fontSize: '1.5rem', fontFamily: 'var(--fuente-acento)' }}>Chacarita</h3>
                        <p style={{ color: '#666', lineHeight: 1.6 }}>El acceso principal al corredor. Esfuerzos centrados en la recuperación de la Playa y el área periurbana del Estero.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            Ver mapa local <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* La Angostura */}
                    <div 
                        onClick={() => navigate('/historia')}
                        style={{ padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ background: '#e9f5ed', width: '70px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <Leaf size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 style={{ color: 'var(--color-mar-profundo)', margin: '1rem 0', fontSize: '1.5rem', fontFamily: 'var(--fuente-acento)' }}>La Angostura</h3>
                        <p style={{ color: '#666', lineHeight: 1.6 }}>El pulmón estrecho de la ciudad. Un tómbolo de arena que conecta la península con el continente.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            Leer historia <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* El Carmen */}
                    <div 
                        onClick={() => navigate('/mapa')}
                        style={{ padding: '2.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ background: '#e9f5ed', width: '70px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <Shield size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 style={{ color: 'var(--color-mar-profundo)', marginBottom: '1rem', fontSize: '1.5rem', fontFamily: 'var(--fuente-acento)' }}>El Carmen</h3>
                        <p style={{ color: '#666', lineHeight: 1.6 }}>Zona de recuperación de manglares al final de la península, protegiendo el entorno del Paseo de los Turistas.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            Ver puntos <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: 'var(--color-mar-profundo)', color: 'var(--color-caracola)', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                    <img src="/src/assets/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                    <div>
                        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.8rem', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase' }}>BioMon ADI</h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>CORREDOR BIOLÓGICO</p>
                    </div>
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-caracola)', opacity: 0.8 }}>&copy; {new Date().getFullYear()} ADI La Angostura, Puntarenas. Salvando el futuro juntos.</p>
            </footer>
        </div>
    );
};

export default Landing;
