'use strict';

/**
 * @ngdoc overview
 * @name poluxClienteApp
 * @description
 * # poluxClienteApp
 *
 * Main module of the application.
 */
angular
    .module('poluxClienteApp', [
        'angular-loading-bar',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'afOAuth2',
        'treeControl',
        'ngMaterial',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.treeView',
        'ui.grid.selection',
        'ui.grid.exporter',
        'ui.grid.autoResize',
        'ui.grid.pagination',
        'ngStorage',
        'ngWebSocket',
        'angularMoment',
        'ui.utils.masks',
        'poluxService',
        'documentoService',
        'oikosService',
        'parametrosService',
        'academicaService',
        'cadenaService',
        'ui.select',
        'cidcService',
        'utilsService',
        //'blueimp.fileupload',
        'poluxMidService',
        'gestorDocumentalMidService',
        'notificacionService',
        'pdf',
        'nuxeoMidService',
        'pascalprecht.translate',
        'file-model',
        'angularBootstrapFileinput',
        'infinite-scroll',
        'uiSwitch',
        'configuracionService',
        'nuxeoService',
        'implicitToken',
        'autenticacionMidService'
        
    ])
    .run(function(amMoment) {
        amMoment.changeLocale('es');
    })
    .config(['cfpLoadingBarProvider', 'uiSelectConfig', function(cfpLoadingBarProvider, uiSelectConfig) {
        uiSelectConfig.theme = 'select2';
        uiSelectConfig.resetSearchInput = true;
        uiSelectConfig.appendToBody = true;
    }])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("");
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/notificaciones', {
              templateUrl: 'views/notificaciones.html',
              controller: 'notificacionesCtrla',
              controllerAs: 'notificaciones'
          })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/materias_posgrado/listar_solicitudes', {
                templateUrl: 'views/materias_posgrado/listar_solicitudes.html',
                controller: 'MateriasPosgradoListarSolicitudesCtrl',
                controllerAs: 'listarSolicitudes'
            })
            .when('/materias_posgrado/publicar_asignaturas', {
                templateUrl: 'views/materias_posgrado/publicar_asignaturas.html',
                controller: 'MateriasPosgradoPublicarAsignaturasCtrl',
                controllerAs: 'publicarAsignaturas'
            })
            .when('/materias_posgrado/solicitar_asignaturas', {
                templateUrl: 'views/materias_posgrado/solicitar_asignaturas.html',
                controller: 'MateriasPosgradoSolicitarAsignaturasCtrl',
                controllerAs: 'solicitarAsignaturas'
            })
            .when('/perfil_docente/areas', {
                templateUrl: 'views/perfil_docente/areas_docente.html',
                controller: 'AreasDocenteCtrl',
                controllerAs: 'areasDocente'
            })
            .when('/formato_nuevo', {
                templateUrl: 'views/formato/formato_nuevo.html',
                controller: 'FormatoNuevoCtrl',
                controllerAs: 'formatoNuevo'
            })
            .when('/formato_editar', {
                templateUrl: 'views/formato/formato_editar.html',
                controller: 'FormatoEditarCtrl',
                controllerAs: 'formatoEditar'
            })
            .when('/formato_ver', {
                templateUrl: 'views/formato/formato_ver.html',
                controller: 'FormatoVerCtrl',
                controllerAs: 'formatoVer'
            })
            .when('/general/propuesta', {
                templateUrl: 'views/general/propuesta.html',
                controller: 'PropuestaCtrl',
                controllerAs: 'propuesta'
            })
            .when('/general/cons_prop', {
                templateUrl: 'views/general/consulta_propuesta.html',
                controller: 'ConsultaPropuestaCtrl',
                controllerAs: 'consultaPropuesta'
            })
            .when('/general/reg_TG', {
                templateUrl: 'views/general/registrar_tg.html',
                controller: 'RegistrarTgCtrl',
                controllerAs: 'registrarTG'
            })
            .when('/materias_profundizacion/publicar_asignaturas', {
                templateUrl: 'views/materias_profundizacion/publicar_asignaturas.html',
                controller: 'MateriasProfundizacionPublicarAsignaturasCtrl',
                controllerAs: 'profundizacion_publicarAsignaturas'
            })
            .when('/materias_profundizacion/solicitar_asignaturas', {
                templateUrl: 'views/materias_profundizacion/solicitar_asignaturas.html',
                controller: 'MateriasProfundizacionSolicitarAsignaturasCtrl',
                controllerAs: 'profundizacion_solicitarAsignaturas'
            })
            .when('/materias_profundizacion/listar_solicitudes', {
                templateUrl: 'views/materias_profundizacion/listar_solicitudes.html',
                controller: 'MateriasProfundizacionListarSolicitudesCtrl',
                controllerAs: 'profundizacion_listarSolicitudes'
            })
            .when('/docente/tgs/revision_documento', {
                templateUrl: 'views/docente/tgs/revision_documento.html',
                controller: 'DocenteTgsRevisionDocumentoCtrl',
                controllerAs: 'docenterevision'
            })
            .when('/docente/tgs/revision_documento/:idDocente', {
                templateUrl: 'views/docente/tgs/revision_documento.html',
                controller: 'DocenteTgsRevisionDocumentoCtrl',
                controllerAs: 'docenterevision'
            })
            .when('/formato/formato_edicion', {
                templateUrl: 'views/formato/formato_editar.html',
                controller: 'FormatoEditarCtrl',
                controllerAs: 'formatoEditar'
            })
            .when('/estudiante/revision_documento/:idEstudiante', {
                templateUrl: 'views/estudiante/revision_documento.html',
                controller: 'EstudianteRevisionDocumentoCtrl',
                controllerAs: 'estudianteRevisionDoc'
            })
            .when('/estudiante/revision_documento', {
                templateUrl: 'views/estudiante/revision_documento.html',
                controller: 'EstudianteRevisionDocumentoCtrl',
                controllerAs: 'estudianteRevisionDoc'
            })
            .when('/evaluar_proyecto', {
                templateUrl: 'views/formato/evaluar_proyecto.html',
                controller: 'EvaluarProyectoCtrl',
                controllerAs: 'evaluarProyecto'
            })
            .when('/formato_proyecto', {
                templateUrl: 'views/formato/formato_facultad.html',
                controller: 'FormatoFacultadCtrl',
                controllerAs: 'formatoFacultad'
            })
            .when('/formato/formato_sesion_proyecto', {
                templateUrl: 'views/formato/formato_sesion_proyecto.html',
                controller: 'FormatoFormatoSesionProyectoCtrl',
                controllerAs: 'formatoSesionProyecto'
            })
            .when('/formato/socializacion', {
                templateUrl: 'views/formato/socializacion.html',
                controller: 'SocializacionCtrl',
                controllerAs: 'socializacion'
            })
            .when('/solicitudes/listar_solicitudes', {
              templateUrl: 'views/solicitudes/listar_solicitudes.html',
              controller: 'SolicitudesListarSolicitudesCtrl',
              controllerAs: 'listarSolicitudes'
            })
            .when('/solicitudes/crear_solicitud', {
              templateUrl: 'views/solicitudes/crear_solicitud.html',
              controller: 'SolicitudesCrearSolicitudCtrl',
              controllerAs: 'crearSolicitud'
            })
            .when('/solicitudes/aprobar_solicitud', {
              templateUrl: 'views/solicitudes/aprobar_solicitud.html',
              controller: 'SolicitudesAprobarSolicitudCtrl',
              controllerAs: 'aprobarSolicitud'
            })
            .when('/solicitudes/aprobar_solicitud/:idSolicitud', {
              templateUrl: 'views/solicitudes/aprobar_solicitud.html',
              controller: 'SolicitudesAprobarSolicitudCtrl',
              controllerAs: 'aprobarSolicitud'
            })
            .when('/formato/evaluar', {
              templateUrl: 'views/formato/evaluar.html',
              controller: 'FormatoEvaluarCtrl',
              controllerAs: 'evaluarTG'
            })
            .when('/administracion/areas', {
              templateUrl: 'views/administracion/areas.html',
              controller: 'AdministracionAreasCtrl',
              controllerAs: 'administrarAreas'
            })
            .when('/materias_posgrado/listar_aprobados', {
              templateUrl: 'views/materias_posgrado/listar_aprobados.html',
              controller: 'MateriasPosgradoListarAprobadosCtrl',
              controllerAs: 'listarAprobados'
            })
            .when('/materias_posgrado/registrar_nota', {
              templateUrl: 'views/materias_posgrado/registrar_nota.html',
              controller: 'MateriasPosgradoRegistrarNotaCtrl',
              controllerAs: 'registrarNota'
            })
            .when('/materias_posgrado/formalizar_solicitud', {
              templateUrl: 'views/materias_posgrado/formalizar_solicitud.html',
              controller: 'MateriasPosgradoFormalizarSolicitudCtrl',
              controllerAs: 'formalizarSolicitud'
            })
            .when('/pasantia/solicitar_carta', {
              templateUrl: 'views/pasantia/solicitar_carta.html',
              controller: 'PasantiaSolicitarCartaCtrl',
              controllerAs: 'solicitarCarta'
            })
            .when('/no_permission', {
              templateUrl: 'views/no_permission.html',
              controller: 'NoPermissionCtrl',
              controllerAs: 'noPermission'
            })
            .when('/general/consultar_trabajo_grado', {
              templateUrl: 'views/general/consultar_trabajo_grado.html',
              controller: 'GeneralConsultarTrabajoGradoCtrl',
              controllerAs: 'consultarTrabajoGrado'
            })
            .when('/pasantia/aprobar_carta', {
              templateUrl: 'views/pasantia/aprobar_carta.html',
              controller: 'PasantiaAprobarCartaCtrl',
              controllerAs: 'aprobarCarta'
            })
            .when('/pasantia/actas_seguimiento', {
              templateUrl: 'views/pasantia/actas_seguimiento.html',
              controller: 'PasantiaActasSeguimientoCtrl',
              controllerAs: 'actasSeguimiento'
            })
            .when('/general/registrar_nota', {
              templateUrl: 'views/general/registrar_nota.html',
              controller: 'GeneralRegistrarNotaCtrl',
              controllerAs: 'registrarNotaVinculado'
            })
            .when('/trabajo_grado/revisar_anteproyecto', {
              templateUrl: 'views/trabajo_grado/revisar_anteproyecto.html',
              controller: 'TrabajoGradoRevisarAnteproyectoCtrl',
              controllerAs: 'revisarAnteproyecto'
            })
            .when('/trabajo_grado/revisar_proyecto', {
              templateUrl: 'views/trabajo_grado/revisar_proyecto.html',
              controller: 'TrabajoGradoRevisarProyectoCtrl',
              controllerAs: 'revisarProyecto'
            })
            .when('/general/concepto_tg', {
              templateUrl: 'views/general/concepto_tg.html',
              controller: 'GeneralConceptoTgCtrl',
              controllerAs: 'conceptoTg'
            })
            .when('/general/concepto_tg/:idVinculacion', {
              templateUrl: 'views/general/concepto_tg.html',
              controller: 'GeneralConceptoTgCtrl',
              controllerAs: 'conceptoTg'
            })
            .when('/materias_profundizacion/seleccion_admitidos', {
              templateUrl: 'views/materias_profundizacion/seleccion_admitidos.html',
              controller: 'MateriasProfundizacionSeleccionAdmitidosCtrl',
              controllerAs: 'seleccionAdmitidos'
            })
            .when('/materias_profundizacion/formalizar_solicitud', {
              templateUrl: 'views/materias_profundizacion/formalizar_solicitud.html',
              controller: 'MateriasProfundizacionFormalizarSolicitudCtrl',
              controllerAs: 'profundizacionFormalizarSolicitud'
            })
            .when('/materias_profundizacion/vincular_admitidos', {
              templateUrl: 'views/materias_profundizacion/vincular_admitidos.html',
              controller: 'MateriasProfundizacionVincularAdmitidosCtrl',
              controllerAs: 'profundizacionVincularAdmitidos'
            })
            .when('/materias_profundizacion/registrar_nota', {
              templateUrl: 'views/materias_profundizacion/registrar_nota.html',
              controller: 'MateriasProfundizacionRegistrarNotaCtrl',
              controllerAs: 'profundizacionRegistrarNota'
            })
            .when('/reportes/reporte_general', {
              templateUrl: 'views/reportes/reporte_general.html',
              controller: 'ReportesReporteGeneralCtrl',
              controllerAs: 'reporteGeneral'
            })   
            .when('/administracion/parametrizacion', {
              templateUrl: 'views/administracion/Parametrizacion.html',
              controller: 'AdministrarTablasCTRL',
              controllerAs: 'Parametrizacion'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
