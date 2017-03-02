'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:MateriasProfundizacionSolicitarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionSolicitarAsignaturasCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('MateriasProfundizacionSolicitarAsignaturasCtrl', function () {
    var ctrl = this;

    ctrl.estudiante={
      "Codigo": "20102020008",
      "Nombre": "María Fernanda Avendaño",
      "Tipo": "PREGRADO"
    };
    ctrl.modalidad="MATERIAS PROFUNDIZACION";
  });
