import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children, roleRequired }) => {
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const userStr = sessionStorage.getItem('user');
  let user = {};
  
  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error("Error parsing user from sessionStorage", e);
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.rol !== roleRequired) {
    // Si no tiene el rol, redirige a la página principal (o a un "acceso denegado")
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes;