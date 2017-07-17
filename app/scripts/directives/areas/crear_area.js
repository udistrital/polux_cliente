'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:areas/crearArea
 * @description
 * # areas/crearArea
 */
angular.module('poluxClienteApp')
  .directive('crearArea', function (poluxRequest, cadenaRequest) {
    return {
      restrict: 'E',
      scope: {
        areasParam: '=setarea',
        idareaparam: '=',
        docactual: '=',
        aredoc: '='
      },
      templateUrl: 'views/directives/areas/crear_area.html',
      controller: function ($scope) {
        var self = this;
        /* Llama a la funcion de asignar areas pasando como parametro el JSON temporal de nuevaArea*/
        self.asignarAreasDocente = function (dataArea) {
          self.codigodocente = parseFloat($scope.docactual);
          angular.forEach(dataArea, function (value) {
            if (value.Id == null) {
              console.log("areasnulas: " + value.Id);

            }
            if (value.Nombre == null) {
              console.log("nombre de area nulo");
            }
            var data = {
              IdAreaConocimiento: {
                Id: value.Id,
                Nombre: value.Nombre
              },
              IdentificacionDocente: self.codigodocente
            }
            poluxRequest.post("areas_docente", data).then(function (response) {
              self.parametros = $.param({
                query: "IdentificacionDocente:" + response.data.IdentificacionDocente,
                sortby: "IdAreaConocimiento",
                related: "IdAreaConocimiento",
                order: "asc",
                limit: 0
              });
              swal(
                'Registro Existoso',
                'Se asignaron las áreas de conocimiento',
                'success'
              );
              poluxRequest.get("areas_docente", self.parametros).then(function (response) {
                $scope.aredoc = response.data;

              });
            });
          });
          self.nuevaArea = [];
        };

      },
      controllerAs: 'd_crearArea'
    };
  });
