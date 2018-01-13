'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoPublicarAsignaturasCtrl
 * @description
 * # MateriasPosgradoPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoPublicarAsignaturasCtrl', function (academicaRequest, $scope, $translate) {
    var ctrl = this;
    $scope.userId = "12237136";
    ctrl.periodo=[];
    ctrl.modalidad="POSGRADO";

    academicaRequest.get("periodo_academico","X").then(function(response){
        if (!angular.isUndefined(response.data.periodoAcademicoCollection.periodoAcademico)) {
            ctrl.periodo=response.data.periodoAcademicoCollection.periodoAcademico[0];
        }
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
      academicaRequest.get("pensums",carreraSeleccionada).then(function(response){
          if (!angular.isUndefined(response.data.pensums.pensum)) {
              ctrl.carrera=carreraSeleccionada;
              ctrl.pensums=response.data.pensums.pensum;
              ctrl.pensumSeleccionado=null;
              $scope.load = false;
          }
      });
    };

  });
