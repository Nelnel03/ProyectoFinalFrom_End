import React, { useEffect, useState } from "react";
import services from "../services/services.jsx";
import "../styles/UserReports.css";

// Formatea una fecha ISO a formato legible en español
function formatFecha(isoString) {
  if (!isoString) return "—";
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Badge de estado con color según valor
function EstadoBadge({ estado }) {
  const colores = {
    Pendiente:  { bg: "#fef9c3", color: "#92400e", border: "#fde68a" },
    Revisado:   { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
    Resuelto:   { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    Rechazado:  { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  };
  const estilo = colores[estado] || colores["Pendiente"];
  return (
    <span style={{
      padding: "3px 12px",
      borderRadius: "999px",
      fontSize: "0.78rem",
      fontWeight: "600",
      backgroundColor: estilo.bg,
      color: estilo.color,
      border: `1px solid ${estilo.border}`,
      whiteSpace: "nowrap",
    }}>
      {estado || "Pendiente"}
    </span>
  );
}

function BuzonEnviados({ user }) {
  const [reportes, setReportes] = useState([]);
  const [reportesRobo, setReportesRobo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // "todos" | "soporte" | "robo"

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const [todos, robos] = await Promise.all([
          services.getReportes(),
          services.getReportesRobados(),
        ]);
        // Filtrar solo los del usuario actual
        setReportes((todos || []).filter((r) => r.userId === user?.id));
        setReportesRobo((robos || []).filter((r) => r.userId === user?.id));
      } catch (err) {
        console.error("Error al cargar buzón:", err);
      } finally {
        setCargando(false);
      }
    };
    if (user?.id) cargar();
  }, [user]);

  // Unir y ordenar por fecha descendente
  const mensajesSoporte = reportes.map((r) => ({
    ...r,
    titulo: r.asunto || "(Sin asunto)",
    tipo: "Soporte",
    tipoBadgeBg: "#ede9fe",
    tipoBadgeColor: "#5b21b6",
    tipoBadgeBorder: "#c4b5fd",
  }));

  const mensajesRobo = reportesRobo.map((r) => ({
    ...r,
    titulo: `Árbol robado: ${r.tipo_arbol || "—"}`,
    tipo: "Robo",
    tipoBadgeBg: "#fee2e2",
    tipoBadgeColor: "#991b1b",
    tipoBadgeBorder: "#fca5a5",
  }));

  const todos = [...mensajesSoporte, ...mensajesRobo].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  const listaMostrar =
    filtro === "soporte"
      ? mensajesSoporte
      : filtro === "robo"
      ? mensajesRobo
      : todos;

  return (
    <div className="user-reports-container" style={{ maxWidth: "750px" }}>
      {/* Encabezado */}
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        Buzón de Enviados
      </h2>
      <p>Aquí puedes ver todos los mensajes y reportes que has enviado al administrador.</p>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { key: "todos", label: "Todos" },
          { key: "soporte", label: "Soporte" },
          { key: "robo",    label: "Robos" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            style={{
              padding: "7px 18px",
              backgroundColor: filtro === key ? "#1a4d2e" : "#f3f4f6",
              color: filtro === key ? "white" : "#4b5563",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {cargando ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Cargando mensajes...
        </div>
      ) : listaMostrar.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "2.5rem 1rem",
          backgroundColor: "#f9fafb", borderRadius: "10px",
          color: "#6b7280", border: "1px dashed #d1d5db",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}></div>
          <p style={{ margin: 0, fontWeight: "500" }}>No hay mensajes enviados aún.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {listaMostrar.map((item) => (
            <div
              key={`${item.tipo}-${item.id}`}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {/* Fila superior: título + badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontWeight: "700", color: "#1a4d2e", fontSize: "1rem" }}>
                  {item.titulo}
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {/* Tipo badge */}
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backgroundColor: item.tipoBadgeBg,
                    color: item.tipoBadgeColor,
                    border: `1px solid ${item.tipoBadgeBorder}`,
                  }}>
                    {item.tipo}
                  </span>
                  <EstadoBadge estado={item.estado} />
                </div>
              </div>

              {/* Fecha */}
              <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                Enviado el {formatFecha(item.fecha)}
              </div>

              {/* Detalle opcional */}
              {item.mensaje && (
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b7280", borderTop: "1px solid #f3f4f6", paddingTop: "0.5rem" }}>
                  {item.mensaje.length > 120 ? item.mensaje.slice(0, 120) + "…" : item.mensaje}
                </p>
              )}
              {item.descripcion && (
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#6b7280", borderTop: "1px solid #f3f4f6", paddingTop: "0.5rem" }}>
                  {item.descripcion.length > 120 ? item.descripcion.slice(0, 120) + "…" : item.descripcion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuzonEnviados;
