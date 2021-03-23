'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:crearArea
 * @description
 * # crearArea
 * Directiva que permite asignar un área de conocimiento a un docente
 * Actualmente no se utiliza.
 * Controlador: {@link poluxClienteApp.directive:crearArea.controller:crearAreaCtrl crearAreaCtrl}
 * @param {object} areasParam lista de áreas de conocimiento.
 * @param {number} idareaparam Id del área que se asignará
 * @param {String} docactual Docente al que se le agregará el area
 * @param {Array} aredoc Areas del docente.
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
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:crearArea.controller:crearAreaCtrl
       * @description
       * # crearAreaCtrl
       * # Controller of the poluxClienteApp.directive:crearArea 
       * Controlador de la directiva {@link poluxClienteApp.directive:crearArea crearArea}.
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @property {number} codigodocente Documento del docente al que se asignarán las áreas.
       */
      controller: function ($scope) {
        var self = this;
        /**
         * @ngdoc method
         * @name asignarAreasDocente
         * @methodOf poluxClienteApp.directive:crearArea.controller:crearAreaCtrl
         * @param {Object} dataArea Datos del área que se asignará al docente.
         * @returns {Promise} bjeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el documento.
         * @description 
         * Agrega las áreas a los docentes y los envia al api crud de polux con los servicios de 
         * {@link services/poluxService.service:poluxRequest poluxRequest}.
         * Llama a la funcion de asignar areas pasando como parametro el JSON temporal de nuevaArea
         */
        self.asignarAreasDocente = function (dataArea) {
          self.codigodocente = parseFloat($scope.docactual);
          angular.forEach(dataArea, function (value) {
            if (value.Id == null) {
              

            }
            if (value.Nombre == null) {
              
            }
            var data = {
              AreaConocimiento: {
                Id: value.Id,
                Nombre: value.Nombre
              },
              Docente: self.codigodocente
            }
            poluxRequest.post("areas_docente", data).then(function (response) {
              self.parametros = $.param({
                query: "Docente:" + response.data.Docente,
                sortby: "AreaConocimiento",
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
