const BASE_URL = "http://localhost:3000";

// ========================
// USUARIOS
// ========================

async function getUsuarios() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios`);
    const datosUsuarios = await respuestaServidor.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    return [];
  }
}

async function postUsuarios(usuario) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al crear el usuario", error);
  }
}

async function putUsuarios(usuario, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al actualizar los cambios", error);
  }
}

async function deleteUsuarios(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al eliminar el registro", error);
  }
}

// ========================
// ÁRBOLES
// ========================

async function getArboles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los árboles", error);
    return [];
  }
}

async function postArboles(arbol) {
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

async function putArboles(arbol, id) {
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

async function deleteArboles(id) {
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

// ========================
// STATS POR TIPO
// ========================

async function getStatsTipos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener stats de tipos", error);
    return [];
  }
}

async function postStatsTipos(stat) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear stat de tipo", error);
  }
}

async function putStatsTipos(stat, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar stat de tipo", error);
  }
}

// ========================
// REPORTES
// ========================

async function getReportes() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener reportes", error);
    return [];
  }
}

async function postReportes(reporte) {
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

// ========================
// REPORTES ÁRBOLES ROBADOS
// ========================

async function getReportesRobados() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener reportes de árboles robados", error);
    return [];
  }
}

async function postReportesRobados(reporte) {
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

async function deleteReportesRobados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar reporte de árbol robado", error);
  }
}

export {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  getArboles,
  postArboles,
  putArboles,
  deleteArboles,
  getStatsTipos,
  postStatsTipos,
  putStatsTipos,
  getReportes,
  postReportes,
  getReportesRobados,
  postReportesRobados,
  deleteReportesRobados,
};

const services = {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
  getArboles,
  postArboles,
  putArboles,
  deleteArboles,
  getStatsTipos,
  postStatsTipos,
  putStatsTipos,
  getReportes,
  postReportes,
  getReportesRobados,
  postReportesRobados,
  deleteReportesRobados,
};

export default services;