'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:btnRegistro
 * @description
 * # btnRegistro
 */
angular.module('poluxClienteApp')
.directive('btnRegistro', function() {
      return {
          restrict: 'E',
          scope: {
              fila: '=',
              funcion: '&',
              grupobotones: '='
          },
          templateUrl: 'views/directives/btn_registro.html',
      };
  });
