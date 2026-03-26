import React from 'react'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="main-footer">
        {/* Decoración sutil de fondo */}
        <div className="footer-decor"></div>
        
        <div className="footer-container">
            <div className="footer-logo-section">
                <img src="/src/assets/logo.png" alt="Logo" className="footer-logo-img" />
                <div className="footer-brand">
                    <h3 className="footer-title">BioMon ADI</h3>
                    <p className="footer-subtitle">CORREDOR BIOLÓGICO LA ANGOSTURA</p>
                </div>
            </div>
            
            <p className="footer-description">
                Preservando la rica biodiversidad de Puntarenas. Nuestra flora y fauna son el corazón de La Angostura. ¡Sé parte del cambio hoy mismo!
            </p>

            <div className="footer-bottom">
                <div className="footer-dot"></div>
                <p className="footer-copy">
                    &copy; {new Date().getFullYear()} ADI La Angostura. Con amor por nuestra tierra.
                </p>
                <div className="footer-dot"></div>
            </div>
        </div>
    </footer>
  )
}

export default Footer