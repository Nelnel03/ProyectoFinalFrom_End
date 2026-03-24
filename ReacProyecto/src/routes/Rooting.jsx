import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import HistoryForm from '../pages/HistoryForm';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdimin from '../pages/InicioAdimin';
import Login from '../pages/Login';
import Voluntariado from '../pages/Voluntariado';
import Nav from '../components/Nav';
import Navbar from '../components/Navbar';
import PrivateRoutes from './PrivateRoutes';

function MainLayout() {
  const location = useLocation();
  const isPremiumRoute = location.pathname === '/' || location.pathname === '/historia';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-main-layout-container">
      {isPremiumRoute ? <Navbar /> : (!isAdminRoute && <Nav />)}
      
      <div className="main-content-layout">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/historia" element={<HistoryForm />} />
          <Route path="/visitante" element={<InicioVisitantes />} />
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