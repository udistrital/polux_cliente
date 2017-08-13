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
    ASIGNAR_DOCENTE: "Asignar Docente",
    SOCIALIZACION: "Socialización de proyectos de grado",
    NUEVA_EVALUACION: "Nueva Evaluación",
    FORMATOS_EVALUACION: "Formatos de Evaluación",
    BUSCAR_FORMATOS: "Buscar Formatos",
    FECHA: "Fecha",
    HORA: "Hora",
    SELECCION_PROYECTO: "Seleccione el Proyecto",
    LUGAR: "Lugar",
    SELECCIONE_FORMATO: "Seleccione el formato"
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
    SELECCIONE_FORMATO: "Select the format"
};
angular.module('poluxClienteApp')
    .config(function($translateProvider) {
        $translateProvider
            .translations("es", text_es)
            .translations("en", text_en);
        $translateProvider.preferredLanguage("es");
        $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
    });