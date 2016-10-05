'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:revisionDocumento
 * @description
 * # revisionDocumento
 */
angular.module('poluxApp')
  .directive('revisionDocumento', function () {
    return {
      restrict: "E",
      /* scope: {
        parametro: '='
      },*/
      templateUrl: "views/directives/revision-documento.html",
      controller: function() {
        var self = this;
        self.test = "esto es una directiva revision";
      },
      controllerAs: "rdocumento"
    };
  });
