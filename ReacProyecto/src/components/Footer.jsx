import React from 'react'

function Footer() {
  return (
    <footer style={{ 
        background: 'var(--color-bosque-musgo)', 
        color: 'var(--color-crema-organico)', 
        padding: '4rem 2rem', 
        textAlign: 'center',
        borderTop: '6px solid var(--color-fauna-lapa)', // Acento Naranja Lapa
        position: 'relative',
        overflow: 'hidden'
    }}>
        {/* Decoración sutil de fondo */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '2rem' }}>
                <img src="/src/assets/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
                <div style={{ textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.8rem', fontFamily: 'var(--fuente-acento)', textTransform: 'uppercase', color: 'white', letterSpacing: '1px' }}>BioMon ADI</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-ocre-silvestre)', letterSpacing: '2px' }}>CORREDOR BIOLÓGICO LA ANGOSTURA</p>
                </div>
            </div>
            
            <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: '1.8', opacity: 0.9 }}>
                Preservando la rica biodiversidad de Puntarenas. Nuestra flora y fauna son el corazón de La Angostura. ¡Sé parte del cambio hoy mismo!
            </p>



            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--color-fauna-rana)', borderRadius: '50%' }}></div>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, fontWeight: '500' }}>
                    &copy; {new Date().getFullYear()} ADI La Angostura. Con amor por nuestra tierra.
                </p>
                <div style={{ width: '8px', height: '8px', background: 'var(--color-fauna-rana)', borderRadius: '50%' }}></div>
            </div>
        </div>
    </footer>
  )
}

export default Footer