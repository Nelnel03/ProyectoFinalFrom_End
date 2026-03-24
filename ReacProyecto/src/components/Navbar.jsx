import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'var(--color-bosque-musgo)', // Verde Esmeralda Vibrante
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1010,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <img src="/src/assets/logo.png" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white' }} />
                <h2 style={{ margin: 0, fontWeight: '800', color: 'white', fontSize: '1.2rem', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase', letterSpacing: '1px' }}>BioMon ADI</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ background: 'var(--color-fauna-marino)', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--fuente-principal)', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(17, 138, 178, 0.3)' }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = 'var(--color-bosque-helecho)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'var(--color-fauna-marino)'; }}
                >
                    Inicio
                </button>
                <button 
                    onClick={() => navigate('/mapa')} 
                    style={{ background: 'var(--color-fauna-marino)', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--fuente-principal)', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(17, 138, 178, 0.3)' }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = 'var(--color-bosque-helecho)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'var(--color-fauna-marino)'; }}
                >
                    Mapa
                </button>
                <button 
                    onClick={() => navigate('/historia')} 
                    style={{ background: 'var(--color-fauna-marino)', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--fuente-principal)', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(17, 138, 178, 0.3)' }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.background = 'var(--color-bosque-helecho)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.background = 'var(--color-fauna-marino)'; }}
                >
                    Historia
                </button>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ 
                        background: 'var(--color-fauna-flor)', // Rojo Heliconia
                        border: 'none', 
                        color: 'white', 
                        padding: '0.6rem 1.5rem', 
                        borderRadius: '50px', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        fontFamily: 'var(--fuente-principal)',
                        boxShadow: '0 6px 15px rgba(231, 29, 54, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(1.1)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'none'; }}
                >
                    Acceder
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
