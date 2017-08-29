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
  GESTION_SOLICITUD: "Módulo de gestión de solicitudes. ",
  NUEVA_SOLICITUD: "Crear nueva solicitud",
  SELECCIONAR_MODALIDAD:"Seleccione la modalidad",
  SELECCIONAR_SOLICITUD:"Seleccione tipo de solicitud",
  FORMULARIO_SOLICITUD:"Formulario de solicitud",
  AREAS_CONOCIMIENTO:"Areas de conocimiento",
  SELECCIONE_AREAS_CONOCIMIENTO:"Seleccione las areas del conocimiento de su proyecto",
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
  PERIODO:"Periodo",
  CARRERA:"Carrera",
  ERROR:"ERROR",
  ESTUDIANTE_NO_ENCONTRADO:"Error: El estudiante no se encuentra",
  NOMBRE_EMPRESA:"Escriba el nombre de la empresa",
  REGISTRO_FORMULARIO:"Registro de formulario",
  SOLICITUD_REGISTRADA:"El formulario se registro correctamente",
  ERROR_SOLICITUDES_1:"Ocurrio un error al insertar los detalles de la solicitud",
  ERROR_SOLICITUDES_2:"Ocurrio un error al insertar los usuarios de la solicitud.",
};
var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop",
  NUEVA_SOLICITUD: "Create new request",
  SELECCIONAR_MODALIDAD:"Select modality",
  SELECCIONAR_SOLICITUD:"Select request type",
  FORMULARIO_SOLICITUD:"Request form",
  AREAS_CONOCIMIENTO:"Areas of knowledge",
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
  PERIODO:"Period",
  CARRERA:"Career",
  ERROR:"ERROR",
  ESTUDIANTE_NO_ENCONTRADO:"Error: The student is not found",
  NOMBRE_EMPRESA:"Enter the name of the company",
  REGISTRO_FORMULARIO:"Form Submit",
  SOLICITUD_REGISTRADA:"The form was successfully registered",
  ERROR_SOLICITUDES_1:"There was an error inserting the details of the request.",
  ERROR_SOLICITUDES_2:"There was an error inserting the details of the request",
};
angular.module('poluxClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
