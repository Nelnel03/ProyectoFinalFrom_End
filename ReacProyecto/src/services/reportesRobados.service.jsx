import { BASE_URL } from "./config.jsx";

export async function getReportesRobados() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener reportes de árboles robados", error);
    return [];
  }
}

export async function postReportesRobados(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte de árbol robado", error);
  }
}

export async function deleteReportesRobados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte de robo", error);
  }
}

export async function putReportesRobados(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte de robo", error);
  }
}
