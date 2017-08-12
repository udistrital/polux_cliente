'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:asignarArea
 * @description
 * # asignarArea
 */
angular.module('poluxClienteApp')
  .directive('asignarEstudiantes', function (poluxRequest,cadenaRequest) {
    return {
      scope: {
        estudiantes: '=',
        },
      templateUrl: 'views/directives/solicitudes/asignar_estudiantes.html',
      controller:function($scope){
        var ctrl = this;
        ctrl.estudianteRegistrado = false;
        ctrl.removable=false;

        ctrl.agregarEstudiante = function(){
            if(!$scope.estudiantes.includes(ctrl.codigoEstudiante)){
                ctrl.estudianteRegistrado = false;
                $scope.estudiantes.push(ctrl.codigoEstudiante);
            }else{
              ctrl.estudianteRegistrado = true;
            }
            console.log($scope.estudiantes);
        };

      },
      controllerAs:'d_asignarEstudiante'
    };
  });
