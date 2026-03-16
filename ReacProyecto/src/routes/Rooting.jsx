import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioVisitantes from '../pages/InicioVisitantes';
import InicioUser from '../pages/InicioUser';
import InicioAdimin from '../pages/InicioAdimin';
import Login from '../pages/Login';
import Nav from '../components/Nav';

function Rooting() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="main-content-layout">
        <Routes>
          <Route path="/" element={<InicioVisitantes />} />
          <Route path="/user" element={<InicioUser />} />
          <Route path="/admin" element={<InicioAdimin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Rooting;