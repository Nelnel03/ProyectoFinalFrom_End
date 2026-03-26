import { BASE_URL } from "./config.jsx";

export async function getAbonos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los abonos", error);
    return [];
  }
}

export async function postAbonos(abono) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el abono", error);
  }
}

export async function putAbonos(abono, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el abono", error);
  }
}

export async function deleteAbonos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar the abono", error);
  }
}
