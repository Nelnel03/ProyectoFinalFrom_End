import React from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(0, 119, 182, 0.95)', // var(--color-mar-profundo) with opacity
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1010,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <img src="/src/assets/logo.png" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '50%' }} />
                <h2 style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-caracola)', fontSize: '1.2rem', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase' }}>BioMon ADI</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: 'var(--color-caracola)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--fuente-principal)' }}>
                    Inicio
                </button>
                <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', border: 'none', color: 'var(--color-caracola)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--fuente-principal)' }}>
                    Mapa
                </button>
                <button onClick={() => navigate('/historia')} style={{ background: 'transparent', border: 'none', color: 'var(--color-caracola)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--fuente-principal)' }}>
                    Historia
                </button>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ 
                        background: 'var(--color-coral)', 
                        border: 'none', 
                        color: 'white', 
                        padding: '0.5rem 1.2rem', 
                        borderRadius: '30px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        fontFamily: 'var(--fuente-principal)'
                    }}
                >
                    Acceder
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
