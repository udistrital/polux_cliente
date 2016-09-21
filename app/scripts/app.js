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
    'ejemploService'
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
        templateUrl: 'views/ejemplo.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
