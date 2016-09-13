'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:EjemploCtrl
 * @description
 * # EjemploCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('EjemploCtrl', function (ejemploRequest) {
    var self =this;
    self.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    self.servicio = ejemploRequest.metodoEjemplo();
  });
