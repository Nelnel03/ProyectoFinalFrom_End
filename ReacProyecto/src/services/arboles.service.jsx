import { BASE_URL } from "./config.jsx";

export async function getArboles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los árboles", error);
    return [];
  }
}

export async function postArboles(arbol) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el árbol", error);
  }
}

export async function putArboles(arbol, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el árbol", error);
  }
}

export async function deleteArboles(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el árbol", error);
  }
}
