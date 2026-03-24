import React, { useState } from "react";
import services from "../services/services.jsx";
import "../styles/UserReports.css";

function UserReports({ user, onDone }) {
  const [reporte, setReporte] = useState({
    asunto: "",
    mensaje: "",
  });
  const [estadoEnvio, setEstadoEnvio] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setReporte({ ...reporte, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoEnvio({ tipo: "", texto: "" });

    try {
      const nuevoReporte = {
        ...reporte,
        userId: user.id,
        userName: user.nombre,
        userEmail: user.email,
        fecha: new Date().toISOString(),
        estado: "Pendiente" // Pendiente, Revisado, etc.
      };

      await services.postReportes(nuevoReporte);
      setEstadoEnvio({ tipo: "success", texto: "Reporte enviado exitosamente." });
      setReporte({ asunto: "", mensaje: "" }); 
      if (onDone) setTimeout(onDone, 1500);
    } catch (error) {
      console.error(error);
      setEstadoEnvio({ tipo: "error", texto: "Hubo un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-reports-container">
      <h2>Enviar Reporte o Mensaje</h2>
      <p>Utiliza este medio para contactar al administrador y reportar problemas o dudas.</p>
      
      {estadoEnvio.texto && (
        <div className={`mensaje ${estadoEnvio.tipo}`}>
          {estadoEnvio.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Asunto:</label>
          <input 
            type="text" 
            name="asunto" 
            value={reporte.asunto} 
            onChange={handleChange} 
            placeholder="Ej: Problema con un árbol registrado"
            required 
            maxLength={100}
          />
        </div>
        
        <div className="form-group">
          <label>Mensaje:</label>
          <textarea 
            name="mensaje" 
            value={reporte.mensaje} 
            onChange={handleChange} 
            placeholder="Describe detalladamente el motivo de tu mensaje..."
            required 
            rows="5"
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-send">
          {loading ? "Enviando..." : "Enviar Reporte"}
        </button>
      </form>
    </div>
  );
}

export default UserReports;
