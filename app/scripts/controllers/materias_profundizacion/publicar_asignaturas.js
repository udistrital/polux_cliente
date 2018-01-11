'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionPublicarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionPublicarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionPublicarAsignaturasCtrl', function (academicaRequest, $scope, $translate) {
    var ctrl = this;
    $scope.userId = "60261576";
    ctrl.periodo=[];
    ctrl.modalidad="PREGRADO";
    $scope.pensumSeleccionado=null;

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
          'tipo': 'PREGRADO'
        };
        academicaRequest.obtenerCoordinador(parametrosCoordinador).then(function(responseCoordinador){
              if(responseCoordinador!=="null"){
                  ctrl.carreras = responseCoordinador;
              }
        });
      $scope.load = false;
    });

    ctrl.myFunc = function(carreraSeleccionada) {
      ctrl.pensums=[];
      $scope.msgCargandoPensums = $translate.instant('LOADING.CARGANDO_PENSUMS');
      $scope.load = true;
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
