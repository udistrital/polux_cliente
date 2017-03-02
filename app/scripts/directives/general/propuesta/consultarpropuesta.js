'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:general/propuesta/consultarPropuesta
 * @description
 * # general/propuesta/consultarPropuesta
 */
angular.module('poluxApp')
  .directive('consultarPropuesta', function () {
    return {
      restrict: 'E',
      /*scope: {
          var:'='
        },
      */
      templateUrl: 'views/directives/general/propuesta/consultar-propuesta.html',
      controller:function(){
        var ctrl = this;
      },
      controllerAs:'d_conProp'
    };
  });
