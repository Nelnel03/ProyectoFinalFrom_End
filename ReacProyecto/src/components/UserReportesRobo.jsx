import React, { useState } from "react";
import services from "../services/services.jsx";
import "../styles/UserReports.css";

function validate(reporte) {
  const errors = {};
  const tipo_arbol  = reporte.tipo_arbol.trim();
  const ubicacion   = reporte.ubicacion.trim();
  const descripcion = reporte.descripcion.trim();

  if (!tipo_arbol)                errors.tipo_arbol  = "El tipo de árbol es obligatorio.";
  else if (tipo_arbol.length < 3)  errors.tipo_arbol  = "Debe tener al menos 3 caracteres.";
  else if (tipo_arbol.length > 100) errors.tipo_arbol = "No puede exceder 100 caracteres.";

  if (!ubicacion)                  errors.ubicacion   = "La ubicación es obligatoria.";
  else if (ubicacion.length < 5)   errors.ubicacion   = "La ubicación debe tener al menos 5 caracteres.";

  if (!descripcion)                errors.descripcion = "La descripción es obligatoria.";
  else if (descripcion.length < 15) errors.descripcion = "La descripción debe tener al menos 15 caracteres.";

  return errors;
}

function UserReportesRobo({ user }) {
  const [reporte, setReporte] = useState({
    tipo_arbol:  "",
    ubicacion:   "",
    descripcion: "",
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [estadoEnvio, setEstadoEnvio] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const updated = { ...reporte, [e.target.name]: e.target.value };
    setReporte(updated);
    if (touched[e.target.name]) {
      const newErr = validate(updated);
      setErrors((prev) => ({ ...prev, [e.target.name]: newErr[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const newErr = validate(reporte);
    setErrors((prev) => ({ ...prev, [e.target.name]: newErr[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ tipo_arbol: true, ubicacion: true, descripcion: true });
    const newErr = validate(reporte);
    setErrors(newErr);
    if (Object.keys(newErr).length > 0) return;

    setLoading(true);
    setEstadoEnvio({ tipo: "", texto: "" });
    try {
      const nuevoReporte = {
        ...reporte,
        userId:    user?.id    || "anonimo",
        userName:  user?.nombre || "Anónimo",
        userEmail: user?.email  || "Sin correo",
        fecha:     new Date().toISOString(),
        estado:    "Pendiente",
      };
      await services.postReportesRobados(nuevoReporte);
      setEstadoEnvio({ tipo: "success", texto: "Reporte de árbol robado enviado exitosamente." });
      setReporte({ tipo_arbol: "", ubicacion: "", descripcion: "" });
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error(error);
      setEstadoEnvio({ tipo: "error", texto: "Hubo un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    touched[name] && errors[name] ? "input-error" : "";

  return (
    <div className="user-reports-container" style={{ borderLeft: "4px solid #ef4444" }}>
      <h2 style={{ color: "#ef4444" }}>🚨 Reportar Árbol Robado</h2>
      <p>Utiliza este formulario para reportar un árbol que ha sido sustraído o talado ilegalmente.</p>

      {estadoEnvio.texto && (
        <div
          className={`mensaje ${estadoEnvio.tipo}`}
          style={{
            backgroundColor: estadoEnvio.tipo === "success" ? "#dcfce7" : "#fee2e2",
            color:           estadoEnvio.tipo === "success" ? "#166534" : "#991b1b",
            border:          estadoEnvio.tipo === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {estadoEnvio.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form" noValidate>
        {/* Tipo de árbol */}
        <div className="form-group">
          <label>Tipo de Árbol (o Nombre): <span style={{ color: "#e53e3e" }}>*</span></label>
          <input
            type="text"
            name="tipo_arbol"
            value={reporte.tipo_arbol}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("tipo_arbol")}
            placeholder="Ej: Almendro de playa, Roble, etc."
            maxLength={100}
          />
          {touched.tipo_arbol && errors.tipo_arbol && (
            <span className="field-error-msg">⚠ {errors.tipo_arbol}</span>
          )}
        </div>

        {/* Ubicación */}
        <div className="form-group">
          <label>Ubicación del Árbol (Dirección o Coordenadas): <span style={{ color: "#e53e3e" }}>*</span></label>
          <input
            type="text"
            name="ubicacion"
            value={reporte.ubicacion}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("ubicacion")}
            placeholder="Ej: Entrada norte, junto al sendero principal"
          />
          {touched.ubicacion && errors.ubicacion && (
            <span className="field-error-msg">⚠ {errors.ubicacion}</span>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>Reseña o Descripción Detallada: <span style={{ color: "#e53e3e" }}>*</span></label>
          <textarea
            name="descripcion"
            value={reporte.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("descripcion")}
            placeholder="Agrega cualquier contexto, fecha aproximada del suceso o detalles relevantes..."
            rows="5"
          />
          {touched.descripcion && errors.descripcion && (
            <span className="field-error-msg">⚠ {errors.descripcion}</span>
          )}
          <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "3px", display: "block" }}>
            {reporte.descripcion.length} caracteres (mínimo 15)
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-send"
          style={{ backgroundColor: "#ef4444" }}
        >
          {loading ? "Enviando Reporte..." : "Enviar Reporte de Robo"}
        </button>
      </form>
    </div>
  );
}

export default UserReportesRobo;
