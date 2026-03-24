import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar = () => {
    const navigate = useNavigate();

    return (

        <nav className="navbar-main">
            {/* OJO: Aquí se rompió la anidación del JSX en el código original, el nav debe tener 2 divs dentro.
                Yo solo reemplazo estilos. El div original del logo estaba antes. */}
            <div onClick={() => navigate('/')} className="navbar-logo-container">
                <img src="/src/assets/logo.png" alt="Logo" className="navbar-logo-img" />
                <h2 className="navbar-logo-title">BioMon ADI</h2>
            </div>
            
            <div className="navbar-links-container">
                <button onClick={() => navigate('/')} className="navbar-btn-link">
                    Inicio
                </button>
                <button onClick={() => navigate('/mapa')} className="navbar-btn-link">
                    Mapa
                </button>
                <button onClick={() => navigate('/historia')} className="navbar-btn-link">

                    Historia
                </button>
                <button 
                    onClick={() => navigate('/login')} 

                    className="navbar-btn-acceder"

                >
                    Acceder
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
