'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:mostrarArea
 * @description
 * # mostrarArea
 */
angular.module('poluxApp')
  .directive('mostrarArea', function (areasRequest) {
    return {
      restrict: "E",
      scope: {
          areanueva:'='
      },
      templateUrl: "views/directives/mostrar-area.html",
      controller: function() {
        var ctrl=this;
        //se llaman los servicios y se guardan en una variable
        ctrl.fabrica=areasRequest;
        ctrl.areas=ctrl.fabrica.obtenerAreas();
        //console.log(ctrl.areas);
    

        /*
        Función que muestra el area por docente
        docenteSeleccionado value:"p.coddocente":
        recibe  la información del codigo del docente

        */
        ctrl.mostrarAreasDocente= function(docenteSeleccionado){
          ctrl.docente=docenteSeleccionado;
          ctrl.fabrica.listarAreasDocente(docenteSeleccionado);
        };



      },
      controllerAs: "mostrar"
    };
  });
