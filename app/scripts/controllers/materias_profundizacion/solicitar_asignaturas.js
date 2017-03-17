'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionSolicitarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionSolicitarAsignaturasCtrl', function () {
    var ctrl = this;

    ctrl.estudiante={
      "Codigo": "20102020008",
      "Nombre": "María Fernanda Avendaño",
      "Tipo": "PREGRADO"
    };
    ctrl.modalidad="MATERIAS PROFUNDIZACION";
  });
