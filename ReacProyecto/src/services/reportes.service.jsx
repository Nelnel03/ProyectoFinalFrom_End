import { BASE_URL } from "./config.jsx";

export async function getReportes() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener reportes", error);
    return [];
  }
}

export async function postReportes(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte", error);
  }
}

export async function putReportes(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte", error);
  }
}

export async function deleteReportes(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte", error);
  }
}
