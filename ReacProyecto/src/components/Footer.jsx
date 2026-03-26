import React from 'react'
import { Facebook, Instagram } from 'lucide-react'
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

            <div className="footer-socials">
                <div className="social-icon" aria-label="Facebook">
                   <Facebook size={24} />
                </div>
                <div className="social-icon" aria-label="Instagram">
                   <Instagram size={24} />
                </div>
                <div className="social-icon" aria-label="TikTok">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02C13.812 0 15.097.01 16.38 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.24-2.42 1.25-4.8 3.42-5.71 1.05-.44 2.21-.57 3.32-.43v4.02c-.89-.13-1.83.17-2.5.76-.7.62-1.05 1.59-1.01 2.53.04 1.22.86 2.37 2.02 2.78 1.15.42 2.49.26 3.47-.45.89-.66 1.4-1.74 1.43-2.84 0-4.66.01-9.33.01-14z"/></svg>
                </div>
            </div>

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