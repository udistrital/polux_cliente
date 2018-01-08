'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
 * @description
 * # MateriasPosgradoPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoPublicarAsignaturasCtrl', function (academicaRequest, $scope,$translate) {
    var ctrl = this;
    $scope.userId = "19187046";
    ctrl.periodo=[];
    ctrl.modalidad="POSGRADO";

    academicaRequest.obtenerPeriodo().then(function(response){
      ctrl.periodo=response[0];
    });

    $scope.$watch("userId",function() {
        $scope.msgCargandoSolicitudes = $translate.instant('LOADING.CARGANDO_ASIGNATURAS');
        $scope.load = true;
        ctrl.carreras = [];
        var parametrosCoordinador = {
          'identificacion':$scope.userId,
          'tipo': 'POSGRADO'
        };
        academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
              if(responseCoordinador!=="null"){
                  ctrl.carreras = responseCoordinador;
              }
        });
        $scope.load = false;
    });

    ctrl.myFunc = function(carreraSeleccionada) {
      $scope.pensumSeleccionado=null;
      $scope.msgCargandoPensums = $translate.instant('LOADING.CARGANDO_PENSUMS');
      $scope.load = true;
      ctrl.pensums=[];
      academicaRequest.obtenerPensums({
       'carrera' : carreraSeleccionada
      }).then(function(response){
        ctrl.carrera=carreraSeleccionada;
        ctrl.pensums=response;
        ctrl.pensumSeleccionado=null;
        $scope.load = false;
      });
    };

  });
