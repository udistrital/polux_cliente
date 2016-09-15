'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:busquedaEntidad
 * @description
 * # busquedaEntidad
 */
angular.module('poluxApp')
  .directive('busquedaEntidad', function () {
    return {
      restrict: "E",
      scope: {
        entidades: '=',
        entidad: '='
      },
      templateUrl: "views/directives/busqueda-entidad.html",
      controller: function() {
        var entidad = this;
        entidad.test = "esto es una directiva busqueda entidad";
      },
      controllerAs: "entidad"
    };
  });
