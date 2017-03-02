'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:RegistrarTgCtrl
 * @description
 * # RegistrarTgCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('RegistrarTgCtrl', function (academicaRequest) {

    var self=this;

    self.estudiantes=academicaRequest.getAllEstudiantesJson(); //cambiar a self.estudiantes=academicaRequest.ObtenerEstudiantes();

  });
