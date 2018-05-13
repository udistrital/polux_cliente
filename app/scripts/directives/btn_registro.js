'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:btnRegistro
 * @description
 * # btnRegistro
 * Directiva que muestra los botones en el ui-grid
 * @param {object} fila Fila del ui-grid donde se enccuentran los botones
 * @param {function} funcion función que se ejecuta cuando se selecciona alguno de los botones
 * @param {object} grupobotones Botones que se muestra
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
