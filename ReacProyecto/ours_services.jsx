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
// ├üRBOLES
// ========================

async function getArboles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los ├írboles", error);
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
    console.error("Error al crear el ├írbol", error);
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
    console.error("Error al actualizar el ├írbol", error);
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
    console.error("Error al eliminar el ├írbol", error);
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
    console.error("Error al actualizar el voluntariado", error);
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
    console.error("Error al eliminar el abono", error);
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
};

export default services;
