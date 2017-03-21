'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoSolicitarAsignaturasCtrl
 * @description
 * # MateriasPosgradoSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoSolicitarAsignaturasCtrl', function (poluxMidRequest) {
    var ctrl = this;

    ctrl.estudiante={
      "Codigo": "20102020009",
      "Nombre": "PARRA FUENTES FABIO ANDRES",
      "Tipo": "POSGRADO"
    };
    ctrl.modalidad="MATERIAS POSGRADO";

    poluxMidRequest.post("disponibilidad/Registrar?tdominio=2", self.colegio).then(function(response){
        console.log(response);
        ctrl.validar= response.data;
    });
  });
