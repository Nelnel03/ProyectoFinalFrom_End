import * as usuariosService from "./usuarios.service.jsx";
import * as arbolesService from "./arboles.service.jsx";
import * as statsTiposService from "./statsTipos.service.jsx";
import * as voluntariadosService from "./voluntariados.service.jsx";
import * as abonosService from "./abonos.service.jsx";
import * as reportesVoluntariadoService from "./reportesVoluntariado.service.jsx";
import * as reportesService from "./reportes.service.jsx";
import * as reportesRobadosService from "./reportesRobados.service.jsx";

const services = {
  ...usuariosService,
  ...arbolesService,
  ...statsTiposService,
  ...voluntariadosService,
  ...abonosService,
  ...reportesVoluntariadoService,
  ...reportesService,
  ...reportesRobadosService,
};

export default services;

export {
  getUsuarios,
  postUsuarios,
  putUsuarios,
  deleteUsuarios,
} from "./usuarios.service";

export {
  getArboles,
  postArboles,
  putArboles,
  deleteArboles,
} from "./arboles.service";

export {
  getStatsTipos,
  postStatsTipos,
  putStatsTipos,
  deleteStatsTipos,
} from "./statsTipos.service";

export {
  getVoluntariados,
  postVoluntariados,
  putVoluntariados,
  deleteVoluntariados,
} from "./voluntariados.service";

export {
  getAbonos,
  postAbonos,
  putAbonos,
  deleteAbonos,
} from "./abonos.service";

export {
  getReportesVoluntariado,
  postReporteVoluntariado,
} from "./reportesVoluntariado.service";

export {
  getReportes,
  postReportes,
  putReportes,
  deleteReportes,
} from "./reportes.service";

export {
  getReportesRobados,
  postReportesRobados,
  putReportesRobados,
  deleteReportesRobados,
} from "./reportesRobados.service";
