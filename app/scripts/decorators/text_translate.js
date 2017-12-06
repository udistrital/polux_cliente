'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the poluxClienteApp
 */
var text_es = {

    TITULO: "GENERATOR-OAS",
    MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
    EVALUAR_PROYECTO: "Evaluación de Proyecto de Grado",
    LISTADO_SOLICITUD: "Listado de Solicitudes",
    MODALIDAD: "Modalidad",
    TITULO_PROPUESTA: "Título de la propuesta",
    VER_DOCUMENTO: "Ver documento",
    ESTADO_DOCUMENTO: "Estado Documento",
    RESUMEN: "Resumen",
    OPCIONES: "Opciones",
    SOLICITUD: "Solicitud",
    DOCENTE: "Docente",
    SELECCION_DOCENTE: "Seleccione Docente",
    SELECCION_TIPO_VINCULACION: "Seleccione el tipo de vinculación",
    TIPO_VINCULACION: "Tipo de vinculación",
    ASIGNAR_DOCENTE: "Asignar Docente",
    SOCIALIZACION: "Socialización de proyectos de grado",
    AREAS_TRABAJO_GRADO: "Areas trabajo de Grado",
    DOCENTES_ASIGNADOS: "Docentes Asignados",
    VER_TODOS: "Ver Todos",
    VER_SUGERENCIAS: "Ver Sugerencias",
    NUEVA_EVALUACION: "Nueva Evaluación",
    FORMATOS_EVALUACION: "Formatos de Evaluación",
    BUSCAR_FORMATOS: "Buscar Formatos",
    FECHA: "Fecha",
    HORA: "Hora",
    SELECCION_PROYECTO: "Seleccione el Proyecto",
    LUGAR: "Lugar",
    SELECCIONE_FORMATO: "Seleccione el formato",
    AREAS_CONOCIMIENTO: "Áreas de Conocimiento",
    LISTAR_SOLICITUDES: "Listado de solicitudes",
    ANO: "Año:",
    PERIODO: "Periodo",
    CARRERA: "Carrera",
    PENSUM: "Pensum:",
    SELECCIONAR_CARRERA: "Seleccione la carrera",
    SELECCIONAR_PENSUM: "*Seleccione un pensum",
    CODIGO: "Código",
    NOMBRE: "Nombre",
    MODALIDAD_ESP_POS: "Modalidad: Espacios académicos de posgrado",
    MODALIDAD_ESP_PROFUNDIZACION: "Modalidad: Espacios académicos de profundización",
    ADMITIDOS_POR_RENDIMIENTO: "Admitidos por rendimiento:",
    ADMITIDOS_POR_ECONOMIA: "Admitidos por pago:",
    FECHA_ACTUAL: "Fecha actual:",
    FECHA_INICIO: "Primera fecha de inicio:",
    FECHA_INICIO_DOS: "Segunda fecha de inicio:",
    FECHA_FIN: "Fecha de finalización:",
    SELECCION_DE_ADMITIDOS: "Selección de Admitidos",
    ADMITIDOS_POR_EXCELENCIA_A: "Admitidos por excelencia académica y exentos de pago (Máx",
    ADMITIDOS_POR_COND_EC: "Admitidos admitidos por condiciones económicas y calidades académicas (Máx ",
    REQUERIDO: "Es requerido",
    PUBLICACION_DE_ESPACIOS: "Publicación de espacios académicos.",
    RESPUESTA: "Respuesta:",
    DENEGADO: "El estudiante no cumple con los requisitos exigidos para la Modalidad de Trabajo de Grado",
    REGISTRAR_PROPUESTA: "Registrar propuesta.",
    ESTADO: "Estado:",
    PORCENTAJE_CURSADO: "Porcentaje cursado",
    PROMEDIO: "Promedio",
    NIVEL_ESTUDIOS: "Nivel de estudios:",
    TIPO_CARRERA: "Tipo de carrera",
    REGISTRAR_TRABAJO_DE_GRADO: "Registrar trabajo de grado.",
    EDICION_FORMATO_EVALUACION: "Edición de Formatos de Evaluación",
    SELECCIONAR_FORMATO: "Seleccionar Formato:",
    EDICION_GENERAL: "Edición general",
    TITULO_FORMATO: "Titulo Formato:",
    INTRODUCCION: "Introducción:",
    EDICION_PREGUNTAS: "Edición Preguntas",
    ENUNCIADO: "Enunciado:",
    PESO: "Peso:",
    TIPO: "Tipo:",
    NOMBRE_FORMATO: "Nombre del formato",
    INTRODUCCION_FORMATO: "Introducción del formato",
    ANADIR_PREGUNTA: "Añadir Pregunta",
    ANADIR_OPCION: "Añadir Opción",
    VISTA_PREVIA: "Vista Previa",
    ASIGNAR_FORMATO_A_PC: "Asignar formato a proyecto curricular:",
    ASOCIAR_FORMATO_A_PC: "Asociar formato a proyecto curricular:",
    SELECCIONAR_PC: "Seleccionar proyecto curricular:",
    CREACION_EVALUACION: "Creación de la evaluación",
    REVISION_DOCUMENTOS: "Revisión de Documentos",
    DOCUMENTO: "Documento",
    REVISIONES: "Revisiones",
    LA_REVISION: "La revisión ",
    LA_REVISION_SE_ENCUENTRA: " se encuentra solicitada ",
    SUBIR_DOCUMENTO: "Subir Documento",
    PUBLICAR_ASIGNATURA: "Publicar asignatura",
    SOLICITUDES_DEL_ESTUDIANTE: "Solicitudes del estudiante",
    NINGUNA_SOLICITUD_REALIZADA: "Ninguna solicitud realizada",
    SOLICITUD_NUM: "Solicitud N° ",
    FORMALIZACION: "Formalización: ",
    CREDITOS: "Créditos ",
    ESTUDIANTE_ACTUAL: "Estudiante actual: ",
    TITULO_TG: "Título del trabajo de grado",
    ASIGNAR_AREA: "Asignar Área",
    DE_ACUERDO_A_SU_PROPUESTA: "De acuerdo a su propuesta, seleccione las áreas, luego adjunte el archivo del documento",
    ESTUDIANTE: "Estudiante",
    NOMBRE_PROPUESTA: "Nombre de la propuesta",
    DE_ACUERDO_A_SU_PROPUEST: "De acuerdo a su propuesta seleccione las áreas",
    SELECCIONE_LAS_OPCIONES: "Seleccione las opciones para vincular el docente",
    FILTRANDO_POR: "Filtrando por: ",
    VINCULAR_DOCENTE: "Vincular docente",
    NOMBRE_DEL_DOCUMENTO: "Nombre del documento",
    SELECCIONE_EL_DOCUMENTO: "Seleccione el documento",
    CARGAR_ARCHIVO: "Cargar archivo",
    ARRASTRE_O_CLICK: "Arrastre el archivo o haga click para subir al servidor",
    GUARDAR_REGISTRO: "Guardar registro",
    CANCELAR: "Cancelar",
    BORRAR: "Borrar",
    CALIFICACION_FINAL_PG: "Calificación Final del proyecto de grado",
    ENVIAR_EVALUACION: "Enviar Evaluación",
    FECHA_REVISION: "Fecha Revisión: ",
    REVISION: "Revisión ",
    INGRESE_NUEVA_AREA: "Ingrese una nueva área",
    NOMBRE_MUY_CORTO: "Nombre muy corto!",
    NOMBRE_MUY_EXTENSO: "Nombre muy largo!",
    DE_ACUERDO_A_SU_PERFIL: "De acuerdo a su perfil seleccione las áreas: ",
    EL_AREA_NO_EXISTE: "El área no existe",
    NO_EXISTEN_AREAS: "No existen áreas",
    AREAS_DOCENTE: "Áreas del docente",
    DOCENTE_ACTUAL: "Docente actual: ",
    GUARDAR: "Guardar",
    OPCION_BOTON: " + Opción",
    PREGUNTA_BOTON: " + Pregunta",
    ASIGNAR_BOTON: " Asignar",
    SEL_FECHA: "Seleccione una fecha",
    ENVIAR_EVALUACION_BOTON: "Enviar calificación",
    SOLICITAR_REVISION: "Solicitar Revision",
    SELECCIONAR: "Seleccionar",
    NUEVA_SOLICITUD: "Crear nueva solicitud",
    GESTION_SOLICITUD: "Módulo de gestión de solicitudes. ",
    SELECCIONAR_MODALIDAD:"Seleccione la modalidad",
    SELECCIONAR_SOLICITUD:"Seleccione tipo de solicitud",
    FORMULARIO_SOLICITUD:"Formulario de solicitud",
    SELECCIONE_AREAS_CONOCIMIENTO:"Seleccione las áreas del conocimiento de su proyecto",
    NOMBRE_CORTO:"Nombre muy corto",
    NOMBRE_LARGO:"Nombre muy largo",
    NUEVA_AREA:"Ingrese nueva area",
    AGREGAR_ESTUDIANTES:"Agregar estudiantes a la solicitud",
    INGRESE_CODIGO:"Digite el código de los otros estudiantes que participan en el proyecto",
    ESTUDIANTE_EN_LISTA:"Error: El estudiante ya se encuentra en la lista de solicitados.",
    ESTUDIANTE_NO_VALIDO:"Error: El codigo digitado no es valido.",
    ESTUDIANTE_NO_REQUISITOS:"Error: El estudiante solicitado actualmente no cumple con los requisitos para realizar un trabajo de grado.",
    ESTUDIANTE_TRABAJO_GRADO:"Error: El estudiante solicitado actualmente esta realizando un trabajo de grado.",
    CANTIDAD_EXCEDIDA:"Error: Se excede la cantidad de estudiantes para la modalidad solicitada.",
    SOLICITAR_ASIGNATURAS:"Solicitar Asignaturas",
    ANIO:"Año",
    ERROR:"ERROR",
    ESTUDIANTE_NO_ENCONTRADO:"Error: El estudiante no se encuentra",
    NOMBRE_EMPRESA:"Escriba el nombre de la empresa",
    REGISTRO_FORMULARIO:"Registro de formulario",
    SOLICITUD_REGISTRADA:"El formulario se registro correctamente",
    ERROR_SOLICITUDES_1:"Ocurrió un error al insertar los detalles de la solicitud",
    ERROR_SOLICITUDES_2:"Ocurrió un error al insertar los usuarios de la solicitud.",
    ERROR_SOLICITUDES_3:"Ocurrió un error al insertar la respuesta de la solicitud.",
    ERROR_RTA_SOLICITUD_1: "Ocurrió un error al actualizar la respuesta de la solicitud.",
    ERROR_RTA_SOLICITUD_2: "Ocurrió un error al registrar la respuesta de la solicitud.",
    ERROR_RTA_SOLICITUD_3: "Ocurrió un error al registrar el acta de respuesta de la solicitud.",
    ERROR_RTA_SOLICITUD_4: "Ocurrió un error al registrar el trabajo de grado.",
    ERROR_RTA_SOLICITUD_5: "Ocurrió un error al registrar la vinculación de trabajo de grado.",
    ERROR_RTA_SOLICITUD_6: "Ocurrió un error al actualizar la vinculación de trabajo de grado.",
    ERROR_RTA_SOLICITUD_7: "Ocurrió un error al actualizar el estado del estudiante en el trabajo de grado.",
    ERROR_RTA_SOLICITUD_8: "Error al cancelar el trabajo de grado.",
    ERROR_RTA_SOLICITUD_9: "Ocurrió un error al registrar el estudiante en el trabajo de grado.",
    ERROR_RTA_SOLICITUD_10: "Ocurrió un error al registrar las áreas de conocimiento del trabajo de grado.",
    ERROR_RTA_SOLICITUD_11: "Ocurrió un error al registrar el documento de la propuesta de trabajo de grado.",
    ERROR_RTA_SOLICITUD_12: "Ocurrió un error al asociar el documento escrito a la propuesta de trabajo de grado.",
    ERROR_RTA_SOLICITUD_13: "Ocurrió un error al actualizar el trabajo de grado.",
    ERROR: {
        SUBIR_DOCUMENTO:"Error al intentar subir un documento",
        HAY_SOLICITUD_DISTINCION:"Actualmente ya hay una solicitud de distinción pendiente para este trabajo de grado.",
        HAY_SOLICITUD_PENDIENTE:"Actualmente el estudiante ya tiene registrada una solicitud de trabajo de grado que se encuentra pendiente por respuesta.",
    },
    VERIFICAR_DOCUMENTO:"Ocurrio un error al intentar cargar un documento. Verifique su conexión y el tipo de documento ('.pdf') y el tamaño.",
    BTN: {
        GUARDAR_ESPACIOS_ACADEMICOS: "Guardar Espacios Académicos",
        CAMBIAR_ESPACIOS_ACADEMICOS: "Cambiar Espacios Académicos",
        VER_DETALLES: "Ver Detalles",
        RESPONDER_SOLICITUD:"Responder solicitud",
    },
    ENVIAR_SOLICITUD:"Enviar Solicitud",
    INGRESAR_PROPUESTA:"Ingrese el nombre de la propuesta",
    SELECCIONE_EMPRESA:"Seleccione el nombre de la empresa",
    CARTA_DIRIGIDA:"Ingrese el nombre de la persona a la cual va dirigida la carta",
    CARGO_DIRIGIDO:"Ingrese el cargo de la persona a la cual se dirige la carta",
    INGRESAR_RESUMEN_PROPUESTA:"Escriba un resumen de su propuesta",
    CARGUE_PROPUESTA:"Cargue su propuesta",
    DOCENTE_AVALA_PROPUESTA:"Seleccione el docente que avala la propuesta",

    CARGUE_CERTIFICACION_ARL:"Cargue la certificación de afiliación a la ARL",
    ESPACIOS_ACADEMICOS_MISMO_PERIODO:"¿Desea la inscripción de los espacios académicos de Trabajo de Grado I y Trabajo de Grado II en el mismo periodo académico?",
    JUSTIFICACION_SOLICITUD:"Escriba la causa con la que justifica la solicitud",
    DIRECTOR_ACTUAL:"Nombre del director actual",
    DIRECTOR_NUEVO:"Seleccione el docente que solicita como nuevo director",
    EVALUADOR_ACTUAL:"Seleccione el nombre del evaluador actual",
    EVALUADOR_NUEVO:"Seleccione el docente que sugiere como nuevo evaluador",
    HOJA_VIDA_DIRECTOR_EXTERNO_NUEVO:"Cargue la hoja de vida del nuevo director externo",
    SELECCIONE_TIPO_PRORROGA:"Seleccione el tipo de prórroga que va a solicitar",
    SELECCIONE_ESPACIOS_ACADEMICOS:"Seleccione los espacios academicos que desea solicitar",
    CANCELAR_ESPACIOS_ACADEMICOS:"Seleccione el espacio academico que desea cancelar",
    SELECCIONE_ESPACIO_SOLICITADO:"Seleccione el espacio academico que solicita",
    NOMBRE_ANTERIOR_PROPUESTA:"Nombre actual de la propuesta",
    ESCRIBA_NOMBRE_NUEVO_PROPUESTA:"Escriba el nuevo nombre de la propuesta",
    ANTERIOR_RESUMEN_PROPUESTA: "Resumen actual de la propuesta",
    ESCRIBA_RESUMEN_NUEVO_PROPUESTA:"Escriba el nuevo resumen de su propuesta",
    ANTERIOR_PROPUESTA:"Propuesta actual",
    CARGUE_NUEVA_PROPUESTA:"Cargue la nueva propuesta",
    ANTERIORES_AREAS_CONOCIMIENTO:"Areas de conocimiento actuales",
    SELECCIONE_NUEVAS_AREAS_CONOCIMIENTO:"Seleccione las nuevas áreas de conocimiento que abarca su proyecto",
    CARGUE_PLAN_INVESTIGACION:"Cargue el Plan de actividades de investigación",
    SELECCIONE_ESTRUCTURA_INVESTIGACION_AVALA:"Seleccione  la Estructura de investigación que avala la propuesta",
    SELECCIONE_DOCENTE_DESIGNADO_INVESTIGACION:"Seleccione el Docente director designado por la estructura de investigación",
    CARGUE_PLAN_NEGOCIOS:"Cargue el plan o el modelo de negocios",
    ANTERIOR_DIRECTOR_EXTERNO:"Director externo actual",
    ESCRIBA_DIRECTOR_EXTERNO_NUEVO:"Escriba el nombre del nuevo director externo",
    PLAN_INVESTIGACION_ANTERIOR:"Plan de actividades de investigación actual",
    CARGUE_PLAN_INVESTIGACION_NUEVO:"Cargue Plan de actividades de investigación nuevo",
    CREACION_INDIVIDUAL_COLECTIVA:"Seleccione si su creación es individual o colectiva",
    ANTERIOR_PLAN_NEGOCIOS:"Plan o modelo de negocios actual",
    CARGUE_NUEVO_PLAN_NEGOCIOS:"Cargue el Plan o modelo de negocios nuevo",
    SELECCIONE_ESTUDIANTES_PROYECTO:"Seleccione los estudiantes que pertenecen al proyecto",
    SOLICITUD_SIN_FORMULARIO:"Esta solicitud no requiere diligenciar ningún formulario. ¿Está seguro de querer enviarla?",
    NUMERO_RADICADO : "Número de radicado",
    TIPO_SOLICITUD : "Tipo de solicitud",
    ESTADO_SOLICITUD : "Estado",
    DETALLE : "Detalle",
    ESTUDIANTE_SIN_SOLICITUD : "El estudiante actualmente no ha realizado ninguna solicitud.",
    DIRIGIJASE_SOLICITUD :"Si desea realizar una nueva solicitud dirijase al modulo",
    COORDINADOR_SIN_SOLICITUD : "Señor coordinador actualmente usted no tiene solicitudes por revisar.",
    DETALLES_SOLICITUD: "Detalles de la solicitud",
    INFORMACION_SOLICITUD: "Información de la solicitud",
    SOLICITANTES: "Solicitantes",
    LOADING:{
      CARGANDO_ESTUDIANTE:"Cargando datos del estudiante",
      ENVIANDO_FORLMULARIO:"Enviando formulario",
      CARGANDO_DETALLES:"Cargando detalles del formulario",
      CARGANDO_SOLICITUDES:"Cargando solicitudes",
      CARGANDO_DOCUMENTO:"Cargando documento",
      CARGANDO_DETALLES_SOLICITUD:"Cargando detalles de la solicitud",
    },
    SELECT:{
      SELECCIONE:"Seleccione una opción",
      DOCENTE_CAMBIO: "Seleccione el docente para realizar el cambio",
      DOCENTE_DIRECTOR: "Seleccione el docente director del proyecto",
      DOCENTE_REVISOR: "Seleccione el docente revisor del proyecto",
      DOCENTE_REVISOR_FILTRO: "Escriba al menos 2 letras del nombre del docente revisor del proyecto",
      DOCENTE_DIRECTOR_FILTRO: "Escriba al menos 2 letras del nombre del docente director del proyecto",
      SIN_CARRERA:"No se ha seleccionado ninguna carrera",
      TIPO_DISTINCION:"Seleccione el tipo de distinción",
      TRABAJO_GRADO_EVALUAR:"Seleccione el trabajo de grado que desea evaluar",
    },
    DOCUMENTO:{
        CARGAR_DOCUMENTO:"Cargar documento",
        INGRESE_NOMBRE:"Ingrese el nombre del documento",
        INGRESE_DESCRIPCION:"Ingrese la descripción del documento",
        SELECCIONE_DOCUMENTO:"Seleccione el documento",
        SIN_DOCUMENTO:"No hay ningún documento seleccionado",
        SELECCIONAR_DOCUMENTO:"Seleccionar documento",
        VER_DOCUMENTO:"Ver documento",
        CARGADO:"Documento Cargado",
        INGRESE_CONSECUTIVO: "Ingrese el consecutivo del documento",
    },
    SWITCH:{
        SI:"SI",
        NO:"NO",
    },
    CODIGO_MATERIA:"Codigo asignatura",
    SIN_CARRERAS_SOLICITUDES:"Actualmente no hay carreras disponibles para su elección",
    APROBAR_SOLICITUD:"Aprobar solicitud",
    RECHAZAR_SOLICITUD:"Rechazar solicitud",
    FORMULARIO_APROBACION:"Formulario de aprobación",
    JUSTIFICACION_RESPUESTA_SOLICITUD:"Escriba la justificación de la respuesta",
    ACTA_RESPUESTA_SOLICITUD:"Seleccione el acta de la respuesta dada por el consejo de carrera",
    RESPUESTA_SOLICITUD:"Respuesta a la solicitud",
    SOLICITUD_APROBADA:"La respuesta a la solicitud ha sido registrada exitosamente",
    SOLICITAR_DISTINCION:"Desea solicitar una distinción para este trabajo de grado",
    JUSTIFICACION_RESPUESTA:"Justificación del estado",
    AUTORIZACION_DERECHOS_AUTOR:"Yo <u> {{nombre}}</u> con código <u>{{codigo}}</u>, manifiesto mi voluntad de ceder los derechos de autor del trabajo de grado <u> {{tg}} </u> a los demás estudiantes relacionados.",
    SELECCIONE_ACTA:"Seleccione el acta mediante la cual se da respuesta a la solicitud",
};
var text_en = {
    TITULO: "GENERATOR-OAS",
    MENSAJE_INICIAL: "Now get to start to develop",
    LISTADO_SOLICITUD: "List of Requests",
    MODALIDAD: "Modality",
    TITULO_PROPUESTA: "Title of proposal",
    VER_DOCUMENTO: "Show document",
    ESTADO_DOCUMENTO: "Document Status",
    RESUMEN: "Abstract",
    OPCIONES: "Options",
    SOLICITUD: "Request",
    ASIGNAR_DOCENTE: "Assign Teacher",
    FECHA: "Date",
    HORA: "Time",
    SELECCIONE_FORMATO: "Select the format",
    AREAS_CONOCIMIENTO: "Knowledge Area",
    LISTAR_SOLICITUDES: "List of request",
    ANO: "Year:",
    PERIODO:"Period",
    CARRERA: "Carrer",
    PENSUM: "List of subjects:",
    EVALUAR_PROYECTO: "Evaluate graduation project",
    SELECCIONAR_CARRERA: "Select a carrer",
    SELECCIONAR_PENSUM: "*Select a list of subjects",
    CODIGO: "Code",
    NOMBRE: "Name",
    MODALIDAD_ESP_POS: "Modality: Postgraduate subjects",
    MODALIDAD_ESP_PROFUNDIZACION: "Modality: Deepening subjects",
    ADMITIDOS_POR_RENDIMIENTO: "Admited by academic performance:",
    ADMITIDOS_POR_ECONOMIA: "Admited by payment:",
    FECHA_ACTUAL: "Current date:",
    FECHA_INICIO: "Start date:",
    FECHA_INICIO_DOS: "Second start date:",
    FECHA_FIN: "Ending date:",
    SELECCION_DE_ADMITIDOS: "Selection of admitted students",
    ADMITIDOS_POR_EXCELENCIA_A: "Admitted by academic performance and no payment (Max",
    ADMITIDOS_POR_COND_EC: "Admitted by academic performance and payment (Max",
    REQUERIDO: "It's required",
    PUBLICACION_DE_ESPACIOS: "Announcement of subjects list.",
    RESPUESTA: "Answer:",
    DENEGADO: "The student doesn't meet the requirements in order aply to this modality",
    REGISTRAR_PROPUESTA: "Register proposal.",
    ESTADO: "Status:",
    PORCENTAJE_CURSADO: "Percentage completed",
    PROMEDIO: "Average",
    NIVEL_ESTUDIOS: "Level of study:",
    TIPO_CARRERA: "Carrer type",
    REGISTRAR_TRABAJO_DE_GRADO: "Register graduation work.",
    EDICION_FORMATO_EVALUACION: "Edition of test formats",
    SELECCIONAR_FORMATO: "Select format:",
    EDICION_GENERAL: "General edition",
    TITULO_FORMATO: "Tittle of the format:",
    INTRODUCCION: "Introduction:",
    EDICION_PREGUNTAS: "Edition of questions",
    ENUNCIADO: "Statement:",
    PESO: "Value:",
    TIPO: "Type:",
    NUEVA_EVALUACION: "New test",
    BUSCAR_FORMATOS: "Search formats",
    NOMBRE_FORMATO: "Format name",
    INTRODUCCION_FORMATO: "Format introduction",
    ANADIR_PREGUNTA: "Add question",
    ANADIR_OPCION: "Add option",
    VISTA_PREVIA: "Preview",
    ASIGNAR_FORMATO_A_PC: "Asign format to a curricular project:",
    ASOCIAR_FORMATO_A_PC: "Asociate format to a curricular project:",
    SELECCIONAR_PC: "Select a curricular project",
    CREACION_EVALUACION: "Creation of the test",
    REVISION_DOCUMENTOS: "Documents review",
    DOCUMENTO: "Document",
    REVISIONES: "Reviews",
    LA_REVISION: "The review ",
    LA_REVISION_SE_ENCUENTRA: " is in process",
    SUBIR_DOCUMENTO: "Upload document",
    PUBLICAR_ASIGNATURA: "Announce subject",
    SOLICITUDES_DEL_ESTUDIANTE: "Student solicitudes",
    NINGUNA_SOLICITUD_REALIZADA: "You have not done any request",
    SOLICITUD_NUM: "Request N° ",
    FORMALIZACION: "Formalization ",
    CREDITOS: "Credits ",
    ESTUDIANTE_ACTUAL: "Current student",
    TITULO_TG: "Graduation work tittle",
    ASIGNAR_AREA: "Asign area",
    DE_ACUERDO_A_SU_PROPUESTA: "According to your proposal, select the areas, then attach the doc file",
    ESTUDIANTE: "Student",
    NOMBRE_PROPUESTA: "Proposal name: ",
    DE_ACUERDO_A_SU_PROPUEST: "According to your proposal, select the areas",
    SELECCIONE_LAS_OPCIONES: "Select the options to link a teacher",
    FILTRANDO_POR: "Filtering by: ",
    VINCULAR_DOCENTE: "Link teacher",
    NOMBRE_DEL_DOCUMENTO: "Document name",
    SELECCIONE_EL_DOCUMENTO: "Choose the document",
    CARGAR_ARCHIVO: "Load file",
    ARRASTRE_O_CLICK: "Click to load the file",
    GUARDAR_REGISTRO: "Save",
    CANCELAR: "Cancel",
    BORRAR: "Delete",
    CALIFICACION_FINAL_PG: "Final qualification of the Graduation project ",
    ENVIAR_EVALUACION: "Send Qualification",
    FECHA_REVISION: "Review date: ",
    REVISION: "Review ",
    INGRESE_NUEVA_AREA: "Enter a new area",
    NOMBRE_MUY_CORTO: "That's a very short name!",
    NOMBRE_MUY_EXTENSO: "That's a very long name!",
    DE_ACUERDO_A_SU_PERFIL: "According to your profile, choose the areas of knowledge: ",
    EL_AREA_NO_EXISTE: "The area of knowledge doesn't exist",
    NO_EXISTEN_AREAS: "There aren't areas of knoeledge",
    AREAS_DOCENTE: "Areas of knowledge for the teacher",
    DOCENTE_ACTUAL: "Current teacher: ",
    GUARDAR: "Save",
    OPCION_BOTON: " + Option",
    PREGUNTA_BOTON: " + Question",
    ASIGNAR_BOTON: " Asign",
    SEL_FECHA: "Select a date",
    ENVIAR_EVALUACION_BOTON: "Send qualification",
    SOLICITAR_REVISION: "Request review",
    SELECCIONAR: "Select",
    NUEVA_SOLICITUD: "Create new request",
    GESTION_SOLICITUD: "Request management module. ",
    SELECCIONAR_MODALIDAD:"Select modality",
    SELECCIONAR_SOLICITUD:"Select request type",
    FORMULARIO_SOLICITUD:"Request form",
    SELECCIONE_AREAS_CONOCIMIENTO:"Select the knowledge areas of your project",
    NOMBRE_CORTO:"Very short name",
    NOMBRE_LARGO:"Very long name",
    NUEVA_AREA:"Enter new area",
    AGREGAR_ESTUDIANTES:"Add students to the request",
    INGRESE_CODIGO:"Enter the code of the other students of the project",
    ESTUDIANTE_EN_LISTA:"Error: The student is already in the requested list.",
    ESTUDIANTE_NO_VALIDO:"Error: The code is not valid.",
    ESTUDIANTE_NO_REQUISITOS:"Error: The currently requested student does not meet the requirements to complete a grade level assignment.",
    ESTUDIANTE_TRABAJO_GRADO:"Error: The currently requested student is performing a degree assignment.",
    CANTIDAD_EXCEDIDA:"Error: The number of students for the requested modality is exceeded.",
    SOLICITAR_ASIGNATURAS:"Request Subjects",
    ANIO:"Year",
    ERROR:"ERROR",
    ESTUDIANTE_NO_ENCONTRADO:"Error: The student is not found",
    NOMBRE_EMPRESA:"Enter the name of the company",
    REGISTRO_FORMULARIO:"Form Submit",
    SOLICITUD_REGISTRADA:"The form was successfully registered",
    ERROR_SOLICITUDES_1:"There was an error inserting the details of the request.",
    ERROR_SOLICITUDES_2:"There was an error inserting the users of the request",
    ERROR_SOLICITUDES_3:"There was an error inserting the answer of the request",
    ERROR_RTA_SOLICITUD_1: "There was an error to update the answer of the request.",
    ERROR_RTA_SOLICITUD_2: "There was an error inserting the answer of the request.",
    ERROR_RTA_SOLICITUD_3: "There was an error inserting the response act of the request.",
    ERROR_RTA_SOLICITUD_4: "There was an error inserting the graduation work.",
    ERROR_RTA_SOLICITUD_5: "There was an error inserting the link of the graduation work.",
    ERROR_RTA_SOLICITUD_6: "There was an error to update the link of the graduation work.",
    ERROR_RTA_SOLICITUD_7: "There was an error to update the student's status in the graduation work.",
    ERROR_RTA_SOLICITUD_8: "Error when canceling the graduation work.",
    ERROR_RTA_SOLICITUD_9: "There was an error inserting the stundent in the graduation work.",
    ERROR_RTA_SOLICITUD_10: "There was an error inserting the knowledge areas of the graduation work.",
    ERROR_RTA_SOLICITUD_11: "There was an error inserting the document of the graduation work.",
    ERROR_RTA_SOLICITUD_12: "There was an error inserting the written document to the proposal of the graduation work.",
    ERROR_RTA_SOLICITUD_13: "There was an error to update the graduation work.",

    ERROR: {
        SUBIR_DOCUMENTO:"Error attempting to load a documento",
        HAY_SOLICITUD_DISTINCION:"Currently there is already a request for outstanding distinction for this degree work.",
        HAY_SOLICITUD_PENDIENTE:"Currently the student already has a grade job request that is pending by response.",
    },
    VERIFICAR_DOCUMENTO:"An error occurred while trying to load a document. Check your connection and document type (.pdf) and the size. ",
    BTN: {
        GUARDAR_ESPACIOS_ACADEMICOS: "Save academic spaces",
        CAMBIAR_ESPACIOS_ACADEMICOS: "Change academic spaces",
        VER_DETALLES: "View details",
        RESPONDER_SOLICITUD:"Reply request",
    },
    ENVIAR_SOLICITUD:"Send Form",
    INGRESAR_PROPUESTA:"Enter the name of the proposal",
    SELECCIONE_EMPRESA:"Select the name of the company",
    CARTA_DIRIGIDA:"Enter the name of the person to whom the letter is addressed",
    CARGO_DIRIGIDO:"Enter the position of the person to whom the letter is addressed",
    INGRESAR_RESUMEN_PROPUESTA:"Write a summary of your proposal",
    CARGUE_PROPUESTA:"Upload your proposal",
    DOCENTE_AVALA_PROPUESTA:"Select the teacher who supports the proposal",

    CARGUE_CERTIFICACION_ARL:"Upload the certification of the affiliation to the ARL",
    ESPACIOS_ACADEMICOS_MISMO_PERIODO:"Select if you want to register the two degree workspaces in the same period.",
    JUSTIFICACION_SOLICITUD:"Write the cause that justifies the request",
    DIRECTOR_ACTUAL:"Name of current director",
    DIRECTOR_NUEVO:"Select the teacher requestes as  new director",
    EVALUADOR_ACTUAL:"Select the name of the current evaluator",
    EVALUADOR_NUEVO:"Select the teacher that you suggest as the new evaluator",
    HOJA_VIDA_DIRECTOR_EXTERNO_NUEVO:"Upload the resume of the new external director",
    SELECCIONE_TIPO_PRORROGA:"Select the type of extension that you are requesting",
    SELECCIONE_ESPACIOS_ACADEMICOS:"Select the academic spaces that you want to request",
    CANCELAR_ESPACIOS_ACADEMICOS:"Select the academic space that you want to cancel",
    SELECCIONE_ESPACIO_SOLICITADO:"Select the academic space that you are requesting",
    NOMBRE_ANTERIOR_PROPUESTA:"Current name of proposal",
    ESCRIBA_NOMBRE_NUEVO_PROPUESTA:"Write the new name of the proposal",
    ANTERIOR_RESUMEN_PROPUESTA: "Current summayof the proposal",
    ESCRIBA_RESUMEN_NUEVO_PROPUESTA:"Write the new summary of your proposal",
    ANTERIOR_PROPUESTA:"Current proposal",
    CARGUE_NUEVA_PROPUESTA:"Upload the new proposal",
    ANTERIORES_AREAS_CONOCIMIENTO:"Current areas of knowledge",
    SELECCIONE_NUEVAS_AREAS_CONOCIMIENTO:"Select the new knowledge areas of your projec",
    CARGUE_PLAN_INVESTIGACION:"Upload the Plan of research activities",
    SELECCIONE_ESTRUCTURA_INVESTIGACION_AVALA:"Select the research structure that supports the proposal",
    SELECCIONE_DOCENTE_DESIGNADO_INVESTIGACION:"Select the director appointed by the research structure",
    CARGUE_PLAN_NEGOCIOS:"Upload plan or business model",
    ANTERIOR_DIRECTOR_EXTERNO:"Current external director",
    ESCRIBA_DIRECTOR_EXTERNO_NUEVO:"Enter the name of the new external director",
    PLAN_INVESTIGACION_ANTERIOR:"Current plan of researchs",
    CARGUE_PLAN_INVESTIGACION_NUEVO:"Upload New Research Activities Plan",
    CREACION_INDIVIDUAL_COLECTIVA:"Select if your creation is individual or collective",
    ANTERIOR_PLAN_NEGOCIOS:"Current Previous Business Plan or Model",
    CARGUE_NUEVO_PLAN_NEGOCIOS:"Upload the new business plan or model",
    SELECCIONE_ESTUDIANTES_PROYECTO:"Select the students that belong to the project",
    SOLICITUD_SIN_FORMULARIO:"This request does not require completing any form. Are you sure you want to send it?",
    NUMERO_RADICADO : "Roaming number",
    TIPO_SOLICITUD : "Type of request",
    ESTADO_SOLICITUD : "State",
    DETALLE : "Detail",
    ESTUDIANTE_SIN_SOLICITUD : "The student has not made any request.",
    DIRIGIJASE_SOLICITUD : "If you want to make a new request go to the module",
    COORDINADOR_SIN_SOLICITUD : "Dear Coordinator, you do not currently have any requests to review.",
    DETALLES_SOLICITUD: "Request's details",
    INFORMACION_SOLICITUD: "Request's information",
    SOLICITANTES: "Applicants",
    LOADING:{
      CARGANDO_ESTUDIANTE:"Loading student data",
      ENVIANDO_FORLMULARIO:"Sending form",
      CARGANDO_DETALLES:"Loading form details",
      CARGANDO_SOLICITUDES:"Loading requests",
      CARGANDO_DOCUMENTO:"Loading document",
      CARGANDO_DETALLES_SOLICITUD:"Loading request details",
    },
    SELECT:{
      SELECCIONE:"Select an option",
      DOCENTE_CAMBIO: "Select the teacher to make the change",
      DOCENTE_REVISOR: "Select the project review teacher",
      DOCENTE_DIRECTOR: "Select the project director teacher",
      DOCENTE_REVISOR_FILTRO: "Enter at least 2 letters of the name of the project review teacher",
      DOCENTE_DIRECTOR_FILTRO: "Enter at least 2 letters of the name of the project director teacher",
      SIN_CARRERA:"No carreer selected",
      TIPO_DISTINCION:"Select the type of distinction",
      TRABAJO_GRADO_EVALUAR:"Select the degree job you want to evaluate",
    },
    DOCUMENTO:{
        CARGAR_DOCUMENTO:"Load document",
        INGRESE_NOMBRE:"Enter the document's name",
        INGRESE_DESCRIPCION:"Enter the document's description",
        SELECCIONE_DOCUMENTO:"Select the document",
        SIN_DOCUMENTO:"There is not a selected document",
        SELECCIONAR_DOCUMENTO:"Select document",
        VER_DOCUMENTO:"View document",
        CARGADO:"Document loaded",
        INGRESE_CONSECUTIVO: "Enter the consecutive document",
    },
    SWITCH:{
        SI:"YES",
        NO:"NO",
    },
    CODIGO_MATERIA:"Subject code",
    SIN_CARRERAS_SOLICITUDES:"There are currently no carrers available for your choice",
    APROBAR_SOLICITUD:"Approve request",
    RECHAZAR_SOLICITUD:"Reject request",
    FORMULARIO_APROBACION:"Approval form",
    JUSTIFICACION_RESPUESTA_SOLICITUD:"Write the justification for the answer",
    ACTA_RESPUESTA_SOLICITUD:"Select the document with the answer given by the Career Council",
    RESPUESTA_SOLICITUD:"Response to the request",
    SOLICITUD_APROBADA:"The response to the request has been successfully registered",
    SOLICITAR_DISTINCION:"Want an application for this degree job",
    JUSTIFICACION_RESPUESTA:"Justification of the state.",
    AUTORIZACION_DERECHOS_AUTOR:"I <u> {{nombre}}</u> with code <u>{{codigo}}</u>, I express my desire to assign the copyright of the work of degree to the other related students.",
    SELECCIONE_ACTA:"Select the minutes by which the request is answered",
};
angular.module('poluxClienteApp')
    .config(function($translateProvider) {
        $translateProvider
            .translations("es", text_es)
            .translations("en", text_en);
        $translateProvider.preferredLanguage("es");
        $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
    });
