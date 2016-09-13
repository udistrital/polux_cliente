'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:ejemploDirectiva
 * @description
 * # ejemploDirectiva
 */
angular.module('poluxApp')
  .directive('ejemploDirectiva', function () {
    return {
      restrict: "E",
    /*  scope: {
        parametro: '='
      },*/
      templateUrl: "views/directives/ejemplo-directiva.html",
      controller: function() {
        var ejemplo = this;
        ejemplo.test = "esto es una directiva ejemplo";
      },
      controllerAs: "ejemplo"
    };
  });
