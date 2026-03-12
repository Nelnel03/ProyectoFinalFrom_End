import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          EcoControl
        </NavLink>
        
        <ul className="nav-links">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Inicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Iniciar Sesión
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/user" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Mi Panel
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/admin" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Admin
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;