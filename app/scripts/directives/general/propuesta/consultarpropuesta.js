'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:general/propuesta/consultarPropuesta
 * @description
 * # general/propuesta/consultarPropuesta
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
      controller:function(){
      },
      controllerAs:'d_conProp'
    };
  });
