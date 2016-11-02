'use strict';

/**
* @ngdoc directive
* @name poluxApp.directive:propuesta/registrarPropuesta
* @description
* # propuesta/registrarPropuesta
*/
angular.module('poluxApp')
.directive('registrarPropuesta', function (areasRequest,docentesRequest) {
  return {
    restrict: "E",
    scope: {
      areaConsultada:'='
    },
    templateUrl: "views/directives/propuesta/registrar-propuesta.html",
    controller: function($scope) {
      var ctrl=this;
      ctrl.fabrica=docentesRequest;
      ctrl.fabricaAreas=areasRequest.obtenerAreas();
      ctrl.string="registrarPropuesta";
      ctrl.propuesta=
      {"modalidad":"pasantia"};
      ctrl.estudiante=
      {
        "codigo": "20101020109",
        "nombre": "David Morales"
      };
      /*
      Función que muestra los docentes relacionados a un área
      areaSeleccionada toma como valor value:"p.Id":
      recibe  la información del codigo del Area

      */
      ctrl.mostrarDocentesArea= function(areaSeleccionada){
        ctrl.fabrica.listarDocentesArea(areaSeleccionada);
      };

      ctrl.asignarDocente = function(docenteSeleccionado){
        console.log(docenteSeleccionado);
      };



    },
    controllerAs: "regProp"
  };
});
