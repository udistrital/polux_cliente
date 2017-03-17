'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionPublicarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionPublicarAsignaturasCtrl', function (academicaRequest) {
    var ctrl = this;
    ctrl.periodo=[];
    ctrl.carreras=[];
    ctrl.modalidad="PREGRADO";

    academicaRequest.obtenerPeriodo().then(function(response){
      ctrl.periodo=response[0];
    });

    academicaRequest.obtenerCarreras({
      'tipo': 'PREGRADO'
    }).then(function(response){
      ctrl.carreras=response;
    });

    ctrl.myFunc = function(carreraSeleccionada) {
      ctrl.pensums=[];
      academicaRequest.obtenerPensums({
       'carrera' : carreraSeleccionada
      }).then(function(response){
        ctrl.carrera=carreraSeleccionada;
        ctrl.pensums=response;
      });
    };
  });
