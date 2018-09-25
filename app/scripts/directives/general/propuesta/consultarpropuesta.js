'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:consultarPropuesta
 * @description
 * # consultarPropuesta
 * Directiva que permite consultar la propuesta de trabajo de grado de un estudiante.
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:consultarPropuesta.controller:consultarPropuestaCtrl consultarPropuestaCtrl}
 */
angular.module('poluxClienteApp')
  .directive('consultarPropuesta', function () {
    return {
      restrict: 'E',
      /*scope: {
          var:'='
        },
      */
      templateUrl: 'views/directives/general/propuesta/consultar-propuesta.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:consultarPropuesta.controller:consultarPropuestaCtrl
       * @description
       * # consultarPropuestaCtrl
       * # Controller of the poluxClienteApp.directive:consultarPropuesta
       * Controlador de la directiva {@link poluxClienteApp.directive:consultarPropuesta consultarPropuesta}.
       * Actualmente no se utiliza.
       */
      controller: function () {
      },
      controllerAs: 'd_conProp'
    };
  });
