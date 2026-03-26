import { BASE_URL } from "./config.jsx";

export async function getReportesVoluntariado() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener los reportes de voluntariado", error);
    return [];
  }
}

export async function postReporteVoluntariado(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al enviar el reporte de voluntariado", error);
  }
}
