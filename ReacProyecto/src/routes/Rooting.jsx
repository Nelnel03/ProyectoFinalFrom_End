import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InicioVisitantes from '../pages/InicioVisitantes'

function Rooting() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioVisitantes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Rooting