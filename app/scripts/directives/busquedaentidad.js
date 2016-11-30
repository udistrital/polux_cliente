'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:busquedaEntidad
 * @description
 * # busquedaEntidad
 */
angular.module('poluxApp')
  .directive('busquedaEntidad', function (entidadRequest) {
    return {
      restrict: "E",
      scope: {
        entidad: '='
      },
      templateUrl: "views/directives/busqueda-entidad.html",
      controller: function() {
        var entidad = this;
        entidad.test = "esto es una directiva busqueda entidad";
        entidad.mostrar=false;
        entidad.entidades = entidadRequest.getAll();
        entidad.mostrarinfo= function(enti){
          if (enti != null && enti != {}) {
              entidad.mostrar=true;
          }else{
              entidad.mostrar=false;
          }
        };

      },
      controllerAs: "bentidad"
    };
  });
