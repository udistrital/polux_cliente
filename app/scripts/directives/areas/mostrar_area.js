'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:mostrarArea
 * @description
 * # mostrarArea
 * Directiva que permite cargar un documento a nuxeo.
 * Controlador: {@link poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl mostrarAreaCtrl}. Actualmente no se utiliza.
 * @param {number} docenteParam Identificador del docente al que se le asignarán las áreas.
 * @param {number} idareaParam Identificador del área que se agregará
 * @param {number} docactual Documento actual del que asigna las áreas.
 * @param {array} ardocente Arreglos de áreas del docente.
 */
angular.module('poluxClienteApp')
  .directive('mostrarArea', function (poluxRequest, academicaRequest) {
    return {
      restrict: 'E',
      scope: {
        docenteParam: '=doc',
        idareaParam: '=setid',
        docactual: '=',
        ardocente: '='
      },
      templateUrl: 'views/directives/areas/mostrar_area.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl
       * @description
       * # mostrarAreaCtrl
       * # Controller of the poluxClienteApp.directive:mostrarArea
       * Controlador de la directiva {@link poluxClienteApp.directive:mostrarArea cargarArea}.
       * @requires services/poluxService.service:poluxRequest
       * @requires $scope
       * @property {object} documento Documento que se va a cargar
       */
      controller: function ($scope, poluxRequest) {
        var self = this;
        self.removable = false;
        self.idareas = [];

        /**
         * @ngdoc method
         * @name watch
         * @methodOf poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl
         * @param {Number} ardocente Id del area que se asignara al docente
         * @returns {undefined} Se resuelve sin ningún parametro
         * @description 
         * vigila los cambios en el objeto ardocente y compara con las areas disponibles para agregar llamando a la función
         * generarIdAreas.
         */
        $scope.$watch('ardocente', function () {
          $scope.idareaParam = self.generarIdAreas($scope.ardocente);
        })
        /**
          * @ngdoc method
          * @name mostrarAreasDocente
          * @methodOf poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl
          * @param {Number} Id Docente al que se le agrega el área.
          * @returns {undefined} Se resuelve sin ningún parametro
          * @description 
          * Función que muestra el area por docente docenteSeleccionado value:"p.coddocente", recibe  la información del codigo del docente y consulta 
          * las áreas del servicio {@link services/poluxService.service:poluxRequest poluxRequest}
          */
        self.mostrarAreasDocente = function (Id) {
          self.parametros = $.param({
            query: "Docente:" + Id,
            sortby: "AreaConocimiento",
            order: "asc",
            limit: 0
          });
          poluxRequest.get("areas_docente", self.parametros)
            .then(function (response) {
              
              self.areas_docente = response.data.Data;
              $scope.idareaParam = self.generarIdAreas(self.areas_docente);
              
              self.codDocenteActual = Id;
              $scope.docactual = self.codDocenteActual;
              $scope.ardocente = self.areas_docente;
            });
        };

        /**
          * @ngdoc method
          * @name generarIdAreas
          * @methodOf poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl
          * @param {array} areasDocenteParam Arreglo de áreas de conocimiento asociadas al docente.
          * @returns {array} Arreglo con los identificadores de las áreas
          * @description 
          * Función que recibe arreglo de areasDocente y envia arreglo  de areas necesario para comparar las areas disponibles para  agregar.
          */
        self.generarIdAreas = function (areasDocenteParam) {
          self.idareas = [];
          
          angular.forEach(areasDocenteParam, function (value) {
            self.idareas.push(value.AreaConocimiento.Id);
          });
          return self.idareas;
        }
        
        /**
          * @ngdoc method
          * @name mostrarAreasDocente
          * @methodOf poluxClienteApp.directive:mostrarArea.controller:mostrarAreaCtrl
          * @param {Number} IdAreaDocente Id del área que se eliminará
          * @returns {undefined} Se resuelve sin ningún parametro, pero llama a la función de mostrar áreas para actualizar la vista.
          * @description 
          * Función que elimina un área asociada a un docente {@link services/poluxService.service:poluxRequest poluxRequest}.
          */
        self.eliminarAreaDocente = function (IdAreaDocente) {
          self.parametros = $.param({
            query: "Id:" + IdAreaDocente
          });
          poluxRequest.get("areas_docente", self.parametros).then(function (response) {
            self.codDocenteActual = response.data.Data[0].Docente;
            
            poluxRequest.delete("areas_docente", IdAreaDocente)
              .then(function (response) {
                self.mostrarAreasDocente(self.codDocenteActual);
              });
          });

        };


      },
      controllerAs: 'd_mostrarArea'
    };
  });
