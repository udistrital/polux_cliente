
'use strict';

/**
 * @ngdoc overview
 * @name poluxApp
 * @description
 * # poluxApp
 *
 * Main module of the application.
 */
angular
  .module('poluxApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ngTable',
    'ngMaterial',
    'ejemploService',
    'entidadService',
    'materiasService',
    'areasService',
    'pdf',
    'entidadService',
    'documentoService',
    'revisionService'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/evaluacion', {
        templateUrl: 'views/evaluacion.html'
      })
      .when('/ejemplo', {
        templateUrl: 'views/ejemplo.html',
        controller: 'EjemploCtrl',
        controllerAs: 'ejemplov'
      })
      .when('/pasantia/carta_presentacion', {
        templateUrl: 'views/pasantia/carta_presentacion.html',
        controller: 'PasantiaCartaPresentacionCtrl',
        controllerAs: 'cartaPresentacion'
      })
      .when('/materiasPosgrado/publicarAsignaturas', {
        templateUrl: 'views/materias posgrado/publicarasignaturas.html',
        controller: 'PublicarasignaturasCtrl',
        controllerAs: 'publicarAsignaturas'
      })

      .when('/perfil', {
        templateUrl: 'views/perfil.html',
        controller: 'PerfilCtrl',
        controllerAs: 'perfil'
      })
      .when('/materiasPosgrado/solicitar', {
        templateUrl: 'views/materias posgrado/solicitar.html',
        controller: 'SolicitarCtrl',
        controllerAs: 'solicitar'
      })
      .when('/docente/TGs/revision_documento', {
        templateUrl: 'views/docente/tgs/revision_documento.html',
        controller: 'DocenteTgsRevisionDocumentoCtrl',
        controllerAs: 'docenterevision'
      })
      .when('/docente/tgs', {
        templateUrl: 'views/docente/tgs.html',
        controller: 'DocenteTgsCtrl',
        controllerAs: 'docente/tgs'
      })
      .when('/docente/TGs/revisiones', {
        templateUrl: 'views//docente/tgs/revisiones.html',
        controller: 'DocenteTgsRevisionesCtrl',
        controllerAs: '/docente/TGs/revisiones'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
