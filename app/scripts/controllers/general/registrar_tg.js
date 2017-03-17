'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:RegistrarTgCtrl
 * @description
 * # RegistrarTgCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('RegistrarTgCtrl', function (academicaRequest) {

    var self=this;

    self.estudiantes=academicaRequest.getAllEstudiantesJson(); //cambiar a self.estudiantes=academicaRequest.ObtenerEstudiantes();

  });
