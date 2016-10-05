'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:mostrarArea
 * @description
 * # mostrarArea
 */
angular.module('poluxApp')
  .directive('mostrarArea', function () {
    return {
      restrict: "E",
      scope: {
        areamostrada: '=',
        areanueva:'='
      },
      templateUrl: "views/directives/mostrar-area.html",
      controller: function() {
        var self=this;
        self.menucreacion=false;
        self.estadoboton=function(estado){
          if (estado){ return false; }
          else{ return true;}
        };

      },
      controllerAs: "mostrar"
    };
  });
