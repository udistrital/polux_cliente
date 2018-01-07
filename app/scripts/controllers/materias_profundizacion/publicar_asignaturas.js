'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionPublicarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionPublicarAsignaturasCtrl', function (academicaRequest, $scope) {
    var ctrl = this;
    $scope.userId = "60261576";
    ctrl.periodo=[];
    ctrl.carreras=[];
    ctrl.modalidad="PREGRADO";

    academicaRequest.obtenerPeriodo().then(function(response){
      ctrl.periodo=response[0];
    });

    $scope.$watch("userId",function() {
        var parametrosCoordinador = {
          'identificacion':$scope.userId,
          'tipo': 'PREGRADO'
        };
        //ctrl.conSolicitudes = false;
        academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
              ctrl.carreras = [];
              if(responseCoordinador!=="null"){
                  ctrl.carreras = responseCoordinador;
                  angular.forEach(responseCoordinador, function(carrera){
                      carreras.push(carrera.CODIGO_CARRERA);
                  });
              }
        });

      $scope.load = true;
    });

    /*academicaRequest.obtenerCarreras({
      'tipo': 'PREGRADO'
    }).then(function(response){
      ctrl.carreras=response;
    });*/

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
