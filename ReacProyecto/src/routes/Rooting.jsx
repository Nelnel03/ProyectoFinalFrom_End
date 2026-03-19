import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdimin from '../pages/InicioAdimin';
import Login from '../pages/Login';
import Voluntariado from '../pages/Voluntariado';
import Nav from '../components/Nav';
import PrivateRoutes from './PrivateRoutes';

function MainLayout() {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  const layoutClass = isAuthenticated ? "main-content-layout" : "main-content-layout visitor-layout";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      
      <div className={layoutClass}>
        <Routes>
          <Route path="/" element={<InicioVisitantes />} />
          <Route 
            path="/user" 
            element={
              <PrivateRoutes rolesAllowed={['user', 'voluntario']}>
                <InicioUser />
              </PrivateRoutes>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PrivateRoutes roleRequired="admin">
                <InicioAdimin />
              </PrivateRoutes>
            } 
          />
          <Route path="/voluntariado" element={<Voluntariado />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function Rooting() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default Rooting;