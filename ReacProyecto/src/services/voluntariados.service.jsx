import { BASE_URL } from "./config.jsx";

export async function getVoluntariados() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios?rol=voluntario`);
    const datosVoluntariados = await respuestaServidor.json();
    return datosVoluntariados;
  } catch (error) {
    console.error("Error al obtener los voluntariados", error);
    return [];
  }
}

export async function postVoluntariados(voluntariado) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el voluntariado", error);
  }
}

export async function putVoluntariados(voluntariado, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar the voluntariado", error);
  }
}

export async function deleteVoluntariados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el voluntariado", error);
  }
}
