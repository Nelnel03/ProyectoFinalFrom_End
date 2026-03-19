import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdimin from '../pages/InicioAdimin';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import Nav from '../components/Nav';
import PrivateRoutes from './PrivateRoutes';

function MainLayout() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

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
              <PrivateRoutes roleRequired="user">
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