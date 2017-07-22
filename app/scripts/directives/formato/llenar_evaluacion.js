'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:formato/llenarEvaluacion
 * @description
 * # formato/llenarEvaluacion
 */
angular.module('poluxClienteApp')
  .directive('formato/llenarEvaluacion', function () {
    return {
      restrict: 'E',
      scope: {
        formato: '='
      },
      link: function(scope, elm, attr) {
        scope.$watch('formato', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.refresh_format_view(newValue);
          }
        }, true);
      },
      templateUrl: 'views/directives/formato/vista_previa_formato.html',
      controller: function(poluxRequest, $scope) {
      },
      controllerAs: 'vistaPrevia'
    };
  });
