'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:formato/llenarEvaluacion
 * @description
 * # formato/llenarEvaluacion
 */
angular.module('poluxClienteApp')
  .directive('llenarEvaluacion', function () {
    return {
      restrict: 'E',
      scope: {
        formato: '=?'
      },
      templateUrl: 'views/directives/formato/llenar_evaluacion.html',
      controller: function(poluxRequest, $scope) {
        var ctrl = this;
        $scope.$watch('formato', function() {
          console.log(ctrl.Formato);
        });
        poluxRequest.get("tr_formato/" + $scope.formato,"")
          .then(function(response) {
            ctrl.Formato = response.data;
            console.log(response.data)
          });
      },
      controllerAs: 'd_llenar_evaluacion'
    };
  });
