panel de administracion http://localhost:3005/admin (la ruta dirigida al admin esta Privada)

 Tutorial: Uso del Panel de Administración
El Panel de Administración es la herramienta centralizada donde los administradores pueden gestionar todos los aspectos del sistema de Recolección de Basura y Reforestación. A esta sección solo pueden entrar usuarios con el rol designado de admin.

Ruta de acceso: http://localhost:3005/admin (Ruta privada, requiere inicio de sesión con credenciales de administrador).

A continuación, explicamos cada una de las secciones (pestañas) disponibles en el panel:

1. Resumen (Dashboard)
Esta es la pantalla principal que verás al entrar. Funciona como un centro de mando para obtener una vista rápida del estado del proyecto.

Estadísticas de Árboles: Muestra cantidades totales de árboles plantados, clasificados por vivos y muertos.
Métricas generales: Puedes visualizar indicadores y gráficas rápidas sobre el progreso general de la reforestación.

2. Gestión de Árboles (Plantaciones)
Esta sección está dedicada al control y monitoreo de todas las especies plantadas.

Lista de Seguimiento: Puedes ver el listado completo de los árboles.
Agregar Nuevo: Tienes un formulario completo para registrar un árbol (Nombre, Nombre Científico, Tipo/Clasificación, Progreso en %, Altura, Clima, y Cuidados).
Botón de Abono: Desde la lista de árboles, puedes aplicar fertilizante directamente a un árbol y revisar su historial de abonos.

3. Árboles en Baja
Un registro histórico de aquellos árboles que lamentablemente no sobrevivieron (estado "muerto"). Sirve para llevar un control estadístico de pérdidas y analizar qué especies o áreas necesitan más atención.

4. Gestión de Usuarios
Aquí el administrador tiene control total sobre las cuentas de las personas registradas en la plataforma.

Crear y Editar: Puedes registrar nuevos usuarios manualmente o corregir sus datos (nombre, email).
Cancelar Cuenta (Banear): Si un usuario hace mal uso del sistema, puedes suspender o cancelar su cuenta indicando un "Motivo de Ban". El usuario verá este motivo si intenta loguearse.
Reactivar: Puedes devolverle el acceso a un usuario baneado.
Convertir a Voluntario: Con un solo clic, puedes ascender a un usuario normal al rol de Voluntario asignándole un área de interés y su teléfono.

5. Gestión de Voluntariados
Sección exclusiva para manejar al equipo de trabajo de campo.

Registro: Da de alta a nuevos voluntarios con sus datos de contacto (área asignada, teléfono). Al crearlos, se les asigna una contraseña temporal por defecto (Voluntario123) que el sistema les pedirá cambiar.
Eliminar o Modificar: Mantén la base de datos de tu equipo de voluntarios siempre actualizada.
Degradar a Usuario: Si un voluntario deja el programa, puedes convertir su cuenta nuevamente a la de un usuario normal.

6. Inventario de Abonos y Fertilizantes
Esencial para la logística y cuidado de las plantas.

Control de Stock: Registra el nombre del abono (ej. Compost, Humus) y la cantidad disponible en kg o unidades.
Actualización: Permite agregar o restar inventario si llega nuevo material. Cuando le asignas abono a un árbol en la pestaña de plantaciones, automáticamente se descuenta 1 unidad del stock general aquí.

7. Buzón (Reportes y Mensajes)
El centro de comunicación y alertas.

Revisión de Reportes: Aquí llegan todos los reportes enviados por los usuarios o voluntarios (por ejemplo, reportes de robo de árboles, denuncias de áreas sucias, o dudas generales).
Gestión de Alertas: Permite al administrador tomar decisiones informadas con base en lo que la comunidad está reportando y marcar los reportes como leídos o resueltos.

------------------------------------------------------------------------------------------------------------------------

panel de usuario http://localhost:3005/user

