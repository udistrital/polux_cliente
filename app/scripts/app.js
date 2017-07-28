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
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'poluxService',
    'academicaService',
    'cadenaService',
    //'blueimp.fileupload',
    'poluxMidService',
    'pdf',
    'pascalprecht.translate',
  ])
    .run(function(amMoment) {
      amMoment.changeLocale('es');
    })
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-clock-o fa-2x faa-spin animated"></div>';
    }])
    .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("");
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
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

      .when('/formato/formato_edicion', {
        templateUrl: 'views/formato/formato_edicion.html',
        controller: 'FormatoEdicionCtrl',
        controllerAs: 'formatoEdicion'
      })
      .when('/estudiante/revision_documento', {
        templateUrl: 'views/estudiante/revision_documento.html',
        controller: 'EstudianteRevisionDocumentoCtrl',
        controllerAs: 'estudianteRevisionDoc'
      })
      .when('/solicitudes/listar_solicitudes', {
        templateUrl: 'views/solicitudes/listar_solicitudes.html',
        controller: 'SolicitudesListarSolicitudesCtrl',
        controllerAs: 'listarSolicitudes'
      })
      .when('/solicitudes/crear_solicitud/:idModalidad', {
        templateUrl: 'views/solicitudes/crear_solicitud.html',
        controller: 'SolicitudesCrearSolicitudCtrl',
        controllerAs: 'crearSolicitud'
      })
      .when('/solicitudes/crear_solicitud', {
        templateUrl: 'views/solicitudes/crear_solicitud.html',
        controller: 'SolicitudesCrearSolicitudCtrl',
        controllerAs: 'crearSolicitud'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
