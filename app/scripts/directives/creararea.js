'use strict';

/**
 * @ngdoc directive
 * @name poluxApp.directive:crearArea
 * @description
 * # crearArea
 */
angular.module('poluxApp')
  .directive('crearArea', function (areasRequest) {
    return {
      templateUrl: 'views/directives/crear-area.html',
      scope: {
          newarea:'='
      },
      restrict: 'E',
      controller: function() {
        var ctrl=this;
        ctrl.fabrica=areasRequest;
        ctrl.areas=areasRequest.obtenerAreas();
       console.log(ctrl.areas);
        //ásignar areas temporalmente
        ctrl.nuevaArea = [];

        ctrl.asignarArea = function() {
      for (var i = 0; i < ctrl.fabrica.areas.length; i++) {
        if (ctrl.fabrica.areas[i].Nombre==ctrl.Nombre) {
          ctrl.Id=ctrl.fabrica.areas[i].Id;
        }
      }

      console.log(ctrl.Id);
              ctrl.nuevaArea.push(
                { "Id":ctrl.Id,
                  "Nombre": ctrl.Nombre

                }
              );
              ctrl.Id='',
              ctrl.Nombre='';
              ctrl.Descripcion='';
        };

        ctrl.asignarAreasDocente= function(area){
          ctrl.fabrica.mostrar=[];
          ctrl.fabrica.asignarAreas(area);
          ctrl.nuevaArea = [];
        };
        ctrl.compararAreas=function(id){
          console.log(id);
          return true;
        };


      },
      controllerAs: "crearArea"
    };
  });
