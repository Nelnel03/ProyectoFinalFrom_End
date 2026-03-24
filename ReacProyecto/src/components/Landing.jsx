import React from 'react';
import { Leaf, ArrowRight, Shield, Map as MapIcon, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Cabecera / Sección Hero */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Descubre y Protege La Angostura
                    </h1>
                    <p className="hero-description">
                        Explora la asombrosa variedad de flora y fauna en Puntarenas. Únete a nuestra comunidad de voluntarios para registrar, monitorear y asegurar la conservación de nuestro ecosistema forestal.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="hero-button"
                    >
                        Comenzar Ahora <ArrowRight size={22} />
                    </button>
                </div>
            </div>

            {/* Sección de Localidades */}
            <div className="localities-section">
                <h2 className="localities-title">Localidades del Corredor</h2>
                <p className="localities-description">
                    Trabajamos en la recuperación de tres sectores estratégicos que conectan el ecosistema costero de Puntarenas.
                </p>
                
                <div className="localities-grid">
                    {/* Chacarita */}
                    <div 
                        onClick={() => navigate('/mapa')}
                        className="locality-card"
                    >
                        <div className="locality-icon-container">
                            <MapIcon size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 className="locality-name">Chacarita</h3>
                        <p className="locality-description">El acceso principal al corredor. Esfuerzos centrados en la recuperación de la Playa y el área periurbana del Estero.</p>
                        <div className="locality-link">
                            Ver mapa local <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* La Angostura */}
                    <div 
                        onClick={() => navigate('/historia')}
                        className="locality-card"
                    >
                        <div className="locality-icon-container">
                            <Leaf size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 className="locality-name">La Angostura</h3>
                        <p className="locality-description">El pulmón estrecho de la ciudad. Un tómbolo de arena que conecta la península con el continente.</p>
                        <div className="locality-link">
                            Leer historia <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* El Carmen */}
                    <div 
                        onClick={() => navigate('/mapa')}
                        className="locality-card"
                    >
                        <div className="locality-icon-container">
                            <Shield size={35} color="var(--color-mar-profundo)" />
                        </div>
                        <h3 className="locality-name">El Carmen</h3>
                        <p className="locality-description">Zona de recuperación de manglares al final de la península, protegiendo el entorno del Paseo de los Turistas.</p>
                        <div className="locality-link">
                            Ver puntos <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-brand">
                    <img src="/src/assets/logo.png" alt="Logo" className="footer-logo" />
                    <div>
                        <h3 className="footer-brand-name">BioMon ADI</h3>
                        <p className="footer-brand-tagline">CORREDOR BIOLÓGICO</p>
                    </div>
                </div>
                <p className="footer-copyright">&copy; {new Date().getFullYear()} ADI La Angostura, Puntarenas. Salvando el futuro juntos.</p>
            </footer>
        </div>
    );
};

export default Landing;
