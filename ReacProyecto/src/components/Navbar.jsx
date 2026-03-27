import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import DarkModeToggle from './DarkModeToggle';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        setAuth(sessionStorage.getItem('isAuthenticated') === 'true');
    }, [location]);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que quieres salir?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#344e41',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear(); // Limpiamos todo para estar seguros
                setAuth(false);
                navigate('/');
            }
        });
    };


    return (
        <nav className="navbar-main">
            <div onClick={() => navigate(auth && user ? (user.rol === 'voluntario' ? '/dashboard-voluntario' : '/dashboard-user') : '/')} className="navbar-logo-container">
                <img src="/src/assets/logo.png" alt="Logo" className="navbar-logo-img" />
                <h2 className="navbar-logo-title">BioMon ADI</h2>
            </div>
            
            <div className="navbar-links-container">
                <DarkModeToggle />
                {/* Si no es admin y no está logueado, mostrar inicio. Si está logueado, el logo ya lo lleva a su panel. */}
                {!location.pathname.startsWith('/admin') && !auth && (
                    <button onClick={() => navigate('/')} className="navbar-btn-link">
                        Inicio
                    </button>
                )}

                {!location.pathname.startsWith('/admin') && (
                    <button onClick={() => navigate('/mapa')} className="navbar-btn-link">
                        Mapa
                    </button>
                )}
                {!location.pathname.startsWith('/admin') && (
                    <button onClick={() => navigate('/historia')} className="navbar-btn-link">
                        Historia
                    </button>
                )}


                {!auth ? (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="navbar-btn-acceder"
                    >
                        Acceder
                    </button>
                ) : (
                    <div className="navbar-auth-actions">

                        <button 
                            onClick={handleLogout} 
                            className="navbar-btn-logout"
                        >
                            Salir
                        </button>
                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;

