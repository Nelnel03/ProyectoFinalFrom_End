import React, { useState } from "react";
import services from "../services/services.jsx";
import "../styles/UserReports.css"; 

function UserReportesRobo({ user }) {
  const [reporte, setReporte] = useState({
    tipo_arbol: "",
    ubicacion: "",
    descripcion: "",
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
        userId: user?.id || 'anonimo',
        userName: user?.nombre || 'Anónimo',
        userEmail: user?.email || 'Sin correo',
        fecha: new Date().toISOString(),
        estado: "Pendiente" // Pendiente, Revisado, etc.
      };

      await services.postReportesRobados(nuevoReporte);
      setEstadoEnvio({ tipo: "success", texto: "Reporte de árbol robado enviado exitosamente." });
      setReporte({ tipo_arbol: "", ubicacion: "", descripcion: "" }); // Limpiar formulario
    } catch (error) {
      console.error(error);
      setEstadoEnvio({ tipo: "error", texto: "Hubo un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-reports-container" style={{ borderLeft: '4px solid #ef4444' }}>
      <h2 style={{ color: '#ef4444' }}>🚨 Reportar Árbol Robado</h2>
      <p>Utiliza este formulario para reportar un árbol que ha sido sustraído o talado ilegalmente.</p>
      
      {estadoEnvio.texto && (
        <div className={`mensaje ${estadoEnvio.tipo}`} style={{ 
          backgroundColor: estadoEnvio.tipo === 'success' ? '#dcfce7' : '#fee2e2',
          color: estadoEnvio.tipo === 'success' ? '#166534' : '#991b1b',
          border: estadoEnvio.tipo === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca'
         }}>
          {estadoEnvio.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Tipo de Árbol (o Nombre):</label>
          <input 
            type="text" 
            name="tipo_arbol" 
            value={reporte.tipo_arbol} 
            onChange={handleChange} 
            placeholder="Ej: Almendro de playa, Roble, etc."
            required 
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label>Ubicación del Árbol (Dirección o Coordenadas):</label>
          <input 
            type="text" 
            name="ubicacion" 
            value={reporte.ubicacion} 
            onChange={handleChange} 
            placeholder="Ej: Entrada norte, junto al sendero principal"
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Reseña o Descripción Detallada:</label>
          <textarea 
            name="descripcion" 
            value={reporte.descripcion} 
            onChange={handleChange} 
            placeholder="Agrega cualquier contexto, fecha aproximada del suceso o detalles relevantes..."
            required 
            rows="5"
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-send" style={{ backgroundColor: '#ef4444' }}>
          {loading ? "Enviando Reporte..." : "Enviar Reporte de Robo"}
        </button>
      </form>
    </div>
  );
}

export default UserReportesRobo;
