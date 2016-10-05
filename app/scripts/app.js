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
    'pdf',
    'ejemploService',
    'entidadService',
    'documentoService'
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
      .otherwise({
        redirectTo: '/'
      });
  });
