import React from 'react';
import { Leaf, ArrowRight, Shield, Map as MapIcon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--text)' }}>
            {/* Cabecera / Sección Hero */}
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(rgba(58, 90, 64, 0.8), rgba(52, 78, 65, 0.9)), url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
                color: 'white',
                padding: '2rem'
            }}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#A3B18A', padding: '0.5rem', borderRadius: '50%' }}>
                            <Leaf size={28} color="#344E41" />
                        </div>
                        <h2 style={{ margin: 0, fontWeight: 'bold', color: '#DAD7CD' }}>BioMon ADI</h2>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', border: 'none', color: '#DAD7CD', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}>
                            Mapa
                        </button>
                        <button onClick={() => navigate('/historia')} style={{ background: 'transparent', border: 'none', color: '#DAD7CD', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}>
                            Historia
                        </button>
                        <button onClick={() => navigate('/auth')} style={{ background: 'transparent', border: '2px solid #A3B18A', color: '#DAD7CD', padding: '0.5rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                            Iniciar Sesión
                        </button>
                    </div>
                </nav>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#DAD7CD', lineHeight: 1.1, fontWeight: '800' }}>
                        Descubre y Protege La Angostura
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#e0e0e0', lineHeight: 1.6 }}>
                        Explora la asombrosa variedad de flora y fauna en Puntarenas. Únete a nuestra comunidad de voluntarios para registrar, monitorear y asegurar la conservación de nuestro ecosistema forestal.
                    </p>
                    <button 
                        onClick={() => navigate('/auth')}
                        style={{ background: '#A3B18A', color: '#1a1a1a', border: 'none', padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }}
                    >
                        Comenzar Ahora <ArrowRight size={22} />
                    </button>
                </div>
            </div>

            {/* Sección de Localidades */}
            <div style={{ padding: '5rem 2rem', background: '#DAD7CD', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#3A5A40', marginBottom: '1.5rem', fontWeight: 'bold' }}>Localidades del Corredor</h2>
                <p style={{ color: '#555', marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
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
                        <div style={{ background: '#e9f5ed', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <MapIcon size={35} color="#3A5A40" />
                        </div>
                        <h3 style={{ color: '#344E41', marginBottom: '1rem', fontSize: '1.5rem' }}>Chacarita</h3>
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
                        <div style={{ background: '#e9f5ed', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <Leaf size={35} color="#3A5A40" />
                        </div>
                        <h3 style={{ color: '#344E41', margin: '1rem 0', fontSize: '1.5rem' }}>La Angostura</h3>
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
                        <div style={{ background: '#e9f5ed', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <Shield size={35} color="#3A5A40" />
                        </div>
                        <h3 style={{ color: '#344E41', marginBottom: '1rem', fontSize: '1.5rem' }}>El Carmen</h3>
                        <p style={{ color: '#666', lineHeight: 1.6 }}>Zona de recuperación de manglares al final de la península, protegiendo el entorno del Paseo de los Turistas.</p>
                        <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            Ver puntos <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: '#344E41', color: '#DAD7CD', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <Leaf size={30} color="#A3B18A" />
                    <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.8rem' }}>BioMon ADI</h3>
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#A3B18A' }}>&copy; {new Date().getFullYear()} ADI La Angostura, Puntarenas. Salvando el futuro juntos.</p>
            </footer>
        </div>
    );
};

export default Landing;
