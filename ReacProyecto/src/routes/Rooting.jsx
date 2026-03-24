

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdimin from '../pages/InicioAdimin';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import LandingPage from '../pages/LandingPage';
import HistoryForm from '../pages/HistoryForm';
import Voluntariado from '../pages/Voluntariado';

import Nav from '../components/Nav';
import PrivateRoutes from './PrivateRoutes';
import LandingPage from '../pages/LandingPage';
import UserDashboard from '../components/UserDashboard';
import VolunteerDashboard from '../components/VolunteerDashboard';
import InicioAdimin from '../pages/InicioAdimin';

function MainLayout() {
  const location = useLocation();


  const isPremiumRoute = location.pathname.startsWith('/user') || location.pathname.startsWith('/admin');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-main-layout-container">
      {isPremiumRoute ? <Navbar /> : (!isAdminRoute && <Nav />)}

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ocultamos el Nav global para el admin, ya que usualmente tienen su propio dashboard/sidebar */}
      {!isAdminRoute && <Nav />}

      
      <div className="main-content-layout">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/historia" element={<HistoryForm />} />
          <Route path="/visitante" element={<InicioVisitantes />} />
          
          {/* Redirección de seguridad para la ruta antigua */}
          <Route 
            path="/user" 
            element={
              isAuth ? (
                (() => {
                  const u = JSON.parse(localStorage.getItem('user') || '{}');
                  return u.rol === 'voluntario' ? <Navigate to="/dashboard-voluntario" replace /> : <Navigate to="/dashboard-user" replace />;
                })()
              ) : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard-user" 
            element={
              <PrivateRoutes rolesAllowed={['user']}>
                <UserDashboard />
              </PrivateRoutes>
            } 
          />

          <Route 
            path="/dashboard-voluntario" 
            element={
              <PrivateRoutes rolesAllowed={['voluntario']}>
                <VolunteerDashboard />
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
          <Route path="/reset-password" element={<ResetPassword />} />
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