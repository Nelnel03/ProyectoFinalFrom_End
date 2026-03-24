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

async function deleteStatsTipos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar stat de tipo", error);
  }
}

// ========================
// VOLUNTARIADOS
// ========================

async function getVoluntariados() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios?rol=voluntario`);
    const datosVoluntariados = await respuestaServidor.json();
    return datosVoluntariados;
  } catch (error) {
    console.error("Error al obtener los voluntariados", error);
    return [];
  }
}

async function postVoluntariados(voluntariado) {
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

async function putVoluntariados(voluntariado, id) {
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

async function deleteVoluntariados(id) {
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

// ========================
// ABONOS / FERTILIZANTES
// ========================

async function getAbonos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los abonos", error);
    return [];
  }
}

async function postAbonos(abono) {
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

async function putAbonos(abono, id) {
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

async function deleteAbonos(id) {
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

// ========================
// REPORTES VOLUNTARIADO
// ========================

async function getReportesVoluntariado() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los reportes de voluntariado", error);
    return [];
  }
}

async function postReporteVoluntariado(reporte) {
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

// ========================
// REPORTES GENERALES
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
    console.error("Error al eliminar el reporte de robo", error);
  }
}


// ========================
// ABONOS
// ========================

async function getAbonos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los abonos", error);
    return [];
  }
}

async function postAbonos(abono) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al crear el abono", error);
  }
}

async function putAbonos(abono, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar el abono", error);
  }
}

async function deleteAbonos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "DELETE",
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al eliminar el abono", error);
  }
}

// ========================
// VOLUNTARIADOS
// ========================

async function getVoluntariados() {
  try {
    const respuesta = await fetch(`${BASE_URL}/voluntariados`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los voluntariados", error);
    return [];
  }
}

async function postVoluntariados(voluntario) {
  try {
    const respuesta = await fetch(`${BASE_URL}/voluntariados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntario),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al crear el voluntariado", error);
  }
}

async function putVoluntariados(voluntario, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/voluntariados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntario),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar el voluntariado", error);
  }
}

async function deleteVoluntariados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/voluntariados/${id}`, {
      method: "DELETE",
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al eliminar el voluntariado", error);
  }
}

// ========================
// EXTRA: DELETE STATS TIPO
// ========================

async function deleteStatsTipos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos/${id}`, {
      method: "DELETE",
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al eliminar stat de tipo", error);
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
  deleteStatsTipos,
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
  getReportesVoluntariado,
  postReporteVoluntariado,
  getReportes,
  postReportes,
  getReportesRobados,
  postReportesRobados,
  deleteReportesRobados,
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
  deleteStatsTipos,
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
  deleteStatsTipos,
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
  getReportesVoluntariado,
  postReporteVoluntariado,
  getReportes,
  postReportes,
  getReportesRobados,
  postReportesRobados,
  putReportesRobados,
  deleteReportesRobados,
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
  deleteStatsTipos,
};

export default services;
