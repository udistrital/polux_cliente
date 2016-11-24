
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
    'ngCookies',
    'ngMessages',
    'ngRoute',
    'ngTable',
    'ngMaterial',
    'ngAnimate',
    'ejemploService',
    'entidadService',
    'materiasService',
    'areasService',
    'entidadService',
    'documentoService',
    'ngSanitize',
    'ngTouch',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'pdf'
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
      .otherwise({
        redirectTo: '/'
      });
  });
