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
            background: 'rgba(52, 78, 65, 0.95)', // Estilo coherente con BioMon ADI
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1010,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#A3B18A', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                    <Leaf size={24} color="#344E41" />
                </div>
                <h2 style={{ margin: 0, fontWeight: 'bold', color: '#DAD7CD', fontSize: '1.2rem' }}>BioMon ADI</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#DAD7CD', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
                    Inicio
                </button>
                <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', border: 'none', color: '#DAD7CD', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
                    Mapa
                </button>
                <button onClick={() => navigate('/historia')} style={{ background: 'transparent', border: 'none', color: '#DAD7CD', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
                    Historia
                </button>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ 
                        background: '#A3B18A', 
                        border: 'none', 
                        color: '#1a1a1a', 
                        padding: '0.5rem 1.2rem', 
                        borderRadius: '30px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer' 
                    }}
                >
                    Acceder
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
